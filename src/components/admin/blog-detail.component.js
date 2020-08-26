import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

import BlogDataService from '../../services/blog.service';

import * as Icon from 'react-bootstrap-icons';
import { Alert, Spinner } from 'react-bootstrap';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';

import { converToSlug, isValidImage } from './Helper';
import { connect } from 'react-redux';
import moment from 'moment';

class AdminBlogDetail extends Component {
    constructor(props) {
        super(props);

        this.getBlog = this.getBlog.bind(this);
        this.saveBlog = this.saveBlog.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.deleteBlog = this.deleteBlog.bind(this);

        this.state = {
            id: null,
            title: "",
            slug: "",
            description: "",
            published: null,
            thumbnail: "",
            content: EditorState.createEmpty(),
            created_by: "",
            created_at: "",
            notification: false,
            message: [],
            saveLoading: false,
            isLoading: true,
            linkActive:false,
            confirmDelete: "",
            btnDelete: false,
            deleteLoading: false,
            redirect: false,
        }
    }

    onChangeInput(e) {

        this.setState({
            [e.target.name]: e.target.value
        });

    }

    onChangeContent = (content) => {
        this.setState({
            content,
        });
    }

    componentDidMount() {
        window.scrollTo(0,0);
        this.getBlog(this.props.match.params.id);
    }

    async getBlog(id) {
        await BlogDataService.show(id)
        .then(res => {
            this.setState({
                id: res.data._id,
                title: res.data.title,
                slug: res.data.slug,
                description: res.data.description,
                published: res.data.published ? 'true' : 'false',
                thumbnail: res.data.thumbnail,
                content: EditorState.createWithContent(
                    ContentState.createFromBlockArray(
                        htmlToDraft(res.data.content)
                    )
                ),
                created_by: res.data.created_by,
                created_at: res.data.created_date,
                linkActive: res.data.published ? 'true' : 'false',
                isLoading: false,
            });
            
        }).catch(e => console.log(e));
    }

    saveBlog() {
        this.setState({ saveLoading: true });

        var data = {
            title: this.state.title,
            slug: converToSlug(this.state.title),
            description: this.state.description,
            published: this.state.published === 'true' ? true : false,
            thumbnail: this.state.thumbnail,
            content: draftToHtml(convertToRaw(this.state.content.getCurrentContent())),
            created_by: this.props.auth.user.name,
        };

        BlogDataService.update(this.state.id, data)
        .then(res => {
            this.setState({
                notification: true,
                message: { message: "Your blog successfully updated!", type: "success"},
                saveLoading: false,
                slug: res.data.slug,
                linkActive: res.data.published ? 'true' : 'false',
            });

            this.getBlog(res.data._id);
        }).catch(err => console.log(err));
    }

    confirmDelete(e) {
        this.setState({
            confirmDelete: e.target.value,
            btnDelete: (e.target.value === this.state.title)
        });
    }

    deleteBlog() {
        this.setState({
            deleteLoading: true,
        });

        BlogDataService.delete(this.state.id)
        .then(res => {
            this.setState({
                redirect: true,
            });
        }).catch(err => console.log(err));
    }

    render() {
        if (this.state.redirect === true) {
            return <Redirect to="../blogs" />
        }

        return (
            <div className="mb-5 mt-0 mt-md-3 px-0 px-md-3">
                { this.state.isLoading ? (
                    <Spinner animation="border" role="status" className="mx-auto spinner-loading my-4 d-block">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                ) : (
                    <>
                        <div className="card border-0 sticky-top d-block d-md-none">
                            <div className="card-header border-0 rounded text-right d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-0" onClick={() => this.props.history.goBack()}><Icon.ArrowLeftCircle/></h5>
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-primary rounded-pill" onClick={this.saveBlog}>
                                        { this.state.saveLoading && (
                                            <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="mr-2"
                                            />
                                        ) }
                                        <span>
                                            Save
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="container-fluid">
                            <div className="d-block d-md-none mt-4">
                                <Alert show={ this.state.notification } variant={ this.state.message.type } className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-start">
                                        <Icon.InfoCircleFill className="text-success mr-2" /> { this.state.message.message }
                                    </div>
                                    <div>
                                        <button onClick={() => this.setState({ notification: false})} className={"btn btn-sm btn-" + this.state.message.type}>
                                            Close
                                        </button>
                                    </div>
                                </Alert>
                            </div>
                            <div className="row mx-0 px-0">
                                <div className="col-md-8 order-1 order-md-1 my-3 px-0 px-md-3">
                                    <div className="form-group row">
                                        <label htmlFor="title" className="col-sm-1 col-form-label">Title</label>
                                        <div className="col-sm-11">
                                            <input name="title" value={this.state.title || ''} onChange={this.onChangeInput} className="form-control border-0 shadow-sm" placeholder="Enter the title" autoComplete="off" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <Editor
                                        editorState={this.state.content}
                                        toolbarClassName="border-0 p-0 m-0"
                                        wrapperClassName="p-2 rounded shadow-sm"
                                        editorClassName="editor-input"
                                        onEditorStateChange={this.onChangeContent}
                                        hashtag={{
                                            separator: ' ',
                                            trigger: '#',
                                        }} />
                                    </div>
                                </div>
                                <div className="col-md-4 order-2 order-md-2 my-3 px-0 px-md-3">
                                    <div className="card border-0 bg-light">
                                        <div className="d-none d-md-block">
                                            <Alert show={ this.state.notification } variant={ this.state.message.type } className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-start">
                                                    <Icon.InfoCircleFill className="text-success mr-2" /> { this.state.message.message }
                                                </div>
                                                <div>
                                                    <button onClick={() => this.setState({ notification: false})} className={"btn btn-sm btn-" + this.state.message.type}>
                                                        Close
                                                    </button>
                                                </div>
                                            </Alert>
                                        </div>
                                        <div className="card-header border-0 bg-light text-right align-items-center justify-content-between d-none d-md-flex">
                                            <div>
                                                <a className={"d-flex align-items-center " + (this.state.linkActive === 'false' ? 'disabled text-danger' : '') } target="_blank" href={`../../#/blog/${this.state.slug}`}>
                                                    <Icon.BoxArrowInUpRight />
                                                    <span className="ml-2">{ this.state.linkActive === 'false' ? 'not published' : 'open blog' }</span>
                                                </a>
                                            </div>
                                            <div>
                                                <button className="btn btn-sm btn-primary rounded-pill" onClick={this.saveBlog}>
                                                    { this.state.saveLoading && (
                                                        <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        className="mr-2"
                                                        />
                                                    ) }
                                                    <span>
                                                        Save
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="form-group row">
                                                <div className="col-sm-8 order-2 order-md-1">
                                                    <label htmlFor="thumbnail">Thumbnail</label>
                                                    <input className="form-control border-0 shadow-sm" onChange={this.onChangeInput} placeholder="Enter the thumbnail" id="thumbnail" name="thumbnail" value={this.state.thumbnail || ''} autoComplete="off" />
                                                </div>
                                                <div className="col-md-4 order-1 order-md-2 mb-3 mb-md-0">
                                                    <div className="thumbnail-preview">
                                                        <img src={ this.state.thumbnail || 'https://www.redanglagoon.com/notfound.png' } alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <textarea className="border-0 form-control shadow-sm" name="description" rows="5" placeholder="Enter the description" onChange={this.onChangeInput} maxLength="150" id="description" value={this.state.description || ''} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="published">Status</label>
                                                <select className="custom-select border-0 shadow-sm" name="published" id="published" onChange={this.onChangeInput} value={this.state.published || ''}>
                                                    <option value="true">Published</option>
                                                    <option value="false">Not Published</option>
                                                </select>
                                            </div>
                                            <div className="text-muted mt-4">
                                                <small>Latest update at <i>{ moment(this.state.created_date).format('DD-MM-YYYY hh:mm') }</i> by <b>{ this.props.auth.user.name }</b></small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mt-3 border-danger">
                                        <div className="card-header bg-transparent border-0 pt-4">
                                            <h5 className="m-0">Danger Zone</h5>
                                        </div>
                                        <div className="card-body pt-1">
                                            <p>Delete this blog? please type <b>{ this.state.title }</b> to confirm in input box below.</p>
                                            <input className="form-control border-0 shadow-sm" placeholder="Type here ..." value={this.state.confirmDelete} onChange={this.confirmDelete} />
                                            <div className="text-right">
                                                <button className={"btn btn-outline-danger rounded-pill mt-3 " + (this.state.btnDelete === false ? "disabled" : "")} onClick={this.deleteBlog}>
                                                    { this.state.deleteLoading && (
                                                        <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        className="mr-2"
                                                        />
                                                    ) }
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
}); 

export default connect(mapStateToProps)(AdminBlogDetail);