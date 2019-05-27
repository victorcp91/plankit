import React from 'react';
import { Link } from 'react-router-dom';

import css from './MainSlider.module.scss';
import Slider from "react-slick";
import sliderImage from '../assets/images/slider.png';


const SampleNextArrow = props => {
  const { onClick } = props;
  return (
    <div
      className={`${css.nextArrow}`}
      onClick={onClick}
    >
      <span className={css.nextIcon}></span>
    </div>
  );
}

const SamplePrevArrow = props => {
  const { onClick } = props;
  return (
    <div
      className={`${css.prevArrow}`}
      onClick={onClick}
    >
      <span className={css.prevIcon}></span>
    </div>
  );
}

const mainSlider = props => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerModer: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
    dotsClass: `slick-dots ${css.dots}`
  };


  return(
    <Slider {...settings} className={css.slider}>
      {props.slides.map(slide => (
        <div>
          <Link className={css.postLink} to={`${slide.channelSlug}/${slide.slug}`}>
            <div className={css.imageContainer}>
              <img src={slide.image} alt="text" className={css.sliderImage}/>
            </div>
            <h1 className={css.slideTitle}>{slide.title}</h1>
          </Link>
        </div>
      ))}
    </Slider> 
  );

}

export default mainSlider;