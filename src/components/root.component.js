import React from 'react';
import { HashRouter as Router, Route, Switch, NavLink, Link } from 'react-router-dom';
import { Modal, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './home.component';
import About from './about.component';
import AboutResume from './resume.component';
import Portofolio from './portofolio.component';
import PortofolioDetail from './portofolio-detail.component';
import Blog from './blog.component';
import BlogDetail from './blog-detail.component';


import NotFound from './shared/NotFound.component';

import Login from './admin/login.component';
import Admin from './admin/admin.component';
import AdminBlog from './admin/blog.component';
import AdminBlogCreate from './admin/blog-create.component';
import AdminBlogDetail from './admin/blog-detail.component';
import AdminPortofolio from './admin/portofolio.component';

import ContactSVG from '../assets/img/laravel.png'

import PrivateRoute from "../private-routes/PrivateRoutes";
import { Component } from 'react';

import { logoutUser } from "../actions/authActions";
import store from '../store';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Root extends Component {

    constructor(props) {
        super(props);
    
        this.contactShow = this.contactShow.bind(this);
        this.contactHide = this.contactHide.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.setNavExpand = this.setNavExpand.bind(this);
        this.logout = this.logout.bind(this);
    
        this.state = {
          contactStatus: false,
          navExpand: false,
        };
      }
    
      componentDidMount() {

      }
    
      contactShow() {
        this.setState({
          contactStatus: true,
        });
      }
    
      setNavExpand() {
        if (window.innerWidth < 576) {
          this.setState({
            navExpand: !this.state.navExpand ?? "expanded"
          });
        }
      }
    
      contactHide() {
        this.setState({
          contactStatus: false,
        });
      }
    
      logout() {
        store.dispatch(logoutUser());
      }
    
      scrollToTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    
    render() {
        return(
            <>
                <Router>

                    <Navbar bg="white" onToggle={this.setNavExpand} expanded={this.state.navExpand} expand="lg" className="navbar navbar-expand-sm navbar-light py-3">
                        <Container>
                            <Navbar.Brand href="">MF.</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mx-auto">
                                    { !this.props.auth.isAuthenticated ? (
                                        <>
                                        <Nav.Item onClick={this.setNavExpand}>
                                            <NavLink className="nav-link" exact={true} activeClassName="active" to="/">Home</NavLink>
                                        </Nav.Item>
                                        <Nav.Item onClick={this.setNavExpand}>
                                            <NavLink className="nav-link" exact={true} activeClassName="active" to="/about">About</NavLink>
                                        </Nav.Item>
                                        <Nav.Item onClick={this.setNavExpand}>
                                            <NavLink className="nav-link" exact={true} activeClassName="active" to="/portofolio">Portofolio</NavLink>
                                        </Nav.Item>
                                        <Nav.Item onClick={this.setNavExpand}>
                                            <NavLink className="nav-link" exact={true} activeClassName="active" to="/blog">Blog</NavLink>
                                        </Nav.Item>
                                        </>
                                    ) : (
                                        <>
                                        <Nav.Item onClick={this.setNavExpand}>
                                            <NavLink className="nav-link" exact={true} activeClassName="active" to="/admin">Home</NavLink>
                                        </Nav.Item>
                                        <Nav.Item onClick={this.setNavExpand}>
                                            <NavLink className="nav-link" exact={true} activeClassName="active" to="/admin/blogs">Blog</NavLink>
                                        </Nav.Item>
                                        <Nav.Item onClick={this.setNavExpand}>
                                            <NavLink className="nav-link" exact={true} activeClassName="active" to="/admin/portofolios">Portofolio</NavLink>
                                        </Nav.Item>
                                        <NavDropdown title="User" id="basic-nav-dropdown">
                                            <NavLink onClick={this.setNavExpand} className="dropdown-item" exact={true} to="/" activeClassName="active">Home</NavLink>
                                            <NavLink onClick={this.setNavExpand} className="dropdown-item" exact={true} to="/about" activeClassName="active">About</NavLink>
                                            <NavLink onClick={this.setNavExpand} className="dropdown-item" exact={true} to="/portofolio" activeClassName="active">Portofolio</NavLink>
                                            <NavLink onClick={this.setNavExpand} className="dropdown-item" exact={true} to="/blog" activeClassName="active">Blog</NavLink>
                                        </NavDropdown>
                                        </>
                                    ) }
                                </Nav>
                                <div className="my-2 my-lg-0">
                                <ul className="navbar-nav m-sm-auto mt-2 mt-lg-0">
                                    <li className="nav-item active" onClick={this.setNavExpand}>
                                        { this.props.auth.isAuthenticated ? (
                                        <NavLink className="nav-link" to="#" onClick={this.logout}>Logout &mdash;</NavLink>
                                        ) : (
                                        <NavLink className="nav-link" to="#" onClick={this.contactShow}>Hire me &mdash;</NavLink>
                                        ) }
                                    </li>
                                </ul>
                            </div>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>

                    <div className="container-fluid">
                        <Switch>
                            <Route exact path={"/"} component={Home} />
                            <Route exact path={"/about"} component={About} />
                            <Route exact path={"/about/resume"} component={AboutResume} />
                            <Route exact path={"/portofolio"} component={Portofolio} />
                            <Route exact path={"/portofolio/:slug"} component={PortofolioDetail} />
                            <Route exact path={"/blog"} component={Blog} />
                            <Route exact path={"/blog/:slug"} component={BlogDetail} />

                            <Route exact path={"/login"} component={Login} />
                            <PrivateRoute exact path={"/admin"} component={Admin} />
                            <PrivateRoute exact path={"/admin/portofolios"} component={AdminPortofolio} />
                            <PrivateRoute exact path={"/admin/blogs"} component={AdminBlog} />
                            <PrivateRoute exact path={"/admin/blogs/create"} component={AdminBlogCreate} />
                            <PrivateRoute exact path={"/admin/blogs/:id"} component={AdminBlogDetail} />
                            <Route component={NotFound} status={404} />
                        </Switch>
                    </div>

                    <footer>
                        <div className="container px-5">
                        <div className="row justify-content-center">
                            <div className="col-md-3 my-2">
                            <h4>General</h4>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/portofolio">Portofolio</Link></li>
                                <li><Link to="/blog">Blog</Link></li>
                            </ul>
                            </div>
                            <div className="col-md-3 my-2">
                            <h4>Extras</h4>
                            <ul>
                                <li><Link to="/">Uses</Link> <span className="badge">COMING SOON</span></li>
                                <li><Link to="/">Reading</Link> <span className="badge">COMING SOON</span></li>
                            </ul>
                            </div>
                            <div className="col-md-3 my-2">
                            <h4>Connect</h4>
                            <ul>
                                <li><Link to="/">LinkedIn</Link></li>
                                <li><Link to="/">Instagram</Link></li>
                                <li><Link to="/">Email</Link></li>
                            </ul>
                            </div>
                            <div className="col-md-3 my-2">
                            <div className="d-flex align-items-end flex-column h-100">
                                <h4 className="font-weight-bold back-to-top"><span  onClick={this.scrollToTop}>&#8593;</span></h4>
                                <div className="mt-auto p-2">
                                <small>Originally Build with <span className="text-danger">&hearts;</span> by MF 2020</small>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </footer>

                    <Modal show={this.state.contactStatus} animation={true} onHide={this.contactHide} size="lg" className="bg-white" dialogClassName="modal-dialog-centered" backdrop="static">
                        <Modal.Body className="p-0 shadow-sm">
                            <div className="closeButton" onClick={this.contactHide}>
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
                                        <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={this.contactHide}>Send me an email</button>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </Router>
            </>
        )
    }
}

PrivateRoute.propTypes = {
    auth: PropTypes.object
};


const mapStateToProps = state => ({
    auth: state.auth
}); 

export default connect(mapStateToProps)(Root);