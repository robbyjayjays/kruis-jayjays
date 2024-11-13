import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login'; // Make sure the path is correct
import Home from './components/Home';
import Profile from './components/Profile';
import CreateWorkshop from './components/CreateWorkshop';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={ <Home />} />
        <Route path="/profile" element= { <Profile />} />
        <Route path="/create-workshop" element= { <CreateWorkshop />} />
      </Routes>
    </Router>
  );
}

export default App;
