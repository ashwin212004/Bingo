import React, { useState, useEffect } from "react";
import axios from "axios";
import './PWC.css';


function PWC() {
    const [bingoNumbers, setBingoNumbers] = useState([]);
    const [markedNumbers, setMarkedNumbers] = useState(new Set());
    const [gameId, setGameId] = useState(null);
    const [status, setStatus] = useState("in-progress");
    const [currentTurn, setCurrentTurn] = useState("player");
    const [gameResult, setGameResult] = useState(null);
    const [coins, setCoins] = useState(0);
    const [bingoCount, setBingoCount] = useState(0); // New state for BINGO progress

    const fetchUserCoins = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/get-coins/${userId}`);
            if (res.data.coin) {
                setCoins(res.data.coin);
            } else if (res.data.coins) {
                setCoins(res.data.coins);
            }
        } catch (error) {
            console.error("Error fetching coins:", error);
        }
    };

    useEffect(() => {
        const startGame = async () => {
            try {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/games`, {
                    playerId: localStorage.getItem('userId')
                });
                setGameId(res.data._id);
                setBingoNumbers(res.data.board);
            } catch (error) {
                console.error("Error starting game:", error);
            }
        };

        startGame();
        fetchUserCoins();
    }, []);

    useEffect(() => {
        if (status === "finished" && gameResult === "you won!") {
            animateFlyingCoins();
            fetchUserCoins();
        }
    }, [status, gameResult]);

    const animateFlyingCoins = () => {
        const flyingCoins = document.querySelectorAll(".flying-coin");
        const coinTarget = document.getElementById("coin-target");

        if (!coinTarget || flyingCoins.length === 0) return;

        const targetRect = coinTarget.getBoundingClientRect();

        flyingCoins.forEach((coin, idx) => {
            const delay = idx * 100;

            setTimeout(() => {
                const coinRect = coin.getBoundingClientRect();

                const xDest = targetRect.left - coinRect.left + targetRect.width / 2;
                const yDest = targetRect.top - coinRect.top + targetRect.height / 2;

                coin.style.setProperty("--x-dest", `${xDest}px`);
                coin.style.setProperty("--y-dest", `${yDest}px`);

                coin.classList.add("animate");

                setTimeout(() => {
                    coin.classList.remove("animate");
                }, 1000);
            }, delay);
        });
    };

    const handlePlayerMove = async (number) => {
        if (markedNumbers.has(number) || status !== "in-progress" || currentTurn !== "player") return;

        setCurrentTurn("computer");

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/games/${gameId}/call-number`, {
                number,
                turn: "player"
            });

            setBingoNumbers(res.data.board);
            setMarkedNumbers(new Set(res.data.board.filter(cell => cell.markedBy !== null)));
            setStatus(res.data.status);
            setGameResult(res.data.gameResult);
            setBingoCount(res.data.bingoCount); // Update BINGO count here

            if (res.data.status === "finished") {
                fetchUserCoins();
                return;
            }

            setTimeout(() => {
                handleComputerMove();
            }, 1500);

        } catch (error) {
            console.error("Error with player move:", error);
        }
    };

    const handleComputerMove = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/games/${gameId}/computer-move`);

            setBingoNumbers(res.data.board);
            setMarkedNumbers(new Set(res.data.board.filter(cell => cell.markedBy !== null)));
            setStatus(res.data.status);
            setGameResult(res.data.gameResult);
            setBingoCount(res.data.bingoCount);

            if (res.data.status === "finished") {
                return;
            }

            setCurrentTurn("player");

        } catch (error) {
            console.error("Error with computer move:", error);
        }
    };

    const renderBingoLetters = () => {
        const letters = ["B", "I", "N", "G", "O"];
        return (
            <div className="bingo-letters">
                {letters.map((letter, idx) => (
                    <span
                        key={idx}
                        className={`bingo-letter ${idx < bingoCount ? "crossed" : ""}`}
                    >
                        {letter}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="pwc-container">
            <video autoPlay muted loop className="background-video-pwc">
                <source src='/gm.mp4' type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="overlay-content-pwc">
                <div className="coin-display" id="coin-target">
                    🪙 Coins: {coins}
                </div>

                <h1 className="title">Play with Computer</h1>

                

                <div className="turn-indicator">
                    {status === "finished" ? null : (
                        <h2 className={currentTurn === "player" ? "player-turn" : "computer-turn"}>
                            {currentTurn === "player" ? "Your Turn!" : "Computer's Turn..."}
                        </h2>
                    )}
                </div>
                {renderBingoLetters()}

                <div className="bingo-card">
                    {bingoNumbers.map((cell, index) => (
                        <button
                            key={index}
                            className={`bingo-cell 
                                ${cell.markedBy === "player" ? "player-selected" : ""} 
                                ${cell.markedBy === "computer" ? "computer-selected" : ""}`}
                            onClick={() => handlePlayerMove(cell.number)}
                            disabled={cell.markedBy !== null || status !== "in-progress" || currentTurn !== "player"}
                        >
                            {cell.markedBy ? "X" : cell.number}
                        </button>
                    ))}
                </div>

                {status === "finished" && gameResult === "you won!" && (
                    <div className="result-with-coins">
                        <h2 className="result">
                            You Won! +10 🪙
                        </h2>
                        <div className="flying-coins-container">
                            {[...Array(10)].map((_, idx) => (
                                <div key={idx} className="flying-coin" />
                            ))}
                        </div>

                        {/* ADD NEW BIG WINNER OVERLAY */}
                        <div className="winner-overlay">
                            <h1 className="winner-text animate-winner-text">🎉 YOU WON! 🎉</h1>
                            <img
                                src='/ce.gif'
                                alt="Celebration"
                                className="winner-gif"
                            />
                        </div>
                    </div>
                )}


{status === "finished" && gameResult !== "you won!" && (
    <div className="result-with-coins">
        <h2 className="result">Computer Won! You Lose</h2>

        <div className="loser-overlay">
            <h1 className="loser-text animate-loser-text">😞 YOU LOSE! 😞</h1>
            <img
                src='/cry1.gif' // You can use another GIF if you have a sad one
                alt="Game Over"
                className="loser-gif"
            />
        </div>
    </div>
)}
            </div>
        </div>
    );

}

export default PWC;
