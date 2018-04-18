import Syncer from '../syncer'
// import GithubFeedSync from './githubFeedSync'
import GithubTaskSync from './githubTaskSync'
// import GithubPeopleSync from './githubPeopleSync'

export default new Syncer('github', {
  actions: {
    task: { secondsBetween: 60 * 5 },
    people: { secondsBetween: 60 * 5 },
    // feed: { secondsBetween: 30 },
  },
  getSyncers: setting => ({
    task: new GithubTaskSync(setting),
    people: new GithubPeopleSync(setting, helpers),
    // feed: new GithubFeedSync(setting, helpers),
  }),
})
