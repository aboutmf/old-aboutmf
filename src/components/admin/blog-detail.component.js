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

import { converToSlug } from './Helper';
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
        this.btnSave = this.btnSave.bind(this);

        this.state = {
            id: null,
            title: "",
            oldTitle: "",
            slug: "",
            description: "",
            published: null,
            thumbnail: "",
            content: EditorState.createEmpty(),
            created_by: "",
            created_at: "",
            notification: false,
            message: [],
            btnLoading: false,
            isLoading: true,
            linkActive:false,
            confirmDelete: "",
            btnDelete: false,
            deleteLoading: false,
            redirect: false,
            oldPublished: 'false',
        }
    }

    btnSave() {
        this.setState({ btnLoading: true });

        this.saveBlog();
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

    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
    }


    getBlog(id) {
        BlogDataService.show(id)
        .then(res => {
            this.setState({
                id: res.data._id,
                title: res.data.title,
                oldTitle: res.data.title,
                slug: res.data.slug,
                description: res.data.description,
                published: res.data.published ? 'true' : 'false',
                oldPublished: res.data.published ? 'true' : 'false',
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
                slug: res.data.slug,
                linkActive: res.data.published ? 'true' : 'false',
                btnLoading: false,
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
            setTimeout(
                this.setState({
                    redirect: true,
                }),
            2000);

        }).catch(err => console.log(err));
    }

    render() {
        if (this.state.redirect === true) {
            return <Redirect to="../blogs" />
        }

        return (
            <>
            <div className="w-admin">
                <div className="container">
                    <div className="row justify-content-center">
                        { this.state.isLoading ? (
                            <>
                                <Spinner animation="border" role="status" className="mx-auto spinner-loading my-4 d-block">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </>
                        ) : (
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
                                        <button onClick={() => this.setState({ notification: false, redirectSuccess: true})} className={"btn btn-sm btn-" + this.state.message.type}>
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
                                                    <li className="breadcrumb-item active" aria-current="page" title={this.state.oldTitle}>
                                                        { this.state.oldTitle.slice(0, 10) + (this.state.oldTitle.length > 10 ? "..." : "") }
                                                    </li>
                                                </ol>
                                            </nav>
                                            <div className="d-flex">
                                                <a target="_blank" href={"../../#/blog/" + this.state.slug} className={"btn btn-light text-primary mr-2 " + (this.state.oldPublished === 'false' ? 'disabled' : '') } rel="noopener noreferrer">
                                                    <Icon.BoxArrowInUpRight />
                                                </a>
                                                <button className="btn btn-light text-primary btn-icon" onClick={this.btnSave} tabIndex="6">
                                                    { (this.state.btnLoading ) ? (
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
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Latest Updated</label>
                                            <div className="col-sm-9">
                                                <input className="form-control border-light bg-white" disabled value={ moment(this.state.created_date).format('DD-MM-YYYY hh:mm') + " by " + this.props.auth.user.name } />
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
                                <div className="card my-3 bg-white border-danger">
                                    <div className="card-body">
                                        <div className="form-group row align-items-end">
                                            <div className="col-sm-3">
                                                <h6 className="">Danger Zone</h6>
                                                <small>Delete this blog? please type <b>{ this.state.title }</b> to confirm.</small>
                                            </div>
                                            <div className="col-sm-9">
                                                <div className="input-group">
                                                    <input className="form-control form-control-danger" placeholder={this.state.title} value={this.state.confirmDelete} onChange={this.confirmDelete} />
                                                    <div className="input-group-append">
                                                        <button className={"btn btn-outline-danger " + (this.state.btnDelete === false ? "disabled" : "")} disabled={!this.state.btnDelete} onClick={this.deleteBlog}>
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
                            </div>
                        ) }
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

export default connect(mapStateToProps)(AdminBlogDetail);