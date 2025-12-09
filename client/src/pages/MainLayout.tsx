import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Dashboard from '../components/views/Dashboard';
import Events from '../components/views/Events';
import Statistics from '../components/views/Statistics';
import Storage from '../components/views/Storage';
import Alert from '../components/views/Alerts';

// npm install react-icons
// Inline styles for now, will be in CSS later

export default function MainLayout() {
    const [sideMenuPage, setSideMenuPage] = useState<number>(0);

    const layoutStyle: React.CSSProperties = {
        display: 'flex',
        position: 'fixed',
        top: 32,
        left: 0,
        width: '100%',
        height: '100%',
        margin: 0
    };

    const contentStyle: React.CSSProperties = {
        flex: 1,
        padding: '16px',
        backgroundColor: '#202020',
        height: '100%',
        overflow: 'auto'
    };

    return (
        <div style={layoutStyle}>
            <Sidebar setSideMenuPage={setSideMenuPage} />

            <div style={contentStyle}>
                {sideMenuPage === 0 && <Dashboard />}
                {sideMenuPage === 1 && <Events />}
                {sideMenuPage === 2 && <Statistics />}
                {sideMenuPage === 3 && <Storage />}
                {sideMenuPage === 4  && <Alert/>}
            </div>
        </div>
    );
}
