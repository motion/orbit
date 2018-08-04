export type ConfluenceGroupResponse = {
  results: {
    name: string
  }[]
}

export type ConfluenceGroupMembersResponse = {
  results: {
    accountId: string
    displayName: string
    profilePicture: {
      path: string
    }
    username: string
  }[]
}

export type ConfluenceGroupMember = ConfluenceGroupMembersResponse["results"][0];