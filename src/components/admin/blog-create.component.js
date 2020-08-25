import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import BlogDataService from '../../services/blog.service';

import * as Icon from 'react-bootstrap-icons';
import { Alert, Spinner } from 'react-bootstrap';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';

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
            published: 'true',
            thumbnail: "",
            content: EditorState.createEmpty(),
            created_by: "",
            created_at: "",
            notification: false,
            message: [],
            saveLoading: false,
            redirectSuccess: false,
        }
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

    componentDidMount() {
        window.scrollTo(0,0);
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

        BlogDataService.create(data)
        .then(res => {
            if (typeof res.data.errors !== 'undefined') {
                this.setState({
                    notification: true,
                    message: { message: res.data.message, type: "danger"},
                    saveLoading: false,
                });
            } else {
                this.setState({
                    notification: true,
                    message: { message: "Your blog successfully created!", type: "success"},
                    saveLoading: false,
                    id: res.data._id
                });
            }

        }).catch(err => {
            this.setState({
                notification: true,
                message: { message: err.message, type: "danger"},
                saveLoading: false,
            });
        });
    }

    render() {

        if (this.state.redirectSuccess && this.state.message.type !== 'danger') {
            return (<Redirect push to={`./${this.state.id}`} />);
        }

        return (
            <div className="container-fluid mb-5 mt-3">
                <div className="row">
                    <div className="col-md-8 order-2 order-md-1 my-3">
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
                    <div className="col-md-4 order-1 order-md-2 my-3">
                        { this.state.message.type === 'danger' ? (
                            <Alert show={ this.state.notification } variant={ this.state.message.type }>
                                <Alert.Heading>How's it going?!</Alert.Heading>
                                <p>{ this.state.message.message }</p>
                                <div className="d-flex justify-content-end">
                                    <button onClick={() => this.setState({ notification: false})} className={"btn btn-sm btn-" + this.state.message.type}>
                                        Close
                                    </button>
                                </div>
                            </Alert>
                        ) : (
                            <Alert show={ this.state.notification } variant={ this.state.message.type } className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Icon.InfoCircleFill className="text-success mr-2" /> { this.state.message.message }
                                </div>
                                <div>
                                    <button onClick={() => this.setState({ notification: false, redirectSuccess: true})} className={"btn btn-sm btn-" + this.state.message.type}>
                                        Close
                                    </button>
                                </div>
                            </Alert>
                        ) }
                        <div className="card border-0 bg-light">
                            { this.state.notification || (
                                <div className="card-header border-0 bg-light text-right d-flex align-items-center justify-content-between">
                                    <div>
                                        <a className={"d-flex align-items-center disabled text-muted"} target="_blank" href="#">
                                            <Icon.BoxArrowInUpRight />
                                            <span className="ml-2">hasn't been created yet</span>
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
                            ) }
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
                                    <textarea className="border-0 form-control shadow-sm" name="description" placeholder="Enter the description" rows="5" onChange={this.onChangeInput} maxLength="150" id="description" value={this.state.description || ''} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="published">Status</label>
                                    <select className="custom-select border-0 shadow-sm" name="published" id="published" onChange={this.onChangeInput} value={this.state.published || ''}>
                                        <option value="true">Published</option>
                                        <option value="false">Not Published</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
}); 

export default withRouter(connect(mapStateToProps)(AdminBlogCreate));