import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const ChargingStationList = () => {
    const [chargingStations, setChargingStations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchChargingStations = async () => {
            const { data, error } = await supabase
                .from('charging_stations')
                .select('id, station_name, address, latitude, longitude');

            if (error) {
                console.error('Błąd podczas pobierania stacji:', error.message);
            } else {
                setChargingStations(data);
            }
        };

        fetchChargingStations();
    }, []);

    const filteredStations = chargingStations.filter(station =>
        station.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNavigate = (latitude, longitude) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude: currentLatitude, longitude: currentLongitude } = position.coords;
                const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${currentLatitude},${currentLongitude}&destination=${latitude},${longitude}&travelmode=driving`;
                window.open(googleMapsUrl, '_blank');
            });
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Lista Punktów Ładowania</h3>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Wyszukaj po adresie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="d-none d-md-block">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Stacja</th>
                        <th>Adres</th>
                        <th>Akcja</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredStations.map(station => (
                        <tr key={station.id}>
                            <td>{station.station_name}</td>
                            <td>{station.address}</td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleNavigate(station.latitude, station.longitude)}
                                >
                                    Nawiguj
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="d-md-none">
                {filteredStations.map(station => (
                    <div className="accordion mb-3" id={`accordionStation${station.id}`} key={station.id}>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id={`headingStation${station.id}`}>
                                <button
                                    className="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapseStation${station.id}`}
                                    aria-expanded="false"
                                    aria-controls={`collapseStation${station.id}`}>
                                    {station.station_name}
                                </button>
                            </h2>
                            <div
                                id={`collapseStation${station.id}`}
                                className="accordion-collapse collapse"
                                data-bs-parent={`#accordionStation${station.id}`}
                            >
                                <div className="accordion-body">
                                    <p><strong>Adres:</strong> {station.address}</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleNavigate(station.latitude, station.longitude)}
                                    >
                                        Nawiguj
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChargingStationList;