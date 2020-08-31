import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

import * as Icon from 'react-bootstrap-icons';

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from "draftjs-to-html";

import { connect } from 'react-redux';
import { Modal, Alert } from 'react-bootstrap';

import portofolioService from '../../services/portofolio.service';
import { converToSlug } from './Helper';

class PortofolioCreate extends Component {
    constructor(props){
        super(props);

        this.setModalShow = this.setModalShow.bind(this);
        this.addImage = this.addImage.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.savePortofolio = this.savePortofolio.bind(this);

        this.state = {
            title: "",
            imageUrl: "",
            description: "",
            image: "",
            images: [],
            content: EditorState.createEmpty(),
            modalShow: false,
            redirectRoute: false,
            notification: false,
            notificationMsg: [],
        }
    }

    setModalShow() {
        this.setState({
            modalShow: !this.state.modalShow
        });
    }

    addImage() {
        if (this.state.image !== "") {
            this.setState({
                images: [...this.state.images, this.state.image],
                image: "",
            });
        }
    }

    removeImage(index) {
        var array = this.state.images;
        array.splice(index, 1);
        this.setState({
            images: array
        });
    }

    savePortofolio() {
        var data = {
            title: this.state.title,
            imageUrl: this.state.imageUrl,
            slug: converToSlug(this.state.title),
            description: this.state.description,
            images: this.state.images,
            content: draftToHtml(convertToRaw(this.state.content.getCurrentContent())),
        };
        
        portofolioService.create(data)
        .then(res => {
            console.log(res);
            if (res.data.errors) {
                this.setState({
                    notification: true,
                    notificationMsg: { message: res.data.message, type: 'danger' }
                });
            } else {
                this.setState({
                    notification: true,
                    notificationMsg: { message: 'Your portofolio successfully created!', type: 'success' }
                });

                setTimeout(() => {
                    this.setState({
                        redirectRoute: true,
                    });
                }, 1500);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    render() {

        if (this.state.redirectRoute) {
            return <Redirect to={`./${this.state.id}`} />
        }

        return(
            <div className="w-admin">
                <div className="container">

                    <div className="row justify-content-center">
                        <div className="col-md-11">
                            { this.state.notification && (
                                <Alert show={ this.state.notification } variant={ this.state.notificationMsg.type } className="d-flex align-items-center justify-content-between mt-3">
                                    <div className="d-flex">
                                        <div className="mr-2">
                                            <Icon.InfoCircleFill className={"text-" + this.state.notificationMsg.type} />
                                        </div>
                                        <div className="mr-2">
                                            <p className="mb-0 alert-message">
                                                { this.state.notificationMsg.message }
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={() => this.setState({ notification: false })} className={"btn btn-sm btn-" + this.state.notificationMsg.type}>
                                            Close
                                        </button>
                                    </div>
                                </Alert>
                            ) }
                            <div className="card border-0 shadow-sm my-3">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb bg-transparent m-0 p-0">
                                                <li className="breadcrumb-item"><Link to="../portofolios">Portofolios</Link></li>
                                                <li className="breadcrumb-item active" aria-current="page">Create</li>
                                            </ol>
                                        </nav>
                                        <div>
                                            <button className="btn btn-light text-primary btn-icon" onClick={this.savePortofolio} tabIndex="6">
                                                <Icon.CheckAll />
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mb-3">
                                <div className="card-body">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Title</label>
                                        <div className="col-sm-9">
                                            <input name="title" value={this.state.title || ''} onChange={ (e) => this.setState({ title: e.target.value }) } className="form-control border-light shadow-sm" tabIndex="1" autoFocus placeholder="eg. My First Project" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Thumbnail</label>
                                        <div className="col-sm-9">
                                            <div className="image-preview">
                                                <img src={this.state.imageUrl || "https://images.unsplash.com/photo-1598620510939-1ee365b7ba12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"} alt="" />
                                            </div>
                                            <input name="imageUrl" value={this.state.imageUrl || ''} onChange={ (e) => this.setState({ imageUrl: e.target.value }) } tabIndex="2" className="form-control border-light shadow-sm" placeholder="eg. https://images.unsplash.com/photo-..." />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Images</label>
                                        <div className="col-sm-9 d-flex align-items-center">
                                            {/* <input name="title" value={this.state.title || ''} className="form-control border-light shadow-sm" placeholder="eg. My First Project" /> */}
                                            <button className="btn my-auto btn-sm btn-primary shadow-sm mr-2" tabIndex="3" onClick={ this.setModalShow }><Icon.Images /></button> { this.state.images.length } image(s) selected
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea name="description" value={this.state.description || ''} tabIndex="4" onChange={(e) => this.setState({ description: e.target.value })} className="form-control border-light shadow-sm" rows="3" maxLength="150" placeholder="eg. This beautiful design ..." />
                                    </div>
                                    <div className="form-group">
                                        <label>Content</label>
                                        <Editor
                                        editorState={this.state.content}
                                        toolbarClassName="border-0 p-0 m-0"
                                        wrapperClassName="p-2 rounded shadow-sm bg-white"
                                        editorClassName="editor-input"
                                        onEditorStateChange={(content) => this.setState({ content })}
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

                    
                    <Modal show={this.state.modalShow} animation={true} onHide={this.setModalShow} size="lg" className="" dialogClassName="">
                        <Modal.Header closeButton>
                            <Modal.Title>Select Images</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="shadow-sm">
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">Input URL</label>
                                <div className="col-sm-9">
                                    <div className="input-group">
                                        <input className="form-control shadow-sm border-light" value={this.state.image} onChange={(e) => this.setState({ image: e.target.value })} placeholder="eg. https://images.unsplash.com/photo-..." />
                                        <div className="input-group-apped">
                                            <button className="btn btn-primary shadow-none" onClick={this.addImage}><Icon.PlusCircle /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid px-0">
                                { this.state.images.map((img, index) => (
                                    <div className="image-preview" key={index}>
                                        <button className="btn btn-md btn-light btn-remove-image shadow-sm" onClick={ () => this.removeImage(index) }>
                                            <Icon.X />
                                        </button>
                                        <img src={img} alt="" className="w-100" />
                                    </div>
                                )) }
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PortofolioCreate);