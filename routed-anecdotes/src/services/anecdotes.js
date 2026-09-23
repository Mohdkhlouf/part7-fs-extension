const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

const createNew = async (object) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object),
  })

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}

const deleteAnecdote = async (id) => {
  const options = {
    method: 'DELETE',
    header: { 'Content-Type': 'applocation/json' },
  }

  const response = await fetch(`${baseUrl}/${id}`, options)
  if (!response.ok) throw new Error('cannot delete the anecdote')

  return await response.json()
}

export default { getAll, createNew,deleteAnecdote }
