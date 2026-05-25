import React from 'react'
import { Spinner } from 'react-bootstrap'

function Loader() {
  return (
    <Spinner animation="border" role="status" style={{height:'65px', width:'65px',margin:'auto',display:'block'}}>
      
    </Spinner>
  )
}

export default Loader