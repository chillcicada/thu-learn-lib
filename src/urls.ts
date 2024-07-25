import type { ContentType, IdentityType, Language, WebsiteShowLanguage } from './types'
import { MAX_SIZE } from './consts'

export const LEARN_PREFIX = 'https://learn.tsinghua.edu.cn'
export const ID_PREFIX = 'https://id.tsinghua.edu.cn'
export const REGISTRAR_PREFIX = 'https://zhjw.cic.tsinghua.edu.cn'

export const LoginUrl = `${ID_PREFIX}/do/off/ui/auth/login/post/bb5df85216504820be7bba2b0ae1535b/0?/login.do`
export const LearnAuthUrlProvider = (ticket: string) => `${LEARN_PREFIX}/b/j_spring_security_thauth_roaming_entry?ticket=${ticket}`
export const LogoutUrl = `${LEARN_PREFIX}/f/j_spring_security_logout`
export const HomePageUrlProvider = (identityType: IdentityType) => `${LEARN_PREFIX}/f/wlxt/index/course/${identityType}/`
export const SemesterListUrl = `${LEARN_PREFIX}/b/wlxt/kc/v_wlkc_xs_xktjb_coassb/queryxnxq`
export const CurrentSemesterUrl = `${LEARN_PREFIX}/b/kc/zhjw_v_code_xnxq/getCurrentAndNextSemester`
export const StuCoursesListUrlProvider = (semester: string, lang: Language = 'zh') => `${LEARN_PREFIX}/b/wlxt/kc/v_wlkc_xs_xkb_kcb_extend/student/loadCourseBySemesterId/${semester}/${lang}`
export const TeaCoursesListUrlProvider = (semester: string) => `${LEARN_PREFIX}/b/kc/v_wlkc_kcb/queryAsorCoCourseList/${semester}/0`
export const CourseTimeUrlProvider = (courseID: string) => `${LEARN_PREFIX}/b/kc/v_wlkc_xk_sjddb/detail?id=${courseID}`
export const CoursePageUrlProvider = (courseID: string, identityType: IdentityType) => `${LEARN_PREFIX}/f/wlxt/index/course/${identityType}/course?wlkcid=${courseID}`
export const StuFileListUrlProvider = (courseID: string, maxSize = MAX_SIZE) => `${LEARN_PREFIX}/b/wlxt/kj/wlkc_kjxxb/student/kjxxbByWlkcidAndSizeForStudent?wlkcid=${courseID}&size=${maxSize}`
export const StuFileDownloadUrlProvider = (fileID: string) => `${LEARN_PREFIX}/b/wlxt/kj/wlkc_kjxxb/student/downloadFile?sfgk=0&wjid=${fileID}`
export const TeaFileListUrlProvider = (courseID: string, maxSize = MAX_SIZE) => `${LEARN_PREFIX}/b/wlxt/kj/v_kjxxb_wjwjb/teacher/queryByWlkcid?wlkcid=${courseID}&size=${maxSize}`
export const TeaFileDownloadUrlProvider = (fileID: string, courseID: string) => `${LEARN_PREFIX}/f/wlxt/kj/wlkc_kjxxb/teacher/beforeView?id=${fileID}&wlkcid=${courseID}`
// TODO
export const FilePreviewUrl = (type: ContentType, fileID: string, identityType: IdentityType, _firstPageOnly = false) => ``
export const StuNotificationListUrlProvider = (courseID: string, maxSize = MAX_SIZE) => `${LEARN_PREFIX}/b/wlxt/kcgg/wlkc_ggb/student/kcggListXs?wlkcid=${courseID}&size=${maxSize}`
export const TeaNotificationListUrlProvider = (courseID: string, maxSize = MAX_SIZE) => `${LEARN_PREFIX}/b/wlxt/kcgg/wlkc_ggb/teacher/kcggList?wlkcid=${courseID}&size=${maxSize}`
export const NotificationDetailUrlProvider = (courseID: string, notificationID: string, identityType: IdentityType) => `${LEARN_PREFIX}/f/wlxt/kcgg/wlkc_ggb/${identityType}/beforeView${identityType === 'student' ? 'Xs' : 'Js'}wlkcid=${courseID}&id=${notificationID}`
export const NotificationEditUrlProvider = (identityType: IdentityType) => `${LEARN_PREFIX}/b/wlxt/kcgg/wlkc_ggb/${identityType}/editKcgg`
// export const LEARN_HOMEWORK_LIST_SOURCE = (courseID: string) => ``
export const StuHomeworkListNewUrlProvider = (courseID: string, maxSize = MAX_SIZE) => `${LEARN_PREFIX}/b/wlxt/kczy/zy/student/index/zyListWj?wlkcid=${courseID}&size=${maxSize}`
export const StuHomeworkListSubmittedUrlProvider = (courseID: string, maxSize = MAX_SIZE) => `${LEARN_PREFIX}/b/wlxt/kczy/zy/student/index/zyListYjwg?wlkcid=${courseID}&size=${maxSize}`
export const StuHomeworkListGradedUrlProvider = (courseID: string, maxSize = MAX_SIZE) => `${LEARN_PREFIX}/b/wlxt/kczy/zy/student/index/zyListYpg?wlkcid=${courseID}&size=${maxSize}`
export const StuHomeworkDetailUrlProvider = (courseID: string, homeworkId: string, stuHomeworkId: string) => `${LEARN_PREFIX}/f/wlxt/kczy/zy/student/viewCj?wlkcid=${courseID}&zyid=${homeworkId}&xszyid=${stuHomeworkId}`
export const StuHomeworkDownloadUrlProvider = (courseID: string, attachmentID: string) => `${LEARN_PREFIX}/b/wlxt/kczy/zy/student/downloadFile/${courseID}/${attachmentID}`
export const StuHomeworkSubmitUrlProvider = (courseID: string, stuHomeworkID: string) => `${LEARN_PREFIX}/f/wlxt/kczy/zy/student/tijiao?wlkcid=${courseID}&xszyid=${stuHomeworkID}`
export const StuHomeworkSubmitPostUrl = `${LEARN_PREFIX}/b/wlxt/kczy/zy/student/tjzy`
export const TeaHomeworkListUrlProvider = (courseID: string, maxSize = MAX_SIZE) => `${LEARN_PREFIX}/b/wlxt/kczy/zy/teacher/index/pageList?wlkcid=${courseID}&size=${maxSize}`
export const TeaHomeworkDetailUrlProvider = (courseID: string, homeworkID: string) => `${LEARN_PREFIX}/f/wlxt/kczy/xszy/teacher/beforePageList?zyid=${homeworkID}&wlkcid=${courseID}`
export const DiscussionListUrlProvider = (courseID: string, maxSize = MAX_SIZE, identityType: IdentityType) => `${LEARN_PREFIX}/b/wlxt/bbs/bbs_tltb/${identityType}/kctlList?wlkcid=${courseID}&size=${maxSize}`
export const DiscussionDetailUrlProvider = (courseID: string, boardID: string, discussionID: string, identityType: IdentityType, tabId: number = 1) => `${LEARN_PREFIX}/f/wlxt/bbs/bbs_tltb/${identityType}/viewTlById?wlkcid=${courseID}&id=${discussionID}&tabbh=${tabId}&bqid=${boardID}`
export const QuestionListAnsweredUrlProvider = (courseID: string, identityType: IdentityType, maxSize = MAX_SIZE) => `${LEARN_PREFIX}/b/wlxt/bbs/bbs_tltb/${identityType}/kcdyList?wlkcid=${courseID}&size=${maxSize}`
export const StuQuestionDetailUrlProvider = (courseID: string, questionID: string) => `${LEARN_PREFIX}/f/wlxt/bbs/bbs_kcdy/student/viewDyById?wlkcid=${courseID}&id=${questionID}`
export const TeaQuestionDetailUrlProvider = (courseID: string, questionID: string) => `${LEARN_PREFIX}/f/wlxt/bbs/bbs_kcdy/teacher/beforeEditDy?wlkcid=${courseID}&id=${questionID}`
export const WebsiteShowLangProvider = (lang: WebsiteShowLanguage = 'zh_CN') => `${LEARN_PREFIX}/f/wlxt/common/language?websiteShowLanguage=${lang}`
export const RegistrarTicketUrl = `${LEARN_PREFIX}/b/wlxt/common/auth/gnt`
export const RegistrarAuthUrlProvider = (ticket: string) => `${REGISTRAR_PREFIX}/j_acegi_login.do?url=/&ticket=${ticket}`
// export const REGISTRAR_TICKET_FORM_DATA = () => ``

export * as default from './urls'
