import React, { useEffect, useState } from 'react'
import cardImage from '../../assets/ac-service.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';
import Cards from '../Cards';

const FoomWashModals = () => {
    const [foomWash, setFoomWash] = useState([]);
    useEffect(() => {
        fetch("/menu.json")
          .then((res) => res.json())
          .then((data) => {
            const FoomWash = data.filter((item) => item.category === "AC Foom Wash");
            setFoomWash(FoomWash);
          });
      }, []);
  return (
    <div>
        {/* <div className="card card-side bg-base-100 shadow-xl flex  items-center mt-10">
                <figure>
                    <img
                        src={cardImage}
                        alt="" className='w-36' />
                </figure>
                <div className="card-body flex flex-col ">
                    <h2 className="card-title">1-2.5 Ton</h2>
                    <p>Extra Charges will be applicable for Additional Work</p>
                    <div className="card-actions flex items-center">
                        <p className='font-semibold text-green'><FontAwesomeIcon icon={faBangladeshiTakaSign} /> &nbsp;1500 BDT <span className='text-slate-500 text-sm'>/ Piece</span></p>
                        <button className="btn btn-primary">Order Now</button>
                    </div>
                </div>
            </div>

            <div className="card card-side bg-base-100 shadow-xl flex  items-center mt-10">
                <figure>
                    <img
                        src={cardImage}
                        alt="" className='w-36' />
                </figure>
                <div className="card-body flex flex-col ">
                    <h2 className="card-title">3-5 Ton</h2>
                    <p>Extra Charges will be applicable for Additional Work</p>
                    <div className="card-actions flex items-center">
                        <p className='font-semibold text-green'><FontAwesomeIcon icon={faBangladeshiTakaSign} /> &nbsp;2400 BDT <span className='text-slate-500 text-sm'>/ Piece</span></p>
                        <button className="btn btn-primary">Order Now</button>
                    </div>
                </div>
            </div> */}

{
                    foomWash.map((item,i) => (
                        // <div key={i} className="card card-side bg-base-100 shadow-xl flex  items-center mt-10">
                        //     <figure>
                        //         <img
                        //             src={item.image}
                        //             alt="" className='w-36' />
                        //     </figure>
                        //     <div className="card-body flex flex-col ">
                        //         <h2 className="card-title">{item.name}</h2>
                        //         <p>Extra Charges will be applicable for Additional Work</p>
                        //         <div className="card-actions flex items-center">
                        //             <p className='font-semibold text-green'><FontAwesomeIcon icon={faBangladeshiTakaSign} /> &nbsp;{item.price} BDT <span className='text-slate-500 text-sm'>/ Piece</span></p>
                        //             <button className="btn btn-primary" >Order Now</button>
                        //         </div>
                        //     </div>
                        // </div>
                        <Cards item={item} key={i}/>
                    ))
                }
            
    </div>
  )
}

export default FoomWashModals