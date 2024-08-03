import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DashboardMapComponent from '../components/DashboardMapComponent';
import ReservationHistory from '../components/ReservationHistory';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            }
        };

        fetchUser();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleReserve = async (stationId, startTime, endTime) => {
        if (!user) {
            alert('Musisz być zalogowany.');
            return;
        }

        const { data: station, error: stationError } = await supabase
            .from('charging_stations')
            .select('available_spots')
            .eq('id', stationId)
            .single();

        if (stationError) {
            console.error('Błąd podczas pobierania danych stacji:', stationError.message);
            alert('Błąd podczas pobierania danych stacji.');
            return;
        }

        if (station.available_spots < 1) {
            alert('Brak wolnych miejsc dla tej lokalizacji.');
            return;
        }

        const { data: reservation, error: reservationError } = await supabase
            .from('reservations')
            .insert([{
                user_id: user.id,
                user_email: user.email,
                station_id: stationId,
                reserved_at: new Date().toISOString(),
                reserved_spots: 1,
                start_time: startTime,
                end_time: endTime
            }]);

        if (reservationError) {
            console.error('Błąd podczas tworzenia rezerwacji:', reservationError.message);
            alert('Błąd podczas tworzenia rezerwacji: ' + reservationError.message);
            return;
        }

        const newAvailableSpots = station.available_spots - 1;

        if (newAvailableSpots < 0) {
            alert('Brak wolnych miejsc dla tej stacji.');
            return;
        }

        const { error: updateError } = await supabase
            .from('charging_stations')
            .update({ available_spots: newAvailableSpots })
            .eq('id', stationId);

        if (updateError) {
            console.error('Błąd podczas aktualizowania dostępnych miejsc:', updateError.message);
            alert('Błąd podczas aktualizowania dostępnych miejsc: ' + updateError.message);
            return;
        }

        setRefreshKey(prevKey => prevKey + 1);
        alert('Reservation successful!');
    };

    return (
        <Container className="mt-5">
            <DashboardMapComponent onReserve={handleReserve} />
            <ReservationHistory key={refreshKey} />

        </Container>
    );
};

export default Dashboard;