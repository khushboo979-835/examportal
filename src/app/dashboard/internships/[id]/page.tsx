'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import StudentWorkspaceView from '@/components/internship/StudentWorkspaceView';

export default function StudentTaskDashboard() {
  const params = useParams();
  const id = params?.id as string;

  return <StudentWorkspaceView internshipId={id} />;
}
