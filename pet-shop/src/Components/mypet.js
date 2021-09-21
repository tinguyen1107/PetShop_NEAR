import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Container,
  Button,
  Row,
  Modal,
  Col,
  Card,
} from "react-bootstrap";
import { render } from "react-dom";
import * as nearAPI from "near-api-js";
const { utils } = nearAPI;

const MyPet = () => {
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const breed = useRef();
  const age = useRef();
  const imgUrl = useRef();
  const price = useRef();
  const newPrice = useRef();

  let sellPetId = 0;

  useEffect(() => {
    async function getPets() {
      let owner_id = window.accountId;
      let pets = await window.contract.get_pets_by_owner({ _owner: owner_id });
      setPets(pets);
    }
    getPets();
  }, []);

  const createPet = async () => {
    let priceInYoctoNear = utils.format.parseNearAmount(price.current.value);
    await window.contract.new_pet({
      _breed: breed.current.value,
      _age: age.current.value,
      _pic: imgUrl.current.value,
      _price: priceInYoctoNear,
    });
  };

  const showSellPetModal = (id) => {
    setShowModal(true);
    sellPetId = id;
  };

  const handleSellPet = async () => {
    let priceInYoctoNear = utils.format.parseNearAmount(newPrice.current.value);
    await window.contract.sell_pet({
      _id: sellPetId,
      _price: priceInYoctoNear,
    });
    handleClose();
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const hideFromMarketPlace = async (id) => {
    await window.contract.hide_pet_from_marketplace({ _id: id });
  };

  return (
    <>
      <p>&nbsp;</p>

      <Container style={{ marginTop: "10px", height: "100%" }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Breed/Name</Form.Label>
            <Form.Control
              ref={breed}
              placeholder="Enter Breed/Name"
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control ref={age} placeholder="Enter Age"></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image Url</Form.Label>
            <Form.Control
              ref={imgUrl}
              placeholder="Enter Image Url"
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control ref={price} placeholder="Enter Price"></Form.Control>
          </Form.Group>

          <Row style={{ margin: "5vh" }}>
            <Button onClick={createPet} variant="primary">
              Create
            </Button>
          </Row>
        </Form>
      </Container>

      {pets.length == 0 ? (
        <></>
      ) : (
        <Row xs={1} md={3} className="g-4">
          {pets.map((v, k) => (
            <Col>
              <Card style={{ margin: "15px" }}>
                <Card.Header>{v.breed}</Card.Header>
                <Card.Img variant="top" src={v.pic} />
                <Card.Body>
                  <Card.Text>Owner: {v.owner}</Card.Text>

                  <Card.Text>Age: {v.age}</Card.Text>

                  <Card.Text>
                    Price: {utils.format.formatNearAmount(v.price)} NEAR
                  </Card.Text>

                  <Card.Text>
                    Visible: {v.price > 0 ? "true" : "false"}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                  <Button
                    onClick={() =>
                      v.price > 0
                        ? hideFromMarketPlace(v.id)
                        : showSellPetModal(v.id)
                    }
                  >
                    {v.price > 0 ? "Hide pet" : "Sell"}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Set a new price for your pet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>NewPice: </Form.Label>
            <Form.Control
              ref={newPrice}
              placeholder="Enter Price"
            ></Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSellPet()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyPet;
