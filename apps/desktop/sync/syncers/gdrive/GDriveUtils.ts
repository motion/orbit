import TurndownService from 'turndown'
import * as fs from "fs";
import * as https from "https";
import {URL} from "url";
import * as Constants from '@mcro/constants'
import Strategies from '@mcro/oauth-strategies'
import r2 from '@mcro/r2'
import { GoogleDriveFetchQueryOptions } from 'GDriveTypes.ts'
import { Setting } from '@mcro/models'

export function htmlToMarkdown(html: string) {
  const turndown = new TurndownService()
  return turndown.turndown(
    html
      .replace(/<head>.*<\/head>/g, '')
      .replace(/ style="[^"]+"/g, '')
  );
}

export function downloadFile(url: string, dest: string, options?: { headers?: any }): Promise<void> {
  return new Promise((ok, fail) => {
    const file = fs.createWriteStream(dest);
    const urlObject = new URL(url);
    https.get({
      protocol: urlObject.protocol,
      host: urlObject.host,
      port: urlObject.port,
      path: urlObject.pathname,
      method: "GET",
      headers: options ? options.headers : {}
    }, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close();
        ok();
      }).on('error', function(err) { // Handle errors
        fail(err.message);
      });
    });
  });
}

/**
 * Fetches data from Google Drive Api.
 *
 * todo: we need to supply only a token instead of setting.
 * todo: this will be possible after we extract refresh token logic
 */
export async function fetchFromGoogleDrive<R>(setting: Setting, options: GoogleDriveFetchQueryOptions<R>): Promise<R> {
  const { url, query, json } = options
  const qs = Object.keys(query).map(key => key + "=" + query[key]).join("&");
  const fullUrl = `https://content.googleapis.com/drive/v3${url}?${qs}`
  const response = await fetch(fullUrl, {
    mode: json ? 'cors' : undefined,
    headers: {
      'Authorization': `Bearer ${setting.token}`,
      'Access-Control-Allow-Origin': Constants.API_URL,
      'Access-Control-Allow-Methods': 'GET',
    },
  })
  const result = json ? await response.json() : await response.text();
  if (result.error && result.error.code === 401/* && !isRetrying*/) {
    const didRefresh = await refreshToken(setting)
    if (didRefresh) {
      return await fetchFromGoogleDrive(setting, options)
    } else {
      console.error('Couldnt refresh access token :(', result)
      throw result.error
    }
  } else if (result.error) {
    console.log(fullUrl, 'error getting result for', result.error)
    throw result.error;
  }
  return result
}

// refresh token functionality should be part of settings functionality!
async function refreshToken(setting: Setting) {
  if (!setting.values.oauth.refreshToken) {
    return null
  }
  const reply = await r2.post('https://www.googleapis.com/oauth2/v4/token', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    formData: {
      refresh_token: setting.values.oauth.refreshToken,
      client_id: Strategies.gmail.config.credentials.clientID,
      client_secret: Strategies.gmail.config.credentials.clientSecret,
      grant_type: 'refresh_token',
    },
  }).json
  if (reply && reply.access_token) {
    setting.token = reply.access_token
    await setting.save()
    return true
  }
  return false
}
