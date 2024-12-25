import React from 'react'
import Banner from '../../components/Banner'
import Categories from './Categories'
import Content from './Content'

const Home = () => {
  return (
    <div className='overflow-hidden'>
      <Banner />
      <Categories/>
      <Content/>
    </div>
  )
}

export default Home