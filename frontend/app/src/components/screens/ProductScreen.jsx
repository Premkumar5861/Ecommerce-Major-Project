import React  from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { use } from "react";





function ProductScreen({ product }) {
  return (
    <>
      <Card className="my-3 p-3 rounded border border-dark shadow">
        <div className="product-card-image-wrap">
        <Link to={`/product/${product._id}`}>
          <Card.Img  src={product.image} className="product-card-img" variant="dark"/>
        </Link>
        </div>
        

        <Card.Body className="d-flex flex-column product-card-body ">
          <Link to={`/product/${product._id}`}>
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
            <div className="my-3">Rs{product.price}</div>
          </Card.Text>
          <Card.Text as="h6">
            <Link className="my-3 text-success" to={`/product/${product._id}`}
             >View More</Link>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default ProductScreen;
