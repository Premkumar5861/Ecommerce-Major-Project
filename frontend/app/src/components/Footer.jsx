import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
    <footer
  style={{
    marginTop: "auto",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "25px 0",
  }}
>
      <Container>
        <Row>
          <Col className="text-center p-2">
            Copyright © Ecommerce.in
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer