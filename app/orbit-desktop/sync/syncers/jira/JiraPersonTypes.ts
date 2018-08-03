export type JiraPeopleResponse = {
  accountId: string
  self: string
  key: string
  name: string
  emailAddress: string
  displayName: string
  avatarUrls: {
    "48x48": string
  }
}[];

export type JiraPerson = JiraPeopleResponse[0];

