import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const User = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get(`/api/users/${id}`)
      .then(res => setUser(res.data))
  }, [id])

  if (!user) return null

  return (
    <div>
      <h1>{user.username}</h1>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(b => <li key={b.id}>{b.title}</li>)}

      </ul>
    </div>
  )
}

export default User
