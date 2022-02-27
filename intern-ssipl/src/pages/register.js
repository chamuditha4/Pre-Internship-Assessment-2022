import Header from '../common/header';
import Footer from '../common/footer';
import React, {useState } from "react";
import axios from 'axios';
import { Form,Button,Container,Row,Col,InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';

const CryptoJS = require("crypto-js");
var key = "ASECRET";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const  Register  = () =>  {
    const [user,setUser] = useState({
        name:"",
        email:"",
        username:"",
        bio:"",
        photo:"",
        password: "",
        repassword:""
    })

    // Error Userstates For alertboxes
    const [open, setOpen] = React.useState(false); //Email Already Exist
    const [open1, setOpen1] = React.useState(false); // User Exist
    const [open2, setOpen2] = React.useState(false); // Other errors
    const [open3, setOpen3] = React.useState(false); // Password mismatch 

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

    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value});
    }

    const handlePhoto = (e) => {
        setUser({...user, photo: e.target.files[0]});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
      if(user.password !== user.repassword){
        handleClick3();
      }
      else{
        const formData = new FormData();

        formData.append("name", user.name);
        formData.append("username", user.username);
        formData.append("email", user.email);
        formData.append("password", (CryptoJS.AES.encrypt((user.password), key)).toString());
        formData.append("photo", user.photo);
        formData.append("bio", user.bio);


      
      
       await axios.post("http://localhost:4000/users/create-user", formData ,{
            headers: { 'Content-Type': 'multipart/form-data'}
          } )
          .then(res => {
            if(res.data.includes("emailExist")){
                handleClick();
            }else if(res.data.includes("userExist")){
                handleClick1();
            }else if(res.data.includes("Added")){
                window.location.href = "/login";
            }else{
                handleClick2();
            }
            
         })
         .catch(error => {
            console.log(error.response.data);
         });
      }
    };

    const handleLogin = async googleData => {
        const res = await fetch("http://localhost:4000/users/api/v1/auth/google", {
            method: "POST",
            body: JSON.stringify({
            token: googleData.tokenId
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        const data = await res.json()
        window.location.href = "/login";
      }


    const responseFacebook = async (response) => {
        await axios.post("http://localhost:4000/users/api/v1/auth/facebook", {name:response.name,email:response.email,picture:response.picture })
            .then(res => {
            console.log(res);
            window.location.href = "/login";
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
                        <Col><h1 style={{ color: '#0d6efd' }}>Register</h1></Col>
                        <Col></Col>
                    </Row>

                    <br></br>
                    <Row>

                        <Col>
                        <Form encType='multipart/form-data' method="POST" onSubmit={handleSubmit}   >
                            <Row className="mb-3">
                                <Form.Group as={Col} md="4" controlId="Name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    required
                                    name="name"
                                    type="text"
                                    placeholder="Name"
                                    defaultValue="Chamuditha Prabhath"
                                    onChange={handleChange}
                                    value={user.name}
                                />
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="Email">
                                <Form.Label>Email</Form.Label>
                                <InputGroup hasValidation>
                                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                    <Form.Control
                                        required
                                        name="email"
                                        type="email"
                                        placeholder="email"
                                        defaultValue="jayasena940@gmail.com"
                                        onChange={handleChange}
                                        value={user.email}
                                    />
                                </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="Username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                        onChange={handleChange}
                                        value={user.username}
                                    />
                                </Form.Group>
                            </Row>
                            <Row  className="mb-3">
                                <Form.Group as={Col} md="6" controlId="ProfilePic">
                                    <Form.Label>Profile Picture</Form.Label>
                                    <Form.Control type="file" 
                                        required  
                                        accept=".png, .jpg, .jpeg"
                                        name="photo"
                                        onChange={handlePhoto}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md="3" controlId="Password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" 
                                        required
                                        name="password"
                                        onChange={handleChange}
                                        value={user.password}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md="3" controlId="RePassword">
                                    <Form.Label>Retype-Password</Form.Label>
                                    <Form.Control type="password" placeholder="Same password again!."
                                        required
                                        name="repassword"
                                        onChange={handleChange}
                                        value={user.repassword}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-1">
                                <Form.Group as={Col} md="6" controlId="bio">
                                    <Form.Label>Bio</Form.Label>
                                    <Form.Control as="textarea" placeholder="Describe yourself!."
                                        required
                                        name="bio"
                                        onChange={handleChange}
                                        value={user.bio}
                                    />
                                </Form.Group>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Check
                                required
                                label="Agree to terms and conditions"
                                feedback="You must agree before submitting."
                                feedbackType="invalid"
                                />
                            </Form.Group>
                            <Button type="submit">Register</Button>
                        </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col>
                        <GoogleLogin
                            clientId="990333757483-q7qo9k1lq5bfvq4e4okqhuoot522nc47.apps.googleusercontent.com"
                            buttonText="Signup using Google"
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
                            textButton="Signup using Facebook"
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
          <br></br>
          <br></br>
          <br></br>

          <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                    Email already exist!
                    </Alert>
                </Snackbar>
            </Stack>

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open1} autoHideDuration={6000} onClose={handleClose1}>
                    <Alert onClose={handleClose1} severity="warning" sx={{ width: '100%' }}>
                    Username already exist!
                    </Alert>
                </Snackbar>
            </Stack>

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open2} autoHideDuration={6000} onClose={handleClose2}>
                    <Alert onClose={handleClose2} severity="warning" sx={{ width: '100%' }}>
                    Please try again later!
                    </Alert>
                </Snackbar>
            </Stack>

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open3} autoHideDuration={6000} onClose={handleClose3}>
                    <Alert onClose={handleClose3} severity="warning" sx={{ width: '100%' }}>
                    Password need to be match!.
                    </Alert>
                </Snackbar>
            </Stack>
          <Footer />
      </div>
    );
  }

  export default Register