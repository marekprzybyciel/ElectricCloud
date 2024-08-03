import React from 'react';
import Login from './Login.jsx';
import Register from './Register.jsx';
import { Container, Row, Col } from 'react-bootstrap';

const AuthPage = () => {
    return (
        <Container className="mt-5">
            <Row>
                <Col md={6} className="mb-4 mb-md-0">
                    <Login />
                </Col>
                <Col md={6}>
                    <Register />
                </Col>
            </Row>
        </Container>
    );
};

export default AuthPage;