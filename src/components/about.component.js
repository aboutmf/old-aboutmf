import React, { Component } from "react";
// import { Link } from 'react-router-dom';
import '../App.css';
import { Helmet } from 'react-helmet';

export default class About extends Component {

    constructor(props) {
        super(props);

        this.parralax = this.parralax.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        window.addEventListener('scroll', this.parralax);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.parralax);
    }

    parralax() {
        let top = window.pageYOffset;
    
        let title = document.getElementsByClassName('text-background');
        let img = document.getElementsByClassName('image-banner-img');
        let titleSpeed, imgSpeed, titleYPos, imgYPos;
        titleSpeed = 30;
        imgSpeed = 10;
        titleYPos = (top * titleSpeed / 100);
        imgYPos = -(top * imgSpeed / 100);
        title[0].setAttribute('style', 'transform: translate3d(0px, ' + titleYPos + 'px, 0px)');
        img[0].setAttribute('style', 'transform: translate3d(0px, ' + imgYPos + 'px, 0px)');
    }

    render() {

        return (
            <>
                <Helmet>
                    <title>About - MF.</title>
                    <meta name="description" value="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum quae cumque odit corporis officia consequatur commodi deleniti quisquam facilis error?"></meta>
                </Helmet>
                <div className="container-fluid mb-5" id="about">
                    <div className="d-flex h-banner-100vh align-items-center order-1 justify-content-center">
                        <div className="text-background">
                            <h1>THE ABOUT.</h1>
                        </div>
                        <div className="image-banner">
                            <img src="https://bridge311.qodeinteractive.com/wp-content/uploads/2020/01/p1-img-01.jpg" alt="" className="image-banner-img" />
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae reprehenderit ipsum non neque officia illo sint ex modi voluptatem asperiores cumque, vitae nisi impedit alias assumenda optio consequuntur! Dicta, fugit!</p>
                            <div className="vertical-line"></div>
                        </div>
                    </div>
                    <div className="container" id="content">
                        <div className="row justify-content-center my-5">
                            <div className="col-md-5 my-2">
                                <h3 className="display-4 font-weight-bold about-title-section">EDUCATIONS</h3>
                            </div>
                            <div className="col-md-5 my-md-2 my-0">
                                <ul className="my-0 my-md-1">
                                    <li>Software Engineering Major &mdash; SMK Wikrama Bogor (2017 - 2020)</li>
                                    <li>Ruby Fundamental &mdash; Owala Bootcamp (Nov 2019)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="row justify-content-center my-5">
                            <div className="col-md-5 my-md-2 my-0">
                                <h3 className="display-4 font-weight-bold about-title-section">AWARDS</h3>
                            </div>
                            <div className="col-md-5 my-1">
                                <ul>
                                    <li>7th Web Technologies &mdash; Lomba Kompetensi Siswa Provinsi Jawa Barat (2019)</li>
                                    <li>3rd Web Design &mdash; Olimpiade TIK Nasional (2019)</li>
                                    <li>1st Web Technologies &mdash; Lomba Kompetensi Siswa Kota Bogor (2019)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="row justify-content-center my-5">
                            <div className="col-md-5 my-md-2 my-0">
                                <h3 className="display-4 font-weight-bold about-title-section">EXPERIENCE</h3>
                            </div>
                            <div className="col-md-5 my-1">
                                <ul>
                                    <li>Junior Programmer &mdash; Kejar.id (Apr - Sep 2020, Contract)</li>
                                    <li>Back-end Developer &mdash; Insyst Media Solutions (Jan - Apr 2019, Internship)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
  }
}