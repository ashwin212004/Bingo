import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./Leaderboard.css"; // Import styles
import { FaRankingStar } from "react-icons/fa6";

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/get-leaderboard`)
            .then((res) => {
                if (res.data.leaderboard) {
                    setLeaderboard(res.data.leaderboard);
                }
            })
            .catch((err) => {
                console.error('Error fetching leaderboard', err);
            });
    }, []);

    return (
        <div className="leaderboard-container">
            <video autoPlay loop muted className="background-video-lead">
                <source src="/bgfall.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="overlay-leaderboard">
                <h1><FaRankingStar /> Leaderboard</h1>
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>🪙 Coins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.coins}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Leaderboard;
