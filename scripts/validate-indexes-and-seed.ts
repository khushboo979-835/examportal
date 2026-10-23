import 'dotenv/config';
import mongoose from 'mongoose';
import { Sector } from '../src/models/Sector';
import { Category } from '../src/models/Category';
import { ExamNode } from '../src/models/ExamNode';
import { Subject } from '../src/models/Subject';
import { PDFProduct } from '../src/models/PDFProduct';
import { InternshipTrack } from '../src/models/InternshipTrack';
import { StudentInternship } from '../src/models/StudentInternship';
import { DDISCertificate } from '../src/models/DDISCertificate';
import { User } from '../src/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edupdf_marketplace';

async function validateAndSeed() {
  console.log('🚀 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected successfully.');

  console.log('\n📊 Validating and Syncing Indexes across all collections...');

  // 1. Sync indexes on Mongoose models
  await Promise.all([
    Sector.syncIndexes(),
    Category.syncIndexes(),
    ExamNode.syncIndexes(),
    Subject.syncIndexes(),
    PDFProduct.syncIndexes(),
    InternshipTrack.syncIndexes(),
    StudentInternship.syncIndexes(),
    DDISCertificate.syncIndexes(),
    User.syncIndexes(),
  ]);

  console.log('✅ All compound, unique, and full-text indexes successfully synchronized with MongoDB.');

  // Print verified index list
  const examNodeIndexes = await ExamNode.collection.indexes();
  console.log('\n🔍 ExamNode Indexes:');
  console.log(examNodeIndexes.map((i) => i.name || JSON.stringify(i.key)).join(', '));

  const subjectIndexes = await Subject.collection.indexes();
  console.log('\n🔍 Subject Indexes:');
  console.log(subjectIndexes.map((i) => i.name || JSON.stringify(i.key)).join(', '));

  const pdfProductIndexes = await PDFProduct.collection.indexes();
  console.log('\n🔍 PDFProduct Indexes (including full-text & compound):');
  console.log(pdfProductIndexes.map((i) => i.name || JSON.stringify(i.key)).join(', '));

  // 2. Ensure default demo user exists
  let demoUser = await User.findOne({ email: 'demo@studyfreepdf.com' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Aditya Verma',
      email: 'demo@studyfreepdf.com',
      phone: '+91 98765 43210',
      role: 'STUDENT',
    });
    console.log('✅ Created Demo User:', demoUser.email);
  }

  // 3. Ensure sample sector & categories exist
  let govtSector = await Sector.findOne({ slug: 'govt-exams' });
  if (!govtSector) {
    govtSector = await Sector.create({
      name: 'Government & Civil Services',
      slug: 'govt-exams',
      icon: 'Award',
      displayOrder: 1,
    });
  }

  let statePcsCategory = await Category.findOne({ slug: 'state-pcs' });
  if (!statePcsCategory) {
    statePcsCategory = await Category.create({
      sectorId: govtSector._id,
      name: 'State Public Service Commission',
      slug: 'state-pcs',
      shortCode: 'PCS',
    });
  }

  let bpscNode = await ExamNode.findOne({ slug: 'bpsc-70th-cce' });
  if (!bpscNode) {
    bpscNode = await ExamNode.create({
      categoryId: statePcsCategory._id,
      name: 'BPSC 70th Combined Competitive Exam',
      slug: 'bpsc-70th-cce',
      state: 'Bihar',
      iconUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100',
      targetYear: '2026-2027',
      isTrending: true,
      totalPdfsCount: 45,
    });
  }

  let gsSubject = await Subject.findOne({ examNodeId: bpscNode._id, slug: 'general-studies' });
  if (!gsSubject) {
    gsSubject = await Subject.create({
      examNodeId: bpscNode._id,
      name: 'General Studies & Bihar Special',
      slug: 'general-studies',
      chapters: [
        { chapterNumber: 1, title: 'Ancient & Medieval History of Bihar', slug: 'bihar-ancient-history' },
        { chapterNumber: 2, title: 'Bihar Economy & Budget 2026-2027', slug: 'bihar-budget-economy' },
        { chapterNumber: 3, title: 'Indian Polity & Constitutional Framework', slug: 'polity-constitution' },
      ],
      displayOrder: 1,
    });
  }

  // 4. Ensure verified sample DDIS certificates exist
  const existingCert = await DDISCertificate.findOne({ certificateId: 'DDIS-NEP-2026-IT-9482' });
  if (!existingCert) {
    await DDISCertificate.create({
      certificateId: 'DDIS-NEP-2026-IT-9482',
      userId: demoUser._id,
      studentName: 'Khushboo Kumari',
      collegeName: 'Patliputra University, Patna',
      degreeProgram: 'Bachelor of Computer Applications (BCA)',
      stream: 'BCA_IT',
      faculty: 'Computer Apps & IT',
      trackTitle: 'Full-Stack Cloud Engineering (Next.js & MongoDB)',
      durationWeeks: 4,
      nepCurriculumHours: 75,
      grade: 'A+ (Distinction)',
      issueDate: new Date(),
      validityStatus: 'VALID',
      verificationUrl: 'https://studyfreepdf.com/verify/DDIS-NEP-2026-IT-9482',
      accreditationAuthority: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
    });
    console.log('✅ Created Demo DDIS Certificate: DDIS-NEP-2026-IT-9482');
  }

  console.log('\n🎉 Database Schema, Compound Indexes, and Seeding verified successfully!');
  await mongoose.disconnect();
}

validateAndSeed().catch((err) => {
  console.error('❌ Validation and Seed Error:', err);
  process.exit(1);
});
