import { useState } from 'react'
import { TextField, Button } from '@mui/material'



const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const createNewBlog = async (event) => {
    event.preventDefault()
    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')

  }
  return (
    <div>
      <form onSubmit={createNewBlog}>
        <div>
          <TextField id="outlined-basic" label="Ttile" variant="outlined" value={blogTitle} size="small" style={{ marginTop: 10 }}
            onChange={({ target }) => setBlogTitle(target.value)} />
        </div>


        <div>
          <TextField id="outlined-basic" label="author" variant="outlined" value={blogAuthor} size="small" style={{ marginTop: 10 }}
            onChange={({ target }) => setBlogAuthor(target.value)} />
        </div>

        <div>
          <TextField id="outlined-basic" label="url" variant="outlined" value={blogUrl} size="small" style={{ marginTop: 10 }}
            onChange={({ target }) => setBlogUrl(target.value)} />

        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}> Create </Button>
        <div>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
