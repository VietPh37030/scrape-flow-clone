import Logo from '@/components/Logo'
import React from 'react'

function Layout({children}: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col justify-center items-center h-screen gap-4'>
        <Logo />
        <div className='w-full max-w-md px-4'>
            {children}
        </div>
    </div>
  )
}

export default Layout