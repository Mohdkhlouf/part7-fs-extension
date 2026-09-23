
const AnecdoteList = ({ anecdotes, deleteAnecdote }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote =>
        <li key={anecdote.id}>
          {anecdote.content}
          <button onClick={() => deleteAnecdote(anecdote.id)}>Delete</button>
        </li>)}
    </ul>
  </div>
)

export default AnecdoteList
