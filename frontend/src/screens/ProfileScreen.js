import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
  Table,
  Container,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  getUserDetails,
  updateUserProfile,
  updateUserInfo,
} from '../features/users/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listMyOrders } from '../features/orderSlice';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const { loading, error, userInfo } = useSelector((state) => state.user);
  const { loadingMyOrders, myOrders, errorMyOrders } = useSelector(
    (state) => state.order
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
    console.log('calling listMyOrders');
    dispatch(listMyOrders());
    console.log(myOrders);
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Password do not match');
      return;
    }
    dispatch(
      updateUserProfile({
        user: { name: name, email: email, password: password },
      })
    );
  };

  return (
    <Row>
      <Col md={3}>
        <h1>Update Profile</h1>
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
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h1>My Orders</h1>
        {loadingMyOrders && <Loader />}
        {errorMyOrders && <Message variant={'danger'}>{errorMyOrders}</Message>}
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <Container to={`/order/${order._id}`}>
                    <Button className='btn-sm' variant='light'>
                      Details
                    </Button>
                  </Container>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
