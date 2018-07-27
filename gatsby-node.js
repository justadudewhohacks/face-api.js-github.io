const { withPrefix } = require('gatsby-link')

exports.createPages = ({ boundActionCreators, graphql }) => {

  const { createRedirect } = boundActionCreators

  createRedirect({
    fromPath: withPrefix('/'),
    isPermanent: true,
    redirectInBrowser: true,
    toPath: withPrefix('/face_detection')
  })
}