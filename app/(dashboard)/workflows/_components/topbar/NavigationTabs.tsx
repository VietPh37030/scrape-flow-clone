"use client";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import React from 'react'

export default function NavigationTabs({workflowId}:{workflowId:string}) {
  const pathbname = usePathname();
  const activeValue = pathbname?.split("/")[2]
  console.log("@@ACTIVE VALUE", activeValue);
  
  return (
   <Tabs value={activeValue} className='w-[400px] '>
    <TabsList className='grid w-full grid-cols-2'>
        <Link href={`/workflow/editor/${workflowId}`}>
        <TabsTrigger value="editor" className='w-full'>Editor</TabsTrigger>
        </Link>
         <Link href={`/workflow/runs/${workflowId}`}>
           <TabsTrigger value="runs" className='w-full'>Hoạt động</TabsTrigger>
         </Link>
    </TabsList>
   </Tabs>
  )
}
