import { slack } from './directory/slack/slack'
import { github } from './directory/github/github'
import { GetOrbitApp, GetOrbitApps } from './types'

// import iconGCalendar from '../../public/icons/gcalendar.svg'
// import iconGDocs from '../../public/icons/gdocs.svg'
// import iconGDrive from '../../public/icons/gdrive.svg'
// import iconGMail from '../../public/icons/gmail.svg'
// import iconGSheets from '../../public/icons/gsheets.svg'
// import iconConfluence from '../../public/icons/confluence.svg'
// import iconJira from '../../public/icons/jira.svg'
// import iconWebsite from '../../public/icons/website.svg'

export const getApps: GetOrbitApps = {
  slack,
  github,
  person: (slack as unknown) as GetOrbitApp<'person'>,
  gmail: (slack as unknown) as GetOrbitApp<'gmail'>,
  gdrive: (slack as unknown) as GetOrbitApp<'gdrive'>,
  jira: (slack as unknown) as GetOrbitApp<'jira'>,
  confluence: (slack as unknown) as GetOrbitApp<'confluence'>,
  website: (slack as unknown) as GetOrbitApp<'website'>,
  app1: (slack as unknown) as GetOrbitApp<'app1'>,
}
