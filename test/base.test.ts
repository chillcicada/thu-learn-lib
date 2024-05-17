import dotenv from 'dotenv'
import { Learn2018Helper } from '../src'

dotenv.config({ path: 'test/.env' })

const U = process.env.U!
const P = process.env.P!

describe('base snapshot', async () => {
  let helper: Learn2018Helper

  beforeAll(async () => {
    helper = new Learn2018Helper()
    await helper.login(U, P)
  })
  afterAll(async () => {
    await helper.logout()
  })

  it('should get user info', async () => {
    const user = await helper.getUserInfo()
    expect(user).toMatchSnapshot()
  })

  it('should get semester list', async () => {
    const semesters = await helper.getSemesterIdList()
    expect(semesters).toMatchSnapshot()
  })

  it('should get current semester', async () => {
    const semester = await helper.getCurrentSemester()
    expect(semester).toMatchSnapshot()
  })

  it('should logout', async () => {
    await helper.logout()
  })
})
