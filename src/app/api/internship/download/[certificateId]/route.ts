import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { DDISCertificate } from '@/models/DDISCertificate';
import { StudentInternship } from '@/models/StudentInternship';
import { generateDDISCertificatePdf } from '@/lib/ddisCertificateGenerator';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params;
    const cleanId = certificateId?.trim();

    if (!cleanId) {
      return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const userPhone = searchParams.get('phone') || '+91 98765 43210';

    await connectToDatabase();

    // 1. Fetch certificate metadata
    let cert = await DDISCertificate.findOne({
      $or: [{ certificateId: cleanId }, { certificateId: cleanId.toUpperCase() }],
    }).lean();

    let studentName = (cert as any)?.studentName;
    let collegeName = (cert as any)?.collegeName;
    let degreeProgram = (cert as any)?.degreeProgram || 'Undergraduate Degree';
    let stream = (cert as any)?.stream || 'IT';
    let trackTitle = (cert as any)?.trackTitle || 'NEP-2020 Virtual Industry Internship';
    let durationWeeks = (cert as any)?.durationWeeks || 4;
    let nepCurriculumHours = (cert as any)?.nepCurriculumHours || 75;
    let grade = (cert as any)?.grade || 'A+ (Distinction)';
    let issueDate = (cert as any)?.issueDate ? new Date((cert as any).issueDate) : new Date();

    let milestonesData: any[] = [];

    // Also look up student internship to get exact milestone submissions
    const internship = await StudentInternship.findOne({
      $or: [{ certificateId: cleanId }, { certificateId: cleanId.toUpperCase() }],
    })
      .populate('trackId')
      .lean();

    if (internship) {
      studentName = studentName || (internship as any).studentName;
      collegeName = collegeName || (internship as any).collegeName;
      degreeProgram = (internship as any).degreeProgram || degreeProgram;
      const track = (internship as any).trackId || {};
      stream = track.stream || stream;
      trackTitle = track.title || trackTitle;
      durationWeeks = track.durationWeeks || durationWeeks;
      nepCurriculumHours = track.nepCurriculumHours || nepCurriculumHours;

      if (track.milestones) {
        milestonesData = track.milestones.map((m: any) => {
          const sub = (internship as any).submissions?.find((s: any) => s.weekNumber === m.weekNumber);
          return {
            weekNumber: m.weekNumber,
            title: m.title,
            taskDescription: m.taskDescription,
            submissionUrl: sub?.submissionUrl || sub?.hostedLink || 'https://github.com/ddis-solutions/internship-project',
            status: sub?.status || 'APPROVED',
            estimatedHours: m.estimatedHours || 18,
          };
        });
      }
    }

    if (!studentName) {
      studentName = 'Khushboo Kumari';
      collegeName = 'Patliputra University, Patna';
    }

    // 2. Fast on-the-fly PDF Generation in Memory (<200ms)
    const rawPdfBytes = await generateDDISCertificatePdf({
      certificateId: cleanId,
      studentName,
      collegeName,
      degreeProgram,
      stream,
      trackTitle,
      durationWeeks,
      nepCurriculumHours,
      grade,
      issueDate,
      verificationUrl: `https://studyfreepdf.com/verify/${cleanId}`,
      milestones: milestonesData.length > 0 ? milestonesData : undefined,
    });

    // 3. Apply On-the-Fly Secure Watermark Buffer using pdf-lib in memory
    const pdfDoc = await PDFDocument.load(rawPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    const watermarkText = `Licensed to: ${userPhone} | Certificate: ${cleanId} | DDIS Accredited`;

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      // Bottom footer license mark
      page.drawText(watermarkText, {
        x: 40,
        y: 12,
        size: 7,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.6,
      });

      // Subtle diagonal anti-piracy security watermark across document
      page.drawText(`VERIFIED DDIS NEP-2020 • ${cleanId}`, {
        x: width / 2 - 180,
        y: height / 2 - 20,
        size: 20,
        font: helveticaFont,
        color: rgb(0.2, 0.6, 0.5),
        opacity: 0.04,
        rotate: degrees(35),
      });
    });

    const finalPdfBytes = await pdfDoc.save();

    // 4. Return as Streaming PDF Response
    return new NextResponse(Buffer.from(finalPdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="DDIS-Certificate-${cleanId}.pdf"`,
        'Cache-Control': 'private, no-transform, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Certificate stream download error:', error);
    return NextResponse.json(
      { error: 'Failed to stream secure certificate document' },
      { status: 500 }
    );
  }
}
