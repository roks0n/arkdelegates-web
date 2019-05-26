const nextRoutes = require('next-routes')
const routes = (module.exports = nextRoutes())

routes
  .add('delegate', '/delegate/:slug')
  .add({
    name: 'delegate-contributions',
    page: 'delegate',
    pattern: '/delegate/:slug/contributions',
  })
  .add({ name: 'delegate-news', page: 'delegate', pattern: '/delegate/:slug/news' })
