import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { StudentInternship } from '@/models/StudentInternship';
import { DDISCertificate } from '@/models/DDISCertificate';
import { InternshipTrack } from '@/models/InternshipTrack';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { internshipId } = body;

    if (!internshipId) {
      return NextResponse.json({ error: 'Internship ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const internship = await StudentInternship.findById(internshipId).populate('trackId');
    if (!internship) {
      return NextResponse.json({ error: 'Internship record not found' }, { status: 404 });
    }

    // If certificate is already issued, return it
    if (internship.certificateIssued && internship.certificateId) {
      return NextResponse.json({
        success: true,
        message: 'Certificate already issued',
        certificateId: internship.certificateId,
      });
    }

    // Verify completion: all milestones should be approved or marked as completed
    const totalWeeks = (internship.trackId as any)?.durationWeeks || 4;
    const approvedMilestones = internship.submissions.filter((s) => s.status === 'APPROVED').length;

    // In educational demo / live student testing mode, allow claiming if either all approved or student has completed submissions
    if (approvedMilestones < totalWeeks && internship.status !== 'COMPLETED') {
      // If student has submitted all weeks, approve them upon claiming
      if (internship.submissions.length >= totalWeeks) {
        internship.submissions.forEach((s) => {
          if (s.status !== 'APPROVED') s.status = 'APPROVED';
        });
      } else {
        return NextResponse.json(
          {
            error: `All ${totalWeeks} weekly project deliverables must be submitted before claiming your official credential.`,
          },
          { status: 400 }
        );
      }
    }

    // Generate Certificate ID
    const streamCode = ((internship.trackId as any)?.stream || 'IT').substring(0, 3).toUpperCase();
    const randomHash = Math.floor(1000 + Math.random() * 9000);
    const certId = `DDIS-NEP-2026-${streamCode}-${randomHash}`;
    const verificationUrl = `https://studyfreepdf.com/verify/${certId}`;

    // Generate QR Code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 1,
      width: 250,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    });

    // Create DDISCertificate record
    const cert = await DDISCertificate.findOneAndUpdate(
      { certificateId: certId },
      {
        $set: {
          certificateId: certId,
          userId: internship.userId,
          internshipId: internship._id,
          studentName: internship.studentName || 'Student Intern',
          collegeName: internship.collegeName,
          degreeProgram: internship.degreeProgram || 'Undergraduate Program',
          stream: (internship.trackId as any)?.stream || 'IT',
          faculty: (internship.trackId as any)?.faculty || (internship.trackId as any)?.stream || 'IT',
          trackTitle: (internship.trackId as any)?.title || 'NEP-2020 Virtual Internship',
          durationWeeks: (internship.trackId as any)?.durationWeeks || 4,
          nepCurriculumHours: (internship.trackId as any)?.nepCurriculumHours || 75,
          grade: 'A+ (Distinction)',
          issueDate: new Date(),
          validityStatus: 'VALID',
          qrCodeDataUrl,
          verificationUrl,
          accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
        },
      },
      { upsert: true, new: true }
    );

    internship.status = 'COMPLETED';
    internship.isCompleted = true;
    internship.certificateIssued = true;
    internship.certificateId = certId;
    internship.completedDate = new Date();
    await internship.save();

    return NextResponse.json({
      success: true,
      message: 'Official DDIS NEP-2020 Certificate issued successfully!',
      certificateId: certId,
      certificate: cert,
    });
  } catch (error) {
    console.error('Claim certificate error:', error);
    return NextResponse.json({ error: 'Failed to issue certificate' }, { status: 500 });
  }
}
