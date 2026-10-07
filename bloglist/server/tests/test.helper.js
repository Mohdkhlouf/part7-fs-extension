const mongoose = require('mongoose')
const Blog = require('../models/blog')

const userId1 = new mongoose.Types.ObjectId('696484e54eeef0aaf2cd8023')
const userId2 = new mongoose.Types.ObjectId('6964a9831d37b1f598869995')

const initialUsers = [
  {
    _id: userId1,
    username: 'mohammad2',
    name: 'mohammad2',
    passwordHash: '$2b$10$83sFMv0z3/1tyZxeDO19tu9/xWy4ekyJDeeKwLLuo4.l86uXlIlDO',
    blogs: []
  },
  {
    _id: userId2,
    username: 'mohammad3',
    name: 'mohammad3',
    passwordHash: '$2b$10$83sFMv0z3/1tyZxeDO19tu9/xWy4ekyJDeeKwLLuo4.l86uXlIlDO',
    blogs: []
  }
]

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: userId1
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: userId1
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: userId1
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    likes: 10,
    user: userId2
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: userId2
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: userId2
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  })
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb
}
