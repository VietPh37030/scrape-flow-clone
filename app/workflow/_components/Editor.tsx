"use client"
import { Workflow } from '@/lib/generated/prisma'
import React from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './FlowEditor'
import TopBar from '@/app/(dashboard)/workflows/_components/topbar/Topbar'
import TaskMenu from '@/app/(dashboard)/workflows/_components/TaskMenu'
import { FlowValidateionContextProvider } from '@/components/context/FlowValidationContext'


function Editor({ workflow }: { workflow: Workflow }) {
  return(
 <FlowValidateionContextProvider>
   <ReactFlowProvider>
    <div className="flex flex-col overflow-hidden h-full w-full ">
      <TopBar workflowId={workflow.id}
        title='Workflow editor'
        subtitle={workflow.name} />
      <section className='flex h-full overflow-auto'>
        <TaskMenu />
        <FlowEditor workflow={workflow} />
      </section>
    </div>
  </ReactFlowProvider>
 </FlowValidateionContextProvider>
 )
}

export default Editor
