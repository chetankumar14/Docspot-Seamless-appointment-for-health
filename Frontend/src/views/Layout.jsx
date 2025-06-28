import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { MDBContainer } from 'mdb-react-ui-kit';

const Layout = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="px-5">
        <Navbar.Brand href="#">Docspot</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {userInfo?.role === 'customer' && <Nav.Link href="/dashboard">Dashboard</Nav.Link>}
            {userInfo?.role === 'doctor' && <Nav.Link href="/doctor/dashboard">Dashboard</Nav.Link>}
            {userInfo?.role === 'admin' && <Nav.Link href="/admin/dashboard">Dashboard</Nav.Link>}
            {/* Add more links as needed */}
          </Nav>
          <Nav>
            {userInfo ? (
              <>
                <Navbar.Text className="me-3">
                  Signed in as: <b>{userInfo.name}</b> ({userInfo.role})
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout} style={{ '--bs-btn-hover-border-color': '#fff' }}>
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <MDBContainer fluid className="mt-4 p-0">
        {children}
      </MDBContainer>
    </>
  );
};

export default Layout;