import dotenv from 'dotenv'
import Learn2018Helper from '../src'

dotenv.config({ path: 'test/.env' })

const username = process.env.TEST_USERNAME || ''
const password = process.env.TEST_PASSWORD || ''

if (!username || !password)
  throw new Error('Please provide TEST_USERNAME and TEST_PASSWORD in test/.env')

describe('helper authentication', () => {
  const helper = new Learn2018Helper({ username, password })

  beforeAll(async () => {
    await helper.login()
  })

  afterAll(async () => {
    await helper.logout()
  })

  it('should get user info', async () => {
    await helper.getUserInfo()
      .then(userInfo => expect(userInfo).toMatchSnapshot())
  })

  it('should get semester list', async () => {
    await helper.getSemesterIdList()
      .then(semesterList => expect(semesterList).toMatchSnapshot())
  })

  it('should get current semester', async () => {
    await helper.getCurrentSemester()
      .then(semester => expect(semester).toMatchSnapshot())
  })
})
