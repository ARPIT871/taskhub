
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Task/Navigation/Navbar';
import Register from './components/Auth/Register';
import TaskList from './components/Task/TaskList'
import './index.css'
import Login from './components/Auth/Login';
import TaskForm from './components/Task/TaskForm';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar/>
       <Routes>
        <Route path='/' element={<TaskList/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/taskform' element={<TaskForm/>}/>
        <Route path='/tasklist' element={<TaskList/>}/>
        <Route path='/taskform/:taskId' element={<TaskForm/>}/>


       </Routes>
      
    </BrowserRouter>
  );
};

export default App;
