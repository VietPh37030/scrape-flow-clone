import { cn } from '@/lib/utils'
import {SnailIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Logo({fontSize='text-2xl',iconSize=20,}:{fontSize?: string, iconSize?: number}) {
  return (
    <Link href={"/"}
    className={cn('text-2xl font-extrabold flex items-center gap-2', fontSize)}
    >
        <div className='rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 p-2'>
            <SnailIcon size={iconSize} className='stroke-white'/>
        </div>
        <div>
            <span className='bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent'> 
               Work 
            </span>
            <span className='bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent'> 
               + 
            </span>
             <span className='text-stone-700 dark:text-stone-300'> 
               Flow
            </span>
        </div>
    </Link>
  )
}

export default Logo