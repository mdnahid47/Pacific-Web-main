import React from 'react'
import Banner from '../../components/Banner'
import install from '../../assets/install.jpg'
import InstallationModal from '../../components/Modals/AcInstallationModals/InstallationModal';
import IndorModals from '../../components/Modals/AcInstallationModals/IndorModals';
import OutdoorModals from '../../components/Modals/AcInstallationModals/OutdoorModals';
import cardImage from '../../assets/ac-service.jpg';
import CheckupModals from './../../components/Modals/CheckupModals';
const AcInstallation = () => {
  return (
    <div>
        <Banner/>

        {/* pop up */}
        <dialog id="installl_1" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>AC  Installation Both Unit</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <InstallationModal/>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

            <dialog id="installl_2" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>AC  Indoor Unit Installation</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <IndorModals/>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

            <dialog id="installl_3" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className='text-xl'>AC  Outdoor Unit Installation</h1>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <OutdoorModals/>
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
                    <h1 >Ac Installation</h1>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-9 md:px-10 lg:grid-cols-12 gap-10'>
                    <div className='col-span-4'>
                    <div className='w-72  rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={install} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Ac Installation <br /> Both Unit</h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                              <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white'onClick={()=>document.getElementById('installl_1').showModal()} >See Details</button>
                            </div>
                        </div>
                    </div>
                    </div>

                    <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={install} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Ac Indoor Unit  Installation</h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                              <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('installl_2').showModal()}>See Details</button>
                            </div>
                        </div>
                    </div>


                    <div className='w-72 col-span-4  rounded-xl border shadow-lg'>
                        <img className='w-96 rounded-t-xl' src={install} alt="" />
                        <div className='card-body'>
                            <h2 className='card-title'>Ac Outdoor Unit  Installation</h2>
                            <p className='text-xl'>1-5 Ton</p>
                            <div className='card-actions mt-6 justify-end '>
                              <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('installl_3').showModal()}>See Details</button>
                            </div>
                        </div>
                    </div>                 
                </div>




            </div>

    </div>
  )
}

export default AcInstallation