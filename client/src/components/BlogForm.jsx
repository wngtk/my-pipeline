import { useState } from 'react'
import * as PropTypes from 'prop-types'

function BlogForm({ createBlog }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = ({ target }) => {
    setTitle(target.value)
  }
  const handleAuthorChange = ({ target }) => {
    setAuthor(target.value)
  }
  const handleUrlChange = ({ target }) => {
    setUrl(target.value)
  }

  const handleCreate = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })
    console.log('creating blog')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <p>
          title:
          <input
            id="blog-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="write blog title here"
          />
        </p>
        <p>
          author:{' '}
          <input
            id="blog-author"
            type="text"
            value={author}
            onChange={handleAuthorChange}
          />
        </p>
        <p>
          url:{' '}
          <input
            id="blog-url"
            type="text"
            value={url}
            onChange={handleUrlChange}
          />
        </p>
        <button id="create-blog-button">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  onSubmit: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  value1: PropTypes.string,
  onChange1: PropTypes.func,
  value2: PropTypes.string,
  onChange2: PropTypes.func,
}

export default BlogForm
