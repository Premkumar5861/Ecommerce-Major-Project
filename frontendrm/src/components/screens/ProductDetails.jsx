import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../../actions/productActions";
import Loader from "../Loader";
import Message from "../Message";
// import axios from 'axios';
import {
  Col,
  Row,
  Button,
  Card,
  Image,
  ListGroup,
  Form,
} from "react-bootstrap";

function ProductDetails({ params }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  const navigate = useNavigate();
  //const location = useLocation();
  const [qty, setQty] = useState(1);
  const [message,setMessage]= useState('')
  const handleClose = ()=> setMessage(false)

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  return (
    <>
      <div>
        <Link to="/" className="my-3 btn btn-dark">
          Go Back
        </Link>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger" onClose={handleClose}>{error}</Message>
        ) : (
          <Row>
            <Col md={6}>
              <Image
                src={product.image}
                alt={product.name}
                style={{
                  maxHeight: "500px",
                  width: "100%",
                  objectFit: "contain",
                }}
              ></Image>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h5>
                    Rating : {product.rating} |No.Of Reviews{" "}
                    {product.numReviews}
                  </h5>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p>Description : {product.description} </p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h3>Prize : ₹{product.price}</h3>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card className="p-3 shadow">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Status</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Category</Col>
                      <Col>{product.category}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Brand</Col>
                      <Col>{product.brand}</Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col xs="auto" className="my-1">
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                              ),
                            )}
                          </Form.Control>{" "}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button className="btn-block btn-success"disabled={product.countInStock===0} type="button" onClick={addToCartHandler}>Add to cart</Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default ProductDetails;
