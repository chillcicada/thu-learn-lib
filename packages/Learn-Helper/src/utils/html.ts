import React from 'react'

export function renderHTML(content?: string) {
  return React.createElement('span', {
    dangerouslySetInnerHTML: { __html: content },
    style: { display: 'contents' },
  })
}
