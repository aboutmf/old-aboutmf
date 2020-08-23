import React, { Component } from "react";
import '../App.css';

import Cube from '../assets/img/3d.svg';


export default class Resume extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {

        return (
            <div className="container-fluid">
                <div className="container">
                    <div className="row h-100vh align-items-center order-1 justify-content-center">
                        <div className="col-md-4 order-2 order-md-2">
                            <h3 className="display-4 font-weight-bold banner-title wow fadeInUp">Resume</h3>
                            <p className="banner-text mt-4">
                                Hope this will tell you, who I am.
                            </p>
                        </div>
                        <div className="col-md-4 order-2 order-md-2">
                            <img src={Cube} alt="" className="w-100"></img>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-6 order-2 order-md-1 my-4">
                            <h1 className="mb-3">Biodata</h1>
                            <p>As long as i work as programmer specifically in web programming. I have lots of experiences and skills that have been improved after i worked as a junior programmer. Instead of shifting to another language that was booming at that time. I still carrying some of the skills that i have known to build another skills.</p>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit dignissimos dicta quod eveniet laboriosam nostrum qui, voluptate unde sint quae tempora esse magni in veritatis. Quaerat corporis esse omnis molestiae sequi a perferendis id ipsum. Ad et cumque, consequatur accusantium sit reprehenderit voluptatibus sint, quis dolor voluptates explicabo? Sint saepe recusandae magni unde?</p>
                            {/* <Link className="page-link d-inline-block" to="/about/resume">Download CV</Link> */}
                        </div>
                        <div className="col-md-6 order-1 order-md-2">
                            <h1>#FreePalestine</h1>
                            <p>#PalestinianLivesMatter</p>
                            <h5>#PalestineWillBeFree</h5>
                        </div>
                    </div>
                </div>
            </div>
        );
  }
}