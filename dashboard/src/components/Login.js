import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if(auth){
            navigate('/')
        }
    })

    const handleLogin = async () => {
        console.log(email, password)
        let result = await fetch('http://localhost:3100/login', {
            method: "POST",
            body: JSON.stringify({email , password}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await result.json();
        console.log(data)
        
        // if name is present in the result then there user is present 
        if(data.auth){
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", JSON.stringify(data.auth));
            navigate('/')
        }
        else{
            alert('Please enter correct details');
        }
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <input
                type="text"
                value={email}
                className="inputBox"
                placeholder="enter email"
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            />
            <input
                type="password"
                value={password}
                className="inputBox"
                placeholder="enter password"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />

            <button type="button" className="appButton" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}

export default Login;
