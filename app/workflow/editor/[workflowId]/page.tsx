
import { waitFor } from '@/lib/helper/waitFor';

import React from 'react'
import Editor from '../../_components/Editor';
import { auth } from '@clerk/nextjs/server';

 async function page({params}:{params:{workflowId:string}}) {
    const {workflowId} = params;
    const {userId} = auth();
    if (!userId) return <div>unthenticated</div>;
    // await waitFor(5000)
    const workflow = await prisma?.workflow.findUnique({
      where:{
        id:workflowId,
        userId,
      }
    })
      
    if (!workflowId) {
      return <div>Workflow không có</div>
    }
  return <Editor workflow={workflow} />
}

export default page