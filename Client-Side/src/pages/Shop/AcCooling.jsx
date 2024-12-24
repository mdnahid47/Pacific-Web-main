import React from 'react';
import Banner from '../../components/Banner';
import cardImage from '../../assets/ac-service.jpg';
import Compressore from '../../assets/compressor.jpg';
import Capcitor from '../../assets/Capacitor-2.jpg';
import Leack from '../../assets/Leack.jpeg';
import pcb from '../../assets/pcb-board.jpg';
import gasCharge from '../../assets/refrigerant.jpg';
import GasChargeModal from '../../components/Modals/CoolingModal/GasChargeModal';
import LeackModals from '../../components/Modals/CoolingModal/LeackModals';
import CircuitModals from '../../components/Modals/CoolingModal/CircuitModals';
import CapacitorModals from '../../components/Modals/CoolingModal/CapacitorModals';
import CompressoreModals from '../../components/Modals/CoolingModal/CompressoreModals';
import CheckupModals from './../../components/Modals/CheckupModals';

const AcCooling = () => {
    return (
        <div>
            {/* Banner */}
            <Banner />

            {/* Modals */}

            <dialog id="my_modal_9" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
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

            <dialog id="cooling_1" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>AC Gas Charge</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <GasChargeModal />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

            <dialog id="cooling_2" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>AC Leack Repair</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <LeackModals />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

            <dialog id="cooling_3" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>AC Circuit Repair</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <CircuitModals />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

            <dialog id="cooling_4" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>AC Capacitor Replace</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <CapacitorModals />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

            <dialog id="cooling_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>AC Compressore Fitting & Gas Charge</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <CompressoreModals />
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
            {/* card item  */}
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


                    <div className='col-span-4'>
                        <div className='w-72  rounded-xl border shadow-lg'>
                            <img className='w-96 rounded-t-xl' src={gasCharge} alt="" />
                            <div className='card-body'>
                                <h2 className='card-title'>Ac Gas Charge</h2>
                                <p className='text-xl'>1-5 Ton</p>
                                <div className='card-actions mt-6 justify-end '>
                                    <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={() => document.getElementById('cooling_1').showModal()} >See Details</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={Leack} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Ac Leack Repair </h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                                <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={() => document.getElementById('cooling_2').showModal()}>See Details</button>
                            </div>
                        </div>
                    </div>


                    <div className='w-72 col-span-4  rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={pcb} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Ac Circuit Repair</h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                                <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={() => document.getElementById('cooling_3').showModal()}>See Details</button>
                            </div>
                        </div>
                    </div>

                    <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={Capcitor} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Ac Capacitor Replace</h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                                <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={() => document.getElementById('cooling_4').showModal()}>See Details</button>
                            </div>
                        </div>
                    </div>

                    <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={Compressore} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Ac Compressor
                                <br />Fitting & Gas Charge
                            </h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                                <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={() => document.getElementById('cooling_5').showModal()}>See Details</button>
                            </div>
                        </div>
                    </div>

                </div>




            </div>




        </div>
    )
}

export default AcCooling