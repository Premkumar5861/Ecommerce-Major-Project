import React, { useState, useEffect } from "react";
import { Button, Row, Col, Form, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import { getUserDetails, updateUserProfile } from "../../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import FormContainer from "./FormContainer";
import { listMyOrders } from "../../actions/orderActions";
import { LinkContainer } from "react-router-bootstrap";

function ProfileScreen({ params }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleClose = () => setMessage(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const myOrderList = useSelector((state) => state.myOrderList);
  const { loading: loadingOrders, error: errorOrders, orders } = myOrderList;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (
        !user ||
        !user.first_name ||
        !user.last_name ||
        success ||
        userInfo._id !== user._id
      ) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders(orders));
      } else {
        setFname(user.first_name);
        setLname(user.last_name);
      }
    }
    dispatch(listMyOrders(orders));
  }, [dispatch, userInfo, success]);

  const submiteHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Password do not match.");
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          fname: fname,
          lname: lname,
          password: password,
          confirmPassword: confirmPassword,
        }),
      );
      setMessage("");
    }
  };
  return (
    <>
      <Row className="mt-4">
        <Col md={5}>
          <h2>User Profile</h2>
          {message && (
            <Message variant="danger" onClose={handleClose}>
              {message}
            </Message>
          )}
          {error && (
            <Message variant="danger" onClose={handleClose}>
              {error}
            </Message>
          )}
          {loading && <Loader />}
          <FormContainer>
            <Form onSubmit={submiteHandler}>
              <Form.Group controlId="fname">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Enter Your First Name"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="lname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Enter Your Last Name"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  required
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="confirmpassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  required
                  placeholder="Enter Your Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form>
          </FormContainer>
        </Col>

        <Col md={7}>
          <h2>My Orders</h2>
          {loadingOrders ? (
            <Loader />
          ) : errorOrders ? (
            <Message variant="danger" onClose={handleClose}>
              {errorOrders}
            </Message>
          ) : (
            <Table striped border hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>₹ {order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn-sm">Details</Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
}

export default ProfileScreen;
