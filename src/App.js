import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login'; // Make sure the path is correct
import Home from './components/Home';
import Profile from './components/Profile';
import CreateWorkshop from './components/CreateWorkshop';
import Workshop from './components/Workshop';
import EditWorkshop from './components/EditWorkshop';
import Calendar from 'react-calendar';
import Admin from './components/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={ <Home />} />
        <Route path="/profile" element= { <Profile />} />
        <Route path="/create-workshop" element= { <CreateWorkshop />} />
        <Route path="/workshop/:id" element= { <Workshop />} />
        <Route path="/edit-workshop/:id" element= { <EditWorkshop />} />
        <Route path="/Admin" element= { <Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
