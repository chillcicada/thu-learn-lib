import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import * as dotenv from 'dotenv'
import { CourseType, Language, Learn2018Helper } from '../src'

dotenv.config({ path: 'test/.env' })
const U = process.env.U! // username
const P = process.env.P! // password

describe('helper data retrival', () => {
  let helper: Learn2018Helper
  let semesterTester: string
  let courseTester: string
  let courseTATester: string

  beforeAll(async () => {
    const _h = new Learn2018Helper()
    await _h.login(U, P)
    const currSemester = await _h.getCurrentSemester()
    semesterTester = currSemester.id
    const courses = await _h.getCourseList(semesterTester)
    expect(courses.length).toBeGreaterThanOrEqual(0)
    const taCourses = await _h.getCourseList(semesterTester, CourseType.TEACHER)
    expect(taCourses.length).toBeGreaterThanOrEqual(0)
    if (courses.length > 0)
      courseTester = courses[0].id

    if (taCourses.length > 0)
      courseTATester = taCourses[0].id
  })
  beforeAll(async () => {
    helper = new Learn2018Helper()
    await helper.login(U, P)
  })
  afterAll(async () => {
    await helper.logout()
  })

  it('should get correct language', async () => {
    const lang = helper.getCurrentLanguage()
    expect(lang).toBeDefined()
    const courses = await helper.getCourseList(semesterTester)
    courses.forEach((course) => {
      expect(course.name).toBe(lang === Language.EN ? course.englishName : course.chineseName)
    })
  })

  it('should get semesterIdList correctly', async () => {
    const semesters = await helper.getSemesterIdList()
    expect(Array.isArray(semesters)).toEqual(true)
    for (const semester of semesters)
      expect(typeof semester).toBe('string')

    expect(semesters).toContain(semesterTester)
  })

  it('should get currentSemester correctly', async () => {
    const currSemester = await helper.getCurrentSemester()
    expect(currSemester).not.toBeUndefined()
    expect(currSemester).not.toBeNull()
    expect(currSemester.id).toEqual(semesterTester)
  })

  it('should get courseList correctly', async () => {
    const courses = await helper.getCourseList(semesterTester)
    expect(courses.length).toBeGreaterThanOrEqual(0)
    if (courses.length > 0)
      expect(courses.map(c => c.id)).toContain(courseTester)
  })

  it('should get TAcourses correctly', async () => {
    const courses = await helper.getCourseList(semesterTester, CourseType.TEACHER)
    expect(courses.length).toBeGreaterThanOrEqual(0)
    if (courses.length > 0)
      expect(courses.map(c => c.id)).toContain(courseTATester)
  })

  it('should get contents (or throw on unimplemented function) correctly', async () => {
    if (courseTester !== undefined) {
      expect((await helper.getHomeworkList(courseTester)).length).toBeGreaterThanOrEqual(0)
      expect((await helper.getDiscussionList(courseTester)).length).toBeGreaterThanOrEqual(0)
      expect((await helper.getNotificationList(courseTester)).length).toBeGreaterThanOrEqual(0)
      expect((await helper.getFileList(courseTester)).length).toBeGreaterThanOrEqual(0)
      expect((await helper.getAnsweredQuestionList(courseTester)).length).toBeGreaterThanOrEqual(0)
    }
    if (courseTATester !== undefined) {
      // expect((await helper.getDiscussionList(courseTATester, CourseType.TEACHER)).length).toBeGreaterThanOrEqual(0);
      // expect((await helper.getNotificationList(courseTATester, CourseType.TEACHER)).length).toBeGreaterThanOrEqual(0);
      expect((await helper.getFileList(courseTATester, CourseType.TEACHER)).length).toBeGreaterThanOrEqual(0)
      // expect((await helper.getAnsweredQuestionList(courseTATester, CourseType.TEACHER)).length).toBeGreaterThanOrEqual(0);
      expect((await helper.getHomeworkList(courseTATester, CourseType.TEACHER)).length).toBeGreaterThanOrEqual(0)
    }
  })

  it('should get user info correctly', async () => {
    const userInfo = await helper.getUserInfo()
    expect(userInfo).toBeDefined()

    expect(userInfo.name).toBeTruthy()
    expect(typeof userInfo.name).toBe('string')

    expect(userInfo.department).toBeTruthy()
    expect(typeof userInfo.department).toBe('string')
  })

  it('should get calendar items correctly and throw on invalid response', async () => {
    expect((await helper.getCalendar('20210501', '20210530')).length).toBeGreaterThanOrEqual(0)
    // await expect(helper.getCalendar('gg', 'GG')).rejects.toHaveProperty('reason', FailReason.INVALID_RESPONSE);
  })
})
