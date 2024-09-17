import React from 'react'
import imgsrc from '../assets/profileimg.png'
import { Link, useNavigate } from 'react-router-dom'
import './Home.css';
function Home() {
  const navigate=useNavigate();
  const handleclick=()=>{
    navigate('/Posts');
  }
  return (
    
    <div>
        <div id="nav">
            <button onClick={handleclick}> posts </button>
            <button> <Link to="/Aluminais">connect-Aluminais </Link> </button>
            <button> <Link to="/Vision">Vision</Link> </button>
        </div>
        <img src={imgsrc} alt="" />
    </div>
  )
}

export default Home