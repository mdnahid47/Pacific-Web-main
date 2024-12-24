/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, {  useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import { getAuth } from 'firebase/auth';
import WaringImage from '../../public/images/alert.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';


const Cards = ({ item }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    }, []);

    const [cart, setCart] = useState([]);

    const handelAddtoCart = (item) => {
        // eslint-disable-next-line no-undef
        // const { name, price, _id, category } = item
        
        onAuthStateChanged(auth, (user) => {
            if (user) {
                
                const existingItemIndex = cart.findIndex((item) => item.id === item.id);

                if (existingItemIndex === -1) {
                    const newCartItem = {
                        id: item._id,
                        name: item.name,
                        price: item.price,
                        category: item.category,// Replace with actual ID property name
                        quantity: 1,
                        email:user.email,
                        
                        // Add other relevant properties like name, price, etc.
                    };
                    setCart([...cart, newCartItem]); // Update cart state with new item
                    console.log(newCartItem);
                    //  navigate(`/checkout`, { state: { addedItem: newCartItem } });
                    //   navigate(`/checkout?productId=${item._id}`);
                    navigate(`/checkout`, { state: { cart: [newCartItem] } });
                    // Update Local Storage
                    // localStorage.setItem('cart', JSON.stringify(cart));
                } else {
                    // Handle cases where the item already exists in the cart (e.g., increase quantity)
                    console.log('Item already in cart.');
                }
                
               
                // User is signed in, see  
                // const cartItem = { orderItemId: _id, name, price, category, quantity: 1, email: user.email }
                // console.log(cartItem);
                // Allow access to protected features

            } else {
                // Swal.fire({
                //     title: "Please Log in ",
                //     text: "Without an accoun You won't be able to Order!",
                //     icon: "warning",
                //     showCancelButton: true,
                //     confirmButtonColor: "#3c8ce7",
                //     cancelButtonColor: "#d33",
                //     confirmButtonText: "Signup Now!",

                //     customClass : { 
                //         container : 'my-swal' 
                //       } 
                // }).then((result) => {
                //     if (result.isConfirmed) {
                //         navigate('/signup', { state: { from: location } })
                //     }
                // });
                document.getElementById('warning').showModal();
            }
        });


    }
    return (
        // eslint-disable-next-line react/jsx-no-undef
        <div id='#modal'>

            <div className="card card-side bg-base-100 shadow-xl flex  items-center mt-10">
                {/* <Link to={`/menu/${item._id}`}> */}
                    <figure>
                        <img
                            src={item.image}
                            alt="" className='w-36' />
                    </figure>
                {/* </Link> */}
                <div className="card-body flex flex-col ">
                    <h2 className="card-title">{item.name}</h2>
                    <p>Extra Charges will be applicable for Additional Work</p>
                    <div className="card-actions flex items-center">
                        <p className='font-semibold text-green'><FontAwesomeIcon icon={faBangladeshiTakaSign} /> &nbsp;{item.price} BDT <span className='text-slate-500 text-sm'>/ Piece</span></p>
                        <button className="btn btn-primary" onClick={() => handelAddtoCart(item)}>Order Now</button>
                    </div>
                </div>
            </div>

            {/* Open the modal using document.getElementById('ID').showModal() method */}
            {/* <button className="btn" onClick={() => document.getElementById('warning').showModal()}>open modal</button> */}
            <dialog id="warning" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <div className='flex flex-col items-center justify-center gap-5'>
                        <img src={WaringImage} alt="warning" className='w-28' />
                        <div className='flex flex-col items-center justify-center'>
                            <h3 className="font-bold text-lg">Please Log in!</h3>
                            <p className="py-4">Without an accoun You won &#x2019;t be able to Order!</p>
                        </div>
                    </div>
                    <div className="modal-action justify-center gap-5">
                        <form method="dialog" className='flex gap-5'>
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Cancel</button>
                            <button className='btn bg-olympic text-white' ><a href="/signup">SignUp</a></button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default Cards