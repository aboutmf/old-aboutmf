import React, { Component } from "react";
import portofolioService from "../../services/portofolio.service";

import * as Icon from 'react-bootstrap-icons';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';
import { Spinner } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import moment from 'moment';

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
        this.onChangeInput = this.onChangeInput.bind(this);

        this.state = {
            showDetail: false,
            edited: false,
            portofolios: [],
            title: "",
            description: EditorState.createEmpty(),
            imageUrl: "",
            images: [],
            content: "",
            slug: "",
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

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    retrievePortofolio() {
        portofolioService.index()
        .then(response => {
            console.log(response);
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
            alert('Berhasil');
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
            <div className="w-admin">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7">
                            { this.state.isLoading ? (
                                <Spinner animation="border" role="status" className="mx-auto spinner-loading my-4 d-block">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            ) : (
                                <>
                                    { this.state.portofolios.sort((a, b) =>  Date.parse(new Date(b.created_date)) - Date.parse(new Date(a.created_date)) ).map((portofolio, index) => (
                                        <Link className="card-custom" to={`./portofolios/${portofolio._id}`} key={index}>
                                            <div className="card border-0 shadow-sm my-3">
                                                <div className="card-body d-flex justify-content-between">
                                                    <div className="w-100">
                                                        <h6 className="mb1">{ portofolio.title }</h6>
                                                        <small>Admin &mdash; Created at : { moment(portofolio.created_date).format('DD/MM/YYYY') }</small>
                                                    </div>
                                                    <div><Icon.Check className="bg-success rounded-circle text-white" /></div>
                                                </div>
                                            </div>
                                        </Link>
                                    )) }
                                </>
                            ) }
                        </div>

                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm mt-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        Total : <strong>{ this.state.portofolios.length }</strong>
                                    </div>
                                    <div>
                                        <Link to="./portofolios/create" className="btn btn-light text-primary rounded btn-icon"><Icon.PencilSquare /> Create</Link>
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