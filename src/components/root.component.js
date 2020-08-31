import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, withRouter, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as Icon from 'react-bootstrap-icons';

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
import AdminPortofolioCreate from './admin/portofolio-create.component';
import AdminPortofolioDetail from './admin/portofolio-detail.component';

import PrivateRoute from "../private-routes/PrivateRoutes";

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavbarSection from '../sections/navbar.section';
import FooterSection from '../sections/foooter.section';
import SidebarSection from '../sections/sidebar.section';
import store from '../store';
import { logoutUser } from '../actions/authActions';

class Root extends Component {

    constructor(props) {
        super(props);

        this.setNavExpand = this.setNavExpand.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            navExpand: false,
            adminNavbar: false
        }
    }

    componentDidMount() {
        
    }

    setAdminNavbar = () => {
        this.setState({
            adminNavbar: this.state.adminNavbar === "toggled" ? false : "toggled"
        });
    }

    setNavExpand = () => {
        this.setState({
            navExpand: !this.state.navExpand
        })
    }

    logout = () => {
        store.dispatch(logoutUser());
    }
    
    render() {
        const isAdmin = (this.props.location.pathname).split('/').includes('admin');

        return(
            <div className={ ((isAdmin && this.props.auth.isAuthenticated) ? "d-flex " : "") + (this.state.adminNavbar) } id="wrapper">

                { (isAdmin && this.props.auth.isAuthenticated) ? (
                    <SidebarSection />
                ) : (
                    <NavbarSection />
                ) }
                
                <div id={ (isAdmin && this.props.auth.isAuthenticated) ? "page-content-wrapper" : ""}>

                    { (isAdmin && this.props.auth.isAuthenticated) && (
                        <nav className="navbar navbar-expand-sm navbar-light bg-white shadow-sm admin-navbar fixed-top">
                            <button className="btn btn-primary" id="menu-toggle" onClick={ this.setAdminNavbar }>
                                <Icon.ListNested />
                            </button>

                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item active">
                                    <button onClick={this.logout} className="btn border-0 shadow-none btn-icon"><Icon.BoxArrowInRight /> Logout</button>
                                </li>
                            </ul>
                        </nav>
                    ) }

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
                        <PrivateRoute exact path={"/admin/portofolios/create"} component={AdminPortofolioCreate} />
                        <PrivateRoute exact path={"/admin/portofolios/:id"} component={AdminPortofolioDetail} />
                        <PrivateRoute exact path={"/admin/blogs"} component={AdminBlog} />
                        <PrivateRoute exact path={"/admin/blogs/create"} component={AdminBlogCreate} />
                        <PrivateRoute exact path={"/admin/blogs/:id"} component={AdminBlogDetail} />

                        <Route component={NotFound} status={404} />
                    </Switch>
                </div>

                
                { ( isAdmin && this.props.auth.isAuthenticated) || (
                    <FooterSection />
                ) }
                    
            </div>
        )
    }
}

PrivateRoute.propTypes = {
    auth: PropTypes.object
};


const mapStateToProps = state => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(Root));