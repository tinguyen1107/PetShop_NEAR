
import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'

import Marketplace from './Components/marketplace';
import MyPet from './Components/mypet';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import {
    Container, 
    Navbar,
    Nav,
} from 'react-bootstrap';

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
    return (
        <Router>

        <Navbar bg="primary" variant="dark">
            <Container>
            <Navbar.Brand href="/">The Pet Shop</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/me">My Pet</Nav.Link>
                <Nav.Link onClick={window.accountId === '' ? login : logout}>{window.accountId === '' ? 'Login' : window.accountId}</Nav.Link>
            </Nav>
            </Container>
        </Navbar>

        <Switch>
            <Route exact path='/'>
                <Marketplace/> 
            </Route>   
            <Route exact path='/me'>
                <MyPet/>
            </Route>    
        </Switch>
        </Router>
    ); 
}

