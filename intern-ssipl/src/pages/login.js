import Header from '../common/header';
import Footer from '../common/footer';
import React, {useState } from "react";
import axios from 'axios';
import { Form,Button,Container,Row,Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { setUserSession  } from '../utils/Common';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const  Login  = () =>  {

    const [user,setUser] = useState({
        email:"",
        password: ""
    })

    // Error Userstates For alertboxes
    const [open, setOpen] = React.useState(false); //Password Error
    const [open1, setOpen1] = React.useState(false); // User Error
    const [open2, setOpen2] = React.useState(false); // Other errors
    const [open3, setOpen3] = React.useState(false); // Password Empty

    const handleClick = () => {
        setOpen(true);
      };
    
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    const handleClick1 = () => {
        setOpen1(true);
      };
    
      const handleClose1 = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen1(false);
    };

    const handleClick2 = () => {
        setOpen2(true);
      };
    
      const handleClose2 = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen2(false);
    };

    const handleClick3 = () => {
        setOpen3(true);
      };
    
      const handleClose3 = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen3(false);
    };



    //Form onchange method
    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value});
    }
    // Form submission method
    const handleSubmit = async (event) => {
        event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }else{
        const formData = new FormData();

        formData.append("email", user.email);
        formData.append("password", user.password);
      
      
       await axios.post("http://localhost:4000/users/login-user", formData )
          .then(res => {
              const userdata = JSON.stringify(res.data.user);
            if ((userdata).includes('pw')){
                handleClick();
            }else if ((userdata).includes('User')){
                handleClick1();
            }else if ((userdata).includes('Error')){
                handleClick2();
            }else if ((userdata).includes('Authentication Apps only')){
                handleClick3();
            }
            else{
            setUserSession(res.data.token, res.data.user);
            window.location.href = "/dashboard";
            }
         })
         .catch(error => {
            console.log(error);
         });
      }

    };

    const handleLogin = async googleData => {
        await axios.post("http://localhost:4000/users/api/v1/auth/google", {token: googleData.tokenId })
            .then(res => {
            console.log(res);
            if(res.data.user){
                setUserSession(res.data.token, res.data.user);
                window.location.href = "/dashboard";
            }else{
                alert('Please try again!.');
            }
        })
        .catch(error => {
            console.log(error.response.data);
        });
    }


    const responseFacebook = async (response) => {
        await axios.post("http://localhost:4000/users/api/v1/auth/facebook", {name:response.name,email:response.email,picture:response.picture })
            .then(res => {
            console.log(res);
            if(res.data.user){
                setUserSession(res.data.token, res.data.user);
                window.location.href = "/dashboard";
            }else{
                alert('Please try again!.');
            }
            
        })
        .catch(error => {
            console.log(error.response.data);
        });
        console.log(response);
    }

      return (
        <div>
            <Header />
            
            <div>
            <Container>
                <br></br>
                <Row>
                    <Col></Col>
                    <Col><h1 style={{ color: '#0d6efd' }}>Log in</h1></Col>
                    <Col></Col>
                </Row>

                <br></br>
                <Row>
                    <Col></Col>

                    <Col>
                        <Form method="POST" onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" 
                                    name="email"
                                    onChange={handleChange}
                                    value={user.email} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password"
                                    name="password"
                                    onChange={handleChange}
                                    value={user.password}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col>
                    <br></br>
                    <GoogleLogin
                        clientId="990333757483-q7qo9k1lq5bfvq4e4okqhuoot522nc47.apps.googleusercontent.com"
                        buttonText="Signin using Google"
                        onSuccess={handleLogin}
                        onFailure={handleLogin}
                        cookiePolicy={'single_host_origin'}
                    />
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col>
                    <br></br>
                    <FacebookLogin
                        appId="366698558378790"
                        autoLoad={false}
                        textButton=" Signin using Facebook"
                        fields="name,email,picture"
                        callback={responseFacebook}
                        cssClass="my-facebook-button-class"
                        icon="fa-facebook" 
                    />
                    </Col>
                    <Col></Col>
                </Row>

            </Container>
            
            </div>

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                    Please Check Password!
                    </Alert>
                </Snackbar>
            </Stack>

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open1} autoHideDuration={6000} onClose={handleClose1}>
                    <Alert onClose={handleClose1} severity="warning" sx={{ width: '100%' }}>
                    Please Check Username!
                    </Alert>
                </Snackbar>
            </Stack>

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open2} autoHideDuration={6000} onClose={handleClose2}>
                    <Alert onClose={handleClose2} severity="warning" sx={{ width: '100%' }}>
                    Error!
                    </Alert>
                </Snackbar>
            </Stack>

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open3} autoHideDuration={6000} onClose={handleClose3}>
                    <Alert onClose={handleClose3} severity="warning" sx={{ width: '100%' }}>
                    Please Enter your password!
                    </Alert>
                </Snackbar>
            </Stack>
            <Footer />
        </div>
      );
    }

  export default Login