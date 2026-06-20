import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://ecommerce-major-project.onrender.com';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return BACKEND_URL + (imagePath.startsWith('/') ? '' : '/') + imagePath;
};

function ProductScreen({ product }) {
  return (
    <>
      <Card className="my-3 p-3 rounded border border-dark shadow">
        <div className="product-card-image-wrap">
          <Link to={`/product/${product._id}`} >
            <Card.Img
              src={getImageUrl(product.image)}
              className="product-card-img"
              variant="dark"
              onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
            />
          </Link>
        </div>
        <Card.Body className="d-flex flex-column product-card-body">
          <Link to={`/product/${product._id}`}className="product-link">
            <Card.Title>
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>
          <Card.Text as="h5">
            <div className="my-3">
              {product.rating} from {product.numReviews} Reviews
            </div>
          </Card.Text>
          <Card.Text as="h6">
            <div className="my-3">₹{product.price}</div>
          </Card.Text>
          <Card.Text as="h6">
            <Link className="my-3 text-success" to={`/product/${product._id}`}>
              View More
            </Link>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default ProductScreen;
