'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import StudentWorkspaceView from '@/components/internship/StudentWorkspaceView';

export default function StudentEnrollmentDashboard() {
  const params = useParams();
  const enrollmentId = (params?.enrollmentId || params?.id) as string;

  return <StudentWorkspaceView internshipId={enrollmentId} />;
}
