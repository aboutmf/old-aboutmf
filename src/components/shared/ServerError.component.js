import React, { Component } from "react";
import {Link} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../../App.css';


export default class ServerError extends Component {

    constructor(props) {
        super(props);

        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    goBack() {
        this.props.history.goBack();
    }

    render() {

        return (
            <>
                <Helmet>
                    <title>500 Server Error - MF.</title>
                </Helmet>
                
                <div className="container-fluid">
                    <div className="container">
                        <div className="row h-banner-100vh align-items-center order-1 justify-content-center">
                            <div className="col-md-6">
                                <h3 className="display-4 font-weight-bold"><span className="">500</span> Server Error</h3>
                                <div className="d-flex align-items-center">
                                    <Link to="/" className="nav-link p-0 text-dark d-flex align-items-center">
                                        <h4 className="m-0 mr-2">&#8592;</h4> <div className="m-0 font-weight-bold">Go Home</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}