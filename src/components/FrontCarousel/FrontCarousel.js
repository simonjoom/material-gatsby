import React, { Component } from 'react';
import {Carousel} from "react-responsive-carousel";
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-responsive-carousel/lib/styles/carousel.css';
import image01 from '../../images/index/2048a.jpg'
import image02 from '../../images/index/exp.jpg'
import image03 from '../../images/index/home-image.jpg'
import image04 from '../../images/index/nice_dog.jpg'
import image05 from '../../images/index/offpiste.jpg'
import image06 from '../../images/index/snowboard.jpg'
import image07 from '../../images/index/top.jpg'
// let Carousel = require('react-responsive-carousel').Carousel;

 const FrontCarousel = ()=>{
    return (
        <div className="carousel">
            <Carousel autoPlay infiniteLoop width="500px" className="carousel-main">
                <div>
                    <img src={image01} alt=""/>
                </div>
                <div>
                    <img src={image02} alt=""/>
                </div>
                <div>
                    <img src={image03} alt=""/>
                </div>
                <div>
                    <img src={image04} alt=""/>
                </div>
                <div>
                    <img src={image05} alt=""/>
                </div>
                <div>
                    <img src={image06} alt=""/>
                </div>
                <div>
                    <img src={image07} alt=""/>
                </div>
            </Carousel>
        </div> 
    )
}

export default FrontCarousel