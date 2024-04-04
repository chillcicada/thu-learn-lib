import { type Downloads, downloads } from 'webextension-polyfill'

export async function initiateFileDownload(url: string, filename?: string) {
  try {
    const id = await downloads.download({
      url,
      filename,
    })
    // eslint-disable-next-line no-console
    console.log(`Download ${url} starts with id ${id}`)
  }
  catch (e) {
    const reason = e as Downloads.InterruptReason
    // eslint-disable-next-line no-console
    console.log(`Download ${url} failed: ${reason}`)
  }
}
