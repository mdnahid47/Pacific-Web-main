import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';
import { FaCheck } from "react-icons/fa6";
import install from '../../../assets/install.jpg';

const IndorModals = () => {
    return (
        <div>
            <div className="card card-side bg-base-100 shadow-xl flex  items-center mt-10">
                <figure>
                    <img
                        src={install}
                        alt="" className='w-36' />
                </figure>
                <div className="card-body flex flex-col ">
                    <h2 className="card-title">1-1.5 Ton </h2>
                    <p>Extra Charges will be applicable for Additional Work</p>
                    <div className="card-actions flex items-center">
                        <p className='font-semibold text-green'>
                            <FontAwesomeIcon icon={faBangladeshiTakaSign} /> &nbsp;1500 BDT <span className='text-slate-500 text-sm'>/  Piece</span></p>
                        <button className="btn btn-primary">Order Now</button>
                    </div>
                </div>
            </div>

            <div className="card card-side bg-base-100 shadow-xl flex  items-center mt-10">
                <figure>
                    <img
                        src={install}
                        alt="" className='w-36' />
                </figure>
                <div className="card-body flex flex-col ">
                    <h2 className="card-title">2-3 Ton </h2>
                    <p>Extra Charges will be applicable for Additional Work</p>
                    <div className="card-actions flex items-center">
                        <p className='font-semibold text-green'>
                            <FontAwesomeIcon icon={faBangladeshiTakaSign} /> &nbsp;1800 BDT <span className='text-slate-500 text-sm'>/  Piece</span></p>
                        <button className="btn btn-primary">Order Now</button>
                    </div>
                </div>
            </div>

            <div className="card card-side bg-base-100 shadow-xl flex  items-center mt-10">
                <figure>
                    <img
                        src={install}
                        alt="" className='w-36' />
                </figure>
                <div className="card-body flex flex-col ">
                    <h2 className="card-title">4-5 Ton </h2>
                    <p>Extra Charges will be applicable for Additional Work</p>
                    <div className="card-actions flex items-center">
                        <p className='font-semibold text-green'>
                            <FontAwesomeIcon icon={faBangladeshiTakaSign} /> &nbsp;3500 BDT <span className='text-slate-500 text-sm'>/  Piece</span></p>
                        <button className="btn btn-primary">Order Now</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IndorModals