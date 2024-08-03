import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button, Form } from 'react-bootstrap';
import { supabase } from '../supabase';
import './MapComponent.scss';

const MapComponent = ({ onChargingStationsFetched }) => {
    const [chargingStations, setChargingStations] = useState([]);
    const [filteredStations, setFilteredStations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('charging_stations')
                .select('id, station_name, latitude, longitude, available_spots, total_spots');

            if (error) {
                console.error('Błąd podczas pobierania danych:', error.message);
            } else {
                setChargingStations(data);
                setFilteredStations(data);
                if (onChargingStationsFetched) {
                    onChargingStationsFetched(data);
                }
            }
        };

        fetchData();
    }, [onChargingStationsFetched]);

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredStations(chargingStations);
        } else {
            const query = searchQuery.toLowerCase();
            const results = chargingStations.filter(station =>
                station.station_name.toLowerCase().includes(query)
            );
            setFilteredStations(results);
        }
    }, [searchQuery, chargingStations]);

    const handleNavigate = (latitude, longitude) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude: currentLatitude, longitude: currentLongitude } = position.coords;
                const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${currentLatitude},${currentLongitude}&destination=${latitude},${longitude}&travelmode=driving`;
                window.open(googleMapsUrl, '_blank');
            }, error => {
                console.error('Błąd podczas pobierania aktualnej pozycji:', error.message);
                alert('Nie można pobrać Twojej lokalizacji. Sprawdź ustawienia lokalizacji i spróbuj ponownie.');
            });
        } else {
            alert('Twoja przeglądarka nie obsługuje geolokalizacji.');
        }
    };

    return (
        <div className="container">
            <div className="map-search-container">
                <Form>
                    <Form.Group controlId="searchQuery">
                        <Form.Label>Wyszukaj lokalizację</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Wprowadź nazwę stacji"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </div>
            <div className="map-container">
                <MapContainer center={[50.0619, 19.9370]} zoom={8} style={{ height: '60vh', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {filteredStations.length > 0 ? (
                        filteredStations.map((station) => (
                            <Marker key={station.id} position={[station.latitude, station.longitude]}>
                                <Popup>
                                    <div className="popup-content">
                                        <h5>{station.station_name}</h5>
                                        <p>Wolne miejsca: {station.available_spots}/{station.total_spots}</p>
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => handleNavigate(station.latitude, station.longitude)}
                                        >
                                            Nawiguj
                                        </Button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))
                    ) : (
                        <div>Brak wyników wyszukiwania</div>
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapComponent;