import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Main = () => {
  return (
    <div className='min-h-screen'>
     
        <div>
        <Navbar/>
        <Outlet/>
        <Footer/>
        </div>
   


    </div>
  )
}

export default Main