import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link, useParams } from 'react-router-dom';
import { fetchProducts } from '../features/products/productSlice';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { products, pages, page } = useSelector((state) => state.product);
  const status = useSelector((state) => state.product.status);
  const errorMessage = useSelector((state) => state.product.error);
  const { keyword, pageNumber } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts({ keyword, pageNumber }));
  }, [dispatch, keyword, pageNumber]);

  let content;
  if (status === 'loading') {
    content = <Loader />;
  } else if (status === 'failed') {
    content = <Message variant={'danger'} children={errorMessage} />;
  } else {
    content = (
      <>
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
        <Paginate page={page} pages={pages} keyword={keyword ? keyword : ''} />
      </>
    );
  }
  return (
    <>
      <Meta />
      {!keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light'>Go Back</Link>}
      <h1>Latest Products</h1>
      {content}
    </>
  );
};

export default HomeScreen;
