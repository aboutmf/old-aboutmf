import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

import * as Icon from 'react-bootstrap-icons';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';

import { connect } from 'react-redux';
import { Modal, Alert, Spinner } from 'react-bootstrap';

import portofolioService from '../../services/portofolio.service';
import { converToSlug } from './Helper';

class PortofolioDetail extends Component {
    constructor(props){
        super(props);

        this.setModalShow = this.setModalShow.bind(this);
        this.addImage = this.addImage.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.getPortofolio = this.getPortofolio.bind(this);
        this.updatePortofolio = this.updatePortofolio.bind(this);
        this.deletePortofolio = this.deletePortofolio.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);

        this.state = {
            id: null,
            title: "",
            oldTitle: "",
            imageUrl: "",
            description: "",
            slug: "",
            image: "",
            images: [],
            content: EditorState.createEmpty(),
            modalShow: false,
            redirectRoute: false,
            notification: false,
            notificationMsg: [],
            isLoading: true,
            confirmDelete: "",
            btnDelete: false,
        }
    }

    componentDidMount() {
        this.getPortofolio(this.props.match.params.id);
    }

    setModalShow() {
        this.setState({
            modalShow: !this.state.modalShow
        });
    }

    confirmDelete(e) {
        this.setState({
            confirmDelete: e.target.value,
            btnDelete: e.target.value === this.state.oldTitle ? true : false,
        })
    }

    addImage() {
        if (this.state.image !== "") {
            this.setState({
                images: [...this.state.images, this.state.image],
                image: "",
            });
        }
    }

    getPortofolio(id) {
        portofolioService.show(id)
        .then(res => {
            this.setState({
                id: res.data._id,
                title: res.data.title,
                oldTitle: res.data.title,
                slug: res.data.slug,
                imageUrl: res.data.imageUrl,
                description: res.data.description,
                images: res.data.images,
                content: EditorState.createWithContent(
                    ContentState.createFromBlockArray(
                        htmlToDraft(res.data.content || '')
                    )
                ),
                isLoading: false,
            });
        })
        .catch(err => {
            console.log(err)
        })
    }

    removeImage(index) {
        var array = this.state.images;
        array.splice(index, 1);
        this.setState({
            images: array
        });
    }

    updatePortofolio() {
        var data = {
            title: this.state.title,
            imageUrl: this.state.imageUrl,
            slug: (this.state.title === this.state.oldTitle) ? this.state.slug : converToSlug(this.state.title),
            description: this.state.description,
            images: this.state.images,
            content: draftToHtml(convertToRaw(this.state.content.getCurrentContent())),
        };
        
        portofolioService.update(this.state.id, data)
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
                    notificationMsg: { message: 'Your portofolio successfully updated!', type: 'success' }
                });
            }
        }).catch(err => {
            console.log(err);
        })
    }

    deletePortofolio() {
        window.scrollTo({top: 0, behavior: 'smooth'});
        
        portofolioService.delete(this.state.id)
        .then(res => {
            this.setState({
                notification: true,
                notificationMsg: { message: 'Your portofolios successfully deleted!', type: 'success' },
            });

            setTimeout(() => {
                this.setState({
                    redirectRoute: true,
                });
            }, 2000);
        }).catch(err => {
            console.log(err);
        })
    }

    render() {

        if (this.state.redirectRoute) {
            return <Redirect to="../portofolios" />
        }

        return(
            <div className="w-admin">
                <div className="container">

                    <div className="row justify-content-center">
                        { this.state.isLoading ? (
                            <Spinner animation="border" role="status" className="mx-auto spinner-loading my-4 d-block">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        ) : (
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
                                                    <li className="breadcrumb-item active" aria-current="page" title={this.state.oldTitle}>
                                                        { this.state.oldTitle.slice(0, 10) + (this.state.oldTitle.length > 10 ? "..." : "") }
                                                    </li>
                                                </ol>
                                            </nav>
                                            <div>
                                                <button className="btn btn-light text-primary btn-icon" onClick={this.updatePortofolio} tabIndex="6">
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
                                            editorState={this.state.content || ''}
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
                                <div className="card my-3 bg-white border-danger">
                                    <div className="card-body">
                                        <div className="form-group row align-items-end">
                                            <div className="col-sm-3">
                                                <h6 className="">Danger Zone</h6>
                                                <small>Delete this portofolio? please type <b>{ this.state.oldTitle }</b> to confirm.</small>
                                            </div>
                                            <div className="col-sm-9">
                                                <div className="input-group">
                                                    <input className="form-control form-control-danger" placeholder={this.state.oldTitle} value={this.state.confirmDelete} onChange={this.confirmDelete} />
                                                    {/* <input className="form-control form-control-danger" placeholder={this.state.oldTitle} value={this.state.confirmDelete} onChangeCapture={ (e) => { this.setState({confirmDelete: e.target.value}); if (this.state.confirmDelete === this.state.oldTitle) { this.setState({ btnDelete: true }) } else { this.setState({ btnDelete: false }) }  } } /> */}
                                                    <div className="input-group-append">
                                                        <button className={"btn btn-outline-danger " + (this.state.btnDelete === false ? "disabled" : "")} disabled={ !this.state.btnDelete } onClick={this.deletePortofolio}>
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

export default connect(mapStateToProps)(PortofolioDetail);