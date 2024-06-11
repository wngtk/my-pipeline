import { createContext, useEffect, useReducer, useRef } from "react"

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')
  const timerRef = useRef(null)

  useEffect(() => {
    if (notification) {
      clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        notificationDispatch({ type: 'SET_NOTIFICATION', payload: '' })
      }, 5000)
    }
  }, [notification])

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
