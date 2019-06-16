const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withCSS = require('@zeit/next-css')

const nextConfiguration = {
  env: {
    API_URL: process.env.API_URL,
  },
}

module.exports = withPlugins([withCSS, withImages], nextConfiguration)
