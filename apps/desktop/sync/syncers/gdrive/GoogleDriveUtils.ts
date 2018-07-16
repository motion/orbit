import TurndownService from 'turndown'

export function htmlToMarkdown(html: string) {
  const turndown = new TurndownService()
  return turndown.turndown(
    html
      .replace(/<head>.*<\/head>/g, '')
      .replace(/ style="[^"]+"/g, '')
  );
}
