const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'Title or Url are missed' })
  }
  const user = await User.findById(request.user)
  if (!user)
    return response.status(400).json({ error: 'UserId missing or not valid' })

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: request.user,
  })
  const result = await blog.save()
  user.blogs = user.blogs.concat(result.id)
  await user.save()
  const populatedResult = await result.populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedResult)
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    if (!request.params.id)
      return response.status(400).json({ error: 'the id is not avaliable' })
    const foundedBlog = await Blog.findById(request.params.id)
    if (!foundedBlog)
      return response.status(400).json({ error: 'the blog is not avaliable' })
    if (foundedBlog.user.toString() !== request.user)
      return response
        .status(404)
        .json({ error: 'You are not allowed to delete this blog' })
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  },
)

blogsRouter.put('/:id', async (request, response) => {
  if (request.body.likes === undefined)
    return response
      .status(400)
      .json({ error: 'the needed information is not avaliable' })

  const blog = await Blog.findById(request.params.id)
  if (!blog)
    return response.status(400).json({ error: 'cannot find this blog id' })

  blog.likes = request.body.likes

  const editedBlog = await blog.save()
  response.status(200).send(editedBlog)
})

module.exports = blogsRouter
