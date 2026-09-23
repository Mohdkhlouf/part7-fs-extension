
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import About from './components/About'
import Footer from './components/Footer'
import CreateNew from './components/CreateNew'
import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  const { anecdotes, addAnecdote, deleteAnecdote } = useAnecdotes()

  const addNew = async (anecdote) => {
    await addAnecdote(anecdote)
  }

  const removeAnecdote = async (id) => {
    await deleteAnecdote(id)
  }

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Routes>
          <Route
            path="/"
            element={<AnecdoteList anecdotes={anecdotes} deleteAnecdote={removeAnecdote} />}
          />
          <Route path="/create" element={<CreateNew addNew={addNew} />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
