import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import playNowImage from './pn.gif'; // Your play button gif
import backgroundVideo from './hm.mp4'; // Replace with your video path

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Background Video */}
      <video autoPlay loop muted className="background-video-home">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* Overlay Content */}
      <div className="overlay-content-home">
        <div className="play-now" onClick={() => navigate('/signup')}>
          <img src={playNowImage} alt="Play Now" className="play-now-image" />
        </div>
      </div>
    </div>
  );
}

export default Home;
