import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import api from '../../services/api';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { Card } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(setCredentials(data));
      
      // Redirect to the appropriate dashboard based on role
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <MDBContainer className="my-5 d-flex justify-content-center">
      <Card style={{ width: '30rem', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h2>Login to Docspot</h2>
          </Card.Title>
          <form onSubmit={handleLogin}>
            <MDBInput
              label="Email address"
              id="form1"
              type="email"
              className="mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <MDBInput
              label="Password"
              id="form2"
              type="password"
              className="mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-danger text-center">{error}</p>}
            <MDBBtn type="submit" block className="mb-4 btn-primary" style={{ '--mdb-btn-hover-bg-color': '#0056b3' }}>
              Sign In
            </MDBBtn>
            <div className="text-center">
              <p>
                Not a member? <a href="/register">Register</a>
              </p>
            </div>
          </form>
        </Card.Body>
      </Card>
    </MDBContainer>
  );
};

export default Login;