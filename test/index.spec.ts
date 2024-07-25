import dotenv from 'dotenv'
import Learn2018Helper from '../src'

dotenv.config({ path: 'test/.env' })

const username = process.env.U || ''
const password = process.env.P || ''

describe('helper authentication', () => {
  const helper = new Learn2018Helper({ username, password })

  it('should login', async () => {
    await helper.login()
  })
})
