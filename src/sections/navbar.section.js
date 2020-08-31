import React, { Component } from 'react';

import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Modal } from 'react-bootstrap';

import { connect } from 'react-redux';
import store from '../store';

import { logoutUser } from '../actions/authActions';

import ContactSVG from '../assets/img/laravel.png'

class NavbarSection extends Component {

    constructor(props) {
        super(props);

        this.setNavExpand = this.setNavExpand.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            navExpand: false,
            contactStatus: false,
        }
    }

    setNavExpand() {
        if (window.innerWidth < 576) {
            this.setState({
                navExpand: !this.state.navExpand ?? "expanded"
            });
        }
    }

    contactShow = () => {
        this.setState({
            contactStatus: !this.state.contactStatus
        });
    }

    logout = () => {
        store.dispatch(logoutUser());
    }

    render() {
        return (
            <>
                <Navbar bg="white" onToggle={this.setNavExpand} expanded={this.state.navExpand} expand="lg" className="navbar navbar-expand-sm navbar-light py-3">
                    <Container>
                        <Navbar.Brand href="">MF.</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mx-auto">
                                    <Nav.Item onClick={this.setNavExpand}>
                                        <NavLink className="nav-link" exact={true} activeClassName="active" to="/">Home</NavLink>
                                    </Nav.Item>
                                    <Nav.Item onClick={this.setNavExpand}>
                                        <NavLink className="nav-link" exact={true} activeClassName="active" to="/about">About</NavLink>
                                    </Nav.Item>
                                    <Nav.Item onClick={this.setNavExpand}>
                                        <NavLink className="nav-link" exact={false} activeClassName="active" to="/portofolio">Portofolio</NavLink>
                                    </Nav.Item>
                                    <Nav.Item onClick={this.setNavExpand}>
                                        <NavLink className="nav-link" exact={false} activeClassName="active" to="/blog">Blog</NavLink>
                                    </Nav.Item>
                                    { this.props.auth.isAuthenticated && (
                                        <>
                                            <Nav.Item onClick={this.setNavExpand}>
                                                <NavLink className="nav-link" exact={true} activeClassName="active" to="/admin">Admin</NavLink>
                                            </Nav.Item>
                                        </>
                                    ) }
                            </Nav>
                            <div className="my-2 my-lg-0">
                            <ul className="navbar-nav m-sm-auto mt-2 mt-lg-0">
                                <li className="nav-item active" onClick={this.setNavExpand}>
                                    <NavLink className="nav-link" to="#" onClick={this.contactShow}>Hire me &mdash;</NavLink>
                                </li>
                            </ul>
                        </div>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Modal show={this.state.contactStatus} animation={true} onHide={this.contactShow} size="lg" className="bg-white" dialogClassName="modal-dialog-centered" backdrop="static">
                    <Modal.Body className="p-0 shadow-sm">
                        <div className="closeButton" onClick={this.contactShow}>
                        <button>&times;</button>
                        </div>
                        <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6 p-0">
                            <img src={ContactSVG} alt="" className="w-100 shadow-sm" />
                            </div>
                            <div className="col-md-6 p-0">
                                <div className="p-4 px-md-4">
                                <div>
                                    <p>If you are really interested with me for joining into your working space. Don't hesitate yourself to
                                    get in touch with me on <b>mf.about@gmail.com</b>. I'll be happy to receive it.</p>
                                    <div className="text-left mt-3 align-self-baseline">
                                    <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={this.contactShow}>Send me an email</button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
}); 

export default connect(mapStateToProps)(NavbarSection);