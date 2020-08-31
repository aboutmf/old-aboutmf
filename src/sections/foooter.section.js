import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';

class FooterSection extends Component {

    constructor(props) {
        super(props);

        this.scrollToTop = this.scrollToTop.bind(this);
    }

    scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    render() {
        return (
            <footer>
                <div className="container px-3 px-md-5">
                    <div className="row justify-content-center">
                        <div className="col-md-3 my-2">
                            <h4>General</h4>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/portofolio">Portofolio</Link></li>
                                <li><Link to="/blog">Blog</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 my-2">
                        <h4>Extras</h4>
                            <ul>
                                <li><Link to="/">Uses</Link> <span className="badge">COMING SOON</span></li>
                                <li><Link to="/">Reading</Link> <span className="badge">COMING SOON</span></li>
                            </ul>
                        </div>
                        <div className="col-md-3 my-2">
                            <h4>Connect</h4>
                            <ul>
                                <li><Link to="/">LinkedIn</Link></li>
                                <li><Link to="/">Instagram</Link></li>
                                <li><Link to="/">Email</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 my-2">
                            <div className="d-flex align-items-end flex-column h-100">
                                <h4 className="font-weight-bold back-to-top"><span><Icon.ArrowUp onClick={this.scrollToTop} /></span></h4>
                                <div className="mt-auto p-2">
                                <small>Originally Build with <span className="text-danger">&hearts;</span> by MF 2020</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default FooterSection;