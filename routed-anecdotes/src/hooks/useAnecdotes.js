import anecdotesService from '../services/anecdotes'
import { useState, useEffect } from 'react'

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect( () => {
      const fetchedAnecdotes = async () => {
        const data = await anecdotesService.getAll()
        setAnecdotes(data)
      }
    fetchedAnecdotes()
    },[]   )

  const addAnecdote = async (anecdote) => {
    const addedAnecdote = await anecdotesService.createNew(anecdote)
    setAnecdotes(anecdotes.concat(addedAnecdote))
  }

  return {
    anecdotes,
    addAnecdote
  }
}
