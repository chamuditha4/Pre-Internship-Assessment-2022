import React from 'react'
import { Nav,Navbar,Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { removeUserSession  } from '../utils/Common';
import { getUser } from '../utils/Common';

const Header  = () =>  {
    const user = getUser();
    if (!user){
        return (
            <div>
                
                <Navbar bg="primary" variant="dark">
                    <Container>
                        
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Navbar.Brand href="/">Profiler</Navbar.Brand>
                            </Nav>
        
                            <Nav>
                                <Nav.Link href="/login">Login</Nav.Link>
                                <Nav.Link href="/register">Register</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
        
                        
                        
                    </Container>
                </Navbar>
        
            </div>
        
        
          )
    }else // If user loged correctly
    {

        const logout = () => {
            removeUserSession();
            window.location.href = "/login";
        }

        return(
            <div>
                <Navbar bg="primary" variant="dark">
                    <Container>
                        
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Navbar.Brand href="/">Profiler</Navbar.Brand>
                            </Nav>
        
                            <Nav>
                                <Nav.Link onClick={logout}>Logout</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
        
                        
                        
                    </Container>
                </Navbar>
            </div>
        )
    }
  
}

export default Header