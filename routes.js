const nextRoutes = require('next-routes')
const routes = (module.exports = nextRoutes())

routes
  .add('delegate', '/delegate/:slug')
  .add({ name: 'delegate-1', page: 'delegate', pattern: '/delegate/:slug/contributions' })
  .add({ name: 'delegate-2', page: 'delegate', pattern: '/delegate/:slug/news' })
