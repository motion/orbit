import { SlackApp } from './SlackApp'
import { SlackSettings } from './SlackSettings'
import { Setting, GenericBit } from '@mcro/models'
// @ts-ignore
import iconSlack from '../../../public/icons/slack.svg'
import { GetOrbitApp, ItemProps, ItemResolverProps } from '../types'
import { findManyType } from '../helpers/queries'
import { SlackItem } from './SlackItem'

export type SlackProps = ItemResolverProps<GenericBit<'slack'>>

export const slack: GetOrbitApp<'slack'> = (setting?: Setting) => ({
  config: {
    icon: iconSlack,
  },
  source: 'slack',
  integrationName: 'Slack',
  displayName: setting.name,
  defaultQuery: (findManyType('slack') as unknown) as any,
  views: {
    main: SlackApp,
    item: SlackItem,
    setting: SlackSettings,
  },
})

export type SlackAppProps = ItemProps<GenericBit<'slack'>>
