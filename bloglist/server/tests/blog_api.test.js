const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const api = supertest(app)
const assert = require('node:assert')
const helper = require('./test.helper')
const logger = require('../utils/logger')

let userToken

beforeEach(async () => {
  const logRes = await api.post('/api/login')
    .send(
      {
        'username':'mohammad3',
        'password':'1891985'
      }
    )
  userToken = logRes.body.token
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('the unique identifier property is named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  response.body.forEach((blog) => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})


test('using POST to add new blog', async () => {
  const newBlog = {
    title: 'Mohammad Khlouf story',
    author: 'mohammad khlouf',
    url: 'https://reactpatterns.com/',
    likes: 0,
  }

  const beforePostBlogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  const before_length = beforePostBlogs.body.length
  await api
    .post('/api/blogs')
    .set({ Authorization: `Bearer ${userToken}` })
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const afterPostBlogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const afterPost = afterPostBlogs.body.length
  assert.strictEqual(afterPost, before_length + 1)
  assert.strictEqual(afterPostBlogs.body[afterPost - 1].title, newBlog.title)
  assert.strictEqual(afterPostBlogs.body[afterPost - 1].author, newBlog.author)
  assert.strictEqual(afterPostBlogs.body[afterPost - 1].url, newBlog.url)
  assert.strictEqual(afterPostBlogs.body[afterPost - 1].likes, newBlog.likes)
})


test('Posting without token', async () => {
  const newBlog = {
    title: 'Mohammad Khlouf story',
    author: 'mohammad khlouf',
    url: 'https://reactpatterns.com/',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})


test('when no likes with request then it will be 0', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'mohammad khlouf',
    url: 'https://reactpatterns.com/12',
  }

  await api
    .post('/api/blogs')
    .set({ Authorization: `Bearer ${userToken}` })
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const afterPostBlogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  const afterPost = afterPostBlogs.body.length
  assert.strictEqual(afterPostBlogs.body[afterPost - 1].likes, 0)
})


test('when no title must return 400 bad request', async () => {
  const newBlog = {
    author: 'mohammad khlouf',
    url: 'https://reactpatterns.com/12',
  }

  await api
    .post('/api/blogs')
    .set({ Authorization: `Bearer ${userToken}` })
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})


test('when no url must return 400 bad request', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'mohammad khlouf',
  }

  await api
    .post('/api/blogs')
    .set({ Authorization: `Bearer ${userToken}` })
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('delete one blog with not authorized user', async () => {
  const blogsBeforeDelete = await helper.blogsInDb()
  const blogToBeDeleted = blogsBeforeDelete[4]
  await api
    .delete(`/api/blogs/${blogToBeDeleted.id}`)
    .set({ Authorization: `Bearer ${userToken}` })
    .expect(204)
  const blogsAfterDeleting = await helper.blogsInDb()
  const ids = blogsAfterDeleting.map((blog) => blog.id)
  assert.ok(!ids.includes(blogToBeDeleted.id))
})


test('delete one blog with not authorized user', async () => {
  const blogsBeforeDelete = await helper.blogsInDb()
  const blogToBeDeleted = blogsBeforeDelete[0]
  await api
    .delete(`/api/blogs/${blogToBeDeleted.id}`)
    .set({ Authorization: `Bearer ${userToken}` })
    .expect(404)
})

test('update blog information', async () => {
  const blogsBefore = await helper.blogsInDb()
  const blogToBeEdited = blogsBefore[0]

  const newLikes = {
    likes: 10
  }

  await api
    .put(`/api/blogs/${blogToBeEdited.id}`)
    .set({ Authorization: `Bearer ${userToken}` })
    .send(newLikes)
    .expect(200)

  const blogsAfterUpdate = await helper.blogsInDb()

  const dbEdited = blogsAfterUpdate.find(
    blog => blog.id === blogToBeEdited.id
  )

  assert.strictEqual(dbEdited.likes, newLikes.likes)
})



after(async () => {
  await mongoose.connection.close()
})
