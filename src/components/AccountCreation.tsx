import { useState } from "react"
import "../App.css"

export const AccountCreation=()=>{
    const [successMsg, setSuccessMsg]= useState('')
    const submitHandler=(e:any)=>{
        e.preventDefault()
        setSuccessMsg('User Successfully created!')
    }
    return (
        <div className="container my-4">
        <form className="login" onSubmit={(e)=>submitHandler(e)}>
  <h2>Welcome, User!</h2>
  <p>Please log in</p>
  <input type="text" placeholder="User Name" required/>
  <input type="password" placeholder="Password" required />
  <input type="submit" value="Log In" />
  <p className="success">{successMsg}</p>
  <div className="links">
    <a href="#">Forgot password</a>
    <a href="#">Register</a>
  </div>
</form></div>
    )
}