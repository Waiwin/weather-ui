import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";

interface WeatherResponse {
    temperatureC: number;
    windKph: number;
    condition: string;
    recommendation: string;
}

const App: React.FC = () => {
    const [lat, setLat] = useState("-41.3");
    const [lon, setLon] = useState("174.7");
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFetch = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get<WeatherResponse>(
                `https://localhost:7194/weather?lat=${lat}&lon=${lon}`
            );
            setWeather(response.data);
        } catch (err: any) {
            setError("Unable to fetch weather data. API may be unavailable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">🌤️ Wellington Weather Checker</h2>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="p-4 shadow">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Latitude</Form.Label>
                                <Form.Control
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control
                                    value={lon}
                                    onChange={(e) => setLon(e.target.value)}
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                onClick={handleFetch}
                                disabled={loading}
                                className="w-100"
                            >
                                {loading ? <Spinner size="sm" animation="border" /> : "Check Weather"}
                            </Button>
                        </Form>

                        {error && <p className="text-danger mt-3">{error}</p>}

                        {weather && (
                            <div className="mt-4 text-center">
                                <h4>{weather.condition}</h4>
                                <p className="mb-1">🌡️ {weather.temperatureC.toFixed(1)} °C</p>
                                <p className="mb-1">💨 {weather.windKph.toFixed(1)} km/h</p>
                                <p className="fw-bold text-primary">
                                    {weather.recommendation}
                                </p>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default App;
