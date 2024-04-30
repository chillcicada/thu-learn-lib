import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Language, Learn2018Helper } from '../src'
import { P, U } from './utils'

const configs = { provider: () => ({ username: U, password: P }) }

describe('helper interaction', () => {
  let helper: Learn2018Helper

  beforeAll(async () => {
    helper = new Learn2018Helper(configs)
  })
  afterAll(async () => {
    await helper.logout()
  })

  it('should set lang', async () => {
    await helper.login()
    const pre_lang = helper.getCurrentLanguage()
    const toset_lang = pre_lang === Language.EN ? Language.ZH : Language.EN
    await helper.setLanguage(toset_lang)
    expect(helper.getCurrentLanguage()).toBe(toset_lang)

    await helper.logout()
    await helper.login()
    expect(helper.getCurrentLanguage()).toBe(toset_lang)

    await helper.setLanguage(pre_lang)
  })
})
