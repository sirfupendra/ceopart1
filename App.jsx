import React from 'react'
import Intro from './components/Intro'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Posts from './components/Posts';
import Aluminais from './components/Aluminais';
import Vision from './components/Vision';


function App() {
  return (
    <div>
    <Router>
    <Routes>
<Route path='/' element={ <Intro/>}/>
<Route path='/Home' element={<Home/>} />
<Route path='/Posts' element={<Posts/>}/>
<Route path='/Aluminais' element={<Aluminais/>}/>
<Route path='/Vision' element={<Vision/>}/>
    </Routes>
    </Router>
     
    
    </div>
  )
}

export default App