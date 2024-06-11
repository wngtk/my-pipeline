import BlogForm from './BlogForm.jsx'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  test('should render properly and calls handleCreate', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()
    render(<BlogForm createBlog={createBlog} />)

    const title = screen.getByPlaceholderText('write blog title here')
    await user.type(title, 'blog title')

    const createButton = screen.getByText('create')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('blog title')
  })
})
