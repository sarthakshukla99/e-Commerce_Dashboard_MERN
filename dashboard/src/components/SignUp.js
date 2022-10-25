import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'

function SignUp() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if(auth){
            navigate('/')
        }
    })

    const collectData = async () => {
        console.log(name,password,email)
        let result = await fetch('http://localhost:3100/register', {
            method: "POST",
            body: JSON.stringify({name,email,password}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json()
        console.log(result);
        localStorage.setItem('user', JSON.stringify(result.result))
        localStorage.setItem('token', JSON.stringify(result.auth))
        if(result){
            navigate('/')
        }
    }

    return (
        <div className="register">
            <h1>Register</h1>
            <input
                className="inputBox"
                value={name}
                type="text"
                placeholder="enter name"
                onChange={(e) => {
                    setName(e.target.value);
                }}
            />

            <input
                className="inputBox"
                value={email}
                type="email"
                placeholder="enter email"
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            />

            <input
                className="inputBox"
                value={password}
                type="password"
                placeholder="enter password"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />

            <button type="button" className="appButton" onClick={collectData}>
                Sign up
            </button>
        </div>
    );
}

export default SignUp;
