import {github} from './github/GithubSyncer'
import {gmail} from './gmail/GMailSyncer'
import {gdocs} from './gdrive/GDriveSyncer'
import {slack} from './slack/SlackSyncer'
import {confluence} from './confluence/ConfluenceSyncer'
import {jira} from './jira/JiraSyncer'

export const Syncers = [
  github,
  gmail,
  gdocs,
  slack,
  confluence,
  jira,
]