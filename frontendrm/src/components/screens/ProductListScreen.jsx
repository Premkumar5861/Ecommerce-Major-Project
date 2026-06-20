import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import {
  listProducts,
  createProduct,
  deleteProduct,
} from "../../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../../constants/productConstants";
import {  useNavigate } from "react-router-dom";

function ProductListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const handleClose = () => {
    setMessage("");
  };
  const productsList = useSelector((state) => state.productsList);
  const { loading, error, products } = productsList;
  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: LoadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // useEffect(() => {
  //   dispatch({ type: PRODUCT_CREATE_RESET });
  //   if (!userInfo || !userInfo.isAdmin) {
  //     navigate("/login");
  //   } else {
  //     dispatch(listProducts());
  //   }
  //   if (successCreate && createdProduct) {
  //     navigate(`/admin/product/${createdProduct._id}/edit`);
  //   }
  // }, [dispatch, userInfo, successCreate, createdProduct,successDelete]);

useEffect(() => {
  dispatch({ type: PRODUCT_CREATE_RESET });
  if (!userInfo) {
    navigate("/login");
    return;  // ← இந்த line add பண்ணு
  }
  if (!userInfo.isAdmin) {
    navigate("/");
    return;
  }
  dispatch(listProducts());
  if (successCreate && createdProduct) {
    navigate(`/admin/product/${createdProduct._id}/edit`);
  }
}, [dispatch, userInfo, successCreate, createdProduct, successDelete]);

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure want to delete this product ?")) {
      dispatch(deleteProduct(id));
    }
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i>
            Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && (
        <Message variant="danger" onClose={handleClose}>
          {errorDelete}
        </Message>
      )}

      {LoadingCreate && <Loader />}
      {errorCreate && (
        <Message variant="danger" onClose={handleClose}>
          {errorCreate}
        </Message>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" onClose={handleClose}>
          {error}
        </Message>
      ) : (
        <div>
          <Table striped border hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Id</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>₹ {product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>

                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button value="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      value="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}

export default ProductListScreen;
