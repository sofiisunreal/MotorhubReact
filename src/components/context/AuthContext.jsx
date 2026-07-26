import { jwtDecode } from "jwt-decode";
import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// create context - special hook that allows variables, functions to be available globally
export const AuthContext = createContext()
export const AuthProvider = ({ children }) => {
  // allows programmatic navigation  from one component to another
  const navigate = useNavigate()

  // inital state auth by loading the token
  // load the jwt token  from the local storage so login persist
  const [token, setToken] = useState(
    () => localStorage.getItem("access_token") || ""
  )

  // load the user data from the localStorage if available
  const [user, setUser] = useState(
    () => {
      try {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
      } catch (error) {
        return error
      }
    }
  )
  // logout function- clears all the data from the localStorage and take you back to the login component
  // dependency are passed to the callback so as to be accessible
  const Logout = useCallback(() => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    localStorage.removeItem("refresh")

    setToken("")
    setUser("")
    navigate("/login")
  }, [navigate]
  )
  // checking if token is expired
  // run anytime the token changes
  // the jwt decode will check the expiry
  useEffect(() => {
    if (!token) return
    try {
      // decode the acess token which was stored in the local storage which came from backend
      const decode = jwtDecode(token)
      const isExpired = decode.exp * 1000 < Date.now()

      if (isExpired) {
        Logout()
      }
    }
    catch (error) {
      Logout()
    }
  }, [token, Logout])
  // provider value global state
  // everything inside the "value" becomes accessible in the app
  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        Logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}
