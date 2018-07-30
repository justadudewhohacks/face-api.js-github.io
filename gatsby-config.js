module.exports = {
  pathPrefix: `/face-api.js`,
  siteMetadata: {
    siteName: `face-api.js`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/static`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-109709749-3`,
        head: false,
        anonymize: true,
        respectDNT: true
      }
    }
  ]
}