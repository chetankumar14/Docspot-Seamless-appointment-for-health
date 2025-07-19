import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { getDoctorsStart, getPendingDoctorsSuccess, approveDoctorSuccess } from '../../redux/slices/doctorSlice';
import api from '../../services/api';
import './Dashboard.css'; // Import a CSS file for background images

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { pendingDoctors, loading, error } = useSelector((state) => state.doctors);

  // Fetch pending doctor applications on component mount
  useEffect(() => {
    const fetchPendingDoctors = async () => {
      dispatch(getDoctorsStart());
      try {
        const { data } = await api.get('/doctors/pending');
        dispatch(getPendingDoctorsSuccess(data));
      } catch (err) {
        console.error('Failed to fetch pending doctors:', err);
      }
    };
    fetchPendingDoctors();
  }, [dispatch]);

  const handleApprove = async (doctorId) => {
    try {
      await api.put(`/doctors/approve/${doctorId}`);
      dispatch(approveDoctorSuccess({ doctorId }));
      alert('Doctor approved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve doctor.');
    }
  };

  const bgStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1587593810166-58728a391583?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    padding: '2rem 0',
  };
  
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    transition: 'transform 0.2s ease-in-out',
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-bg admin-bg" style={bgStyle}>
      <h1 className="text-center mb-5 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        Admin Dashboard
      </h1>
      <Row className="px-5">
        <Col md={8} lg={6} className="mx-auto">
          <Card style={cardStyle} className="hover-lift">
            <Card.Header className="bg-dark text-white text-center">
              <h4>Pending Doctor Applications</h4>
            </Card.Header>
            <ListGroup variant="flush">
              {pendingDoctors.length > 0 ? (
                pendingDoctors.map((doctor) => (
                  <ListGroup.Item key={doctor._id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{doctor.name}</strong>
                      <br />
                      <small>{doctor.email}</small>
                    </div>
                    <div>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(doctor._id)}
                        className="me-2 hover-bg-success"
                      >
                        Approve
                      </Button>
                      <Button variant="danger" size="sm" className="hover-bg-danger">
                        Reject
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center">No pending applications.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardPage;