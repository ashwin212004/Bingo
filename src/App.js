import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Leaderboard from './components/Leaderboard';
import PWC from './components/PWC';
import PWF from './components/PWF';
import Hwtp from './components/Hwtp';
function App() {
  return (
    <div>   
    <Home/>
    <Signup/>
    <Login/>
    <Dashboard/>
    <History/>
    <Leaderboard/>
    <PWC/>
    <PWF/>
    <Hwtp/>
    </div>
  );
}



export default App;
