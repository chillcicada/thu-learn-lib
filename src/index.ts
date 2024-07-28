import type {
  ContentType,
  CourseInfo,
  HomeworkSubmitAttachment,
  HomeworkSubmitResult,
  IdentityType,
  Language,
  NotificationDetail,
  NotificationItem,
  SemesterInfo,
  UserInfo,
} from './types'
import urls from './urls'
import { $, addCSRFTokenToUrl, base64ToUtf8, decodeHTML, parseSemesterType } from './utils'

// #region interface
export interface Learn2018HelperConfig {
  username: string
  password: string
}

export interface Learn2018HelperOption {
  useHeartbeat: boolean
  language: Language
  previewFirstPage: boolean
}

export interface FetchWithAuthOption {
  useCSRFToken: boolean
  fetchImpl: typeof fetch
}
// #endregion

export default class Learn2018Helper {
  // #region properties
  #loginForm: FormData = new FormData() // form data (username, password)

  // cached data
  #cookie: string = ''
  #identityType: IdentityType | null = null
  #userInfo: UserInfo | null = null
  #semesterList: string[] | null = null
  #currentSemester: SemesterInfo | null = null
  #courseLists: Record<string, CourseInfo[]> = {}

  // options
  #useHeartbeat: boolean = false
  #language: Language = 'zh'
  #previewFirstPage: boolean = true
  // #endregion

  // #region constructor
  private _constructor(cfg: Partial<Learn2018HelperConfig> = {}, opt: Partial<Learn2018HelperOption> = {}): void {
    const { username = '', password = '' } = cfg

    if (!username || !password)
      throw new Error('Username or password is required')

    this.#loginForm.set('i_user', username)
    this.#loginForm.set('i_pass', password)
    this.#loginForm.set('atOnce', 'true')

    this.#useHeartbeat = opt.useHeartbeat ?? false
    this.#language = opt.language ?? 'zh'
    this.#previewFirstPage = opt.previewFirstPage ?? true
  }

  constructor(cfg: Partial<Learn2018HelperConfig> = {}, opt: Partial<Learn2018HelperOption> = {}) {
    this._constructor(cfg, opt)
  }
  // #endregion

  // #region getters/setters
  /**
   * return all options
   */
  get options(): Learn2018HelperOption {
    return {
      useHeartbeat: this.#useHeartbeat,
      language: this.#language,
      previewFirstPage: this.#previewFirstPage,
    }
  }

  get isUseHeartbeat() { return this.#useHeartbeat }

  get currentLang() { return this.#language }

  get previewFirstPage() { return this.#previewFirstPage }
  // #endregion

  // #region methods
  async login(): Promise<this> {
    if (await this.validateLogin())
      return this

    const ticket = await fetch(urls.LoginUrl, { body: this.#loginForm, method: 'POST' })
      .then(res => res.text()) // almost the same fast as `TextDecoderStream`
      .then((text) => {
        const ticket = text.match(/ticket=([^"]+)/)?.[1]

        if (!ticket || ticket === 'BAD_CREDENTIALS')
          throw new Error('Bad credentials, is your username or password correct?')

        return ticket
      })

    const authUrl = await fetch(urls.LearnAuthUrlProvider(ticket))
      .then(res => res.url)

    const jsessionid = authUrl.match(/jsessionid=([^?]+)/)?.[1]

    const token = await fetch(authUrl)
      .then(res => res.headers.get('set-cookie')?.match(/XSRF-TOKEN=([^;]+)/)?.[1])

    if (!jsessionid || !token)
      throw new Error('Failed to get jsessionid or token')

    const cookie = `JSESSIONID=${jsessionid}; XSRF-TOKEN=${token}`

    this.#cookie = cookie

    return this
  }

  async getCookie(): Promise<string> {
    if (this.#cookie)
      return this.#cookie

    return await this.login().then(() => this.#cookie)
  }

  async fetchWithAuth(
    url: string | URL | Request,
    init: RequestInit = {},
    opt: Partial<FetchWithAuthOption> = {},
  ): Promise<Response> {
    const cookie = this.#cookie

    if (!cookie)
      throw new Error('Not logged in')

    const { headers = {}, ...rest } = init

    const { useCSRFToken = true, fetchImpl = fetch } = opt

    if (useCSRFToken)
      url = addCSRFTokenToUrl(url, cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '')

    return fetchImpl(url, { headers: { ...headers, cookie }, ...rest })
  }

  async logout(): Promise<this> {
    await this.fetchWithAuth(urls.LogoutUrl, { method: 'POST' })
    this.#cookie = ''
    return this
  }

  private async _getUserInfo(): Promise<UserInfo> {
    if (!this.#identityType)
      throw new Error('Identity type is required')

    const text = await this.fetchWithAuth(urls.HomePageUrlProvider(this.#identityType))
      .then(res => res.text())

    const dom = $(text)

    const name = dom('a.user-log')?.text().trim() || ''
    const department = dom('.fl.up-img-info p:nth-child(2) label')?.text().trim() || ''

    if (!name || !department)
      throw new Error('Failed to get user info')

    this.#userInfo = { name, department }
    return this.#userInfo
  }

  async getUserInfo(identityType: IdentityType = 'student'): Promise<UserInfo> {
    if (this.#userInfo)
      return this.#userInfo

    this.#identityType = identityType
    return await this._getUserInfo()
  }

  // TODO: Implement this method
  // async getCalendar(startDate: string, endDate: string, graduate = false): Promise<CalendarEvent[]> {
  //   const body = new FormData()
  //   body.set('appId', 'ALL_ZHJW')
  //   const ticket = await this.fetchWithAuth(urls.RegistrarTicketUrl, {body, method: 'POST'})
  //     .then(res => res.text())

  // }

  private async _getSemesterIdList(): Promise<string[]> {
    const json: string[] = await this.fetchWithAuth(urls.SemesterListUrl)
      .then(res => res.json())

    this.#semesterList = json.filter(i => i !== null)
    return this.#semesterList
  }

  async getSemesterIdList(): Promise<string[]> {
    if (this.#semesterList)
      return this.#semesterList

    return await this._getSemesterIdList()
  }

  private async _getCurrentSemester(): Promise<SemesterInfo> {
    const json = await this.fetchWithAuth(urls.CurrentSemesterUrl)
      .then(res => res.json())

    const { id, kssj, jssj, xnxq } = json.result

    const regex = /^(\d{4})-(\d{4})-(\d)$/

    if (!regex.test(xnxq))
      throw new Error('Invalid xnxq')

    const [, _startYear, _endYear, _type] = xnxq.match(regex) as RegExpMatchArray

    this.#currentSemester = {
      id,
      startDate: new Date(kssj),
      endDate: new Date(jssj),
      startYear: Number(_startYear),
      endYear: Number(_endYear),
      type: parseSemesterType(Number(_type)),
    }

    return this.#currentSemester
  }

  async getCurrentSemester(): Promise<SemesterInfo> {
    if (this.#currentSemester)
      return this.#currentSemester

    return await this._getCurrentSemester()
  }

  // TODO: set the default semester to the current semester
  private async _getCourseList(
    semesterID: string,
    identityType: IdentityType = 'student',
  ): Promise<CourseInfo[]> {
    const json = await this.fetchWithAuth(
      identityType === 'student'
        ? urls.StuCoursesListUrlProvider(semesterID, this.#language)
        : urls.TeaCoursesListUrlProvider(semesterID), // teacher
    ).then(res => res.json())

    const { resultList = {} } = json
    const courses: CourseInfo[] = this.#courseLists[semesterID] = []

    await Promise.all(resultList.map(async (course: any) => {
      const timeAndLocation: string[] = await this.fetchWithAuth(urls.CourseTimeUrlProvider(course.id))
        .then(res => res.json())

      const {
        wlkcid: id, // 网络课程ID
        zywkcm: _name, // 中英文课程名
        kcm: _chineseName, // 课程名
        ywkcm: _englishName, // 英文课程名
        jsm: teacherName, // 教师名
        jsh: teacherNumber, // 教师号
        kch: courseNumber, // 课程号
        kxh: _courseIndex, // 课序号
      } = course

      courses.push({
        id,
        name: decodeHTML(_name),
        chineseName: decodeHTML(_chineseName),
        englishName: decodeHTML(_englishName),
        timeAndLocation,
        url: urls.CoursePageUrlProvider(id, identityType),
        teacherName,
        teacherNumber,
        courseNumber,
        courseIndex: Number(_courseIndex),
        identityType,
      })
    }))

    return this.#courseLists[semesterID]
  }

  async getCourseList(semesterID: string, identityType: IdentityType = 'student'): Promise<CourseInfo[]> {
    if (this.#courseLists[semesterID])
      return this.#courseLists[semesterID]

    return await this._getCourseList(semesterID, identityType)
  }

  // TODO
  async getAllContents<T extends ContentType>(
    courseIDs: string[],
    type: T,
    _identityType: IdentityType = 'student',
  ) {
    // const fetchContentForCourse = <T extends ContentType>(type: T, id: string, courseType: CourseType) => {
    //   switch (type) {
    //     case ContentType.NOTIFICATION:
    //       return this.getNotificationList(id, courseType) as Promise<ContentTypeMap[T][]>
    //     case ContentType.FILE:
    //       return this.getFileList(id, courseType) as Promise<ContentTypeMap[T][]>
    //     case ContentType.HOMEWORK:
    //       return this.getHomeworkList(id) as Promise<ContentTypeMap[T][]>
    //     case ContentType.DISCUSSION:
    //       return this.getDiscussionList(id, courseType) as Promise<ContentTypeMap[T][]>
    //     case ContentType.QUESTION:
    //       return this.getAnsweredQuestionList(id, courseType) as Promise<ContentTypeMap[T][]>
    //     default:
    //   }
    // }
  }

  async getNotificationList(courseID: string, identityType: IdentityType = 'student'): Promise<NotificationItem[]> {
    const json = await this.fetchWithAuth(
      identityType === 'student'
        ? urls.StuNotificationListUrlProvider(courseID)
        : urls.TeaNotificationListUrlProvider(courseID),
    ).then(res => res.json())

    const result = json.object?.aaData ?? json.object?.resultsList ?? []

    const notifications: NotificationItem[] = []

    await Promise.all(result.map(async (n: any) => {
      const { ggid: id, ggnr: _content, bt: title, fbrxm: publisher, sfyd: _hasRead, sfqd: _markedImportant, fbsj: _publishTime, fbsjStr: _publishTimeStr, fjmc: _attachmentName, fjbt: _attachmentTitle } = n

      const content = decodeHTML(base64ToUtf8(_content))
      const url = urls.NotificationDetailUrlProvider(courseID, id, identityType)
      const hasRead = _hasRead === '是'
      const markedImportant = Number(_markedImportant) === 1
      const publishTime = new Date(
        _publishTime && typeof _publishTime === 'string'
          ? _publishTime
          : _publishTimeStr,
      )

      // attachment
      const detail: NotificationDetail = {}

      const name = identityType === 'student' ? _attachmentName : _attachmentTitle

      if (name) {
        const text = await this.fetchWithAuth(url)
          .then(res => res.text())

        const dom = $(text)

        const _size = dom('div#attachment > div.fl > span[class^="color"]').first().text()

        const path = identityType === 'student'
          ? dom('.ml-10').attr('href')!
          : dom('#wjid').attr('href')!

        const params = new URLSearchParams(path.split('?').slice(-1)[0])
        const attachmentID = params.get('wjid')!

        const _attachment = {
          name,
          id: attachmentID,
          downloadUrl: !path.startsWith(urls.LEARN_PREFIX) ? urls.LEARN_PREFIX + path : path,
          previewUrl: urls.FilePreviewUrl('notification', attachmentID, identityType),
        }
      }

      notifications.push({ id, content, title, url, publisher, hasRead, markedImportant, publishTime, ...detail })
    }))

    return notifications
  }

  async submitHomework(
    stuHomeworkID: string,
    content = '',
    attachment?: HomeworkSubmitAttachment,
    removeAttachment = false,
  ): Promise<HomeworkSubmitResult> {
    const body = new FormData()

    body.set('xszyid', stuHomeworkID)
    body.set('zynr', content)
    attachment
      ? body.set('fileupload', attachment.content, attachment.filename)
      : body.set('fileupload', 'undifined')
    body.set('isDeleted', removeAttachment ? '1' : '0')

    const json: HomeworkSubmitResult = await this.fetchWithAuth(urls.StuHomeworkSubmitPostUrl, { body, method: 'POST' })
      .then(res => res.json())

    // TODO
    return json
  }

  // TODO: add specific methods update methods
  async update(): Promise<this> {
    return this
  }

  async updateAll(): Promise<this> {
    return Promise.all([
      this._getUserInfo(),
      this._getSemesterIdList(),
      this._getCurrentSemester(),
      // this._getCourseList(this.#currentSemester?.id ?? '', this.#identityType ?? 'student'),
    ]).then(() => this)
  }

  reset(cfg: Partial<Learn2018HelperConfig> = {}, opt: Partial<Learn2018HelperOption> = {}): this {
    this._constructor(cfg, opt)
    return this
  }

  cleanAll(): this {
    this.#cookie = ''
    this.#identityType = null
    this.#userInfo = null
    this.#semesterList = null
    this.#currentSemester = null
    return this
  }

  // TODO: Implement this method
  private async heartbeat(): Promise<void> {
    await this.validateLogin()
    ;(() => {
      setTimeout(() => this.heartbeat(), 1000 * 60 * 5)
    })()
  }

  private async validateLogin(): Promise<boolean> {
    if (!this.#cookie)
      return false

    // both student page and teacher page can get accessed when logged in
    const text = await this.fetchWithAuth(urls.HomePageUrlProvider('student'))
      .then(res => res.text())

    if (text.includes('登录超时'))
      return false

    return true
  }

  useHeartbeat(value = true): this {
    this.#useHeartbeat = value
    return this
  }

  setLanguage(value: Language = 'zh'): this {
    this.#language = value
    return this
  }

  usePreviewFirstPage(value = true): this {
    this.#previewFirstPage = value
    return this
  }
  // #endregion
}

export { Learn2018Helper }
export * from './types'
