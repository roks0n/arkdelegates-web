const nextRoutes = require('next-routes')
const routes = (module.exports = nextRoutes())

routes
  .add({ name: 'delegates', page: 'delegates', pattern: '/delegates/' })
  .add({ name: 'delegate', page: 'delegate', pattern: '/delegate/:slug/' })
  .add({
    name: 'delegate-contributions',
    page: 'delegate',
    pattern: '/delegate/:slug/contributions/',
  })
  .add({ name: 'delegate-news', page: 'delegate', pattern: '/delegate/:slug/news/' })
  .add({ name: 'claim-delegate', page: 'claim-delegate', pattern: '/claim-delegate/' })
  .add({ name: 'claim-delegate-account', page: 'auth/claim', pattern: '/auth/claim/:slug/' })
  .add({ name: 'login', page: 'auth/login', pattern: '/auth/login/' })
  .add({ name: 'edit-delegate', page: 'edit/delegate', pattern: '/edit/delegate/' })
