import React, { Component } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';

import BlogDataService from '../../services/blog.service';

import * as Icon from 'react-bootstrap-icons';
import { Alert, Spinner } from 'react-bootstrap';

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from "draftjs-to-html";

import { converToSlug } from './Helper';
import { connect } from 'react-redux';

class AdminBlogCreate extends Component {

    constructor(props) {
        super(props);

        this.saveBlog = this.saveBlog.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);

        this.state = {
            id: null,
            title: "",
            slug: "",
            description: "",
            published: "false",
            thumbnail: "",
            content: EditorState.createEmpty(),
            notification: false,
            message: [],
            redirectSuccess: false,
            btnLoading: false,
        }
    }

    componentDidMount() {
        window.scrollTo(0,0);
    }

    onChangeInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeContent = (content) => {
        this.setState({
            content,
        });
    }

    saveBlog() {
        this.setState({ btnLoading: true });

        var data = {
            title: this.state.title,
            slug: converToSlug(this.state.title),
            description: this.state.description,
            published: this.state.published === 'true' ? true : false,
            thumbnail: this.state.thumbnail,
            content: draftToHtml(convertToRaw(this.state.content.getCurrentContent())),
            created_by: this.props.auth.user.name,
        };

        BlogDataService.create(data)
        .then(res => {
            if (typeof res.data.errors !== 'undefined') {
                this.setState({
                    notification: true,
                    message: { message: res.data.message, type: "danger"},
                    btnLoading: false,
                });
            } else {
                this.setState({
                    notification: true,
                    message: { message: "Your blog successfully created!", type: "success"},
                    btnLoading: false,
                    id: res.data._id,
                });

                setTimeout(() => {
                    this.setState({
                        redirectSuccess: true,
                    })
                }, 1000);
            }

        }).catch(err => {
            this.setState({
                notification: true,
                message: { message: err.message, type: "danger"},
                btnLoading: false,
            });
        });
    }

    render() {

        if (this.state.redirectSuccess && this.state.message.type !== 'danger') {
            return (<Redirect push to={`./${this.state.id}`} />)
        }

        return (
            <>
            <div className="w-admin">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-11 my-3">
                            <Alert show={ this.state.notification } variant={ this.state.message.type } className="d-flex align-items-center justify-content-between">
                                <div className="d-flex">
                                    <div className="mr-2">
                                        <Icon.InfoCircleFill className={"text-" + this.state.message.type} />
                                    </div>
                                    <div className="mr-2">
                                        <p className="mb-0 alert-message">
                                            { this.state.message.message }
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={() => this.setState({ notification: false })} className={"btn btn-sm btn-" + this.state.message.type}>
                                        Close
                                    </button>
                                </div>
                            </Alert>
                            <div className="card border-0 bg-white mb-3">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb bg-transparent m-0 p-0">
                                                <li className="breadcrumb-item"><Link to="../blogs">Blogs</Link></li>
                                                <li className="breadcrumb-item active" aria-current="page">Create</li>
                                            </ol>
                                        </nav>
                                        <div>
                                            <button className="btn btn-light text-primary btn-icon" onClick={this.saveBlog} tabIndex="6">
                                                { (this.state.btnLoading || false ) ? (
                                                    <>
                                                        <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        className="mr-2"
                                                        aria-hidden="true"></Spinner>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Icon.CheckAll />
                                                    </>
                                                ) }
                                            Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 bg-white">
                                <div className="card-body">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Title</label>
                                        <div className="col-sm-9">
                                            <input className="form-control border-light shadow-sm" value={this.state.title || ''} name="title" onChange={this.onChangeInput} placeholder="eg. How do i deal with the err ..." autoFocus tabIndex="1" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Thumbnail URL</label>
                                        <div className="col-sm-9">
                                            <div className="image-preview">
                                                <img src={this.state.thumbnail || "https://images.unsplash.com/photo-1598620510939-1ee365b7ba12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"} alt="" />
                                            </div>
                                            <input className="form-control border-light shadow-sm" value={this.state.thumbnail || ''} name="thumbnail" onChange={this.onChangeInput} placeholder="eg. https://images.unsplash.com/pho..." tabIndex="2" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Status</label>
                                        <div className="col-sm-9">
                                            <select className="custom-select border-light shadow-sm" name="published" value={this.state.published || ''} onChange={this.onChangeInput} tabIndex="3">
                                                <option value="true">Published</option>
                                                <option value="false">Not Published</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea className="form-control border-light shadow-sm" rows="3" maxLength="50" name="description" value={this.state.description || ''} onChange={this.onChangeInput} placeholder="eg. In this articles i want to ..." tabIndex="4" />
                                    </div>
                                    <div className="form-group">
                                        <label>Content</label>
                                        <Editor
                                        editorState={this.state.content}
                                        toolbarClassName="border-0 p-0 m-0"
                                        wrapperClassName="p-2 rounded shadow-sm bg-white"
                                        editorClassName="editor-input"
                                        onEditorStateChange={this.onChangeContent}
                                        placeholder="eg. Everybody knows about this but some of them are ..."
                                        tabIndex="5"
                                        hashtag={{
                                            separator: ' ',
                                            trigger: '#',
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
}); 

export default withRouter(connect(mapStateToProps)(AdminBlogCreate));