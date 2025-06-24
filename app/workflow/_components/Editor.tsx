"use client"
import { Workflow } from '@/lib/generated/prisma'
import React from 'react'
import {ReactFlowProvider} from '@xyflow/react'
import FlowEditor from './FlowEditor'
import TopBar from '@/app/(dashboard)/workflows/_components/topbar/Topbar'


function Editor({workflow}:{workflow:Workflow}) {
  return <ReactFlowProvider>
    <div className="flex flex-col overflow-hidden  h-full w-full ">
      <TopBar workflowId={workflow.id} title='Workflow editor' subtitle={workflow.name}/>
    <section className='flex h-full overflow-auto'>
        <FlowEditor workflow={workflow} />
    </section>
    </div>
  </ReactFlowProvider>
}

export default Editor
