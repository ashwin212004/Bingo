import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({ name, password });
        const url = `${process.env.REACT_APP_BACKEND_BASEURL}/signup`;
        const data = { name, email, password };

        axios.post(url, data)
            .then((res) => {
                console.log(res.data);
                alert(res.data.message);
                if (res.data.message === 'saved success') {
                    navigate('/login');
                }
            })
            .catch((err) => {
                console.log(err);
                alert("Server error");
            });
    }

    return (
        <div className="signup-container">
            {/* Background Video */}
            <video autoPlay muted loop className="background-video-sign">
                <source src='/silo.mp4' type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Signup Card Content */}
            <div className="signup-card">
                <h2>Join the Game!</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="signup-input"
                        type="text"
                        placeholder="Username"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="signup-input"
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="signup-input"
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="signup-button" type="submit">
                        Register
                    </button>
                </form>
                <p className="login-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
