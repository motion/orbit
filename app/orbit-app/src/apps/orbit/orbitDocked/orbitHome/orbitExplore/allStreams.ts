import { PersonBitModel, BitModel } from "@mcro/models";

const findManyType = integration => ({
  take: 10,
  where: {
    integration,
  },
  relations: ['people'],
  order: { bitCreatedAt: 'DESC' },
})


export const allStreams = [
  // {
  //   id: '-1',
  //   name: 'Apps',
  //   source: 'apps',
  //   showTitle: false,
  //   model: SettingModel,
  //   query: {
  //     where: {
  //       category: 'integration',
  //     },
  //     take: 1000,
  //   },
  // },
  {
    id: '0',
    name: 'People',
    source: 'people',
    model: PersonBitModel,
    query: {
      take: 20,
    },
  },
  {
    id: '1',
    name: 'Slack',
    source: 'slack',
    model: BitModel,
    query: findManyType('slack'),
  },
  {
    id: '2',
    name: 'Gmail',
    source: 'gmail',
    model: BitModel,
    query: findManyType('gmail'),
  },
  {
    id: '3',
    name: 'Google Drive',
    source: 'gdrive',
    model: BitModel,
    query: findManyType('gdrive'),
  },
  {
    id: '4',
    name: 'Github',
    source: 'github',
    model: BitModel,
    query: findManyType('github'),
  },
  {
    id: '5',
    name: 'Confluence',
    source: 'confluence',
    model: BitModel,
    query: findManyType('confluence'),
  },
  {
    id: '6',
    source: 'jira',
    name: 'Jira',
    model: BitModel,
    query: findManyType('jira'),
  },
  {
    id: '7',
    source: 'website',
    name: 'Websites',
    model: BitModel,
    query: findManyType('website'),
  },
  // {
  //   id: '7',
  //   source: 'app1',
  //   name: 'Test App',
  //   model: BitModel,
  //   query: findManyType('app1'),
  // },
].filter(Boolean)
