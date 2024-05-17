const id = 1

export async function interceptCsrfRequest(csrf: string) {
  if (await browser.permissions.contains({ permissions: ['declarativeNetRequest'] })) {
    browser.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [id] })
    browser.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [id],
      addRules: [
        {
          id,
          condition: {
            requestDomains: ['learn.tsinghua.edu.cn'],
            tabIds: [(await browser.tabs.getCurrent()).id!],
          },
          action: {
            type: 'redirect',
            redirect: {
              transform: {
                queryTransform: {
                  addOrReplaceParams: [{ key: '_csrf', value: csrf, replaceOnly: true }],
                },
              },
            },
          },
        },
      ],
    })
  }
}
