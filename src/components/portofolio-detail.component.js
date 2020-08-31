import React, { Component } from 'react';

import { Helmet } from 'react-helmet';
import { Spinner } from 'react-bootstrap';

import moment from 'moment';

import Carousel from 'nuka-carousel';

import portofolioService from '../services/portofolio.service';

class PortofolioDetail extends Component {

    constructor(props) {
        super(props);

        this.parralax = this.parralax.bind(this);
        this.getPortofolio = this.getPortofolio.bind(this);

        this.state = {
            isLoading: false,
            title: "",
            description: "",
            thumbnail: "",
            content: "",
            images: [],
            created_date: "",
        }
    }

    componentDidMount() {
        window.scrollTo(0,0);
        window.addEventListener('scroll', this.parralax);

        this.getPortofolio(this.props.match.params.slug);
    }

    getPortofolio(slug) {
        portofolioService.detail(slug)
        .then(res => {
            this.setState({
                title: res.data.title,
                description: res.data.description,
                thumbnail: res.data.imageUrl,
                content: res.data.content,
                images: res.data.images,
                created_date: res.data.created_date,
                isLoading: false,
            });
        })
        .catch(err => {
            console.log(err);
        });
    }

    parralax () {

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
                    <title>{ this.state.title } - MF.</title>
                    <meta name="description" content={ this.state.description } />
                </Helmet>
                <div>

                    <div className="container">
                        <div className="row h-banner-100vh align-items-center justify-content-center">
                            { this.state.isLoading ? 
                                <Spinner animation="border" role="status" className="mx-auto d-block">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            :
                                <>
                                <div className="image-background">
                                    <img src={ this.state.thumbnail } alt="" className="" />
                                </div>
                                <div className="col-md-6">
                                    <h3 className="display-4 font-weight-bold banner-title wow fadeInUp">{ this.state.title }</h3>
                                    <p className="banner-text mt-4">
                                        { this.state.description }
                                    </p>
                                </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="row justify-content-center mb-5 bg-white">
                        <div className="col-md-8">
                            <h2 className="mb-2">About This Project</h2>
                        </div>
                        <div className="col-md-6 order-2 order-md-1 my-3">
                            <div className="">
                                <Carousel
                                    slideIndex={this.state.slideIndex}
                                    afterSlide={slideIndex => this.setState({ slideIndex })}
                                    autoplay={true}
                                    wrapAround={true} >
                                    { this.state.images.map((img, index) => (
                                        <img src={img} alt="" key={index} />
                                    )) }
                                </Carousel>
                            </div>
                            <div className="mt-4" dangerouslySetInnerHTML={{__html: this.state.content}} />
                        </div>
                        <div className="col-md-2 my-3 order-1 order-md-2">
                            <h5>Title</h5>
                            <p>{ this.state.title }</p>
                            <h5>Date</h5>
                            <p>{ moment(this.state.created_date).format('MMM, YYYY') }</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default PortofolioDetail;