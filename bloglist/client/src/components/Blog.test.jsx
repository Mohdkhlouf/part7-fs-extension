import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from './Blog'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

describe('<Blog />', () => {
  const blog = {
    id: '1',
    title: 'Component testing is done with react-testing-library',
    author: 'Mohammad',
    url: 'https://example.com',
    likes: 5,
    user: { username: 'mohammad', name: 'Mohammad' }
  }

  test('blog info and likes are shown to unauthenticated users, no buttons shown', () => {
    render(
      <Blog blog={blog} user={null} onLike={() => {}} onDelete={() => {}} />
    )

    expect(screen.getByText(blog.title, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(blog.author, { exact: false })).toBeInTheDocument()
    expect(screen.getByText('5', { exact: false })).toBeInTheDocument()

    expect(screen.queryByText('like')).not.toBeInTheDocument()
    expect(screen.queryByText('Remove')).not.toBeInTheDocument()
  })

  test('logged-in non-creator sees only the like button', () => {
    const loggedInUser = { username: 'someoneelse', name: 'Someone Else' }

    render(
      <Blog
        blog={blog}
        user={loggedInUser}
        onLike={() => {}}
        onDelete={() => {}}
      />
    )

    expect(screen.getByText('like')).toBeInTheDocument()
    expect(screen.queryByText('Remove')).not.toBeInTheDocument()
  })

  test('blog creator sees delete button and onDelete is called', async () => {
    const creator = { username: 'mohammad', name: 'Mohammad' }
    const onDelete = vi.fn()
    const user = userEvent.setup()

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    blogService.deleteBlog.mockResolvedValue({})

    render(
      <Blog blog={blog} user={creator} onLike={() => {}} onDelete={onDelete} />
    )

    await user.click(screen.getByText('Remove'))

    expect(onDelete).toHaveBeenCalledWith(blog.id)
  })

  test('like button calls the handler when clicked twice', async () => {
    const loggedInUser = { username: 'someoneelse', name: 'Someone Else' }
    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={loggedInUser}
        onLike={mockHandler}
        onDelete={() => {}}
      />
    )

    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
