import { slack } from './directory/slack/slack'
import { github } from './directory/github/github'
import { gmail } from './directory/gmail/gmail'
import { jira } from './directory/jira/jira'
import { GetOrbitApp, GetOrbitApps } from './types'

// import iconGCalendar from '../../public/icons/gcalendar.svg'
// import iconGDocs from '../../public/icons/gdocs.svg'
// import iconGDrive from '../../public/icons/gdrive.svg'
// import iconGSheets from '../../public/icons/gsheets.svg'
// import iconConfluence from '../../public/icons/confluence.svg'
// import iconWebsite from '../../public/icons/website.svg'

export const getApps: GetOrbitApps = {
  slack,
  github,
  gmail,
  jira,
  person: (slack as unknown) as GetOrbitApp<'person'>,
  gdrive: (slack as unknown) as GetOrbitApp<'gdrive'>,
  confluence: (slack as unknown) as GetOrbitApp<'confluence'>,
  website: (slack as unknown) as GetOrbitApp<'website'>,
  app1: (slack as unknown) as GetOrbitApp<'app1'>,
}
