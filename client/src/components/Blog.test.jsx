import Blog from './Blog'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('<Blog />', async () => {
  const blog = {
    title: 'Hello World',
    author: 'John Doe',
    url: 'no url',
    likes: 0,
  }

  const { container } = render(<Blog blog={blog} />)

  const viewButton = screen.getByText('view')
  const user = userEvent.setup()
  await user.click(viewButton)

  const author = container.querySelector('.author')
  expect(author).toHaveTextContent('John Doe')
})

test('after clicking view button, url and likes are displayed', async () => {
  const blog = {
    title: 'Hello World',
    author: 'John Doe',
    url: 'no url',
    likes: 20,
  }

  const { container } = render(<Blog blog={blog} />)

  const view = screen.getByText('view')
  const user = userEvent.setup()
  await user.click(view)

  const url = container.querySelector('.url')
  expect(url).toHaveTextContent('no url')
  const likes = container.querySelector('.likes')
  expect(likes).toHaveTextContent('20')
})

test('likes button can be clicked twice', async () => {
  const blog = {
    title: 'Hello World',
    author: 'John Doe',
    url: 'no url',
    likes: 20,
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} onLikeClick={mockHandler} />)

  const view = screen.getByText('view')
  const user = userEvent.setup()
  await user.click(view)

  const like = screen.getByText('like')
  await user.click(like)
  await user.click(like)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
