exports.createPages = ({ boundActionCreators, graphql }) => {

  const { createRedirect } = boundActionCreators

  createRedirect({
    fromPath: '/',
    isPermanent: true,
    redirectInBrowser: true,
    toPath: '/face_and_landmark_detection'
  })

  createRedirect({
    fromPath: '/docs',
    isPermanent: true,
    redirectInBrowser: true,
    toPath: '/docs/globals.html'
  })
}