import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { MDBContainer, MDBInput, MDBBtn } from 'mdb-react-ui-kit'; // Removed MDBRow, MDBCol as not used directly
import { Card } from 'react-bootstrap';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); // New state for username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // Include username in the payload
      const { data } = await api.post('/auth/register', { name, username, email, password });
      
      if (data.role === 'doctor') {
        setSuccess('Registration successful! Your doctor account is pending admin approval.');
      } else {
        setSuccess('Registration successful! You can now log in.');
      }
      
      // Clear form
      setName('');
      setUsername(''); // Clear username field
      setEmail('');
      setPassword('');

      // Redirect after a delay
      setTimeout(() => navigate('/login'), 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      console.error('Registration error:', err.response?.data || err.message);
    }
  };

  return (
    <MDBContainer className="my-5 d-flex justify-content-center">
      <Card style={{ width: '30rem', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h2>Register for Docspot</h2>
          </Card.Title>
          <form onSubmit={handleRegister}>
            <MDBInput
              label="Name"
              id="registerName"
              type="text"
              className="mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <MDBInput
              label="Username" // New input for username
              id="registerUsername"
              type="text"
              className="mb-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <MDBInput
              label="Email address"
              id="registerEmail"
              type="email"
              className="mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <MDBInput
              label="Password"
              id="registerPassword"
              type="password"
              className="mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-danger text-center">{error}</p>}
            {success && <p className="text-success text-center">{success}</p>}
            <MDBBtn type="submit" block className="mb-4 btn-primary" style={{ '--mdb-btn-hover-bg-color': '#0056b3' }}>
              Register
            </MDBBtn>
            <div className="text-center">
              <p>
                Already have an account? <a href="/login">Login</a>
              </p>
            </div>
          </form>
        </Card.Body>
      </Card>
    </MDBContainer>
  );
};

export default Register;
