import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class Login extends Component {

    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.login = this.login.bind(this);

        this.state = {
            username: "",
            password: "",
            error: "",
            errors: {}
        }
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/admin");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/admin");
        }

        if (nextProps.error) {
            this.setState({
                errors: nextProps.error
            });
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }


    login() {
        const userData = {
            username: this.state.username,
            password: this.state.password
        }

        this.props.loginUser(userData);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="container">
                    <div className="row h-banner-100vh align-items-center order-1 justify-content-center">
                        <div className="col-md-4 order-1 order-md-1">
                            <h3 className="text-center">MF. Login</h3>
                            <div className="mt-5" id="login">
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input onChange={this.onChangeUsername} type="text" id="username" className="form-control" name="username" autoComplete="off" autoFocus />
                                </div>
                                <div className="form-group mt-4">
                                    <label htmlFor="password">Password</label>
                                    <input onChange={this.onChangePassword} type="password" id="password" className="form-control" name="password" />
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <div>
                                        <small className="text-small mt-2 d-block">{this.state.error === "" ? "Selamat datang, silahkan login!" : this.state.error }</small>
                                    </div>
                                    <div>
                                        <button className="btn btn-light shadow-sm" onClick={() => this.login()}>Login</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser }
)(Login);