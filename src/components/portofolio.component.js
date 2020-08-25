import React, { Component } from "react";
import '../App.css';

import portofolioService from "../services/portofolio.service";
import { Spinner } from 'react-bootstrap';

import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";

// import { LazyLoadImage as Img } from 'react-lazy-load-image-component';
// import 'react-lazy-load-image-component/src/effects/blur.css';

export default class Portofolio extends Component {

    
    constructor(props) {
        super(props);
        
        this.retrievePortofolio = this.retrievePortofolio.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.parralax = this.parralax.bind(this);
        
        
        this.state = {
            portofolios: [],
            show: false,
            title: "",
            imageModalUrl: "",
            description: "",
            isLoading: true,
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        window.addEventListener('scroll', this.parralax);
        this.retrievePortofolio();
    }

    retrievePortofolio() {
        portofolioService.index()
        .then(response => {
            this.setState({
                portofolios: response.data,
                isLoading: false,
            });
        })
        .catch(e => {
            console.log(e);
        });
    }

    closeModal() { 
        this.setState({
            show: false,
        });
    }

    showModal(data) {
        this.setState({
            show: true,
            title: data.title,
            imageModalUrl: data.imageUrl,
            description: data.description,
        });
    }

    async parralax () {

        try {
            let yPos;
            let top = window.pageYOffset;
    
            let element = document.getElementsByClassName('text-background')[0];
        
            yPos = -(top * 30 / 100);
            element.setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px)');
        } catch (error) {
            
        }
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>Portofolio - MF.</title>
                    <meta name="description" value="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum quae cumque odit corporis officia consequatur commodi deleniti quisquam facilis error?"></meta>
                </Helmet>
                <div className="container-fluid mb-5">
                    <div className="container">
                        <div className="row h-banner-100vh align-items-center order-1 justify-content-center">
                            <div className="text-background align-self-end">
                                <h1>"THE PORTOFOLIO.</h1>
                            </div>
                            <div className="col-md-6 order-1 order-md-1">
                                <h3 className="display-4 font-weight-bold banner-title wow fadeInUp">Portofolio</h3>
                                <p className="banner-text">
                                    Some of the them are just for learning purposes and the rests are real projects!
                                </p>
                            </div>
                        </div>
                        { this.state.isLoading ? 
                            <Spinner animation="border" role="status" className="mx-auto spinner-loading d-block">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                            : 
                            <div className="card-columns" id="portofolio-list">
                                {this.state.portofolios.map((portofolio) => (
                                    <div className="card border-0 rounded-0" key={portofolio._id}>
                                        <div className="card-img">
                                            <Link to="/portofolio/satu">
                                                <div className="portofolio-image-description-hint">
                                                    <div className="portofolio-image-description" dangerouslySetInnerHTML={{ __html: portofolio.description }} />
                                                </div>
                                                <img
                                                src={portofolio.imageUrl}
                                                alt=""
                                                effect="blur"
                                                className="w-100" />
                                            </Link>
                                        </div>
                                        <div className="card-body">
                                            <h3>{portofolio.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                {/* <Modal show={this.state.show} animation={true} onHide={this.closeModal} size="lg" dialogClassName="modal-dialog-centered" className="">
                    <Modal.Body className="p-0">
                        <div className="closeButton" onClick={this.closeModal}>
                            <button>&times;</button>
                        </div>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-6 p-0">
                                    <img src={this.state.imageModalUrl} className="w-100" alt="" />
                                </div>
                                <div className="col-md-6 pt-sm-0 pt-md-4 ">
                                    <div className="container">
                                        <h4 className="mt-3">{ this.state.title }</h4>
                                        <hr />
                                        <div dangerouslySetInnerHTML={{ __html: this.state.description }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal> */}
            </>
        );
    }
}