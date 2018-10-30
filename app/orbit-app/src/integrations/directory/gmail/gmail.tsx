import { Setting } from '@mcro/models'
// @ts-ignore
import icon from '../../../../public/icons/gmail.svg'
import { GetOrbitIntegration } from '../../types'
import { findManyType } from '../../helpers/queries'
import { GmailApp } from './views/GmailApp'
import { GmailItem } from './views/GmailItem'
import { GmailSources } from './views/GmailSources'

export const gmail: GetOrbitIntegration<'gmail'> = (setting?: Setting) => ({
  modelType: 'bit',
  integration: 'gmail',
  appName: 'Gmail',
  defaultQuery: findManyType('gmail'),
  display: {
    name: setting.name,
    itemName: 'thread',
    icon,
  },
  views: {
    main: GmailApp,
    item: GmailItem,
    setting: GmailSources,
  },
})
