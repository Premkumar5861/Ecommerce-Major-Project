import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import Message from "../Message";
import Loader from "../Loader";
import { LinkContainer } from "react-router-bootstrap";
import FormContainer from "./FormContainer";
import { USER_UPDATE_RESET } from "../../constants/userConstants";
import { updateUsers,getUserDetails } from "../../actions/userActions";



function AdminUserEditScreen({params}) {
  const {id} = useParams()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [isAdmin,setIsAdmin]=useState(false)


  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector(state=>state.userDetails)
  const {error,loading,user} = userDetails

  const userUpdate = useSelector(state=>state.userUpdate)
  const {error: errorUpdate, loading:loadingUpdate,success: successUpdate} = userUpdate

 

  const [message, setMessage] = useState("");
  const handleClose = () => setMessage(false);

useEffect(()=>{
  if(successUpdate){
    dispatch({ type:USER_UPDATE_RESET})
    navigate('/admin/userlist')
  }else{
    if (!user || !user.name || user._id !== id){
      dispatch(getUserDetails(id))
    }else{
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
    }
  }
},[dispatch,userInfo,successUpdate,id])

 const submitHandler=(e)=>{
e.preventDefault()
dispatch(updateUsers({_id: user._id,name,email,isAdmin}))
 }

  return (
   <>
   <br />


   <div>
    <Link to='/admin/userlist'>Go Back</Link>
    <FormContainer>
      <h1>Edit User</h1>
      {loadingUpdate && <Loader/>}
      {errorUpdate && <Message variant='danger' onClose={handleClose}>{errorUpdate}</Message>}
      {
  loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'onClose={handleClose}>{error}</Message>
  ) : (
    <Form onSubmit={submitHandler}>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="isadmin">
        <Form.Check
          type="checkbox"
          label="Is Admin"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        Update
      </Button>
    </Form>
  )
}
      
    </FormContainer>
   </div>
   </>
  )
}

export default AdminUserEditScreen;
