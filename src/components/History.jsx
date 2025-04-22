import React, { useEffect, useState } from "react";
import axios from "axios";
import "./History.css"; // Import the styles
import bgVideo from "./bgfall.mp4"; // Assuming the video is in the same folder

function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const playerId = localStorage.getItem("userId");
                const username = localStorage.getItem("userName");
                if (!playerId || !username) {
                    console.error("Missing playerId or username in localStorage");
                    return;
                }
                const res = await axios.get(`http://localhost:3001/history/${playerId}/${username}`);
                setHistory(res.data);
            } catch (error) {
                console.error("Error fetching history:", error.response?.data || error.message);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="history-container">
            <video className="background-video-hist" autoPlay loop muted>
                <source src={bgVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="overlay-content-hist">
                <h1>Game History</h1>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Opponent</th>
                            <th>🏆 Result</th>
                            <th>🎮 Mode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((game) => (
                            <tr key={game._id}>
                                <td>{new Date(game.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                                <td>{game.opponent}</td>
                                <td>{game.gameResult}</td>
                                <td>{game.gameType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default History;
