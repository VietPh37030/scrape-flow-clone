"use client";
import { ParamProps } from '@/types/appNode';
import { TaskParam } from '@/types/task';
import React from 'react'

function BrowserInstanceParam({param}:ParamProps) {
  return (
    <div className='text-xs'>{param.name}</div>
  )
}

export default BrowserInstanceParam