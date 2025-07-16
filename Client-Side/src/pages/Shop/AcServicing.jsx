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
import UniversalModal from '../../components/Modals/UniversalModal';


const AcServicing = () => {
    return (
        <div>
            {/* Banner  */}
            <Banner />

            {/* Items  */}

            {/* Open the modal using document.getElementById('ID').showModal() method */}

           <dialog id="my_modal_9" className="modal">
                <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Left Side - Modal Header and Close Button */}
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>AC Checkup Services</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        
                        {/* Right Side - Modal Content */}
                        <div className=" h-full overflow-y-auto w-full">
                            <UniversalModal category="Ac-Checkup-2" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>


           <dialog id="my_modal_5" className="modal">
                <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Left Side - Modal Header and Close Button */}
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>AC Basic Services</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        
                        {/* Right Side - Modal Content */}
                        <div className=" h-full overflow-y-auto w-full">
                            <UniversalModal category="Ac-Basic-Service" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            {/* Jetwash Modal */}

             <dialog id="my_modal_6" className="modal">
                <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Left Side - Modal Header and Close Button */}
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>AC Basic Services</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        
                        {/* Right Side - Modal Content */}
                        <div className=" h-full overflow-y-auto w-full">
                            <UniversalModal category="Ac-Jet-Wash" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* Foom wash */}
            <dialog id="my_modal_7" className="modal">
                <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Left Side - Modal Header and Close Button */}
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>AC Basic Services</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        
                        {/* Right Side - Modal Content */}
                        <div className=" h-full overflow-y-auto w-full">
                            <UniversalModal category="AC-Foom-Wash" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

        {/* waterDroop */}

        <dialog id="my_modal_8" className="modal">
                <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Left Side - Modal Header and Close Button */}
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>AC Basic Services</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        
                        {/* Right Side - Modal Content */}
                        <div className=" h-full overflow-y-auto w-full">
                            <UniversalModal category="Ac-Waterdrop-Solution" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
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

            

        </div>
    )
}

export default AcServicing

// import React from 'react';
// import Banner from '../../components/Banner';
// import cardImage from '../../assets/ac-service.jpg';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';
// import BasicServiceModals from '../../components/Modals/BasicServiceModals';
// import AcJetWashModal from '../../components/Modals/AcJetWashModal';
// import FoomWashModals from '../../components/Modals/FoomWashModals';
// import WaterDroopModals from '../../components/Modals/WaterDroopModals';
// import CheckupModals from '../../components/Modals/CheckupModals';
// import '../../App.css';
// import UniversalModal from '../../components/Modals/UniversalModal';

// const AcServicing = () => {
//     return (
//         <div className="bg-base-100">
//             {/* Banner */}
//             <Banner />

//             {/* Main Content */}
//             <div className="container mx-auto px-4 py-8">
//                 {/* Page Title */}
//                 <div className="text-center my-10">
//                     <h1 className="text-3xl font-bold">AC Servicing</h1>
//                 </div>

//                 {/* Services Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
//   {/* AC Check Up */}
//   <div className="card bg-base-100 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
//     <figure className="px-4 pt-4">
//       <img 
//         src={cardImage} 
//         alt="AC Check Up" 
//         className="rounded-xl h-36 w-full object-cover"
//       />
//     </figure>
//     <div className="card-body p-4">
//       <h2 className="card-title text-lg">AC Check Up</h2>
//       <p className="text-gray-600 text-sm">1-5 Ton</p>
//       <div className="card-actions justify-end mt-2">
//         <button 
//           className="btn btn-sm bg-gradient-to-r from-sky to-olympic border-none text-white"
//           onClick={()=>document.getElementById('my_modal_9').showModal()}
//         >
//           See Details
//         </button>
//       </div>
//     </div>
//   </div>

//   {/* AC Service */}
//   <div className="card bg-base-100 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
//     <figure className="px-4 pt-4">
//       <img 
//         src={cardImage} 
//         alt="AC Service" 
//         className="rounded-xl h-36 w-full object-cover" 
//       />
//     </figure>
//     <div className="card-body p-4">
//       <h2 className="card-title text-lg">AC Service</h2>
//       <p className="text-gray-600 text-sm">1-5 Ton</p>
//       <div className="card-actions justify-end mt-2">
//         <button 
//           className="btn btn-sm bg-gradient-to-r from-sky to-olympic border-none text-white"
//           onClick={()=>document.getElementById('my_modal_5').showModal()}
//         >
//           See Details
//         </button>
//       </div>
//     </div>
//   </div>

//   {/* AC Jet Wash */}
//   <div className="card bg-base-100 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
//     <figure className="px-4 pt-4">
//       <img 
//         src={cardImage} 
//         alt="AC Jet Wash" 
//         className="rounded-xl h-36 w-full object-cover" 
//       />
//     </figure>
//     <div className="card-body p-4">
//       <h2 className="card-title text-lg">AC Jet Wash</h2>
//       <p className="text-gray-600 text-sm">1-5 Ton</p>
//       <div className="card-actions justify-end mt-2">
//         <button 
//           className="btn btn-sm bg-gradient-to-r from-sky to-olympic border-none text-white"
//           onClick={()=>document.getElementById('my_modal_6').showModal()}
//         >
//           See Details
//         </button>
//       </div>
//     </div>
//   </div>

//   {/* AC Foam Wash */}
//   <div className="card bg-base-100 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
//     <figure className="px-4 pt-4">
//       <img 
//         src={cardImage} 
//         alt="AC Foam Wash" 
//         className="rounded-xl h-36 w-full object-cover" 
//       />
//     </figure>
//     <div className="card-body p-4">
//       <h2 className="card-title text-lg">AC Foam Wash</h2>
//       <p className="text-gray-600 text-sm">1-5 Ton</p>
//       <div className="card-actions justify-end mt-2">
//         <button 
//           className="btn btn-sm bg-gradient-to-r from-sky to-olympic border-none text-white"
//           onClick={()=>document.getElementById('my_modal_7').showModal()}
//         >
//           See Details
//         </button>
//       </div>
//     </div>
//   </div>

//   {/* Waterdrop Solution */}
//   <div className="card bg-base-100 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
//     <figure className="px-4 pt-4">
//       <img 
//         src={cardImage} 
//         alt="Waterdrop Solution" 
//         className="rounded-xl h-36 w-full object-cover" 
//       />
//     </figure>
//     <div className="card-body p-4">
//       <h2 className="card-title text-lg">Waterdrop Solution</h2>
//       <p className="text-gray-600 text-sm">1-5 Ton</p>
//       <div className="card-actions justify-end mt-2">
//         <button 
//           className="btn btn-sm bg-gradient-to-r from-sky to-olympic border-none text-white"
//           onClick={()=>document.getElementById('my_modal_8').showModal()}
//         >
//           See Details
//         </button>
//       </div>
//     </div>
//   </div>
// </div>

//                 {/* Full Text Content */}
//                 <div className="mt-16 max-w-4xl mx-auto space-y-8">
//                     <section>
//                         <h2 className="text-2xl font-bold mb-4">Overview of AC Repair Service</h2>
//                         <div className="space-y-6">
//                             <div>
//                                 <h3 className="text-xl font-semibold mb-2">What's Included?</h3>
//                                 <ul className="list-disc pl-5 space-y-1">
//                                     <li>Only service charge</li>
//                                     <li>7 Days service warranty</li>
//                                 </ul>
//                             </div>
                            
//                             <div>
//                                 <h3 className="text-xl font-semibold mb-2">What's Excluded?</h3>
//                                 <ul className="list-disc pl-5 space-y-1">
//                                     <li>Price of materials or parts</li>
//                                     <li>Transportation cost for carrying new materials/parts</li>
//                                     <li>Warranty given by manufacturer</li>
//                                 </ul>
//                             </div>
                            
//                             <div>
//                                 <h3 className="text-xl font-semibold mb-2">Available Services</h3>
//                                 <div className="grid grid-cols-1 gap-2">
//                                     <div className="flex items-center">
//                                         <span className="mr-2">•</span>
//                                         <span>AC Basic Servicing</span>
//                                     </div>
//                                     <div className="flex items-center">
//                                         <span className="mr-2">•</span>
//                                         <span>AC Master Service</span>
//                                     </div>
//                                     <div className="flex items-center">
//                                         <span className="mr-2">•</span>
//                                         <span>AC Water Drop Solution</span>
//                                     </div>
//                                     <div className="flex items-center">
//                                         <span className="mr-2">•</span>
//                                         <span>AC Jet Wash</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     <section>

//                         <div className="space-y-6">
//                           <div className="space-y-8">
//   {/* How to Order Section */}
//   <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
//     <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
//       <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//       </svg>
//       How to order
//     </h3>
//     <div className="space-y-4">
//       <div className="flex items-start">
//         <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm font-medium">
//           1
//         </div>
//         <div>
//           <h4 className="font-semibold text-gray-700">Select service</h4>
//           <p className="text-gray-600 text-sm mt-1">From the category, select the service you are looking for.</p>
//         </div>
//       </div>
//       <div className="flex items-start">
//         <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm font-medium">
//           2
//         </div>
//         <div>
//           <h4 className="font-semibold text-gray-700">Book your schedule</h4>
//           <p className="text-gray-600 text-sm mt-1">Select your convenient time slot.</p>
//         </div>
//       </div>
//       <div className="flex items-start">
//         <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm font-medium">
//           3
//         </div>
//         <div>
//           <h4 className="font-semibold text-gray-700">Place order</h4>
//           <p className="text-gray-600 text-sm mt-1">Confirm your order by clicking 'Place order'.</p>
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* FAQ Section */}
//   <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
//     <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
//       <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//       FAQ
//     </h3>
//     <div className="space-y-5">
//       <div className="pb-4 border-b border-gray-100">
//         <h4 className="font-semibold text-gray-700">Do I have to pay any charge if I don't take any service?</h4>
//         <p className="text-gray-600 text-sm mt-2">
//           If you don't avail any services for your AC after our Service Provider sends a technician to your doorstep, then you only have to pay the visiting charge which is BDT 200.
//         </p>
//       </div>
//       <div className="pb-4 border-b border-gray-100">
//         <h4 className="font-semibold text-gray-700">Do I have to pay advance money before availing your service?</h4>
//         <p className="text-gray-600 text-sm mt-2">
//           [Your answer here]
//         </p>
//       </div>
//       <div className="pb-4 border-b border-gray-100">
//         <h4 className="font-semibold text-gray-700">Is this only for household AC?</h4>
//         <p className="text-gray-600 text-sm mt-2">
//           [Your answer here]
//         </p>
//       </div>
//       <div className="pb-4 border-b border-gray-100">
//         <h4 className="font-semibold text-gray-700">What if they damage my AC?</h4>
//         <p className="text-gray-600 text-sm mt-2">
//           [Your answer here]
//         </p>
//       </div>
//       <div className="pb-4 border-b border-gray-100">
//         <h4 className="font-semibold text-gray-700">Do you give Materials/Parts warranty?</h4>
//         <p className="text-gray-600 text-sm mt-2">
//           [Your answer here]
//         </p>
//       </div>
//       <div>
//         <h4 className="font-semibold text-gray-700">Can I buy AC materials/parts by myself and ask your technician to use them?</h4>
//         <p className="text-gray-600 text-sm mt-2">
//           [Your answer here]
//         </p>
//       </div>
//     </div>
//   </div>
// </div>
                            
//                             <div>
//                                 <h3 className="text-lg font-semibold mb-2">Details</h3>
//                                 <p className="text-gray-600">
//                                     At Pacific Refrigeration you can hire expert AC repair service near you. Our professional Service Providers will give you the best AC repair service. From general inspection, to changing AC parts you can avail every AC related service within a few moments.
//                                 </p>
//                             </div>
//                         </div>
//                     </section>

//                     <section>
//                         <h2 className="text-2xl font-bold mb-4">About Pacific Refrigeration's AC Repairing Service</h2>
//                         <p className="text-gray-600 mb-6">
//                          we serve you with every possible service. AC Repairing service is one of our services to repair all types of AC related problems. We deliver expert and AC repair services with integrity from our professional service providers.
//                         </p>
                        
//                         <h3 className="text-xl font-semibold mb-3">Available Services</h3>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-6">
//                             {[
//                                 'AC Checkup', 'AC Basic Servicing', 'AC Gas Charge', 
//                                 'AC Master Service', 'AC Water Drop Solution', 'AC Installation',
//                                 'AC Shifting Service', 'AC Compressor Fitting', 'AC Dismantling',
//                                 'AC Jet Wash', 'AC Service Repairing', 'Special Corporate Ac Service'
//                             ].map((service, index) => (
//                                 <div key={index} className="flex items-center">
//                                     <span className="mr-2">•</span>
//                                     <span>{service}</span>
//                                 </div>
//                             ))}
//                         </div>
                        
//                         <div className="space-y-6">
//                             <div>
//                                 <h4 className="font-semibold">AC Checkup Service:</h4>
//                                 <p className="text-gray-600">AC Checkup service offers only the diagnosis of your Air Conditioner by an expert technician who performs initial tests for problem identification.</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold">AC Basic Servicing:</h4>
//                                 <p className="text-gray-600">AC Basic service offers primary diagnosis, filter cleaning, test and identify problems by an expert AC technician.</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold">AC Gas Charge:</h4>
//                                 <p className="text-gray-600">This service offers a performance checkup and post gas refill. If there is a leakage; most of the time AC can be fixed onsite but sometimes it might take a longer time. For that, you have to wait for 1 or 2 days.</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold">AC Master Service:</h4>
//                                 <p className="text-gray-600">AC Master Service offers detail cleaning of the indoor and outdoor units including minor problem-fixing (excluding materials and parts). The service charge varies on your AC amount, height, weight and difficulties.</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold">AC Water Drop Solution:</h4>
//                                 <p className="text-gray-600">This service offers identification of the source of dripping water from your AC and fixation water drainage system accordingly. Any additional materials/parts will be charged separately.</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold">AC Shifting Service:</h4>
//                                 <p className="text-gray-600">This service is to shift your AC unit from one place or floor to the loading truck. Only the service charge is applicable for this service. The service charge varies on your AC amount, height, weight, and difficulties.</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold">AC Compressor Fitting With Gas Charge:</h4>
//                                 <p className="text-gray-600">This service offers old Compressor removal and new Compressor installation. Compressor price and warranty differ as per manufacturer.</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold">AC Jet Wash:</h4>
//                                 <p className="text-gray-600">AC Jet Wash offers detailed cleaning of the indoor and outdoor units with Jet Wash Machine including minor problem-fixing (excluding materials and parts). The service charge varies on your AC amount, height, weight, and difficulties.</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold">AC Dismantling:</h4>
//                                 <p className="text-gray-600">This service offers dismantling AC from home or workplace and disconnecting all the electrical wiring from the AC unit.</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold">AC Capacitor Replacement:</h4>
//                                 <p className="text-gray-600">This service offers to replace the AC capacitor with a new one. Capacitor price and warranty differ as per manufacturer.</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold">AC Circuit Repairing:</h4>
//                                 <p className="text-gray-600">This service offers to repair the circuits of your AC. Circuit box price and warranty differ as per manufacturer.</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold">Special Corporate Ac Service:</h4>
//                                 <p className="text-gray-600">This service offer you dedicated key account manager for your massive corporate ac solution.</p>
//                             </div>
//                         </div>
//                     </section>

//                     <section>
//                         <h2 className="text-2xl font-bold mb-4">Why Us?</h2>
//                         <div className="space-y-4">
//                             <div>
//                                 <h3 className="text-lg font-semibold">Hassle-Free:</h3>
//                                 <p className="text-gray-600">Ordering AC repair service from us is simple and easy. You can hire expert Service Providers from us hassle-free to carry your AC here and there. Our Service Provider will come to your doorstep for you.</p>
//                             </div>
//                             <div>
//                                 <h3 className="text-lg font-semibold">Budget-Friendly:</h3>
//                                 <p className="text-gray-600">You can hire a professional AC repair service in the same budget or less than any other local services near you. Our Service Providers will provide expert AC technicians to inspect problems and fix them.</p>
//                             </div>
//                             <div>
//                                 <h3 className="text-lg font-semibold">Well-trained Professionals:</h3>
//                                 <p className="text-gray-600">Our professional Service Providers have discreet and skilled AC repair technicians. Their backgrounds are thoroughly checked in detail. Safety Assurance: Our service providers offer a safe AC repairing service for you. This means they will handle repairs with care.</p>
//                             </div>
//                         </div>
//                     </section>

//                     <section>
//                         <h2 className="text-2xl font-bold mb-4">Pricing</h2>
//                         <p className="text-gray-600">
//                             You only have to pay the service charge including materials/parts cost if taken using cost will have to pay if no service is avail payment:
//                             After service completion you will receive a text message on your mobile from Sheba.xyz then you have to pay through Online or Cash on Delivery.
//                         </p>
//                     </section>

//                     <section>
//                         <h2 className="text-2xl font-bold mb-4">Liability</h2>
//                         <p className="text-gray-600">
//                             Pacific will not be liable for any pre-existing issues or potential risks reported by the technician but not handled due to the customer's refusal to repair.
//                         </p>
//                     </section>
//                 </div>
//             </div>

//             {/* Modals - Kept exactly the same as your original */}
//             <dialog id="my_modal_9" className="modal">
//                 <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
//                     <div className="flex flex-col lg:flex-row h-full">
//                         <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
//                             <h1 className='text-2xl font-bold'>AC Checkup Services</h1>
//                             <form method="dialog">
//                                 <button className="btn btn-sm btn-circle btn-ghost">✕</button>
//                             </form>
//                         </div>
//                         <div className="h-full overflow-y-auto w-full">
//                             <UniversalModal category="Ac-Checkup-2" />
//                         </div>
//                     </div>
//                 </div>
//                 <form method="dialog" className="modal-backdrop">
//                     <button>close</button>
//                 </form>
//             </dialog>

//             <dialog id="my_modal_5" className="modal">
//                 <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
//                     <div className="flex flex-col lg:flex-row h-full">
//                         <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
//                             <h1 className='text-2xl font-bold'>AC Basic Services</h1>
//                             <form method="dialog">
//                                 <button className="btn btn-sm btn-circle btn-ghost">✕</button>
//                             </form>
//                         </div>
//                         <div className="h-full overflow-y-auto w-full">
//                             <UniversalModal category="Ac-Basic-Service" />
//                         </div>
//                     </div>
//                 </div>
//                 <form method="dialog" className="modal-backdrop">
//                     <button>close</button>
//                 </form>
//             </dialog>

//             <dialog id="my_modal_6" className="modal">
//                 <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
//                     <div className="flex flex-col lg:flex-row h-full">
//                         <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
//                             <h1 className='text-2xl font-bold'>AC Basic Services</h1>
//                             <form method="dialog">
//                                 <button className="btn btn-sm btn-circle btn-ghost">✕</button>
//                             </form>
//                         </div>
//                         <div className="h-full overflow-y-auto w-full">
//                             <UniversalModal category="Ac-Jet-Wash" />
//                         </div>
//                     </div>
//                 </div>
//                 <form method="dialog" className="modal-backdrop">
//                     <button>close</button>
//                 </form>
//             </dialog>

//             <dialog id="my_modal_7" className="modal">
//                 <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
//                     <div className="flex flex-col lg:flex-row h-full">
//                         <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
//                             <h1 className='text-2xl font-bold'>AC Basic Services</h1>
//                             <form method="dialog">
//                                 <button className="btn btn-sm btn-circle btn-ghost">✕</button>
//                             </form>
//                         </div>
//                         <div className="h-full overflow-y-auto w-full">
//                             <UniversalModal category="AC-Foom-Wash" />
//                         </div>
//                     </div>
//                 </div>
//                 <form method="dialog" className="modal-backdrop">
//                     <button>close</button>
//                 </form>
//             </dialog>

//             <dialog id="my_modal_8" className="modal">
//                 <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
//                     <div className="flex flex-col lg:flex-row h-full">
//                         <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
//                             <h1 className='text-2xl font-bold'>AC Basic Services</h1>
//                             <form method="dialog">
//                                 <button className="btn btn-sm btn-circle btn-ghost">✕</button>
//                             </form>
//                         </div>
//                         <div className="h-full overflow-y-auto w-full">
//                             <UniversalModal category="Ac-Waterdrop-Solution" />
//                         </div>
//                     </div>
//                 </div>
//                 <form method="dialog" className="modal-backdrop">
//                     <button>close</button>
//                 </form>
//             </dialog>
//         </div>
//     )
// }

// export default AcServicing;