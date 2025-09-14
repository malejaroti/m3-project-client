// Wrapper component that will only allow pages to display if the user is logged in

import { Navigate } from "react-router"
import { useContext,  type ReactNode } from "react"
import { AuthContext } from "../context/auth.context"

type OnlyPrivateProps = {
  children: ReactNode
}

function OnlyPrivate({ children }: OnlyPrivateProps){

const authContext = useContext(AuthContext)
if (!authContext) {
    throw new Error('This paged must be used within an AuthWrapper')
  }

  const { isLoggedIn } = authContext

  if (isLoggedIn) {
    return children 
  } else {
    return <Navigate to="/login"/>
  }

}
export default OnlyPrivate