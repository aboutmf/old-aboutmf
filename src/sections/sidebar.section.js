import React, { Component } from 'react';

import { NavLink, Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Modal } from 'react-bootstrap';

import { connect } from 'react-redux';
import store from '../store';

import { logoutUser } from '../actions/authActions';

import ContactSVG from '../assets/img/laravel.png'

class SidebarSection extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);

        this.state = {
            contactStatus: false,
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
                <div className="bg-white border-right" id="sidebar-wrapper">
                    <div className="sidebar-heading"><b>MF.</b> Admin </div>
                    <div className="list-group list-group-flush">
                        <NavLink to="/admin" exact className="list-group-item list-group-item-action border-0" replace>Dashboard</NavLink>
                        <NavLink to="/admin/blogs" className="list-group-item list-group-item-action border-0" replace>Blogs</NavLink>
                        <NavLink to="/admin/portofolios" className="list-group-item list-group-item-action border-0" replace>Portofolios</NavLink>
                    </div>
                </div>

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

export default connect(mapStateToProps)(SidebarSection);