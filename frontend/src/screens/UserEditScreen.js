import React, { useState, useEffect } from 'react';
import FormContainer from '../components/FormContainer';
import {
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
  FormCheck,
} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getUserDetails, register, updateUser } from '../features/users/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';

const UserEditScreen = () => {
  const userId = useParams().id;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { loading, error, targetUserInfo, errorUpdate, successUpdate } =
    useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!targetUserInfo.name || targetUserInfo._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(targetUserInfo.name);
      setEmail(targetUserInfo.email);
      setIsAdmin(targetUserInfo.isAdmin);
    }
  }, [dispatch, targetUserInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  let content;
  if (loading) content = <Loader />;
  else if (error) content = <Message variant='danger'>{error}</Message>;
  else
    content = (
      <FormContainer>
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

          <FormGroup controlId='isAdmin' className='py-3'>
            <FormLabel>Admin</FormLabel>
            <FormCheck
              type='checkbox'
              label='Is Admin'
              value={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            ></FormCheck>
          </FormGroup>

          <Button type='submit' variant='primary' onClick={submitHandler}>
            Update
          </Button>
        </Form>
      </FormContainer>
    );
  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <h2>Edit User</h2>
      {content}
    </>
  );
};

export default UserEditScreen;
