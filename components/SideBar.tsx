"use client"

import { HomeIcon, Layers2Icon } from 'lucide-react'
import React from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { usePathname } from 'next/navigation'

const routers = [
    {
        href: '',
        label: 'Home',
        icon: HomeIcon,

    },

    {
        href: 'workflow',
        label: 'Workflow',
        icon: Layers2Icon,

    },
    {
        href: 'credentials',
        label: 'Credentials',
        icon: HomeIcon,

    },
    {
        href: 'billing',
        label: 'Billing',
        icon: HomeIcon,

    },

]
function DestopSideBar() {
    const pathname = usePathname();
    const activeRoute = routers.find((route) => route.href.length >0 && pathname.includes(route.href) )|| routers[0];
    return (
        <div
            className='hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full 
            bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate'
        >
            <div className='flex items-center justify-center gap-2 border-b-[1px] border-separate p-4'>
                <Logo/>
            </div>
            <div className='p-2 '>TODO CREDITS</div>
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

export default DestopSideBar