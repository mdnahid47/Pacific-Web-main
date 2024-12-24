import React from 'react'
import cardImage from '../../assets/ac-service.jpg'
import fridgeImage from '../../assets/fridge.webp'
import homeApp from '../../assets/homeap.jpg'

const Content = () => {
  return (
    <div className='max-w-screen-2xl container px-10 mx-auto xl:px-24 mt-10 '>
        <div className='text-3xl mb-10 flex items-center justify-center'>
            <h1>Our Service</h1>
        </div>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='w-96 rounded-xl border shadow-lg'>
            <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
            <div className='card-body'>
                <h2 className='card-title'>Ac Service</h2>
                <p className='text-xl'>Lorem, ipsum dolor.</p>
                <div className='card-actions mt-6 justify-end '>
                    <a href="/ac-servicing"><button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white'>Order Now</button></a>
                </div>
            </div>
        </div>

        <div className='w-96 rounded-xl border shadow-lg'>
            <img className='w-96 rounded-t-xl' src={fridgeImage} alt="" />
            <div className='card-body'>
                <h2 className='card-title'>Refrigerator Service</h2>
                <p className='text-xl'>Lorem, ipsum dolor.</p>
                <div className='card-actions mt-6 justify-end '>
                    <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white '>Order Now</button>
                </div>
            </div>
        </div>

        <div className='w-96 rounded-xl border shadow-lg'>
            <img className='w-96 rounded-t-xl' src={homeApp} alt="" />
            <div className='card-body'>
                <h2 className='card-title'>Home Applaience Service</h2>
                <p className='text-xl'>Lorem, ipsum dolor.</p>
                <div className='card-actions mt-6 justify-end '>
                    <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white '>Order Now</button>
                </div>
            </div>
        </div>


      </div>

    </div>
  )
}

export default Content