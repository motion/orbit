import { logger } from '@mcro/logger'
import { Bit, Person } from '@mcro/models'
import { AtlassianService } from '@mcro/services'
import TurndownService from 'turndown'

export class ConfluenceUtils {

  static contentHtmlToMarkdown(html: string): string {
    const turndown = new TurndownService()
    const htmlToMarkdown = html => turndown.turndown(html)
    return htmlToMarkdown(html)
  }

}
