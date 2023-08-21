import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteProduct,
  fetchProducts,
  createProduct,
  createProductReset,
} from '../features/products/productSlice';
import Paginate from '../components/Paginate';

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const {pageNumber} = useParams() || 1;

  const {
    userInfo,
    successDelete,
    products,
    successCreate,
    createdProduct,
    page,
    pages,
  } = useSelector((state) => state.product);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(createProductReset());
    if (userInfo && !userInfo.isAdmin) {
      navigate('');
    }
    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(fetchProducts({keyword: '',pageNumber}));
    }
  }, [dispatch, successCreate, successDelete, pageNumber]);

  const createProductHandler = (product) => {
    dispatch(createProduct(product));
  };

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus' /> Create Product
          </Button>
        </Col>
      </Row>
      {/* {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />} */}
      {/* {errorCreate && <Message variant='danger'>{errorCreate}</Message>} */}

      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                  <Button variant='light' className='btn-sm'>
                    <i className='fas fa-edit'></i>
                  </Button>
                </LinkContainer>
                <Button
                  variant='danger'
                  className='btn-sm'
                  onClick={() => deleteHandler(product._id)}
                >
                  <i className='fas fa-trash'></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginate pages={pages} page={page} isAdmin={true} />
    </>
  );
};

export default ProductListScreen;
