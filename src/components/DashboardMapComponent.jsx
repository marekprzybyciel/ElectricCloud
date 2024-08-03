import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../supabase';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import ChargingStationList from './ChargingStationList'; // Import nowego komponentu

const DashboardMapComponent = ({ onReserve }) => {
    const [chargingStations, setChargingStations] = useState([]);
    const [filteredStations, setFilteredStations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStationId, setSelectedStationId] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

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
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const localTime = new Date();
        setStartTime(formatDateForInput(localTime));
    }, []);

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

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

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

    const handleReserveClick = async (stationId) => {
        const currentTime = new Date().toISOString();
        if (endTime && new Date(endTime) > new Date(currentTime)) {
            try {
                await onReserve(stationId, startTime, endTime);
                window.location.reload();
            } catch (error) {
                console.error('Błąd podczas dokonywania rezerwacji:', error.message);
                alert('Błąd podczas dokonywania rezerwacji: ' + error.message);
            }
        } else {
            alert('Proszę wybrać prawidłowy czas zakończenia rezerwacji (musi przypadać po aktualnej godzinie).');
        }
    };

    const minEndTime = formatDateForInput(new Date());

    return (
        <Container fluid className="map-container">
            <Row className="mb-3">
                <Col xs={12}>
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
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <MapContainer center={[50.0619, 19.9370]} zoom={8} style={{ height: '60vh', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {filteredStations.map((station) => (
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
                                        <Form.Group controlId={`formStartTime-${station.id}`} className="mt-2">
                                            <Form.Label>Czas rozpoczęcia:</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                readOnly
                                            />
                                        </Form.Group>
                                        <Form.Group controlId={`formEndTime-${station.id}`} className="mt-2">
                                            <Form.Label>Czas zakończenia:</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                min={minEndTime}
                                                required
                                            />
                                        </Form.Group>
                                        <Button
                                            variant="primary"
                                            className="mt-2"
                                            onClick={() => handleReserveClick(station.id)}
                                        >
                                            Zarezerwuj
                                        </Button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <ChargingStationList
                        stations={filteredStations}
                        onNavigate={handleNavigate}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardMapComponent;