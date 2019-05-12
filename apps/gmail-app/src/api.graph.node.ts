import gapiToGraphQL from 'gapi-to-graphql'
import GmailApi from 'gapi-to-graphql/google_apis/gmail-v1'

export async function graph() {
  return gapiToGraphQL({
    gapiAsJsonSchema: GmailApi,
  })
}
