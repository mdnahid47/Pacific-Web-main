import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AuthContext } from '../contexts/AuthProvider'
import LoadingSpinner from '../components/LoadingSpinner'

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