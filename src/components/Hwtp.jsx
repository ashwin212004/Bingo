import React from "react";
import "./Hwtp.css";
function Hwtp() {
    return (
      <div className="hwtp-container">
        <div className="hwtp-content">
          <h1 className="hwtp-title">How to Play</h1>
  
          <section className="hwtp-section">
            <h2>🎮 Play with Computer</h2>
            <ul className="hwtp-list">
              <li>Click Play with Computer on the home page.</li>
              <li>You and the computer get different Bingo cards.</li>
              <li>Take turns selecting numbers on your card.</li>
              <li>Complete five lines (horizontal, vertical, or diagonal).</li>
              <li>Spell BINGO before the computer to win and earn coins!</li>
            </ul>
          </section>
  
          <section className="hwtp-section">
            <h2>👥 Play with Friends</h2>
  
            <h3>Create Game</h3>
            <ul className="hwtp-list">
              <li>Click Play with Friends, then Create Game.</li>
              <li>Share your Game ID or Invite Link with friends.</li>
              <li>Wait for friends to join and click Start to begin.</li>
              <li>Each player gets a unique Bingo card.</li>
              <li>First to complete BINGO wins!</li>
            </ul>
  
            <h3>Join Game</h3>
            <ul className="hwtp-list">
              <li>Click Play with Friends, then Join Game.</li>
              <li>Enter the Game ID shared by your friend.</li>
              <li>Wait in the lobby for the host to start the game.</li>
              <li>Compete with your friends to win!</li>
            </ul>
          </section>
  
          <section className="hwtp-section">
            <h2>🏆 How to Win</h2>
            <ul className="hwtp-list">
              <li>Complete five lines (horizontal, vertical, or diagonal).</li>
              <li>Each completed line lights up a letter in BINGO.</li>
              <li>Finish all five lines to win the game.</li>
              <li>Win coins by beating the computer or friends!</li>
            </ul>
          </section>
  
          <div className="hwtp-footer">
            Enjoy the game and may luck be on your side! 🍀
          </div>
        </div>
      </div>
    );
  }
  
  export default Hwtp;
  