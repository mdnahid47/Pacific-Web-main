import React from 'react';
import Banner from '../../components/Banner';
import cardImage from '../../assets/ac-service.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';
import BasicServiceModals from '../../components/Modals/BasicServiceModals';
import AcJetWashModal from '../../components/Modals/AcJetWashModal';
import FoomWashModals from '../../components/Modals/FoomWashModals';
import WaterDroopModals from '../../components/Modals/WaterDroopModals';
import CheckupModals from '../../components/Modals/CheckupModals';
import '../../App.css'


const AcServicing = () => {
    return (
        <div>
            {/* Banner  */}
            <Banner />

            {/* Items  */}

            {/* Open the modal using document.getElementById('ID').showModal() method */}

            <dialog id="my_modal_9" className="modal modal-bottom sm:modal-middle ">
                <div className="modal-box ">
                    <h1 className='text-xl'>AC Checkup</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <CheckupModals />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>


            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>AC Basic Service</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <BasicServiceModals />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

            {/* Jetwash Modal */}

            <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>AC Jet Wash</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <AcJetWashModal />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

            {/* Foom wash */}
            <dialog id="my_modal_7" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>AC Foom Wash</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <FoomWashModals />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

        {/* waterDroop */}

        <dialog id="my_modal_8" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>Ac Waterdrop Solution</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <WaterDroopModals />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>



            <div className='container px-10 md:px-0 md:gap-2 mx-auto xl:px-24'>
                <div className='text-3xl mt-20 mb-10 flex items-center justify-center'>
                    <h1 >Ac Servicing</h1>
                </div>


                <div className='grid grid-cols-1 md:grid-cols-9 md:px-10 lg:grid-cols-12 gap-10'>
                    <div className='col-span-4'>
                    <div className='w-72  rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Ac Check Up</h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                              <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white'onClick={()=>document.getElementById('my_modal_9').showModal()} >See Details</button>
                            </div>
                        </div>
                    </div>
                    </div>

                    <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Ac Service</h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                              <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('my_modal_5').showModal()}>See Details</button>
                            </div>
                        </div>
                    </div>


                    <div className='w-72 col-span-4  rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Ac jet Wash</h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                              <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('my_modal_6').showModal()}>See Details</button>
                            </div>
                        </div>
                    </div>

                    <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Ac Foom Wash</h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                              <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('my_modal_7').showModal()}>See Details</button>
                            </div>
                        </div>
                    </div>

                    <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Waterdroop Solution</h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                              <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('my_modal_8').showModal()}>See Details</button>
                            </div>
                        </div>
                    </div>
                   
                </div>




            </div>

                {/*  <div to={`/menu/${item._id}`} className="card shadow-xl relative mr-5 md:my-5">
      <div
        className={`rating gap-1 absolute right-2 top-2 p-4 heartStar bg-green ${
          isHeartFilled ? "text-rose-500" : "text-white"
        }`}
        onClick={handleHeartClick}
      >
        <FaHeart className="w-5 h-5 cursor-pointer" />
      </div>
      <Link to={`/menu/${item._id}`}>
        <figure>
          <img src={item.image} alt="Shoes" className="hover:scale-105 transition-all duration-300 md:h-72" />
        </figure>
      </Link>
      <div className="card-body">
       <Link to={`/menu/${item._id}`}><h2 className="card-title">{item.name}!</h2></Link>
        <p>Description of the item</p>
        <div className="card-actions justify-between items-center mt-2">
          <h5 className="font-semibold">
            <span className="text-sm text-red">$ </span> {item.price}
          </h5>
          <button className="btn bg-green text-white">Add to Cart </button>
        </div>
      </div>
    </div> */}

        </div>
    )
}

export default AcServicing