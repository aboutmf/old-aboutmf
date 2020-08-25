import React, { Component } from "react";
import '../../App.css';
import blogService from "../../services/blog.service";
import { Spinner } from 'react-bootstrap';

import * as moment from 'moment';
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';

import ServerError from '../shared/ServerError.component';

export default class AdminBlog extends Component {

    constructor(props) {
        super(props);

        this.getBlogs = this.getBlogs.bind(this);

        this.state = {
            blogs: [],
            isLoading: true,
            errorOccured: false,
        };
    }

    componentDidMount() {
        this.getBlogs();
    }

    getBlogs() {
        blogService.index()
        .then(res => {
            this.setState({
                blogs: res.data,
                isLoading: false,
            });
        })
        .catch(() => {
            this.setState({
                errorOccured: true,
            });
        });
    }

    render() {
        return (
            <div className="container-fluid">
                { this.state.errorOccured ? (
                    <ServerError />
                ) : (
                    <div className="row justify-content-center mb-5 mt-md-3 mt-0">
                        <div className="col-md-6 px-0 px-md-2">
                                { this.state.isLoading ? (
                                    <Spinner animation="border" role="status" className="mx-auto spinner-loading my-3 d-block">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                ) : (
                                    <>
                                        <div className="card border-0 sticky-top">
                                            <div className="card-header border-0 rounded text-right d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h5 className="mb-0">Blog List</h5>
                                                </div>
                                                <div>
                                                    <Link to="blogs/create" className="btn btn-sm rounded-pill btn-primary">Create New</Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2 px-md-0">
                                            { this.state.blogs.map((blog, index) => (
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
                                        </div>
                                    </>
                                ) }
                        </div>
                    </div>
                ) }
            </div>
        );
    }
}