import { GithubApp } from './GithubApp'
import { githubIcon } from './githubIcon'
import { githubIconWhite } from './githubIconWhite'
import { GithubItem } from './GithubItem'
import GithubSettings from './GithubSettings'

export const github = {
  name: 'Github',
  modelType: 'bit',
  sourceType: 'github',
  itemName: 'task',
  icon: githubIcon,
  iconLight: githubIconWhite,
  views: {
    main: GithubApp,
    item: GithubItem,
    setting: GithubSettings,
  },
}
