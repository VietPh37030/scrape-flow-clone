import { NextResponse } from 'next/server';
import { GetWorkflowsForUser } from '@/actions/workflow/getWorkflowsForUser';
import { DeleteWorkflow } from '@/actions/workflow/deleteWorkflow';
import { CreateWorkflow } from '@/actions/workflow/createWorkflow';

export async function GET() {
  try {
    const workflows = await GetWorkflowsForUser();
    return NextResponse.json({ workflows });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await CreateWorkflow(body);
    return NextResponse.json({ success: true, workflow: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }
    
    await DeleteWorkflow(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    );
  }
} 