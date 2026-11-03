require('dotenv').config();
const { sendInquiryEmail } = require('../src/lib/mailer.ts');

async function testEmailDispatch() {
  console.log('\n======================================================');
  console.log('   TESTING INQUIRY EMAIL DISPATCH (STUDYFREEPDF)');
  console.log('======================================================\n');

  const testPayload = {
    type: 'CONTACT_FORM',
    studentName: 'Khushboo Kumari',
    studentEmail: 'khushboo.student@example.com',
    studentPhone: '+91 9876543210',
    subject: 'Need BPSC 70th Prelims Bihar GK Notes & Formula Sheet',
    message: 'Hello DDIS Team, I would like to inquire about the Bihar Special GK notes and how to enroll in the NEP-2020 BCA/IT Virtual Internship.',
    ticketId: `TKT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    metadata: {
      examTarget: 'BPSC 70th CCE',
      medium: 'Hindi Medium',
      college: 'Patna Women’s College',
    },
  };

  console.log(`Submitting test inquiry for: ${testPayload.studentName}`);
  console.log(`Target Administrative Email: studyfreepdf2@gmail.com`);

  const result = await sendInquiryEmail(testPayload);
  console.log('\nResult:', result);

  if (result.success) {
    console.log('\n✅ TEST PASSED: Inquiry registered & queued for studyfreepdf2@gmail.com.');
  } else {
    console.log('\n❌ TEST FAILED');
  }
  console.log('======================================================\n');
}

testEmailDispatch().catch(console.error);
