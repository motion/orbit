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

export type ConfluenceUser = {
  accountId: string
  displayName: string
  profilePicture: {
    path: string
  }
  username: string
  details: {
    personal: {
      email: string
    }
  }
}

export type ConfluenceGroupMember = ConfluenceGroupMembersResponse["results"][0]

export type AtlassianUser = {
  accountId: string
  userKey: string
  username: string
  displayName: string
  profilePicture: {
    path: string
    height: number
    width: number
  }
  latest: boolean
}

export type AtlassianContent = {
  body: { storage: { value: string } }
  history: {
    createdDate: string
    createdBy: AtlassianUser
    lastUpdated: {
      by: AtlassianUser
      when: string
    }
  }
  space: {
    id: string
    name: string
    _links: {
      base: string
      webui: string
    }
  }
  extensions: Object
  id: string
  status: string
  title: string
  type: 'page'
  _links: {
    base: string
    webui: string
  }
}

export type AtlassianObj = {
  response: AtlassianContent
  markdownBody: string
  body: string
}
