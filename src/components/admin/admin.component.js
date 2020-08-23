import React, { Component } from 'react';

class Admin extends Component {

    constructor(props) {
        super(props);
        this.parralax = this.parralax.bind(this);

        
    }

    componentDidMount() {
        window.addEventListener('scroll', this.parralax);
    }

    async parralax () {

        try {
            let yPos;
            let top = window.pageYOffset;
    
            let element = document.getElementsByClassName('text-background')[0];
        
            yPos = -(top * 30 / 100);
            element.setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px)');
        } catch (error) {
            
        }
    }

    render() {
        return (
            <>
                <div className="container-fluid">
                    <div className="container my-5">
                        <div className="row h-banner-100vh align-items-center order-1 justify-content-center">
                            <div className="text-background align-self-end">
                                <h1>WELCOME ADMIN!</h1>
                            </div>
                            <div className="col-md-6 order-2 order-md-1">
                                <h3 className="display-4 font-weight-bold banner-title">ADMIN &mdash; welcome to admin page!</h3>
                                <p className="banner-text">
                                    in this page you can edit, delete and add some datas to display on user pages.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Admin;