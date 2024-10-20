import React from 'react'
import Navbar from '../dashboard/_components/Navbar';

const Upgradelayout = ({children}) => {
  return (
   <>
   <div>
    <Navbar />
    <div className='mx-5 md:mx-20 lg:mx-36'>
    {children}
    </div>
   </div>
   </>
  )
}

export default Upgradelayout;