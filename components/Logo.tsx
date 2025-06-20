import { cn } from '@/lib/utils'
import { SquareDashedMousePointer } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Logo({fontSize='text-2xl',iconSize=20,}:{fontSize?: string, iconSize?: number}) {
  return (
    <Link href={"/"}
    className={cn('text-2xl font-extrabold flex items-center gap-2', fontSize)}
    >
        <div className='rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 p-2'>
            <SquareDashedMousePointer size={iconSize} className='stroke-white'/>
        </div>
        <div>
            <span className='bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent'> 
                Scrapeflow 
            </span>
             <span className='text-stone-700 dark:text-stone-300'> 
                Clone
            </span>
        </div>
    </Link>
  )
}

export default Logo