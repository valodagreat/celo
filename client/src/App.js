import React, { Component } from "react";
import MarketPlaceContract from "./contracts/MarketPlace.json";
import getWeb3 from "./getWeb3";
import { newKitFromWeb3 } from '@celo/contractkit';
import BigNumber from "bignumber.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Blockies from 'react-blockies';

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MarketPlaceContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MarketPlaceContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  connectCeloWallet = async function () {
  if (window.celo) {
      setNot("⚠️ Please approve this DApp to use it.");
    try {
      await window.celo.enable()
      setNot("");

      const nweb3 = new Web3(window.celo)
      setKit(newKitFromWeb3(nweb3));

    } catch (error) {
      setNot(`⚠️ ${error}.`)
    }
  } else {
    setNot("⚠️ Please install the CeloExtensionWallet.")
  }
}

  notification = () => {
    if(not){
      return(
        <div className="alert alert-warning sticky-top mt-2" role="alert">
          <span id="notification">{not}</span>
        </div>
      )
    }else{
      return null
    }
  }

  renderProducts = (product) => {
    return (
      <div className="col-md-4">
        <Card className="mb-4">
          <Card.Img variant="top" src={`${product.image}`} />
            <div className="position-absolute top-0 end-0 bg-warning mt-4   px-2 py-1 rounded-start">
            ${product.sold} Sold
            </div>
          <Card.Body className ="text-left p-4 position-relative">
            <div className="translate-middle-y position-absolute top-0">
              ${identiconTemplate(product.owner)}
            </div>
            <Card.Title className="fs-4 fw-bold mt-2">
              {product.name}
            </Card.Title>
            <Card.Text className="mb-4" style={{minHeight: "82px"}}>
              {product.description} 
            </Card.Text>
            <Card.Text className="mt-4">
              <i className="bi bi-geo-alt-fill"></i>
              <span>{product.location}</span>
            </Card.Text>
            <div className="d-grid gap-2">
              <button className="btn btn-lg btn-outline-dark buyBtn fs-6 p-3" >
                Buy for ${product.price} cUSD
              </button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }


  identiconTemplate =(_address) => { 

    return (
    <div class="rounded-circle overflow-hidden d-inline-block border border-white border-2 shadow-sm m-0">
      <a href={`https://alfajores-blockscout.celo-testnet.org/address/${_address}/transactions`}
          target="_blank">
          <Blockies
            seed={_address} 
            size={8} 
            scale={16}
          />
      </a>
    </div>
    )
}

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="container mt-2" >
      <nav className="navbar bg-white navbar-light">
        <div className="container-fluid">
          <span className="navbar-brand m-0 h4 fw-bold">Street Food Kigali</span>
          <span className="nav-link border rounded-pill bg-light">
            <span id="balance">21</span>
            cUSD
          </span>
        </div>
      </nav>

      {notification()}

      <div className="mb-4" style={{"marginTop": "4em"}}>
        <button
          className="btn btn-dark rounded-pill"
          onClick={handleShow}
        >
          Add product
        </button>
      </div>

      <main id="marketplace" className="row"></main>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="col">
              <Form.Control className="mb-2" type="text" placeholder="Enter name of product" value={name} onChange={(e)=> setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="col">
              <Form.Control className="mb-2" type="text" placeholder="Enter image url" value={image} onChange={(e)=> setImage(e.target.value)} />
            </Form.Group>
            <Form.Group className="col">
              <Form.Control className="mb-2" type="text" placeholder="Enter product description" value={description} onChange={(e)=> setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="col">
              <Form.Control className="mb-2" type="text" placeholder="Enter product category" value={category} onChange={(e)=> setCategory(e.target.value)} />
            </Form.Group>
            <Form.Group className="col">
              <Form.Control className="mb-2" type="text" placeholder="Enter product price" value={price} onChange={(e)=> setPrice(e.target.value)} />
            </Form.Group>
            <Form.Group className="col">
              <Form.Control className="mb-2" type="text" placeholder="Enter the product's count in stock" value={countInStock} onChange={(e)=> setCountInStock(e.target.value)}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-light border" onClick={handleClose}>
            Close
          </Button>
          <Button className="btn btn-dark" onClick={handleClose}>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    );
  }
}

export default App;
