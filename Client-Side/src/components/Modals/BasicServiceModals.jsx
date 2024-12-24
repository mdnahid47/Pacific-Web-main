import React, { useContext, useEffect, useState } from 'react'
import Cards from '../Cards';
const BasicServiceModals = () => {

  const [AcService, setAcService] = useState([]);
  useEffect(() => {
    fetch("/menu.json")
      .then((res) => res.json())
      .then((data) => {
        const Basic = data.filter((item) => item.category === "Ac Basic Service");
        setAcService(Basic);
      });
  }, []);

    return (
        <div >
              {
                    AcService.map((item,i) => (
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
                        //             <button className="btn btn-primary" onClick={() => handelAddtoCart(item)}>Order Now</button>
                        //         </div>
                        //     </div>
                        // </div>

                        <Cards item={item} key={i}/>
                    ))
                }
             

            

            <div>
                
            </div>
        </div>

    )
}

export default BasicServiceModals