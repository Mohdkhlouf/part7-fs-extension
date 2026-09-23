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
    try {
      const addedAnecdote = await anecdotesService.createNew(anecdote)
      setAnecdotes(anecdotes.concat(addedAnecdote))
    } catch (e) {
      console.log('failed to delete anecdote',e)
    }
  }

  const deleteAnecdote = async (id) => {
    try {
      await anecdotesService.deleteAnecdote(id)
      const filteredAnecdotes = anecdotes.filter((anecdote) => anecdote.id != id)
      setAnecdotes(filteredAnecdotes)
    } catch (e) {
      console.log('failed to delete anecdote',e)
    }
  }


  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote
  }
}
