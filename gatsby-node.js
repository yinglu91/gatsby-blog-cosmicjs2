const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // rename the index page from / to /posts
  createPage({
    path: `posts`,
    component: path.resolve('./src/pages/index.js'),
  })

  const result = await graphql(
    `
      {
        allCosmicjsPosts(
          sort: { fields: [created], order: DESC }
          limit: 1000
        ) {
          nodes {
            slug
            title
          }
        }
      }
    `
  )

  if (result.errors) {
    console.log(result.errors)
    return
  }

  // Create blog posts pages.

  const posts = result.data.allCosmicjsPosts.nodes
  posts.forEach((post, index) => {
    const next = index === posts.length - 1 ? null : posts[index + 1]
    const previous = index === 0 ? null : posts[index - 1]

    createPage({
      path: `posts/${post.slug}`,
      component: path.resolve('./src/templates/blog-post.js'),
      context: {
        slug: post.slug,
        previous,
        next,
      },
    })
  })
}
