import React, { Component } from "react";
import '../../App.css';
import blogService from "../../services/blog.service";
import { Spinner } from 'react-bootstrap';

import * as moment from 'moment';
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';

export default class AdminBlog extends Component {

    constructor(props) {
        super(props);

        this.getBlogs = this.getBlogs.bind(this);

        this.state = {
            blogs: [],
            isLoading: true,
        };
    }

    componentDidMount() {
        window.scrollTo(0,0);
        this.getBlogs();
    }

    getBlogs() {
        blogService.index()
        .then(res => {
            this.setState({
                blogs: res.data,
                isLoading: false,
            });

            window.scrollTo(0,0);
        })
        .catch(() => {
            
        });
    }

    render() {
        return (
            <div className="w-admin">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 order-2 order-md-1">
                            { this.state.isLoading ? (
                                <>
                                    <Spinner animation="border" role="status" className="mx-auto spinner-loading my-4 d-block">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </>
                            ) : (
                                <>
                                    { this.state.blogs.sort((a, b) => ((Date.parse(new Date(b.created_date))) - (Date.parse(new Date(a.created_date))))  ).map((blog, index) => (
                                        <Link to={`blogs/${blog._id}`} className="card-custom" key={blog._id}>
                                            <div className="card my-3 border-0 shadow-sm">
                                                <div className="card-body d-flex">
                                                    <div className="w-100">
                                                        <h6 className="mb-1" dangerouslySetInnerHTML={{ __html: blog.title }} />
                                                        <small>{blog.created_by }  &mdash; Created at : { moment(blog.created_date).format('DD/MM/YYYY') }</small>
                                                    </div>
                                                    <div className="blog-status">{blog.published ? <Icon.Check className="text-white bg-success rounded-circle" /> : <Icon.DashCircle className="text-danger" /> }</div>
                                                </div>
                                            </div>
                                        </Link>
                                    )) }
                                </>
                            ) }
                        </div>
                        <div className="col-md-4 order-1 order-md-2">
                            <div className="card border-0 shadow-sm mt-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        Total : <strong>{ this.state.blogs.length }</strong>
                                    </div>
                                    <div>
                                        <Link to="./blogs/create" className="btn btn-light text-primary rounded btn-icon"><Icon.PencilSquare /> Create</Link>
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