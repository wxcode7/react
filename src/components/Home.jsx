import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from './Footer';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const sliderRef = useRef(null);
  const slideRefs = useRef([]);

  // About section refs
  const aboutImageRef = useRef(null);
  const aboutContentRef = useRef(null);
  const aboutHeadingRef = useRef(null);
  const aboutTextRef = useRef(null);
  const aboutButtonRef = useRef(null);
  const aboutSectionRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: "Welcome to Our Website",
      description: "Discover amazing features and services",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    },
    {
      id: 2,
      title: "Innovative Solutions",
      description: "We provide cutting-edge technology solutions",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 3,
      title: "Expert Team",
      description: "Our team of professionals is here to help you",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ];

  // Initialize slide refs
  useEffect(() => {
    slideRefs.current = slides.map(() => React.createRef());
  }, []);

  const animateSlideContent = useCallback((slideIndex) => {
    const currentSlideRef = slideRefs.current[slideIndex];
    if (!currentSlideRef.current) return;

    const title = currentSlideRef.current.querySelector('.slide-title');
    const description = currentSlideRef.current.querySelector('.slide-description');
    const button = currentSlideRef.current.querySelector('.slide-button');

    // Reset initial positions
    gsap.set([title, description, button], {
      opacity: 0,
      y: 50
    });

    // Animate content in sequence
    gsap.timeline()
      .to(title, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .to(description, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4")
      .to(button, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = prev === slides.length - 1 ? 0 : prev + 1;
      animateSlideContent(next);
      return next;
    });
  }, [slides.length, animateSlideContent]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = prev === 0 ? slides.length - 1 : prev - 1;
      animateSlideContent(next);
      return next;
    });
  }, [slides.length, animateSlideContent]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto slide effect with pause on hover
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, nextSlide]);

  // Animate initial slide
  useEffect(() => {
    animateSlideContent(currentSlide);
  }, [currentSlide, animateSlideContent]);

  // About section animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          markers: false // Set to true for debugging
        }
      });

      tl.from(aboutImageRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      })
      .from(aboutHeadingRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5")
      .from(aboutTextRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4")
      .from(aboutButtonRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");
    }, aboutSectionRef);

    return () => ctx.revert();
  }, []);

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="relative w-full">
      {/* Hero Section with Slider */}
      <section 
        className="relative w-full overflow-hidden"
        style={{ height: `${windowHeight}px` }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Slider */}
        <div className="relative h-full w-full" ref={sliderRef}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              ref={slideRefs.current[index]}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 translate-x-0'
                  : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
              }`}
            >
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="max-w-3xl px-4">
                  <h1 
                    className="slide-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                  >
                    {slide.title}
                  </h1>
                  <p 
                    className="slide-description text-lg sm:text-xl text-white mb-8"
                  >
                    {slide.description}
                  </p>
                  <button 
                    className="slide-button px-6 sm:px-8 py-2 sm:py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <button
          onClick={() => {
            prevSlide();
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 p-2 rounded-full transition-all duration-300 z-10"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={24} />
        </button>
        <button
          onClick={() => {
            nextSlide();
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 p-2 rounded-full transition-all duration-300 z-10"
          aria-label="Next slide"
        >
          <FaChevronRight size={24} />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section 
        ref={aboutSectionRef}
        className="min-h-screen py-20 px-4 md:px-8 lg:px-16 bg-white flex items-center"
      >
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Side - Image */}
            <div 
              ref={aboutImageRef}
              className="w-full lg:w-1/2 h-[400px] lg:h-[500px] overflow-hidden rounded-lg shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="About Us"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right Side - Content */}
            <div 
              ref={aboutContentRef}
              className="w-full lg:w-1/2 space-y-6"
            >
              <h2 
                ref={aboutHeadingRef}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800"
              >
                About Our Company
              </h2>
              <p 
                ref={aboutTextRef}
                className="text-lg text-gray-600 leading-relaxed"
              >
                We are a team of passionate professionals dedicated to providing innovative solutions 
                for our clients. With years of experience in the industry, we combine creativity with 
                technical expertise to deliver exceptional results. Our mission is to help businesses 
                grow and succeed in the digital age.
              </p>
              <button
                ref={aboutButtonRef}
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 group"
              >
                Explore More
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home; 