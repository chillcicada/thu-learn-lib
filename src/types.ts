import type { HomeworkGradeLevel } from './consts'

export type IdentityType = 'student' | 'teacher'

export type Language = 'zh' | 'en'

export type WebsiteShowLanguage = 'zh_CN' | 'en_US'

export type SemesterType = 'spring' | 'fall' | 'summer' | 'unknown'

export type ResultStatus = 'success' | 'error'

export interface CalendarEvent {
  location: string
  status: string
  startTime: string
  endTime: string
  date: string
  courseName: string
}

export interface UserInfo {
  name: string
  department: string
}

export interface SemesterInfo {
  id: string
  startDate: Date
  endDate: Date
  startYear: number
  endYear: number
  type: SemesterType
}

export interface CourseInfo {
  id: string
  name: string
  chineseName: string
  englishName: string
  timeAndLocation: string[]
  url: string
  teacherName: string
  teacherNumber: string
  courseNumber: string
  courseIndex: number
  identityType: IdentityType
}

export interface RemoteFile {
  id: string | number
  name: string
  downloadUrl: string
  previewUrl: string
  size: string | number
}

export interface NotificationDetail {
  attachment?: RemoteFile
}

export interface NotificationItem extends NotificationDetail {
  id: string | number
  title: string
  content: string
  hasRead: boolean
  url: string
  markedImportant: boolean
  publishTime: Date
  publisher: string
}

export interface FileItem {
  id: string | number
  /** size in byte */
  rawSize: number
  /** inaccurate size description (like '1M') */
  size: string | number
  title: string
  description: string
  uploadTime: Date
  /** for teachers, this url will not initiate download directly */
  downloadUrl: string
  /** preview is not supported on all types of files, check before use */
  previewUrl: string
  isNew: boolean
  markedImportant: boolean
  visitCount: number
  downloadCount: number
  fileType: string
  /** for compatibility */
  remoteFile: RemoteFile
}

export interface HomeworkStatus {
  submitted: boolean
  graded: boolean
}

export interface HomeworkBase extends HomeworkStatus {
  id: string | number
  stuHomeworkId: string | number
  title: string
  deadline: Date
  url: string
  submitUrl: string
  submitTime?: Date
  grade?: number
  /** some homework has levels but not grades, like A/B/.../F */
  gradeLevel?: keyof typeof HomeworkGradeLevel
  gradeTime?: Date
  graderName?: string
  gradeContent?: string
}

export interface HomeworkDetail {
  description?: string
  /** attachment from teacher */
  attachment?: RemoteFile
  /** answer from teacher */
  answerContent?: string
  answerAttachment?: RemoteFile
  /** submitted content from student */
  submittedContent?: string
  submittedAttachment?: RemoteFile
  /** grade from teacher */
  gradeAttachment?: RemoteFile
}

export type Homework = HomeworkStatus & HomeworkDetail

export type HomeworkCompletionType = 'individual' | 'group'

export type HomeworkSubmissionType = 'offline' | 'webLearning'

export interface IHomeworkTA {
  id: string
  index: number
  title: string
  description: string
  publisherId: string
  publishTime: Date
  startTime: Date
  deadline: Date
  url: string
  completionType: HomeworkCompletionType
  submissionType: HomeworkSubmissionType
  gradedCount: number
  submittedCount: number
  unsubmittedCount: number
}

export interface HomeworkSubmitAttachment {
  filename: string
  content: Blob
}

// TODO: Add transition rules
export interface HomeworkSubmitResult {
  result: ResultStatus
  message: string
  object: unknown
}

export interface DiscussionBase {
  id: string
  title: string
  publisherName: string
  publishTime: Date
  lastReplierName: string
  lastReplyTime: Date
  visitCount: number
  replyCount: number
}

export interface Discussion extends DiscussionBase {
  url: string
  boardId: string
}

export interface Question extends DiscussionBase {
  url: string
  question: string
}

export interface ContentMap {
  notification: NotificationItem
  file: FileItem
  homework: HomeworkStatus
  discussion: Discussion
  question: Question
  unknown: unknown
}

export type ContentType = keyof ContentMap

export interface CourseContent<T extends ContentType> {
  [id: string | number]: ContentMap[T][]
}

export type { HomeworkGradeLevel }
