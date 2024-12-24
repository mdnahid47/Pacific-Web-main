


import banerImg from '../assets/ac.png';

// Import Swiper styles




const Banner = () => {
  const carouselItems1 = <>
    <div className=' flex flex-col items-center px-10 py-52 text-white bg-no-repeat bg-cover  ' style={{ backgroundImage: `url(${banerImg})` }}>
      <h1 className='text-3xl'>Lorem ipsum dolor sit.</h1>
      <p className='text-2xl'>One-stop solution for your services. Order any service, anytime.</p>
    </div>
  </>
  return (
    <div>
      {carouselItems1}
               {/* <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={'auto'}
      pagination={{ clickable: true }}
      autoplay={true}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
    >
      <SwiperSlide>{carouselItems1}</SwiperSlide>
      <SwiperSlide>{carouselItems1}</SwiperSlide>
      <SwiperSlide>{carouselItems1}</SwiperSlide>
      
      
    </Swiper> */}

    </div>
  );
};

export default Banner