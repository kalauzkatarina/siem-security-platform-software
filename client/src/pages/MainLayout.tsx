import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Event from './Event';
import Statistics from './Statistics';
import Storage from './Storage';
// npm install react-icons
// Inline styles for now, will be in CSS later

export default function MainLayout() {
     const [activePage, setActivePage] = useState<"Dashboard"| "Events" | "Statistics" | "Storage" >("Dashboard");
    const layoutStyle: React.CSSProperties = {
        display: 'flex',
        position: 'fixed',
        top: 32,
        left: 0,
        width: '100%',
        height: '100%',
        margin: 0
    };

    const mainStyle: React.CSSProperties = {
        flex: 1,
        padding: '16px',
        //backgroundColor: 'white',
        backgroundColor: '#202020',
        height: '100%'
    };

    return (
        <div style={layoutStyle}>

            <Sidebar activePage={setActivePage}/>
            {activePage==="Events" ? <Event/> : 
                activePage==="Statistics" ? <Statistics/>  : 
                    activePage==="Storage" ? <Storage/> :
            <div style={mainStyle}>
                <p>This is main content!</p>
                <p>This is main content!</p>
                <p>This is main content!</p>
                <p>This is main content!</p>
            </div>
            }
        </div>
    );
}
