const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0))
const byteHex = (n: number) => `0${Number(n).toString(16)}`.slice(-2)
function applySaltToChar(salt: string) {
  return (code: number) =>
    textToChars(salt).reduce((a, b) => a ^ b, code)
}

export function cipher(salt: string) {
  return (text: string) =>
    textToChars(text).map(applySaltToChar(salt)).map(byteHex).join('')
}

export function decipher(salt: string) {
  return (encoded: string) =>
    encoded
      .match(/.{1,2}/g)!
      .map(hex => Number.parseInt(hex, 16))
      .map(applySaltToChar(salt))
      .map(charCode => String.fromCharCode(charCode))
      .join('')
}
