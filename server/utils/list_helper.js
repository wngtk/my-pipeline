const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (total, blog) => {
    return total + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const res = blogs.reduce((res, blog) => {
    return res.likes < blog.likes ? blog : res
  }, blogs[0])

  return { author: res.author, likes: res.likes, title: res.title }
}

const mostBlogs = (blogs) => {
  const blogAuthor = blog => blog.author
  const blogCounts = _.countBy(blogs, blogAuthor)
  const topAuthor = _.maxBy(_.toPairs(blogCounts), ([, count]) => count)
  return { author: topAuthor[0], blogs: topAuthor[1] }
}

const mostLikes = (blogs) => {
  const blogAuthor = blog => blog.author
  const blogByAuthor = _.groupBy(blogs, blogAuthor)
  const likes = _.transform(blogByAuthor, (result, blogs, author) => {
    result[author] = _.sumBy(blogs, blog => blog.likes)
  }, {})

  const lovestAuthor = _.maxBy(_.toPairs(likes), ([, likes]) => likes)
  return { author: lovestAuthor[0], likes: lovestAuthor[1] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
