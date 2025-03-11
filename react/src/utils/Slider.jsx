import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../css/Slider.css";
import Inyector01 from '../images/Inyector01.jpg'
import Inyector02 from '../images/Inyector02.jpg'
import Inyector03 from '../images/Inyector03.jpg'

const SliderComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [intervalId, setIntervalId] = useState(null); 
    const slides = [Inyector01, Inyector02, Inyector03];

  const resetInterval = () => {
    if (intervalId) {
      clearInterval(intervalId); 
    }
    const newIntervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 12000);
    setIntervalId(newIntervalId); 
  };

  useEffect(() => {
    resetInterval(); 

    return () => {
      if (intervalId) {
        clearInterval(intervalId); 
      }
    };
  }, [slides.length]); 


    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        resetInterval(); 

    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        resetInterval(); 

    };

    return (
        <div className="slider-container">
            <button className="slider-btn left" onClick={handlePrev}>
                <FaChevronLeft size={30} />
            </button>

            <div className="slides-wrapper">
                {slides.map((slide, index) => {
                    let positionClass = "";
                    if (index === currentIndex) {
                        positionClass = "active";
                    } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                        positionClass = "left";
                    } else if (index === (currentIndex + 1) % slides.length) {
                        positionClass = "right";
                    }

                    return (
                        <div key={index} className={`slide ${positionClass}`}>
                            <img src={slide} alt={`Slide ${index + 1}`} />
                        </div>
                    );
                })}
            </div>

            <button className="slider-btn right" onClick={handleNext}>
                <FaChevronRight size={30} />
            </button>
        </div>
    );
};

export default SliderComponent;
