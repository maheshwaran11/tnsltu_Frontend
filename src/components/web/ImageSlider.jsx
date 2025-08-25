import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slide1 from "../../assets/slides/slide1.jpg";
import slide2 from "../../assets/slides/slide2.jpg";

export default function StaticSlider() {
  const slides = [
    { id: 1, title: "Welcome to TNSLTU", image: slide1 },
    { id: 2, title: "Our Services", image: slide2 },
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  };

  return (
    <Slider {...settings} className="home-slider">
      {slides.map((slide) => (
        <div key={slide.id}>
          <img
            src={slide.image}
            alt={slide.title}
            style={{ width: "100%", height: "auto" }}
          />
          {/* <h2 style={{ textAlign: "center" }}>{slide.title}</h2> */}
        </div>
      ))}
    </Slider>
  );
}
