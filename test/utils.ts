import process from 'node:process'
import dotenv from 'dotenv'

dotenv.config({ path: 'test/.env' })

const USERNAME = process.env.U || ''
const PASSWORD = process.env.P || ''

export { USERNAME as U, PASSWORD as P }
