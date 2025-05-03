import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./PWF.css";
const socket = io(`${process.env.REACT_APP_BACKEND_BASEURL}`);

const emojiGifMap = {
    "😀":'/laugh.gif',
    "🥳": '/celb.gif',
    "🤔": '/think.gif',
    "😢": '/cry1.gif',
    "👏": '/clap.gif'
};

const PWF = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState([]);
    const [winner, setWinner] = useState(null);
    const [players, setPlayers] = useState([]);
    const [turn, setTurn] = useState(null);
    const [emojiMessages, setEmojiMessages] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [myMarkedCells, setMyMarkedCells] = useState(new Set());
    const username = localStorage.getItem("userName");

    useEffect(() => {
        socket.on("emoji", ({ username, emoji }) => {
            if (localStorage.getItem("userName") === username) return; // Don't display to the sender themselves

            setEmojiMessages(prev => [...prev, { username, emoji }]);

            setTimeout(() => {
                setEmojiMessages(prev => prev.slice(1));
            }, 3000);
        });

        return () => {
            socket.off("emoji");
        };
    }, []);
    
    useEffect(() => {
        socket.on("chatMessage", ({ username: sender, message }) => {
            setChatMessages(prev => [...prev, { sender, message }]);
        });

        return () => {
            socket.off("chatMessage");
        };
    }, []);
    
    const sendChatMessage = () => {
        if (!chatInput.trim()) return;
        socket.emit("sendChatMessage", { roomId, username, message: chatInput });
        setChatInput(""); // Just clear the input
    };
    
    useEffect(() => {
        socket.emit("joinRoom", { roomId, username });

        socket.on("updatePlayers", (roomData) => {
            const uniquePlayers = [...new Map(roomData.players.map(player => [player.username, player])).values()];
            setPlayers(uniquePlayers);
            setTurn(roomData.turn);

            const playerData = uniquePlayers.find(p => p.username === username);
            if (playerData) {
                setBoard(playerData.board);
            }
        });

        socket.on("gameUpdate", ({ updatedBoards, nextTurn }) => {
            setTurn(nextTurn);
            const playerData = updatedBoards.find(p => p.username === username);
            if (playerData) {
                setBoard(playerData.board);
            }
        });

        socket.on("winner", (winnerName) => {
            setWinner(winnerName);
        });

        return () => {
            socket.off("updatePlayers");
            socket.off("gameUpdate");
            socket.off("winner");
        };
    }, [roomId, username]);

    const markNumber = (index) => {
        if (turn !== username) {
            alert("It's not your turn!");
            return;
        }
        if (board[index] === "X") {
            alert("Number already marked!");
            return;
        }
        // Add this index to myMarkedCells to track cells marked by the current user
        setMyMarkedCells(prev => new Set([...prev, index]));
        socket.emit("markNumber", { roomId, index, username });
    };

    useEffect(() => {
        socket.on("errorMessage", (message) => {
            alert(message);
        });

        return () => {
            socket.off("errorMessage");
        };
    }, []);

    const exitGame = () => {
        navigate("/dashboard");
    };

    return (
        <>
          <video autoPlay muted loop className="background-video">
            <source src='/bgfall.mp4' type="video/mp4" />
            Your browser does not support the video tag.
          </video>
      
          <div className="overlay">
            <div className="game-container">
              <h1>Play with Friends</h1>
              {winner && <h2>🎉 Winner: {winner} 🎉</h2>}

              {/* Player Names */}
              <div className="player-list">
                {players.map((player, index) => (
                  <p key={index} className={turn === player.username ? "highlight" : ""}>
                    {player.username}
                  </p>
                ))}
              </div>

              {/* Bingo board and chat side by side */}
              <div className="game-content">
                {/* Bingo board */}
                <div className="bingo-container">
                  <div className="bingo-board">
                    {board.length > 0 ? (
                      board.map((num, index) => (
                        <div
                          key={index}
                          className={`cell ${
                            num === "X" 
                              ? (myMarkedCells.has(index) ? "marked-by-me" : "marked-by-others")
                              : ""
                          }`}
                          onClick={() => markNumber(index)}
                        >
                          {num}
                        </div>
                      ))
                    ) : (
                      <p>Loading Bingo Board...</p>
                    )}
                  </div>
                  <button className="exit-button" onClick={exitGame}>Exit to Dashboard</button>
                </div>

                {/* Chat box */}
                <div className="chat-container">
                  <h3>Chat</h3>
                  <div className="chat-messages">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className="chat-message">
                        <strong>{msg.sender}:</strong> {msg.message}
                      </div>
                    ))}
                  </div>
                  <div className="chat-input-container">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                      className="chat-input"
                    />
                    <button onClick={sendChatMessage} className="chat-send-button">Send</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Emoji sidebar fixed on the far right */}
            <div className="emoji-sidebar">
              <div className="emoji-display">
                {emojiMessages.map((msg, idx) => (
                  <div key={idx} className="emoji-bubble">
                    <p>{msg.username}</p>
                    <img
                      src={emojiGifMap[msg.emoji]}
                      alt={msg.emoji}
                      className="emoji-gif"
                    />
                  </div>
                ))}
              </div>
              <div className="emoji-container">
                {Object.keys(emojiGifMap).map((emoji, index) => (
                  <button
                    key={index}
                    className="emoji-button"
                    onClick={() => socket.emit("sendEmoji", { roomId, username, emoji })}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
    );
};

export default PWF;