module.exports = {
  pathPrefix: `/`,
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
    }

  ]
}