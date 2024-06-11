import { createContext, useReducer } from "react";

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    case 'CLEAR_USER':
      return null
  }
}

export const UserContextProvider = (props) => {
  const userAndDispatch = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={userAndDispatch}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext