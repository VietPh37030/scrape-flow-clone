"use client"

import { BanknoteArrowDown, Fingerprint, HomeIcon, icons, Layers2Icon, Menu, MenuIcon } from 'lucide-react'
import React, { useState } from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { Button, buttonVariants } from './ui/button'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import UserAvailableCreditsBadge from './UserAvailableCreditsBadge'


const routers = [
    {
        href: '/',
        label: 'Trang Chủ',
        icon: HomeIcon,

    },

    {
        href: '/workflows',
        label: 'Workflow',
        icon: Layers2Icon,

    },
    {
        href: '/credentials',
        label: 'Xác Thực',
        icon: Fingerprint,

    },
    {
        href: '/billing',
        label: 'Trả Phí',
        icon: BanknoteArrowDown,

    },

]
function DestopSideBar() {
    const pathname = usePathname();
    const activeRoute = routers.find((route) => route.href !== '/' && pathname.includes(route.href) )|| routers[0];
    return (
        <div
            className='hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full 
            bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate'
        >
            <div className='flex items-center justify-center gap-2 border-b-[1px] border-separate p-4'>
                <Logo/>
            </div>
            <div className='p-2  italic'><UserAvailableCreditsBadge/></div>
            <div className='flex flex-col p-2'>
                {
                    routers.map(router =>(
                        <Link key={router.href} href={router.href}
                        className={buttonVariants({
                            variant:activeRoute.href === router.href ? "sidebarActiveItem" : "sidebarItem",
                        })}
                        >
                        <router.icon size={20}/>
                        {router.label}
                        </Link>
                    ))
                }
                
            </div>
        </div>
    )
}

export function MobileSidebar(){
    const [isOpen, setOpen] = useState(false);
     const pathname = usePathname();
    const activeRoute = routers.find((route) => route.href !== '/' && pathname.includes(route.href) )|| routers[0];
    return(
        <div className='block border-separate bg-background md:hidden'> 
           <nav className='container flex items-center justify-between px-8'>
            <Sheet open={isOpen} onOpenChange={setOpen} >
                <SheetTrigger asChild>
                    <Button variant='ghost' size={"icon"}>
                    <MenuIcon/>
                    </Button>
                </SheetTrigger>
                <SheetContent className='w-[400px] sm:w-[540px] space-y-4' side={'left'}>
                    <Logo/>
                    <UserAvailableCreditsBadge/>
                    <div className='flex flex-col gap-1'>
                        {
                    routers.map(router =>(
                        <Link key={router.href} href={router.href}
                        className={buttonVariants({
                            variant:activeRoute.href === router.href ? "sidebarActiveItem" : "sidebarItem",
                        })}
                        onClick={()=>setOpen((prev)=> !prev)}
                        >
                        <router.icon size={20}/>
                        {router.label}
                        </Link>
                    ))
                }

                    </div>
                </SheetContent>
            </Sheet>
           </nav>
        </div>
    )
}
export default DestopSideBar