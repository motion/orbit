// MIT License

// Copyright (c) 2018 Charles Stover

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// https://github.com/CharlesStover/fetch-suspense

import { isEqual } from '@o/fast-compare'

interface FetchCache {
  fetch?: Promise<void>
  error?: any
  init: RequestInit | undefined
  input: RequestInfo
  response?: any
}

const fetchCaches: FetchCache[] = []

export const useFetch = (
  input: RequestInfo,
  init?: RequestInit | undefined,
  lifespan: number = 0,
) => {
  for (const fetchCache of fetchCaches) {
    // The request hasn't changed since the last call.
    if (isEqual(input, fetchCache.input) && isEqual(init, fetchCache.init)) {
      // If an error occurred,
      if (Object.prototype.hasOwnProperty.call(fetchCache, 'error')) {
        throw fetchCache.error
      }

      // If a response was successful,
      if (Object.prototype.hasOwnProperty.call(fetchCache, 'response')) {
        return fetchCache.response
      }
      throw fetchCache.fetch
    }
  }

  // The request is new or has changed.
  const fetchCache: FetchCache = {
    fetch:
      // Make the fetch request.
      fetch(input, init)
        // Parse the response.
        .then(response => {
          const contentType = response.headers.get('Content-Type')
          if (contentType && contentType.indexOf('application/json') !== -1) {
            return response.json()
          }
          return response.text()
        })

        // Cache the response.
        .then(response => {
          fetchCache.response = response
        })
        .catch(e => {
          fetchCache.error = e
        })

        // Invalidate the cache.
        .then(() => {
          if (lifespan > 0) {
            setTimeout(() => {
              const index = fetchCaches.indexOf(fetchCache)
              if (index !== -1) {
                fetchCaches.splice(index, 1)
              }
            }, lifespan)
          }
        }),
    init,
    input,
  }
  fetchCaches.push(fetchCache)
  throw fetchCache.fetch
}
