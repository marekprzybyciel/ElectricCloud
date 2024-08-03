import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const ReservationHistory = ({ refreshReservations }) => {
    const [reservations, setReservations] = useState([]);
    const [activeReservations, setActiveReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('reservations')
                    .select('*, charging_stations (station_name, address, voltage_type, price_per_kwh)')
                    .eq('user_id', user.id)
                    .order('reserved_at', { ascending: false });

                if (error) {
                    console.error('Błąd pobierania rezerwacji:', error.message);
                } else {
                    setReservations(data);
                    setActiveReservations(data.filter(reservation => reservation.status === 'active'));
                }
            }
        };

        fetchReservations();
    }, [refreshReservations]);

    const cancelReservation = async (reservationId, stationId) => {
        try {
            const { error } = await supabase
                .rpc('update_reservation_and_spots', {
                    reservation_id: reservationId,
                    station_id: stationId,
                    reserved_spots: 1 // Always 1 spot
                });

            if (error) {
                console.error('Błąd podczas anulowania rezerwacji:', error.message);
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error('Nieoczekiwany błąd podczas anulowania rezerwacji:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Aktywne Rezerwacje</h3>
            <div className="d-none d-md-block">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Stacja</th>
                        <th>Adres</th>
                        <th>Rodz. napi.</th>
                        <th>Cena za kWh</th>
                        <th>Data końca rezerwacji</th>
                        <th>Akcja</th>
                    </tr>
                    </thead>
                    <tbody>
                    {activeReservations.map(reservation => (
                        <tr key={reservation.id}>
                            <td>{reservation.charging_stations.station_name}</td>
                            <td>{reservation.charging_stations.address}</td>
                            <td>{reservation.charging_stations.voltage_type}</td>
                            <td>{reservation.charging_stations.price_per_kwh} PLN</td>
                            <td>{new Date(reservation.end_time).toLocaleString()}</td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => cancelReservation(reservation.id, reservation.station_id)}
                                    disabled={reservation.status === 'inactive'}
                                >
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>


            <div className="d-md-none">
                {activeReservations.map(reservation => (
                    <div className="accordion mb-3" id={`accordionActive${reservation.id}`} key={reservation.id}>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id={`headingActive${reservation.id}`}>
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseActive${reservation.id}`} aria-expanded="false" aria-controls={`collapseActive${reservation.id}`}>
                                    {reservation.charging_stations.station_name}
                                </button>
                            </h2>
                            <div id={`collapseActive${reservation.id}`} className="accordion-collapse collapse" data-bs-parent={`#accordionActive${reservation.id}`}>
                                <div className="accordion-body">
                                    <p><strong>Adres:</strong> {reservation.charging_stations.address}</p>
                                    <p><strong>Rodzaj Napięcia:</strong> {reservation.charging_stations.voltage_type}</p>
                                    <p><strong>Cena za kWh:</strong> {reservation.charging_stations.price_per_kwh} PLN</p>
                                    <p><strong>Data końca rezerwacji:</strong> {new Date(reservation.end_time).toLocaleString()}</p>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => cancelReservation(reservation.id, reservation.station_id)}
                                        disabled={reservation.status === 'inactive'}
                                    >
                                        Usuń
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h3 className="mb-4">Historia Rezerwacji</h3>

            <div className="d-none d-md-block">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Stacja</th>
                        <th>Adres</th>
                        <th>Rodz. napi.</th>
                        <th>Cena za kWh</th>
                        <th>Data końca rezerwacji</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map(reservation => (
                        <tr key={reservation.id}>
                            <td>{reservation.charging_stations.station_name}</td>
                            <td>{reservation.charging_stations.address}</td>
                            <td>{reservation.charging_stations.voltage_type}</td>
                            <td>{reservation.charging_stations.price_per_kwh} PLN</td>
                            <td>{new Date(reservation.end_time).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="d-md-none">
                {reservations.map(reservation => (
                    <div className="accordion mb-3" id={`accordionHistory${reservation.id}`} key={reservation.id}>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id={`headingHistory${reservation.id}`}>
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseHistory${reservation.id}`} aria-expanded="false" aria-controls={`collapseHistory${reservation.id}`}>
                                    {reservation.charging_stations.station_name}
                                </button>
                            </h2>
                            <div id={`collapseHistory${reservation.id}`} className="accordion-collapse collapse" data-bs-parent={`#accordionHistory${reservation.id}`}>
                                <div className="accordion-body">
                                    <p><strong>Adres:</strong> {reservation.charging_stations.address}</p>
                                    <p><strong>Rodzaj Napięcia:</strong> {reservation.charging_stations.voltage_type}</p>
                                    <p><strong>Cena za kWh:</strong> {reservation.charging_stations.price_per_kwh} PLN</p>
                                    <p><strong>Data końca rezerwacji:</strong> {new Date(reservation.end_time).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReservationHistory;