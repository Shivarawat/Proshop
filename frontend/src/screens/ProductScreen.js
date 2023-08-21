import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  ListGroupItem,
  FormControl,
  FormGroup,
  Form,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import { useParams } from 'react-router-dom';
import {
  createProductReview,
  fetchSingleProduct,
} from '../features/products/productSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToCart } from '../features/cartSlice';
import Meta from '../components/Meta';

const ProductScreen = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const productStatus = useSelector((state) => state.product.productStatus);
  const product = useSelector((state) => state.product.product);
  const { errorProductReview, successProductReview, reviews } = useSelector(
    (state) => state.product
  );
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment('');
    }
    dispatch(fetchSingleProduct(id));
  }, [id, successProductReview]);

  const addToCartHandler = () => {
    dispatch(addToCart({ id, qty }));
    navigate('/cart');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview({ id, rating, comment }));
  };

  let content;
  if (productStatus === 'loading') content = <Loader />;
  else if (productStatus === 'failed')
    content = <Message variant={'danger'} children={'SingleProduct Error'} />;
  else {
    content = (
      <>
        <Meta title={product.name} />
        <Link className='btn btn-light my-3' to='/'>
          Get Back
        </Link>
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <h3>{product.name}</h3>
              </ListGroupItem>
              <ListGroupItem>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroupItem>
              <ListGroupItem>Price: ${product.price}</ListGroupItem>
              <ListGroupItem>Description: {product.description}</ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroupItem>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      <strong>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </strong>
                    </Col>
                  </Row>
                </ListGroupItem>
                {product.countInStock > 0 && (
                  <ListGroupItem>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <FormControl
                          as={'select'}
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </FormControl>
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}
                <ListGroupItem>
                  <Button
                    onClick={addToCartHandler}
                    className='btn-block'
                    type='button'
                    disabled={product.countInStock === 0}
                  >
                    add to cart
                  </Button>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h2>Reviews</h2>
            {product.reviews?.length === 0 && <Message>No Reviews</Message>}
            <ListGroup variant='flush'>
              {product.reviews?.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <h2>Write a Customer Review</h2>
                {errorProductReview && (
                  <Message variant='danger'>{errorProductReview}</Message>
                )}
                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId='rating'>
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as='select'
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value=''>Select...</option>
                        <option value='1'>1 - Poor</option>
                        <option value='2'>2 - Fair</option>
                        <option value='3'>3 - Good</option>
                        <option value='4'>4 - Very Good</option>
                        <option value='5'>5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    <FormGroup controlId='comment'>
                      <Form.Label>Comment</Form.Label>
                      <FormControl
                        as='textarea'
                        row='3'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></FormControl>
                    </FormGroup>
                    <Button type='submit' variant='primary'>
                      Submit
                    </Button>
                  </Form>
                ) : (
                  <Message>
                    Please <Link to='/login'> sign in</Link> to write a review
                  </Message>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </>
    );
  }
  console.log('Product Reviews hai', product);
  return <>{content}</>;
};

export default ProductScreen;
