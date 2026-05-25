import React, {  useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../Loader";
import Message from "../Message";
import { login } from "../../actions/userActions";

function LoginScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const [message, setMessage] = useState("");
  const [show, changeShow] = useState("fa fa-eye-slash");

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;
  const handleClose = () => setMessage(false);

  useEffect(() => {
    if (userInfo) {
      navigate("/login");
    }
  }, [userInfo, redirect]);

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    console.log(e.target.value);

    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
    validateField(name, value);
  };
  const isFormValid = () => {
    return (
      Object.values(formErrors).every((error) => error === null) &&
      Object.values(formValues).every(
        (value) => value !== "" && value !== false,
      )
    );
  };

  const getValidateClass = (name) => {
    if (formValues[name] === "") return "";
    return formErrors[name] ? "is-invalid" : "is-valid";
  };

  const clearForm = () => {
    setFormValues({
      email: "",
      password: "",
    });
  };

  const validateField = (name, value) => {
    let errorMessage = null;
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMessage = "Invalid email format..";
        }
        break;
      case "password":
        if (value.length < 6) {
          errorMessage = "Password must be at least 6 characters.";
        }
        break;

      default:
        break;
    }

    setFormErrors({
      ...formErrors,
      [name]: errorMessage,
    });
  };
  const showPassword = () => {
    var x = document.getElementById("pass");
    if ((x.type === "password")) {
      x.type = "text";
      changeShow("fa fa-eye");
    } else {
      x.type = "password";
      changeShow('fa fa-eye-slash');
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(login(formValues.email, formValues.password));
    clearForm();
    setMessage("Login is Success");
    
  };

  useEffect(()=>{
    if(userInfo){
      navigate("/")
    }
  },[userInfo])

  return (
    <>
      <Container>
        <Row>
          <Col md="3"></Col>

          {loading ? (
            <Loader />
          ) : (
            <Col md="6">
              <Form onSubmit={submitHandler}>
                <br />
                <h1 className="text-center">Login Here</h1>

                {message && (
                  <Message variant="success" onClose={handleClose}>
                    {message}
                  </Message>
                )}
                {error && (
                  <Message variant="danger" onClose={handleClose}>
                    {error}
                  </Message>
                )}

                <Form.Group controlId="email" className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Your Email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    isInvalid={!!formErrors.email}
                    className={getValidateClass("email")}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>
                    {" "}
                    <span>
                      <i className={show}></i>
                    </span>{" "}
                    Password
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Checkbox onClick={showPassword} />{" "}
                    <Form.Control
                      required
                      type="password"
                      name="password"
                      id="pass"
                      value={formValues.password}
                      placeholder="Enter Your Password"
                      isInvalid={!!formErrors.password}
                      className={getValidateClass("password")}
                      onChange={handleChange}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button
                  className="mt-3"
                  variant="success"
                  type="submit"
                  disabled={!isFormValid()}
                >
                  Login
                </Button>
              </Form>
              <Row className="my-3">
                <Col>
                  New User?
                  <Link to="/signup"> Signup</Link>
                </Col>
              </Row>
            </Col>
          )}
          <Col md="3"></Col>
        </Row>
      </Container>
    </>
  );
}

export default LoginScreen;
