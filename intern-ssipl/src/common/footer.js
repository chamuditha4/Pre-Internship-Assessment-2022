import React from 'react';
import { Navbar,Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
      <div>
        <Navbar bg="dark" variant="dark"  fixed="bottom">
            <Container>
            <Navbar.Collapse className="justify-content-center">
                <Navbar.Brand>
                    Pre-Internship Assessment {(new Date().getFullYear())}
                </Navbar.Brand>
            </Navbar.Collapse>
            </Container>
        </Navbar>
      </div>
    
    
  )
}

export default Footer