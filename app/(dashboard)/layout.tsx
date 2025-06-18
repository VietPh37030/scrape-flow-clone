import BreadCrumbHeader from '@/components/BreadCrumbHeader'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import DestopSideBar from '@/components/SideBar'
import { ModeToggle } from '@/components/ThemeModeToggle'
import { Separator } from '@/components/ui/separator'
import { SignIn, UserButton } from '@clerk/nextjs'
import React from 'react'


function layout({children}: { children: React.ReactNode }) {
    return (
        <div className='flex h-screen'>
            <DestopSideBar/>
            <div className='flex flex-col flex-1 min-h-screen'>
                <header className='flex items-center justify-between px-6 py-4 h-[50px] container'>
                   <BreadCrumbHeader />
                   <div className='gap-1 flex items-center'>
                    <ModeToggle />
                    <UserButton />
                   </div>
                </header>
                <Separator />
                <div className='overflow-auto'>
                    <div className='flex-1 container text-accent-foreground py-4'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default layout