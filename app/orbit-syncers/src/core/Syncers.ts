import { ConfluenceSyncer } from '../integrations/confluence/ConfluenceSyncer'
import { DriveSyncer } from '../integrations/drive/DriveSyncer'
import { GithubSyncer } from '../integrations/github/GithubSyncer'
import { GMailSyncer } from '../integrations/gmail/GMailSyncer'
import { JiraSyncer } from '../integrations/jira/JiraSyncer'
import { PinnedUrlsSyncer } from '../integrations/pinned/PinnedUrlsSyncer'
import { WebsiteSyncer } from '../integrations/website/WebsiteSyncer'
import { MailWhitelisterSyncer } from '../integrations/mail-whitelister/MailWhitelisterSyncer'
import { SlackSyncer } from '../integrations/slack/SlackSyncer'
import { Syncer } from './Syncer'

const ONE_MINUTE = 1000 * 60
const FIVE_MINUTES = ONE_MINUTE * 5
const TEN_MINUTES = ONE_MINUTE * 10

export const Syncers = [
  new Syncer({
    type: 'jira',
    constructor: JiraSyncer,
    interval: TEN_MINUTES,
  }),
  new Syncer({
    type: 'confluence',
    constructor: ConfluenceSyncer,
    interval: TEN_MINUTES,
  }),
  new Syncer({
    type: 'drive',
    constructor: DriveSyncer,
    interval: FIVE_MINUTES,
  }),
  new Syncer({
    type: 'gmail',
    constructor: GMailSyncer,
    interval: FIVE_MINUTES,
  }),
  new Syncer({
    type: 'github',
    constructor: GithubSyncer,
    interval: TEN_MINUTES,
  }),
  new Syncer({
    type: 'slack',
    constructor: SlackSyncer,
    interval: FIVE_MINUTES,
  }),
  new Syncer({
    constructor: MailWhitelisterSyncer,
    interval: TEN_MINUTES,
  }),
  new Syncer({
    constructor: PinnedUrlsSyncer,
    interval: TEN_MINUTES,
  }),
  new Syncer({
    type: 'website',
    constructor: WebsiteSyncer,
    interval: FIVE_MINUTES,
  }),
]
