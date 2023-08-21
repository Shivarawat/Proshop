import React, { useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../features/cartSlice';
import { Button, Col, Form, FormCheck, FormLabel } from 'react-bootstrap';

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.cart);
  if (!shippingAddress) navigate('/shipping');

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(paymentMethod);
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };
  const onPaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <FormLabel as='legend'>Select Method</FormLabel>

        <Col>
          <FormCheck
            type='radio'
            label='PayPal or Credit Card'
            id='PayPal'
            name='paymentMethod'
            value='PayPal'
            checked={paymentMethod === 'PayPal'}
            onChange={onPaymentMethodChange}
          />
          <FormCheck
            type='radio'
            label='Stripe'
            id='Stripe'
            name='paymentMethod'
            value='Stripe'
            checked={paymentMethod === 'Stripe'}
            onChange={onPaymentMethodChange}
          />
        </Col>

        <Button type='submit' variant='primary' className='my-3'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
