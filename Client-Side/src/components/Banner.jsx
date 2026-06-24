


// import banerImg from '../assets/ac.png';

// // Import Swiper styles




// const Banner = () => {
//   const carouselItems1 = <>
//     <div className=' flex flex-col items-center px-10 py-52 text-white bg-no-repeat bg-cover  ' style={{ backgroundImage: `url(${banerImg})` }}>
//       <h1 className='text-3xl'>Lorem ipsum dolor sit.</h1>
//       <p className='text-2xl'>One-stop solution for your services. Order any service, anytime.</p>
//     </div>
//   </>
//   return (
//     <div>
//       {carouselItems1}
//                {/* <Swiper
//       // install Swiper modules
//       modules={[Navigation, Pagination, Autoplay]}
//       slidesPerView={'auto'}
//       pagination={{ clickable: true }}
//       autoplay={true}
//       onSwiper={(swiper) => console.log(swiper)}
//       onSlideChange={() => console.log('slide change')}
//     >
//       <SwiperSlide>{carouselItems1}</SwiperSlide>
//       <SwiperSlide>{carouselItems1}</SwiperSlide>
//       <SwiperSlide>{carouselItems1}</SwiperSlide>
      
      
//     </Swiper> */}

//     </div>
//   );
// };

// export default Banner

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useState } from 'react';
import banerImg from '../assets/ac.png';
import banerImg2 from '../assets/ac.png';
import banerImg3 from '../assets/ac.png';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Banner = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  // Categories data
  const categories = [
    'Home Services',
    'Electronics Repair',
    'Cleaning',
    'Beauty & Spa',
    'Fitness',
    'Education',
    'Healthcare',
    'Automotive',
    'Event Services',
    'Business Solutions'
  ];

  // Carousel data
  const carouselData = [
    {
      id: 1,
      image: banerImg,
      title: 'Lorem ipsum dolor sit.',
      description: 'One-stop solution for your services. Order any service, anytime.',
    },
    {
      id: 2,
      image: banerImg2,
      title: 'Professional Services',
      description: 'Expert services for all your needs with quality guarantee.',
    },
    {
      id: 3,
      image: banerImg3,
      title: '24/7 Available',
      description: 'Round the clock services whenever you need them.',
    },
  ];

  const CarouselItem = ({ item }) => (
    <div 
      className='relative flex items-center justify-center py-20 text-white bg-no-repeat bg-cover bg-center h-96'
      style={{ backgroundImage: `url(${item.image})` }}
    >
      {/* Dark overlay for better text readability */}
      <div className='absolute inset-0 bg-black/30'></div>
      
      {/* Content */}
      <div className='relative z-10 text-center max-w-4xl mx-auto px-4'>
        <h1 className='text-3xl md:text-4xl font-bold mb-4'>{item.title}</h1>
        <p className='text-lg md:text-xl'>{item.description}</p>
      </div>
    </div>
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchTerm);
    // Add your search logic here
  };

  return (
    <div className='relative'>
      {/* Fixed Search Bar - Outside Swiper */}
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full max-w-2xl px-4'>
        <div className='bg-white rounded-lg shadow-2xl p-2'>
          <form onSubmit={handleSearch} className='flex gap-2'>
            <div className='flex-1 relative'>
              <input
                type='text'
                placeholder='Search all services...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowCategories(true)}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              
              {/* Categories Dropdown */}
              {showCategories && (
                <div className='absolute top-full left-0 right-0 bg-white mt-2 rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto z-50'>
                  <div className='p-3 border-b border-gray-200'>
                    <h3 className='font-semibold text-gray-700'>All Categories</h3>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-1 p-2'>
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        type='button'
                        className='text-left px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200'
                        onClick={() => {
                          setSearchTerm(category);
                          setShowCategories(false);
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type='submit'
              className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold whitespace-nowrap'
            >
              Search
            </button>
          </form>
        </div>

        {/* Quick Access Categories - Below Search */}
        <div className='hidden md:flex flex-wrap gap-2 justify-center mt-4'>
          {categories.slice(0, 6).map((category, index) => (
            <button
              key={index}
              type='button'
              className='bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white hover:shadow-md transition-all duration-200'
              onClick={() => {
                setSearchTerm(category);
                setShowCategories(true);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel Section */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        navigation={true}
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={800}
        effect='fade'
        className='w-full'
      >
        {carouselData.map((item) => (
          <SwiperSlide key={item.id}>
            <CarouselItem item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay to close categories when clicking outside */}
      {showCategories && (
        <div 
          className='fixed inset-0 z-10'
          onClick={() => setShowCategories(false)}
        />
      )}
    </div>
  );
};

export default Banner;