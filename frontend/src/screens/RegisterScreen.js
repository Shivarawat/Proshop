import React, { useState, useEffect } from 'react';
import FormContainer from '../components/FormContainer';
import {
  Row,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../features/users/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const { loading, error, userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) setMessage('Password do not match');
    dispatch(register({ name, email, password }));
    console.log(userInfo);
  };
  return (
    <FormContainer>
      <h1>Sign In</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <FormGroup controlId='name'>
          <FormLabel>Name</FormLabel>
          <FormControl
            type='text'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></FormControl>
        </FormGroup>

        <FormGroup controlId='email'>
          <FormLabel>Email Address</FormLabel>
          <FormControl
            type='text'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></FormControl>
        </FormGroup>

        <FormGroup controlId='password' className='py-3'>
          <FormLabel>Password</FormLabel>
          <FormControl
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></FormControl>
        </FormGroup>

        <FormGroup controlId='confirmPassword' className='py-3'>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></FormControl>
        </FormGroup>

        <Button type='submit' variant='primary' onClick={submitHandler}>
          Register
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Have an Account? <Link to={'/login'}>Log In</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
