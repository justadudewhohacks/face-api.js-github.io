exports.createPages = ({ boundActionCreators, graphql }) => {

  const { createRedirect } = boundActionCreators

  createRedirect({
    fromPath: '/',
    isPermanent: true,
    redirectInBrowser: true,
    toPath: '/image_source'
  })
}