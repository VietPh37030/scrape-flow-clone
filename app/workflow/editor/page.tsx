import { auth } from '@clerk/nextjs/server';
import React from 'react'

function page({params}:{params:{workflowId:string}}) {
    const {workflowId} = params;
    const {userId} = auth();
  return (
    <div>page</div>
  )
}

export default page