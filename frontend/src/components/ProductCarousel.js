import React, { useEffect } from 'react';
import { Carousel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopProducts } from '../features/products/productSlice';

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const { topProducts } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchTopProducts());
  }, [dispatch]);

  return (
    <Carousel pause='hover' className='bg-dark'>
      {topProducts.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className='carousel-caption'>
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
