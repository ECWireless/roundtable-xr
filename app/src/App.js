import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Congrats! You have created an XR room version of #$channel
        </p>
        <p>Guild name: $guild</p>
        <p>Number of members in this channel: $memberCount</p>
      </header>
    </div>
  );
}

export default App;
