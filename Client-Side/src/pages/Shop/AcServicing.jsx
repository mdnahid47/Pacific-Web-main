// import React from 'react';
// import Banner from '../../components/Banner';
// import cardImage from '../../assets/ac.png';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';
// // import BasicServiceModals from '../../components/Modals/BasicServiceModals';
// // import AcJetWashModal from '../../components/Modals/AcJetWashModal';
// // import FoomWashModals from '../../components/Modals/FoomWashModals';
// // import WaterDroopModals from '../../components/Modals/WaterDroopModals';
// // import CheckupModals from '../../components/Modals/CheckupModals';
// import '../../App.css'
// import UniversalModal from '../../components/Modals/UniversalModal';


// const AcServicing = () => {
//     return (
//         <div>
//             {/* Banner  */}
//             <Banner />

//             {/* Items  */}

//             {/* Open the modal using document.getElementById('ID').showModal() method */}

//            <dialog id="my_modal_9" className="modal">
//                 <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
//                     <div className="flex flex-col lg:flex-row h-full">
//                         {/* Left Side - Modal Header and Close Button */}
//                         <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
//                             <h1 className='text-2xl font-bold'>AC Checkup Services</h1>
//                             <form method="dialog">
//                                 <button className="btn btn-sm btn-circle btn-ghost">✕</button>
//                             </form>
//                         </div>
                        
//                         {/* Right Side - Modal Content */}
//                         <div className=" h-full overflow-y-auto w-full">
//                             <UniversalModal category="Ac-Checkup-2" />
//                         </div>
//                     </div>
//                 </div>
//                 <form method="dialog" className="modal-backdrop">
//                     <button>close</button>
//                 </form>
//             </dialog>


//            <dialog id="my_modal_5" className="modal">
//                 <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
//                     <div className="flex flex-col lg:flex-row h-full">
//                         {/* Left Side - Modal Header and Close Button */}
//                         <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
//                             <h1 className='text-2xl font-bold'>AC Basic Services</h1>
//                             <form method="dialog">
//                                 <button className="btn btn-sm btn-circle btn-ghost">✕</button>
//                             </form>
//                         </div>
                        
//                         {/* Right Side - Modal Content */}
//                         <div className=" h-full overflow-y-auto w-full">
//                             <UniversalModal category="Ac-Basic-Service" />
//                         </div>
//                     </div>
//                 </div>
//                 <form method="dialog" className="modal-backdrop">
//                     <button>close</button>
//                 </form>
//             </dialog>
//             {/* Jetwash Modal */}

//              <dialog id="my_modal_6" className="modal">
//                 <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
//                     <div className="flex flex-col lg:flex-row h-full">
//                         {/* Left Side - Modal Header and Close Button */}
//                         <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
//                             <h1 className='text-2xl font-bold'>AC Basic Services</h1>
//                             <form method="dialog">
//                                 <button className="btn btn-sm btn-circle btn-ghost">✕</button>
//                             </form>
//                         </div>
                        
//                         {/* Right Side - Modal Content */}
//                         <div className=" h-full overflow-y-auto w-full">
//                             <UniversalModal category="Ac-Jet-Wash" />
//                         </div>
//                     </div>
//                 </div>
//                 <form method="dialog" className="modal-backdrop">
//                     <button>close</button>
//                 </form>
//             </dialog>

//             {/* Foom wash */}
//             <dialog id="my_modal_7" className="modal">
//                 <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
//                     <div className="flex flex-col lg:flex-row h-full">
//                         {/* Left Side - Modal Header and Close Button */}
//                         <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
//                             <h1 className='text-2xl font-bold'>AC Basic Services</h1>
//                             <form method="dialog">
//                                 <button className="btn btn-sm btn-circle btn-ghost">✕</button>
//                             </form>
//                         </div>
                        
//                         {/* Right Side - Modal Content */}
//                         <div className=" h-full overflow-y-auto w-full">
//                             <UniversalModal category="AC-Foom-Wash" />
//                         </div>
//                     </div>
//                 </div>
//                 <form method="dialog" className="modal-backdrop">
//                     <button>close</button>
//                 </form>
//             </dialog>

//         {/* waterDroop */}

//         <dialog id="my_modal_8" className="modal">
//                 <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
//                     <div className="flex flex-col lg:flex-row h-full">
//                         {/* Left Side - Modal Header and Close Button */}
//                         <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
//                             <h1 className='text-2xl font-bold'>AC Basic Services</h1>
//                             <form method="dialog">
//                                 <button className="btn btn-sm btn-circle btn-ghost">✕</button>
//                             </form>
//                         </div>
                        
//                         {/* Right Side - Modal Content */}
//                         <div className=" h-full overflow-y-auto w-full">
//                             <UniversalModal category="Ac-Waterdrop-Solution" />
//                         </div>
//                     </div>
//                 </div>
//                 <form method="dialog" className="modal-backdrop">
//                     <button>close</button>
//                 </form>
//             </dialog>


//             <div className='container px-10 md:px-0 md:gap-2 mx-auto xl:px-24'>
//                 <div className='text-3xl mt-20 mb-10 flex items-center justify-center'>
//                     <h1 >Ac Servicing</h1>
//                 </div>


//                 <div className='grid grid-cols-1 md:grid-cols-9 md:px-10 lg:grid-cols-12 gap-10'>
//                     <div className='col-span-4'>
//                     <div className='w-72  rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac Check Up</h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                               <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white'onClick={()=>document.getElementById('my_modal_9').showModal()} >See Details</button>
//                             </div>
//                         </div>
//                     </div>
//                     </div>

//                     <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac Service</h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                               <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('my_modal_5').showModal()}>See Details</button>
//                             </div>
//                         </div>
//                     </div>


//                     <div className='w-72 col-span-4  rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac jet Wash</h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                               <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('my_modal_6').showModal()}>See Details</button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac Foom Wash</h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                               <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('my_modal_7').showModal()}>See Details</button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Waterdroop Solution</h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                               <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('my_modal_8').showModal()}>See Details</button>
//                             </div>
//                         </div>
//                     </div>
                   
//                 </div>




//             </div>

            

//         </div>
//     )
// }

// export default AcServicing

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

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaTools, FaClock, FaShieldAlt, FaStar, FaCheck, FaArrowRight, FaPhone, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import { GiTechnoHeart } from 'react-icons/gi';
import Banner from '../../components/Banner';
import cardImage from '../../assets/ac.png';
import jetImage from '../../assets/jetWash.jpg';
import waterDrop from '../../assets/waterdrop.png';
import UniversalModal from '../../components/Modals/UniversalModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const AcServicing = () => {
    const services = [
        {
            id: 1,
            image: cardImage,
            title: "AC Check Up",
            price: "৳ 400",
            ton: "1-5 Ton",
            modalId: "my_modal_9"
        },
        {
            id: 2,
            image: cardImage,
            title: "AC Basic Service",
            price: "৳ 500",
            ton: "1-5 Ton",
            modalId: "my_modal_5"
        },
        {
            id: 3,
            image: jetImage,
            title: "AC Jet Wash",
            price: "৳ 1200",
            ton: "1-5 Ton",
            modalId: "my_modal_6"
        },
        {
            id: 4,
            image: jetImage,
            title: "AC Foam Wash",
            price: "৳ 1400",
            ton: "1-5 Ton",
            modalId: "my_modal_7"
        },
        {
            id: 5,
            image: waterDrop,
            title: "Waterdrop Solution",
            price: "৳ 1200",
            ton: "1-5 Ton",
            modalId: "my_modal_8"
        }
    ];

    const warrantyPolicy = [
        {
            icon: <FaShieldAlt className="text-3xl" />,
            title: "7 Days Service Warranty",
            description: "All our AC services come with 7 days service warranty"
        },
        {
            icon: <FaTools className="text-3xl" />,
            title: "Quality Parts",
            description: "We use genuine and high-quality cleaning materials"
        },
        {
            icon: <FaClock className="text-3xl" />,
            title: "Quick Service",
            description: "Most services completed within 1-2 hours"
        },
        {
            icon: <GiTechnoHeart className="text-3xl" />,
            title: "Expert Technicians",
            description: "Certified professionals with years of experience"
        }
    ];

    const problems = [
        "AC not cooling properly",
        "Water leakage issues",
        "Unusual noises from AC",
        "Bad odor from AC",
        "Weak airflow",
        "AC not starting",
        "Remote control issues",
        "High electricity consumption"
    ];

    const brands = ["Gree", "General", "Midea", "Samsung", "LG", "Daikin", "Hitachi", "Carrier"];

    return (
        <div className="min-h-screen bg-white">
            {/* Banner */}
            <Banner />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center mb-4 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                        <FaStar className="mr-2" />
                        Professional AC Servicing
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        Expert AC <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-100">
                            Servicing & Maintenance
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
                        Get your AC professionally serviced by certified technicians with 7 days service warranty
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-olympic px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                            <FaPhone className="text-sm" />
                            Call Now: 09638-787878
                        </button>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-olympic transition-all duration-300 flex items-center justify-center gap-2">
                            <FaWhatsapp className="text-sm" />
                            WhatsApp Service
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-olympic mb-2">20,000+</div>
                            <div className="text-gray-600">ACs Serviced</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-olympic mb-2">99%</div>
                            <div className="text-gray-600">Customer Satisfaction</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-olympic mb-2">80+</div>
                            <div className="text-gray-600">Expert Technicians</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-olympic mb-2">24/7</div>
                            <div className="text-gray-600">Service Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Carousel Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">
                            Our AC <span className="text-olympic">Services</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Professional AC servicing and maintenance for optimal performance
                        </p>
                    </div>

                    <div className="mb-16">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            slidesPerView={1}
                            spaceBetween={20}
                            navigation={true}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true
                            }}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 25
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 30
                                }
                            }}
                            className="services-carousel"
                        >
                            {services.map((service) => (
                                <SwiperSlide key={service.id}>
                                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group h-full">
                                        <div className="h-48 overflow-hidden">
                                            <img 
                                                src={service.image} 
                                                alt={service.title} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                                            <p className="text-gray-600 mb-1">{service.ton}</p>
                                            <div className="flex items-center justify-between mt-auto pt-4">
                                                <span className="text-2xl font-bold text-green-600">{service.price}</span>
                                                <button 
                                                    className="bg-olympic text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm hover:bg-blue-700"
                                                    onClick={() => document.getElementById(service.modalId).showModal()}
                                                >
                                                    See Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Swiper Navigation Styles */}
                        <style jsx>{`
                            .services-carousel {
                                padding: 20px 10px;
                            }
                            .swiper-button-next,
                            .swiper-button-prev {
                                background: white;
                                width: 50px;
                                height: 50px;
                                border-radius: 50%;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                                color: #0085C7;
                            }
                            .swiper-button-next:after,
                            .swiper-button-prev:after {
                                font-size: 20px;
                                font-weight: bold;
                            }
                            .swiper-pagination-bullet {
                                background: #0085C7;
                                opacity: 0.5;
                            }
                            .swiper-pagination-bullet-active {
                                background: #0085C7;
                                opacity: 1;
                            }
                        `}</style>
                    </div>
                </div>
            </section>

            {/* Service Policy Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">
                            Our <span className="text-olympic">Service Policy</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We provide comprehensive AC servicing with quality assurance
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {warrantyPolicy.map((item, index) => (
                            <div key={index} className="group text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-olympic flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problems & Brands Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Common Problems */}
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 mb-8">
                                Common AC <span className="text-olympic">Problems</span>
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {problems.map((problem, index) => (
                                    <div key={index} className="flex items-center bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 border border-gray-100">
                                        <FaTools className="text-olympic mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{problem}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Supported Brands */}
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 mb-8">
                                Brands We <span className="text-olympic">Service</span>
                            </h2>
                            <div className="grid grid-cols-4 gap-4">
                                {brands.map((brand, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                                        <div className="text-lg font-semibold text-gray-800">{brand}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-olympic text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-black mb-6">
                        Ready to Service Your AC?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Keep your AC running efficiently with our professional servicing. Book now and enjoy cool comfort!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-olympic px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                            <FaPhone className="text-sm" />
                            Call for Service
                        </button>
                        <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-olympic transition-all duration-300 flex items-center justify-center gap-2">
                            <FaWhatsapp className="text-sm" />
                            Message on WhatsApp
                        </button>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-2 text-blue-100">
                        <FaMapMarkerAlt className="text-sm" />
                        <span>Service available in Dhaka, Chittagong, Sylhet & all major cities</span>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">
                            Frequently Asked <span className="text-olympic">Questions</span>
                        </h2>
                    </div>
                    
                    <div className="max-w-4xl mx-auto space-y-6">
                        {[
                            {
                                question: "How often should I service my AC?",
                                answer: "For optimal performance, it's recommended to service your AC every 3-6 months, especially before summer season."
                            },
                            {
                                question: "Do I have to pay any charge if I don't take any service?",
                                answer: "If you don't avail any services for your AC after our Service Provider sends a technician to your doorstep, then you only have to pay the visiting charge which is BDT 200."
                            },
                            {
                                question: "Do I have to pay advance money before availing your service?",
                                answer: "No advance payment is required. You pay after the service is completed to your satisfaction."
                            },
                            {
                                question: "What's the difference between basic service and jet wash?",
                                answer: "Basic service includes cleaning of filters and basic components, while jet wash involves deep cleaning with high-pressure water of both indoor and outdoor units."
                            },
                            {
                                question: "Do you provide service warranty?",
                                answer: "Yes, we provide 7 days service warranty on all our AC servicing work."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modals */}
            <dialog id="my_modal_9" className="modal">
                <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>AC Checkup Services</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        <div className="h-full overflow-y-auto w-full mt-16">
                            <UniversalModal category="Ac-Checkup-2" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="my_modal_5" className="modal">
                <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>AC Basic Services</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        <div className="h-full overflow-y-auto w-full mt-16">
                            <UniversalModal category="Ac-Basic-Service" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="my_modal_6" className="modal">
                <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>AC Jet Wash</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        <div className="h-full overflow-y-auto w-full">
                            <UniversalModal category="Ac-Jet-Wash" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="my_modal_7" className="modal">
                <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>AC Foam Wash</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        <div className="h-full overflow-y-auto w-full">
                            <UniversalModal category="AC-Foom-Wash" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="my_modal_8" className="modal">
                <div className="modal-box max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>Waterdrop Solution</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        <div className="h-full overflow-y-auto w-full">
                            <UniversalModal category="Ac-Waterdrop-Solution" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default AcServicing;