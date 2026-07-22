import React from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom'
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const navigate=useNavigate();

}
const AuthContext = () => {
  return (
    <div>AuthContext</div>
  )
}

export default AuthContext
