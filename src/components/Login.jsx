import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({ name, password });

        const url = `${process.env.REACT_APP_BACKEND_BASEURL}/login`;
        const data = { name, password };

        axios.post(url, data)
            .then((res) => {
                console.log(res.data);
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userId', res.data.userId);
                    localStorage.setItem('userName', res.data.username);
                    navigate('/dashboard');
                } else {
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Server error');
            });
    };

    return (
        <div className="login-container">
            {/* Background Video */}
            <video autoPlay muted loop className="background-video-login">
                <source src='/silo.mp4' type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Login Card Content */}
            <div className="login-card">
                <h2>Let's Play!!</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="login-input"
                        type="text"
                        placeholder="Username"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="login-button" type="submit">
                        Login
                    </button>
                </form>
                <p className="signup-link">
                    Don't have an account? <Link to="/signup">Sign up here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
