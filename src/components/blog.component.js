import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import BlogDataService from '../services/blog.service';
import '../App.css';

// import Cube from '../assets/img/blog.png';
import { Helmet } from "react-helmet";

export default class Blog extends Component {

    constructor(props) {
        super(props);

        this.getBlogs = this.getBlogs.bind(this);
        this.parralax = this.parralax.bind(this);

        this.state = {
            blogs: [],
            isLoading: true,
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        window.addEventListener('scroll', this.parralax);
        this.getBlogs();
    }

    async getBlogs() {
        await BlogDataService.index()
        .then(res => {
            this.setState({
                blogs: res.data,
                isLoading: false
            });
        })
        .catch(e => {
            console.log(e);
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
                    <title>Blog - MF.</title>
                    <meta name="description" value="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum quae cumque odit corporis officia consequatur commodi deleniti quisquam facilis error?"></meta>
                </Helmet>
                <div className="container-fluid">
                    <div className="container">
                        <div className="row h-banner-100vh align-items-center order-1 justify-content-center">
                            <div className="text-background align-self-end">
                                <h1>THE BLOG.</h1>
                            </div>
                            <div className="col-md-6 order-2 order-md-1">
                                <h3 className="display-4 font-weight-bold banner-title">JSTN &mdash; just share the notes.</h3>
                                <p className="banner-text">
                                    I just want to express my tought trough this what I've made. I'll be happy to recieve any kind of feedback about these if you find anything that i've to be considering.
                                </p>
                            </div>
                        </div>
                        { this.state.isLoading ? 
                            <Spinner animation="border" role="status" className="mx-auto spinner-loading d-block">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                            : 
                            <div className="row mb-5 justify-content-center">
                                <div className="col-md-8">
                                    { this.state.blogs.map((blog, index) => (
                                        <>
                                            { blog.published === true && (
                                                <div className="card blog-card rounded-0 border-0 shadow-sm my-4" key={blog._id}>
                                                    <Link to={`/blog/${blog.slug}`} className="card-body p-0" id={blog._id}>
                                                        <div className="container">
                                                            <div className="row align-items-center">
                                                                <div className="col-md-3 p-0 col-sm-0 blog-card-thumbnail">
                                                                    <img src={ blog.thumbnail ?? "https://bridge311.qodeinteractive.com/wp-content/uploads/2020/01/p1-img-01.jpg"} alt="" className="" />
                                                                </div>
                                                                <div className="col-md-9 p-4 blog-card-text">
                                                                    <h4 className="font-weight-bold" dangerouslySetInnerHTML={{ __html: blog.title }} />
                                                                    <div>{ blog.description }</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ) }
                                        </>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </>
        );
    }
}