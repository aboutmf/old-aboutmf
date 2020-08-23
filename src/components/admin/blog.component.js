import React, { Component } from "react";
import '../../App.css';
import blogService from "../../services/blog.service";
import { Spinner } from 'react-bootstrap';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';


export default class AdminBlog extends Component {

    constructor(props) {
        super(props);

        this.getBlogs = this.getBlogs.bind(this);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeCreatedBy = this.onChangeCreatedBy.bind(this);
        this.onChangeThumbnail = this.onChangeThumbnail.bind(this);
        this.saveBlog = this.saveBlog.bind(this);
        this.deleteBlog = this.deleteBlog.bind(this);
        this.editBlog = this.editBlog.bind(this);
        this.updateBlog = this.updateBlog.bind(this);
        this.cancelUpdate = this.cancelUpdate.bind(this);
        this.showBlog = this.showBlog.bind(this);
        this.hideBlog = this.hideBlog.bind(this);

        this.state = {
            edited: false,
            blogs: [],
            showDetail: false,
            currentData: [],
            currentId: null,
            title: "",
            thumbnail: "",
            description: "",
            slug: "",
            editorState: EditorState.createEmpty(),
            created_by: "",
            isLoading: true,
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
        .catch(e => {
            console.log(e);
        });
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value,
        });
    }

    onChangeThumbnail(e) {
        this.setState({
            thumbnail: e.target.value,
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value,
        });
    }

    onChangeContent = (editorState) => {
        this.setState({
            editorState,
        });
    }

    onChangeCreatedBy(e) {
        this.setState({
            created_by: e.target.value
        });
    }

    saveBlog() {
        var slug = this.string_to_slug(this.state.title);

        var data = {
            title: this.state.title,
            description: this.state.description,
            thumbnail: this.state.thumbnail,
            slug: slug,
            content: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
            created_by: this.state.created_by
        };

        blogService.create(data)
        .then(res => {
            this.showBlog(res.data);
            this.getBlogs();
        })
        .catch(e => {
            console.log(e);
        });
    }

    deleteBlog(id) {
        blogService.delete(id)
        .then(res => {
            this.getBlogs();
        })
        .catch(e => {
            console.log(e);
        });
    }

    editBlog(data) {
        this.setState({
            showDetail: false,
            currentId: data._id,
            title: data.title,
            thumbnail: data.thumbnail,
            description: data.description,
            slug: data.slug,
            editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    htmlToDraft(data.content)
                )
            ),
            created_by: data.created_by,
            edited: true,
        });
    }

    updateBlog() {
        console.log(convertToRaw(this.state.editorState.getCurrentContent()));
        var data = {
            title: this.state.title,
            thumbnail: this.state.thumbnail,
            description: this.state.description,
            slug: this.string_to_slug(this.state.title),
            content: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
            created_by: this.state.created_by,
        };

        blogService.update(this.state.currentId, data)
        .then(res => {
            this.getBlogs();
            this.showBlog(res.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    cancelUpdate() {
        this.setState({
            showDetail: false,
            edited: false,
            currentId: null,
            title: "",
            description: "",
            thumbnail: "",
            slug: "",
            editorState: EditorState.createEmpty(),
            created_by: "",
        });
    }

    showBlog(data) {
        this.setState({
            showDetail: true,
            currentId: data._id,
            title: data.title,
            thumbnail: data.thumbnail,
            description: data.description,
            slug: data.slug,
            content: data.content,
            created_by: data.created_by
        });
    }

    hideBlog() {
        this.cancelUpdate();
    }


    string_to_slug(str) {
        str = str.replace(/^\s+|\s+$/g, '')
                .toLowerCase()
                // .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        return str;
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-4">
                            <div className="card rounded-0 border-0 shadow-sm border">
                                <div className="card-header d-flex justify-content-between border-0 align-items-center">
                                    <div>
                                        <h5 className="m-0">Blogs</h5>
                                    </div>
                                    <div>
                                        <button className="btn btn-sm btn-primary" onClick={this.hideBlog}>Create</button>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    { this.state.isLoading ? (
                                        <Spinner animation="border" role="status" className="mx-auto spinner-loading my-3 d-block">
                                            <span className="sr-only">Loading...</span>
                                        </Spinner>
                                    ) : (
                                        <div className="list-group">
                                            { this.state.blogs.map((blog, index) => (
                                                <div className={"list-group-item border-left-0 border-right-0 list-group-item-action flex-column align-items-start " + ( blog._id === this.state.currentId ? "active" : "" )} key={blog._id}>
                                                    <div className="d-flex w-100 justify-content-between" onClick={() => this.showBlog(blog)}>
                                                        <h6 className="mb-1 list-item-title" dangerouslySetInnerHTML={{ __html: blog.title }} />
                                                        <small>{ blog.created_by }</small>
                                                    </div>
                                                    <div>
                                                        <small className="delete-link mr-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this?')) this.deleteBlog(blog._id) }}>hapus</small>|
                                                        <small className="edit-link ml-1" onClick={() => this.editBlog(blog)}>edit</small>
                                                    </div>
                                                </div>
                                            )) }
                                        </div>
                                    ) }
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="card border-0 shadow-sm rounded-0">
                                <div className="card-body">
                                    { this.state.showDetail ? (
                                        <div>
                                            <h4 dangerouslySetInnerHTML={{ __html: this.state.title }} />
                                            <div dangerouslySetInnerHTML={{ __html: this.state.content}} />
                                            <hr />
                                            <small><strong>Link :</strong> { window.location.host + '/blog/' + this.state.slug }</small>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="form-group">
                                                <label htmlFor="title">Title</label>
                                                <input
                                                className="form-control rounded-0"
                                                type="text"
                                                id="title"
                                                required
                                                value={this.state.title}
                                                onChange={this.onChangeTitle}
                                                name="title"/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="thumbnail">Thumbnail</label>
                                                <input
                                                className="form-control rounded-0"
                                                type="text"
                                                id="thumbnail"
                                                required
                                                value={this.state.thumbnail}
                                                onChange={this.onChangeThumbnail}
                                                name="thumbnail"/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <textarea
                                                className="form-control rounded-0"
                                                id="description"
                                                required
                                                onChange={this.onChangeDescription}
                                                value={this.state.description}
                                                name="description" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="content">Content</label>
                                                <Editor
                                                editorState={this.state.editorState}
                                                toolbarClassName="sticky-top sticky-offset"
                                                wrapperClassName="border p-2"
                                                editorClassName="editor-input"
                                                onEditorStateChange={this.onChangeContent}
                                                hashtag={{
                                                    separator: ' ',
                                                    trigger: '#',
                                                }} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="created_by">Created By</label>
                                                <input
                                                className="form-control rounded-0"
                                                type="text"
                                                id="created_by"
                                                required
                                                value={this.state.created_by}
                                                onChange={this.onChangeCreatedBy}
                                                name="created_by"/>
                                            </div>
                                            <div className="text-right mt-5">
                                                { this.state.edited ? (
                                                    <>
                                                        <button onClick={this.cancelUpdate} className="btn btn-md btn-transparent mr-3">Batal</button>
                                                        <button onClick={this.updateBlog} className="btn btn-md btn-success">Perbarui</button>
                                                    </>
                                                ) : (
                                                    <button onClick={this.saveBlog} className="btn btn-md btn-primary">Save</button>
                                                ) }
                                            </div>
                                        </>
                                    ) }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}