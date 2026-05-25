import React, {useEffect} from "react";
import { Alert  } from "react-bootstrap";

function Message ({ variant, children, onClose}){
  useEffect(()=>{
    const timer = setTimeout(()=>{
      onClose();  // call the onClose function after 15 seconds

    },15000);

    return ()=> clearTimeout(timer); // Cleanup the timer on unmount
  },[onClose]);

  return(
    <Alert variant={variant} dismissible onClose={onClose}>{children}</Alert>
  )
}

export default Message;