export default defineBackground(() => {
  browser.action.onClicked.addListener(() => {
    browser.tabs.create({
      url: 'index.html',
    })
  })
})
