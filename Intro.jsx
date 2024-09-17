import React, { useState, useEffect } from 'react';
import videosrc from '../assets/aman.mp4';
import './Intro.css'
import { useNavigate } from 'react-router-dom';


function Intro() {
    const [showText, setShowText] = useState(false);
    const navigate=useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {

            setShowText(true); // Update state to show text after 22.5 seconds
            navigate('/Home');
        }, 22500);

        // Clean up the timer if the component is unmounted before the timeout completes
        return () => clearTimeout(timer);
    }, []);

    return (
        <div id="container">
            <div id="videoid">
                <video autoPlay muted src={videosrc}></video>
            </div>
           
            {showText && <h1>This is text</h1>} {/* Conditionally render text */}
        </div>
    );
}

export default Intro;
