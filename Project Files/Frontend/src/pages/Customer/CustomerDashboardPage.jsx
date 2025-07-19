import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { getDoctorsStart, getDoctorsSuccess, getDoctorsFailure } from '../../redux/slices/doctorSlice';
import { bookAppointmentSuccess } from '../../redux/slices/appointmentSlice';
import api from '../../services/api';
import './Dashboard.css'; // Import a CSS file for background images

const CustomerDashboardPage = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector((state) => state.doctors);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [documents, setDocuments] = useState([]);

  // Fetch all approved doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      dispatch(getDoctorsStart());
      try {
        const { data } = await api.get('/doctors');
        dispatch(getDoctorsSuccess(data));
      } catch (err) {
        dispatch(getDoctorsFailure(err.response?.data?.message || 'Failed to fetch doctors'));
      }
    };
    fetchDoctors();
  }, [dispatch]);

  const handleBookNowClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setAppointmentDate('');
    setDocuments([]);
  };

  const handleFileChange = (e) => {
    // In a real app, you would upload files to a server and store URLs
    // For this example, we'll just store file names
    const files = Array.from(e.target.files).map(file => file.name);
    setDocuments(files);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentDate) return;

    try {
      const { data } = await api.post('/appointments/book', {
        doctorId: selectedDoctor.userId._id || selectedDoctor._id,
        appointmentDate,
        documents,
      });
      dispatch(bookAppointmentSuccess(data.appointment));
      // Updated alert message to reflect no explicit payment step
      alert('Appointment booked successfully!');
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book appointment.');
    }
  };

  if (loading) return <div>Loading doctors...</div>;
  if (error) return <div>Error: {error}</div>;

  const bgStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba99934?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
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
    margin: '1rem',
    transition: 'transform 0.2s ease-in-out',
  };

  return (
    <div className="dashboard-bg customer-bg" style={bgStyle}>
      <h1 className="text-center mb-5 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        Find and Book an Appointment
      </h1>
      <Row xs={1} md={2} lg={3} className="g-4 px-5">
        {doctors.map((doctor) => (
          <Col key={doctor._id}>
            <Card style={cardStyle} className="hover-lift">
              <Card.Body>
                <Card.Title>{doctor.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{doctor.profile.specialization}</Card.Subtitle>
                <Card.Text>
                  <strong>Experience:</strong> {doctor.profile.experience} years
                  <br />
                  <strong>Clinic:</strong> {doctor.profile.clinic}
                  <br />
                  <strong>Location:</strong> {doctor.profile.location}
                  <br />
                  <strong>Phone:</strong> {doctor.profile.phoneNumber}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleBookNowClick(doctor)}
                  className="w-100 mt-2 hover-bg-dark"
                >
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Booking Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book with Dr. {selectedDoctor?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleBookAppointment}>
            <Form.Group className="mb-3">
              <Form.Label>Appointment Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Documents</Form.Label>
              <Form.Control type="file" multiple onChange={handleFileChange} />
              <Form.Text className="text-muted">
                (e.g., prescriptions, reports, etc.)
              </Form.Text>
            </Form.Group>
            <Button
              variant="success"
              type="submit"
              className="w-100 hover-bg-dark"
            >
              Confirm Booking {/* Changed button text */}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CustomerDashboardPage;
