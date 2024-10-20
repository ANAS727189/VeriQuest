import React from 'react'
import Navbar from "./_components/Navbar";
import { ThemeProvider } from '@/context/ThemeContext';


const DashLayout = ({children}) => {
 
  return (
    <>
       <div>
        <Navbar />
       <div>
       {children}
       </div>
       </div>
    </>
  )
}

export default DashLayout;