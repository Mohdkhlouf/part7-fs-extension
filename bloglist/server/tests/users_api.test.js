const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)
const assert = require('node:assert')
const helper = require('./test.helper')

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

test('successfuly added user', async () => {
  const newuser = {
    username: 'mohammad5',
    password: '1002003000',
    name: 'mohammad5'
  }
  await api
    .post('/api/users')
    .send(newuser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

test('wrong username user', async () => {
  const newuser = {
    username: 'm1',
    password: '1002003000',
    name: 'mohammad6'
  }
  await api
    .post('/api/users')
    .send(newuser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('wrong password user', async () => {
  const newuser = {
    username: 'mohammad6',
    password: '20',
    name: 'mohammad6'
  }
  await api
    .post('/api/users')
    .send(newuser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})
after(async () => {
  await mongoose.connection.close()
})
