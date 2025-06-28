import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import { getAppointmentsStart, getAppointmentsSuccess, updateAppointmentStatusSuccess } from '../../redux/slices/appointmentSlice';
import api from '../../services/api';
import './Dashboard.css'; // Import a CSS file for background images

const DoctorDashboardPage = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state) => state.appointments);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [profileData, setProfileData] = useState({
    specialization: '', 
    experience: 0, 
    location: '', 
    clinic: '', 
    phoneNumber: '', 
    bio: ''
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileFetchError, setProfileFetchError] = useState(null); // New state for profile fetch error

  // Fetch appointments for the doctor
  useEffect(() => {
    const fetchAppointments = async () => {
      if (userInfo?.role === 'doctor' && userInfo?.isApproved) {
        dispatch(getAppointmentsStart());
        try {
          const { data } = await api.get('/appointments/my-appointments');
          dispatch(getAppointmentsSuccess(data));
        } catch (err) {
          console.error('Failed to fetch appointments:', err.response?.data?.message || err.message);
        }
      } else {
        dispatch(getAppointmentsSuccess([]));
      }
    };
    fetchAppointments();
  }, [dispatch, userInfo]);

  // Fetch doctor profile data on mount or when userInfo changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (userInfo?.role === 'doctor' && userInfo?.isApproved) {
        setProfileFetchError(null); // Clear previous error
        try {
          const { data } = await api.get('/doctors/profile');
          if (data) {
              setProfileData({
                specialization: data.specialization || '',
                experience: data.experience || 0,
                location: data.location || '',
                clinic: data.clinic || '',
                phoneNumber: data.phoneNumber || '',
                bio: data.bio || ''
              });
          }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            console.error('Failed to fetch doctor profile:', errorMessage);
            setProfileFetchError(errorMessage); // Set the specific error message
            setProfileData({
                specialization: '', experience: 0, location: '', clinic: '', phoneNumber: '', bio: ''
            });
        }
      } else {
        setProfileData({ specialization: '', experience: 0, location: '', clinic: '', phoneNumber: '', bio: '' });
        setProfileFetchError(null);
      }
    };
    fetchProfile();
  }, [userInfo]);

  const handleStatusChange = async (appointmentId, newStatus, isEmergency = false) => {
    try {
      const { data } = await api.put(`/appointments/${appointmentId}/status`, { status: newStatus, isEmergency });
      dispatch(updateAppointmentStatusSuccess(data));
      alert(`Appointment status updated to ${newStatus}.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleProfileUpdate = async (e) => {
      e.preventDefault();
      setProfileFetchError(null); // Clear error on update attempt
      try {
        const payload = {
            ...profileData,
            experience: parseInt(profileData.experience) || 0
        };
        const { data } = await api.put('/doctors/profile', payload);
        console.log('Updated profile response:', data);
        alert('Profile updated successfully!');
        setShowProfileModal(false);
      } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          alert('Failed to update profile: ' + errorMessage);
          console.error('Profile update error:', err);
          setProfileFetchError(errorMessage); // Set error on update failure
      }
  };
  
  const pendingAppointments = appointments.filter(app => app.status === 'pending');
  const scheduledAppointments = appointments.filter(app => app.status === 'scheduled');
  const completedAppointments = appointments.filter(app => app.status === 'completed');
  const canceledAppointments = appointments.filter(app => app.status === 'canceled');

  const bgStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1530026217469-8d76a599ce77?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
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
    minHeight: '100%',
  };
  
  if (userInfo?.role === 'doctor' && !userInfo?.isApproved) {
      return (
          <div className="text-center my-5 p-5" style={{...bgStyle, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Card className="p-5 text-center" style={cardStyle}>
                  <h2>Your account is pending approval.</h2>
                  <p>Please wait for the admin to approve your account to access your dashboard.</p>
              </Card>
          </div>
      );
  }
  
  if (userInfo?.role === 'doctor' && userInfo?.isApproved && loading) return <div>Loading appointments...</div>;
  if (userInfo?.role === 'doctor' && userInfo?.isApproved && error) return <div>Error: {error}</div>;


  return (
    <div className="dashboard-bg doctor-bg" style={bgStyle}>
      <h1 className="text-center mb-5 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        Doctor Dashboard
      </h1>

      <Row className="mb-4 px-5">
        <Col className="d-flex justify-content-end">
          <Button variant="info" onClick={() => setShowProfileModal(true)} className="hover-bg-dark">
            Update Profile
          </Button>
        </Col>
      </Row>

      {profileFetchError && userInfo?.role === 'doctor' && userInfo?.isApproved && (
          <Row className="px-5">
              <Col md={12}>
                  <Card className="mb-4 p-3 border-danger text-danger text-center" style={cardStyle}>
                      <Card.Body>
                          <Card.Title>Profile Not Found</Card.Title>
                          <Card.Text>
                              {profileFetchError}. Please click "Update Profile" to create and fill out your profile.
                          </Card.Text>
                      </Card.Body>
                  </Card>
              </Col>
          </Row>
      )}

      <Row className="px-5">
        <Col md={6} lg={4} className="mb-4">
          <Card style={cardStyle} className="hover-lift">
            <Card.Header className="bg-primary text-white text-center">Pending Appointments</Card.Header>
            <ListGroup variant="flush">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map((app) => (
                  <ListGroup.Item key={app._id}>
                    <div>
                      <strong>Patient:</strong> {app.customerId?.name || 'N/A'}
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date(app.appointmentDate).toLocaleString()}
                    </div>
                    <div className="mt-2">
                      <Button size="sm" variant="success" className="me-2 hover-bg-success" onClick={() => handleStatusChange(app._id, 'scheduled')}>
                        Schedule
                      </Button>
                      <Button size="sm" variant="danger" className="hover-bg-danger" onClick={() => handleStatusChange(app._id, 'canceled')}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="warning" className="ms-2 hover-bg-warning" onClick={() => handleStatusChange(app._id, 'scheduled', true)}>
                        Prioritize (Emergency)
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center">No pending appointments.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col md={6} lg={4} className="mb-4">
          <Card style={cardStyle} className="hover-lift">
            <Card.Header className="bg-success text-white text-center">Scheduled Appointments</Card.Header>
            <ListGroup variant="flush">
              {scheduledAppointments.length > 0 ? (
                scheduledAppointments.map((app) => (
                  <ListGroup.Item key={app._id} className={app.isEmergency ? 'bg-warning' : ''}>
                    <div>
                      <strong>Patient:</strong> {app.customerId?.name || 'N/A'} {app.isEmergency && <span className="text-danger">(Emergency)</span>}
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date(app.appointmentDate).toLocaleString()}
                    </div>
                    <div className="mt-2">
                      <Button size="sm" variant="info" className="me-2 hover-bg-info" onClick={() => handleStatusChange(app._id, 'completed')}>
                        Mark as Completed
                      </Button>
                      <Button size="sm" variant="secondary" className="hover-bg-secondary" onClick={() => handleStatusChange(app._id, 'rescheduled')}>
                        Reschedule
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center">No scheduled appointments.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col md={6} lg={4} className="mb-4">
          <Card style={cardStyle} className="hover-lift">
            <Card.Header className="bg-secondary text-white text-center">History</Card.Header>
            <ListGroup variant="flush">
              {completedAppointments.length > 0 || canceledAppointments.length > 0 ? (
                [...completedAppointments, ...canceledAppointments].map((app) => (
                  <ListGroup.Item key={app._id}>
                    <div>
                      <strong>Patient:</strong> {app.customerId?.name || 'N/A'}
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date(app.appointmentDate).toLocaleString()}
                    </div>
                    <div>
                      <strong>Status:</strong> <span className={`badge ${app.status === 'completed' ? 'bg-success' : 'bg-danger'}`}>{app.status}</span>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center">No past appointments.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Profile Update Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProfileUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Specialization</Form.Label>
              <Form.Control type="text" value={profileData.specialization} onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Experience (years)</Form.Label>
              <Form.Control type="number" value={profileData.experience} onChange={(e) => setProfileData({ ...profileData, experience: parseInt(e.target.value) || 0 })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Clinic</Form.Label>
              <Form.Control type="text" value={profileData.clinic} onChange={(e) => setProfileData({ ...profileData, clinic: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" value={profileData.phoneNumber} onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control as="textarea" rows={3} value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3 hover-bg-dark">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DoctorDashboardPage;
