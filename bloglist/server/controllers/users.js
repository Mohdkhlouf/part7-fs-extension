const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if(!username || !password)
    return response.status(400).json({ error : 'missing information' })
  if (username.length <3 || password.length <3 )
    return response.status(400).json({ error : 'both username and password must be more than 3 letters' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username, name, passwordHash
  })

  const addedUser = await user.save()
  response.status(201).json(addedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs',{ title:1 })
  response.status(200).json(users)
})



module.exports = usersRouter