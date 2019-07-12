import gapiToGraphQL from 'gapi-to-graphql'
import DriveApi from 'gapi-to-graphql/google_apis/drive-v3'

export async function graph() {
  return gapiToGraphQL({
    gapiAsJsonSchema: DriveApi,
  })
}
