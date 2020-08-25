import React, { Component } from "react";
import '../App.css';

import BlogDataService from '../services/blog.service';
import { Helmet } from 'react-helmet';
import { Spinner } from 'react-bootstrap';
// import { Redirect } from "react-router-dom";
import NotFound from './shared/NotFound.component';

export default class BlogDetail extends Component {

    constructor(props) {
        super(props);

        this.getBlogDetail = this.getBlogDetail.bind(this);
        this.parralax = this.parralax.bind(this);

        this.state = {
            id: "",
            slug: "",
            blogTitle: "",
            blogDescription: "",
            blogContent: "",
            blogThumbnail: "",
            createdBy: "",
            isLoading: true,
            notFound: false,
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        window.addEventListener('scroll', this.parralax);
        this.getBlogDetail(this.props.match.params.slug);
    }

    async getBlogDetail(slug) {
        await BlogDataService.detail(slug)
        .then(res => {
            if (res.data === null || res.data.published !== true) {
                this.setState({
                    isLoading: false,
                    notFound: true,
                });
            } else {
                this.setState({
                    id: res.data._id,
                    blogTitle: res.data.title,
                    blogThumbnail: res.data.thumbnail,
                    blogDescription: res.data.description,
                    blogContent: res.data.content,
                    createdBy: res.data.created_by,
                    isLoading: false,
                });
            }
        })
        .catch(e => {
            this.setState({
                notFound: true
            });
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
        
        if (this.state.notFound){
            return (
                <>
                    <Helmet>
                        <title>{ this.state.blogTitle } - MF.</title>
                        <meta name="description" content={ this.state.blogDescription } />
                    </Helmet>
                    <NotFound />
                </>
            );

        }

        return (
            <>
                <Helmet>
                    <title>{ this.state.blogTitle } - MF.</title>
                    <meta name="description" content={ this.state.blogDescription } />
                </Helmet>
                <div className="container-fluid">
                    <div className="container">
                        <div className="row h-banner-100vh position-relative align-items-center justify-content-center">
                            { this.state.isLoading ? 
                                <Spinner animation="border" role="status" className="mx-auto d-block">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            :
                                <>
                                <div className="text-background">
                                    <img src={ this.state.blogThumbnail ?? "https://bridge311.qodeinteractive.com/wp-content/uploads/2020/01/p1-img-01.jpg"} alt="" className="" />
                                </div>
                                <div className="col-md-6">
                                    <h3 className="display-4 font-weight-bold banner-title wow fadeInUp" dangerouslySetInnerHTML={{ __html: this.state.blogTitle }} />
                                    <p className="banner-text mt-4">
                                        { this.state.blogDescription } This article was published by <strong>{ this.state.createdBy }</strong>.
                                    </p>
                                </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="row justify-content-center mb-5">
                        <div className="col-md-8 mb-5 blog-text">
                            <div dangerouslySetInnerHTML={{ __html: this.state.blogContent }} />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}