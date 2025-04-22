import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRankingStar } from "react-icons/fa6";
import io from 'socket.io-client';
import background from './dhh.mp4';

const socket = io("http://localhost:3001");

function Dashboard() {
    const [coins, setCoins] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [showRoomPopup, setShowRoomPopup] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [players, setPlayers] = useState([]);
    const [host, setHost] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("userName");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    useEffect(() => {
        if (userId) {
            const url = `http://localhost:3001/get-coins/${userId}`;
            axios.get(url)
                .then((res) => {
                    if (res.data.coin) {
                        setCoins(res.data.coin);
                    }
                })
                .catch(() => {
                    alert("Server Error");
                });
        }
    }, [userId]); 

    useEffect(() => {
        socket.on("updatePlayers", (roomData) => {
            setPlayers(roomData.players);
            setHost(roomData.host);
        });
    }, []);

    const createRoom = () => {
        const newRoomId = Math.random().toString(36).substring(2, 8);
        setRoomId(newRoomId);
        socket.emit("createRoom", { roomId: newRoomId, username });
        setShowPopup(false);
        setShowRoomPopup(true);
    };

    const joinRoom = () => {
        if (roomId) {
            socket.emit("joinRoom", { roomId, username });
            setShowPopup(false);
            setShowRoomPopup(true);
        }
    };

    const startGame = async () => {
        if (roomId) {
            if (coins < 5) {
                alert("Not enough coins to start the game!");
                return;
            }

            try {
                await axios.post("http://localhost:3001/deduct-coins", { userId, amount: 5 });
                setCoins(coins - 5);
                socket.emit("startGame", { roomId });
            } catch (error) {
                alert("Error deducting coins");
            }
        }
    };

    useEffect(() => {
        socket.on("navigateToGame", ({ roomId }) => {
            navigate(`/game/${roomId}`);
        });
    }, [navigate]);

    return (
        <div className="dashboard">
             <video
                autoPlay
                muted
                loop
                className="background-video-dash"
            >
                <source src={background} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="top-bar">
                <div className="left-section">
                <Link to="/hwtp">
                        <button className="hwtp-btn">how to play?</button>
                    </Link>
                    <div className="username">👤 {username?.toUpperCase()}</div>
                    <div className="coins">🪙 Coins: {coins}</div>
                </div>
                <div className="center-text">Play • Enjoy • Fun</div>
                <div className="buttons">
                    <Link to="/history">
                        <button className="history-btn">History</button>
                    </Link>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className="main-content">
                <div className="center-buttons">
                    <Link to="/pwithc">
                        <button className="play-btn play-computer">Play with Computer</button>
                    </Link>
                    <button className="play-btn play-friends" onClick={() => setShowPopup(true)}>Play with Friends</button>
    
                    <Link to="/leaderboard">
                        <button className="play-btn play-leaderboard"><FaRankingStar /> Leaderboard</button>
                    </Link>
                </div>
    
                {showPopup && (
                    <div className="popup">
                        <h2>Play with Friends</h2>
                        <button onClick={createRoom}>Create Room</button>
                        <input type="text" placeholder="Enter Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                        <button onClick={joinRoom}>Join Room</button>
                        <button onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                )}
    
                {showRoomPopup && (
                    <div className="popup">
                        <h2>Room ID: {roomId}</h2>
                        <h3>Players Joined:</h3>
                        <ul>
                            {players.map((player, index) => (
                                <li key={index}>{player.username}</li>
                            ))}
                        </ul>
                        {host === username && players.length > 1 && (
                            <>
                                <p>Starting the game will cost <b>5 coins</b>.</p>
                                <button onClick={startGame}>Start Game</button>
                            </>
                        )}
                        <button onClick={() => setShowRoomPopup(false)}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
    
}

export default Dashboard;
