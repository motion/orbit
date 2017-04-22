import request from 'request'

export default function(prefix, proxy_url) {
  return function(req, res, next) {
    const proxy_path = req.path.match(RegExp('^\\/' + prefix + '(.*)$'))
    if (proxy_path) {
      const db_url = proxy_url + proxy_path[1]
      req
        .pipe(
          request({
            uri: db_url,
            method: req.method,
            qs: req.query,
          })
        )
        .pipe(res)
    } else {
      next()
    }
  }
}
