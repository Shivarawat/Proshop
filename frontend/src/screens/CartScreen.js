import React, { useEffect } from 'react';
import { addToCart, removeFromCart } from '../features/cartSlice';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Image,
  FormControl,
  Button,
  Card,
} from 'react-bootstrap';
import Message from '../components/Message';

const CartScreen = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { userInfo } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.cart);
  const qty = searchParams.get('qty');
  const id = useParams().id;
  const navigate = useNavigate();

  const checkOut = () => {
    if (!userInfo) navigate('/login');
    navigate('/shipping');
  };

  useEffect(() => {
    dispatch(addToCart({ id, qty }));
    navigate('/cart');
  }, [id, qty]);

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>Your Cart is empty</Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => {
              
              return (
                <ListGroupItem key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link
                        to={`/product/${item._id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>
                      <FormControl
                        as={'select'}
                        value={item.qty}
                        onChange={(e) =>
                          {console.log(';lajf;sdkjf;lasj', item)
                            dispatch(
                            addToCart({
                              id: item.product,
                              qty: Number(e.target.value),
                            })
                          )}
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </FormControl>
                    </Col>
                    <Col md={2}>
                      <Button
                        type='button'
                        variant='light'
                        onClick={() => {
                          dispatch(removeFromCart(item));
                        }}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroupItem>
            <ListGroupItem>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkOut}
              >
                Proceed To Checkout
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
