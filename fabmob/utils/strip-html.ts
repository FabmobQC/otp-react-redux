/**
 * Converts an HTML string to plain text, turning block-level breaks
 * (<p>, <div>, <br>) into newlines so the result stays readable.
 * Uses DOMParser (never inserted into the live document), so no markup
 * is ever executed, unlike dangerouslySetInnerHTML.
 */
export function stripHtml(html: string): string {
  const withBreaks = html.replace(/<\/(p|div)>|<br\s*\/?>/gi, '\n')
  const doc = new DOMParser().parseFromString(withBreaks, 'text/html')
  return (doc.body.textContent || '').trim()
}
