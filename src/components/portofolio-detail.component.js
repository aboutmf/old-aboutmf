import React, { Component } from 'react';

import { Helmet } from 'react-helmet';
import { Spinner } from 'react-bootstrap';
import Carousel from 'nuka-carousel';

class PortofolioDetail extends Component {

    constructor(props) {
        super(props);

        this.parralax = this.parralax.bind(this);

        this.state = {
            isLoading: false
        }
    }

    componentDidMount() {
        window.scrollTo(0,0);
        window.addEventListener('scroll', this.parralax);

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
        return(
            <>
                <Helmet>
                    <title>Project Pertama - MF.</title>
                    <meta name="description" content="Ini isinya projectkloh" />
                </Helmet>
                <div className="container-fluid mb-5">
                    <div className="container">
                        <div className="row h-banner-100vh align-items-center justify-content-center">
                            { this.state.isLoading ? 
                                <Spinner animation="border" role="status" className="mx-auto d-block">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            :
                                <>
                                <div className="text-background">
                                    <img src="https://bridge311.qodeinteractive.com/wp-content/uploads/2020/01/p1-img-01.jpg" alt="" className="" />
                                </div>
                                <div className="col-md-6">
                                    <h3 className="display-4 font-weight-bold banner-title wow fadeInUp">PROJECT PERTAMA</h3>
                                    <p className="banner-text mt-4">
                                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos cum architecto repellat itaque laudantium. Sed.
                                    </p>
                                </div>
                                </>
                            }
                        </div>
                        <div className="row">
                            <div className="col-md-8 my-2">
                                <h3 className="mb-3">About This Project</h3>
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos cum architecto repellat itaque laudantium. Sed. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos cum architecto repellat itaque laudantium. Sed. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos cum architecto repellat itaque laudantium. Sed.</p>
                                <div className="my-5">
                                    <Carousel
                                        slideIndex={this.state.slideIndex}
                                        afterSlide={slideIndex => this.setState({ slideIndex })}
                                        // renderCenterLeftControls={({ previousSlide }) => (
                                        // <button onClick={previousSlide}>
                                        //     <i className="fa fa-arrow-left" />
                                        // </button>
                                        // )}
                                        // renderCenterRightControls={({ nextSlide }) => (
                                        // <button onClick={nextSlide}>
                                        //     <i className="fa fa-arrow-right"/>
                                        // </button>
                                        // )}
                                        >
                                        <img src="https://demo.qodeinteractive.com/bridge25/wp-content/uploads/2013/10/p-project1-01.jpg" alt="" />
                                        <img src="https://demo.qodeinteractive.com/bridge25/wp-content/uploads/2013/10/p-project1-02.jpg" alt="" />
                                        <img src="https://demo.qodeinteractive.com/bridge25/wp-content/uploads/2013/10/p-project1-03.jpg" alt="" />
                                    </Carousel>
                                </div>
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos cum architecto repellat itaque laudantium. Sed. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos cum architecto repellat itaque laudantium. Sed. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos cum architecto repellat itaque laudantium. Sed.</p>
                            </div>
                            <div className="col-md-4 my-2">
                                <h5>Title</h5>
                                <p>Project Pertama</p>
                                <h5>Date</h5>
                                <p>Jan, 2020</p>
                                <h5>Category</h5>
                                <p>Web Design</p>
                                <h5>Link</h5>
                                <p>https://google.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default PortofolioDetail;