/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
const sm = require('sitemap')
const fetch = require('isomorphic-unfetch')

const sitemap = sm.createSitemap({
  hostname: 'https://arkdelegates.io',
  cacheTime: 14400000, // 4h - cache purge period
  urls: [
    { url: '/', changefreq: 'daily', priority: 1 },
    { url: '/delegates/', changefreq: 'daily', priority: 0.7 },
  ],
})

const setup = async ({ server }) => {
  let page = 1
  while (true) {
    const data = await fetch(`${process.env.API_URL}delegates/?page=${page}`).then((res) =>
      res.json()
    )

    for (const delegate of data.data) {
      sitemap.add({
        url: `/delegate/${delegate.slug}/`,
        changefreq: 'weekly',
        priority: 0.5,
      })
    }
    if (data.total_pages === data.current_page) {
      break
    }
    page++
  }

  server.get('/sitemap.xml', (req, res) => {
    sitemap.toXML((err, xml) => {
      if (err) {
        res.status(500).end()
        return
      }

      res.header('Content-Type', 'application/xml')
      res.send(xml)
    })
  })
}

module.exports = setup
