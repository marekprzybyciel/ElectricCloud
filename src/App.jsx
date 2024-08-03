import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import MapComponent from './components/MapComponent.jsx';
import AuthPage from './components/AuthPage.jsx';
import ReservationHistory from './components/ReservationHistory.jsx';
import ChargingStationList from './components/ChargingStationList.jsx';
import NavBar from './components/NavBar.jsx';
import { supabase } from './supabase';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const clearUserState = () => {
        setUser(null);
    };

    return (
        <Router>
            <div>
                <NavBar user={user} handleLogout={clearUserState} />

                <Routes>
                    <Route path="/" element={
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12 col-md-9 mx-auto">

                                    <div className="map-container mb-4">
                                        <MapComponent />
                                    </div>

                                    <div className="search-container mb-4">
                                        <ChargingStationList />
                                    </div>

                                    {user && <ReservationHistory />}
                                </div>
                            </div>
                        </div>
                    } />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;