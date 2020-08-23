import React, { Component } from "react";
import '../../App.css';
import portofolioService from "../../services/portofolio.service";

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';
import { Spinner } from 'react-bootstrap';

export default class AdminPortofolio extends Component {

    constructor(props) {
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeImageUrl = this.onChangeImageUrl.bind(this);
        this.retrievePortofolio = this.retrievePortofolio.bind(this);
        this.savePortofolio = this.savePortofolio.bind(this);
        this.clearField = this.clearField.bind(this);
        this.showDetail = this.showDetail.bind(this);
        this.editPortofolio = this.editPortofolio.bind(this);
        this.updatePortofolio = this.updatePortofolio.bind(this);

        this.state = {
            showDetail: false,
            edited: false,
            portofolios: [],
            title: "",
            description: EditorState.createEmpty(),
            imageUrl: "",
            isLoading: true,
        };
    }

    componentDidMount() {
        this.retrievePortofolio();
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeDescription = (description) => {
        this.setState({
            description,
        })
    }
    
    onChangeImageUrl(e) {
        this.setState({
            imageUrl: e.target.value
        })
    }

    retrievePortofolio() {
        portofolioService.index()
        .then(response => {
            this.setState({
                portofolios: response.data,
                isLoading: false,
            });
        })
        .catch(e => {
            console.log(e);
        });
    }

    savePortofolio() {
        var data = {
            title: this.state.title,
            description: draftToHtml(convertToRaw(this.state.description.getCurrentContent())),
            imageUrl: this.state.imageUrl
        };

        portofolioService.create(data)
        .then(res => {
            this.clearField();
        })
        .catch(e => {
            console.log(e);
        });
    }

    deletePortofolio(id) {
        portofolioService.delete(id)
        .then(response => {

        })
        .catch(e => {

        });
    }

    clearField() {
        this.setState({
            edited: false,
            showDetail: false,
            currentId: null,
            title: "",
            description: EditorState.createEmpty(),
            imageUrl: "",
        });

        this.retrievePortofolio();
    }

    showDetail(data) {
        this.setState({
            showDetail: true,
            currentId: data._id,
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl
        });

        this.retrievePortofolio();
    }

    editPortofolio(data) {
        this.setState({
            edited: true,
            showDetail: false,
            currentId: data._id,
            title: data.title,
            description: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    htmlToDraft(data.description)
                )
            ),
            imageUrl: data.imageUrl
        });
    }

    updatePortofolio() {
        var data = {
            title: this.state.title,
            description: draftToHtml(convertToRaw(this.state.description.getCurrentContent())),
            imageUrl: this.state.imageUrl,
        };

        portofolioService.update(this.state.currentId, data)
        .then(res => {
            this.showDetail(res.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="container">

                    <div className="row mb-5">
                        <div className="col-md-4">
                            <div className="card rounded-0 border-0 shadow-sm border">
                                <div className="card-header border-0 d-flex justify-content-between align-items-center">
                                    <h5 className="m-0">Portofolio</h5>
                                    <button className="btn btn-sm btn-primary" onClick={() => this.clearField()}>Create</button>
                                </div>
                                <div className="card-body p-0">
                                    { this.state.isLoading ? (
                                        <Spinner animation="border" role="status" className="mx-auto spinner-loading my-3 d-block">
                                            <span className="sr-only">Loading...</span>
                                        </Spinner>
                                    ) : (
                                        <div className="list-group">
                                            { this.state.portofolios.map((portofolio, index) => (
                                                <div className={"list-group-item border-left-0 border-right-0 list-group-item-action flex-column align-items-start " + (portofolio._id === this.state.currentId ? " active" : "")} key={portofolio._id}>
                                                    <div className="d-flex w-100 mb-1 justify-content-between" onClick={() => this.showDetail(portofolio)}>
                                                        <h6 className="list-item-title" dangerouslySetInnerHTML={{ __html: portofolio.title }} />
                                                    </div>
                                                    <div>
                                                        <small className="delete-link mr-1">hapus</small>|
                                                        <small className="edit-link ml-1" onClick={() => this.editPortofolio(portofolio) }>edit</small>
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
                                        <>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <img src={this.state.imageUrl} className="w-100" alt="" />
                                                </div>
                                                <div className="col-md-6">
                                                    <h5>{this.state.title}</h5>
                                                    <hr />
                                                    <div dangerouslySetInnerHTML={{ __html: this.state.description }} />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <div className="form-group">
                                                <label htmlFor="title">Title</label>
                                                <input
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                value={this.state.title}
                                                onChange={this.onChangeTitle}
                                                required
                                                name="title" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <Editor
                                                    editorState={this.state.description}
                                                    toolbarClassName="sticky-top sticky-offset"
                                                    wrapperClassName="border p-2"
                                                    editorClassName="editor-input"
                                                    onEditorStateChange={this.onChangeDescription}
                                                    hashtag={{
                                                        separator: ' ',
                                                        trigger: '#',
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="imageUrl">Image URL</label>
                                                <input
                                                type="text"
                                                className="form-control"
                                                id="imageUrl"
                                                value={this.state.imageUrl}
                                                onChange={this.onChangeImageUrl}
                                                required
                                                name="imageUrl" />
                                            </div>
                                            <div className="text-right">
                                                { this.state.edited ? (
                                                    <>
                                                        <button className="btn btn-sm btn-transparent mr-1">Batal</button>
                                                        <button className="btn btn-sm btn-success" onClick={this.updatePortofolio}>Perbarui</button>
                                                    </>
                                                ) : (
                                                    <button onClick={this.savePortofolio} className="btn btn-sm btn-primary">Simpan</button>
                                                ) }
                                            </div>
                                        </div>                                    
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