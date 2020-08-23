import React, { Component } from "react";
import '../App.css';

import { Helmet } from 'react-helmet';

import Cube from '../83_prominent.jpg';

export default class Home extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {

        return (
            <>
                <Helmet>
                    <title>Home - MF.</title>
                    <meta name="description" value="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum quae cumque odit corporis officia consequatur commodi deleniti quisquam facilis error?"></meta>
                </Helmet>
                <div className="container-fluid">
                    <div className="container">
                        <div className="row h-banner-100vh align-items-center order-1 justify-content-center">
                            <div className="col-md-6 order-2 order-md-1">
                                <h3 className="display-4 font-weight-bold banner-title wow fadeInUp">Hi, I'm Muhamad Firmansyah</h3>
                                <p className="banner-text mt-4">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta asperiores minus autem eveniet necessitatibus. Eveniet architecto quasi error. Eum eaque repellendus exercitationem incidunt voluptatibus aut consectetur totam reiciendis commodi distinctio!
                                </p>
                            </div>
                            <div className="col-md-4 order-1 d-none d-md-block order-md-2">
                                <img src={Cube} alt="" className="w-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}