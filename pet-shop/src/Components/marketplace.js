import React, { useEffect, useState, useRef } from "react";
import { Form, Container, Button, Row, Card, Col } from "react-bootstrap";
import { render } from "react-dom";
import * as nearAPI from "near-api-js";

const { utils } = nearAPI;

const Marketplace = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    async function getPets() {
      let pets = await window.contract.get_pets();
      setPets(pets);
    }
    getPets();
  }, []);

  const buyPet = async (id) => {
    await window.contract.buy_pet({ _id: id });
  };

  return (
    <>
      <p>&nbsp;</p>
      {pets.length == 0 ? (
        <div class="centered">Pet Shop is Empty !!!</div>
      ) : (
        <Row xs={1} md={3} className="g-4">
          {pets.map((v, k) => (
            <Col>
              <Card style={{ margin: "15px" }}>
                <Card.Header>{v.breed}</Card.Header>
                <Card.Img variant="top" src={v.pic} />
                <Card.Body>
                  <Card.Title>{v.breed}</Card.Title>
                  <Card.Text>Owner: {v.owner}</Card.Text>

                  <Card.Text>Age: {v.age}</Card.Text>

                  <Card.Text>
                    Price: {utils.format.formatNearAmount(v.price)} NEAR
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                  <Button onClick={() => buyPet(v.id)}>Buy Now</Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default Marketplace;
