const express = require('express')
const next = require('next')
const routes = require('../routes')
const parseURL = require('url').parse

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  const server = express()
  server.enable('strict routing')
  server.use(slash())

  server.get('*', (req, res) => {
    return handler(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

function slash(statusCode) {
  statusCode || (statusCode = 301)

  return function(req, res, next) {
    const method = req.method.toLowerCase()

    // Skip when the request is neither a GET or HEAD.
    if (!(method === 'get' || method === 'head')) {
      next()
      return
    }

    const url = parseURL(req.url),
      pathname = url.pathname,
      search = url.search || '',
      hasSlash = pathname.substr(-1) === '/',
      isStatic = pathname.includes('_next')

    if (!hasSlash && !isStatic) {
      res.redirect(statusCode, `${pathname}/${search}`)
    } else {
      next()
    }
  }
}
