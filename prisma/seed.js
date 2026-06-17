const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

const adapter = new PrismaLibSql({
  url: 'file:dev.db'
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.prescription.deleteMany({});
  await prisma.videoSession.deleteMany({});
  await prisma.consultation.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.medicalRecord.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.aIReport.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding users...');
  
  // 1. Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@telecare.ai',
      passwordHash: 'admin123',
      name: 'System Admin',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
    }
  });

  // 2. Doctors
  const doc1User = await prisma.user.create({
    data: {
      email: 'sarah.khan@telecare.ai',
      passwordHash: 'doctor123',
      name: 'Dr. Sarah Khan',
      role: 'DOCTOR',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80'
    }
  });

  const doc2User = await prisma.user.create({
    data: {
      email: 'ahmed.ali@telecare.ai',
      passwordHash: 'doctor123',
      name: 'Dr. Ahmed Ali',
      role: 'DOCTOR',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80'
    }
  });

  const doc3User = await prisma.user.create({
    data: {
      email: 'emily.chen@telecare.ai',
      passwordHash: 'doctor123',
      name: 'Dr. Emily Chen',
      role: 'DOCTOR',
      avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=150&h=150&q=80'
    }
  });

  const doc4User = await prisma.user.create({
    data: {
      email: 'david.miller@telecare.ai',
      passwordHash: 'doctor123',
      name: 'Dr. David Miller',
      role: 'DOCTOR',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&h=150&q=80'
    }
  });

  // 3. Patients
  const pat1User = await prisma.user.create({
    data: {
      email: 'sarah.jenkins@telecare.ai',
      passwordHash: 'patient123',
      name: 'Sarah Jenkins',
      role: 'PATIENT',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
    }
  });

  const pat2User = await prisma.user.create({
    data: {
      email: 'john.smith@telecare.ai',
      passwordHash: 'patient123',
      name: 'John Smith',
      role: 'PATIENT',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
    }
  });

  const pat3User = await prisma.user.create({
    data: {
      email: 'mike.johnson@telecare.ai',
      passwordHash: 'patient123',
      name: 'Mike Johnson',
      role: 'PATIENT',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
    }
  });

  console.log('Seeding doctors profiles...');
  const doc1 = await prisma.doctor.create({
    data: {
      userId: doc1User.id,
      specialty: 'Dermatology',
      experience: 12,
      languages: 'English, Urdu',
      bio: 'Board-certified dermatologist specializing in medical and cosmetic dermatology, acne treatments, and skin cancer screenings.',
      price: 130.00,
      rating: 4.9,
      availability: 'Mon, Wed, Fri: 9:00 AM - 4:00 PM'
    }
  });

  const doc2 = await prisma.doctor.create({
    data: {
      userId: doc2User.id,
      specialty: 'Cardiology',
      experience: 15,
      languages: 'English, Arabic',
      bio: 'Senior cardiologist focusing on preventative cardiology, hypertension management, and cardiovascular disease rehabilitation.',
      price: 180.00,
      rating: 4.8,
      availability: 'Tue, Thu: 10:00 AM - 5:00 PM'
    }
  });

  const doc3 = await prisma.doctor.create({
    data: {
      userId: doc3User.id,
      specialty: 'Pediatrics',
      experience: 8,
      languages: 'English, Spanish',
      bio: 'Compassionate pediatrician specializing in newborn care, childhood development, immunizations, and general adolescent health.',
      price: 100.00,
      rating: 5.0,
      availability: 'Mon-Thu: 8:00 AM - 3:00 PM'
    }
  });

  const doc4 = await prisma.doctor.create({
    data: {
      userId: doc4User.id,
      specialty: 'Psychiatry',
      experience: 10,
      languages: 'English',
      bio: 'Dedicated psychiatrist focusing on anxiety disorders, depression therapy, ADHD management, and stress reduction counseling.',
      price: 150.00,
      rating: 4.7,
      availability: 'Wed, Fri: 1:00 PM - 7:00 PM'
    }
  });

  console.log('Seeding patient profiles...');
  const pat1 = await prisma.patient.create({
    data: {
      userId: pat1User.id,
      dateOfBirth: new Date('1994-04-12'),
      gender: 'Female',
      medicalHistory: 'Mild seasonal allergies. History of migraines (managed with medication).'
    }
  });

  const pat2 = await prisma.patient.create({
    data: {
      userId: pat2User.id,
      dateOfBirth: new Date('1985-08-25'),
      gender: 'Male',
      medicalHistory: 'Diagnosed with Type 2 Diabetes in 2021. Managed with metformin and diet.'
    }
  });

  const pat3 = await prisma.patient.create({
    data: {
      userId: pat3User.id,
      dateOfBirth: new Date('1990-11-03'),
      gender: 'Male',
      medicalHistory: 'Asthma since childhood. Uses albuterol inhaler as needed.'
    }
  });

  console.log('Seeding appointments & consultations...');
  
  // Upcoming consultation for Sarah Jenkins today
  const today4PM = new Date();
  today4PM.setHours(16, 0, 0, 0); // 4:00 PM today

  const app1 = await prisma.appointment.create({
    data: {
      patientId: pat1.id,
      doctorId: doc2.id, // Dr. Ahmed
      type: 'VIDEO',
      dateTime: today4PM,
      status: 'CONFIRMED',
      amount: doc2.price,
      paymentStatus: 'PAID'
    }
  });

  await prisma.payment.create({
    data: {
      appointmentId: app1.id,
      amount: doc2.price,
      provider: 'Stripe',
      status: 'PAID',
      transactionId: 'ch_mock_12345'
    }
  });

  // Create Video Session for it
  await prisma.videoSession.create({
    data: {
      appointmentId: app1.id,
      roomName: `room-${app1.id}`,
      active: false
    }
  });

  // AI pre-visit report for Dr. Ahmed about Sarah Jenkins
  await prisma.aIReport.create({
    data: {
      patientId: pat1.id,
      type: 'PRE_VISIT_SUMMARY',
      content: JSON.stringify({
        mainIssue: 'Mild chest tightness & shortness of breath during light workouts.',
        duration: '1 week',
        previousTreatment: 'None',
        importantInfo: 'Patient has family history of cardiovascular disease. Blood pressure was slightly elevated (135/85) at general dentist visit last month.',
        symptoms: ['Chest tightness', 'Slight breathlessness'],
        questions: [
          'Is it safe to continue jogging?',
          'Could this be related to my seasonal allergies?',
          'Should I start monitoring my blood pressure daily?'
        ]
      })
    }
  });

  // Past appointment for Sarah Jenkins (Dr. Ahmed, 2 months ago)
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const appPast = await prisma.appointment.create({
    data: {
      patientId: pat1.id,
      doctorId: doc2.id,
      type: 'FOLLOWUP',
      dateTime: twoMonthsAgo,
      status: 'COMPLETED',
      amount: doc2.price,
      paymentStatus: 'PAID'
    }
  });

  const consultPast = await prisma.consultation.create({
    data: {
      appointmentId: appPast.id,
      reason: 'Hypertension monitoring follow-up',
      symptoms: 'Occasional mild headache, high stress due to work.',
      notes: 'Blood pressure readings are slightly elevated. Heart rate is normal. Recommended stress management techniques and reduction of sodium intake. Patient was prescribed a low-dose beta blocker.',
      summary: 'Patient followed up for hypertension monitoring. Experiencing mild headaches and work-related stress. Blood pressure was 138/88. Instructed to reduce sodium intake, monitor BP at home, and start Metoprolol 25mg daily. Scheduled a follow-up in 2 months.',
      status: 'COMPLETED'
    }
  });

  await prisma.prescription.create({
    data: {
      consultationId: consultPast.id,
      medicine: 'Metoprolol Succinate ER',
      dosage: '25mg',
      duration: '60 Days',
      instructions: 'Take 1 tablet daily in the morning with food.'
    }
  });

  await prisma.medicalRecord.create({
    data: {
      patientId: pat1.id,
      diagnosis: 'Essential Hypertension (Stage 1)',
      treatment: 'Started low-dose Metoprolol 25mg daily. Lifestyle modifications (low sodium diet, exercise).',
      date: twoMonthsAgo,
      notes: 'Patient responded well but needs follow-up to check blood pressure trends.'
    }
  });

  // Seeding some other medical records for Sarah Jenkins
  await prisma.medicalRecord.create({
    data: {
      patientId: pat1.id,
      diagnosis: 'Acute Migraine Headache',
      treatment: 'Prescribed Sumatriptan 50mg for onset of acute migraine.',
      date: new Date('2025-10-15'),
      notes: 'Migraines occur 1-2 times a month, usually triggered by stress.'
    }
  });

  await prisma.prescription.create({
    data: {
      consultationId: consultPast.id, // Link to past consult for simplicity
      medicine: 'Sumatriptan Succinate',
      dosage: '50mg',
      duration: 'As needed',
      instructions: 'Take 1 tablet at the immediate onset of migraine symptoms. Do not exceed 100mg in 24 hours.'
    }
  });

  // Seeding active prescriptions
  // 1: Metoprolol (Hypertension)
  // 2: Sumatriptan (Migraines)
  // 3: Cetirizine (Allergies)
  // Let's create an active prescription for Cetirizine
  await prisma.medicalRecord.create({
    data: {
      patientId: pat1.id,
      diagnosis: 'Seasonal Allergic Rhinitis',
      treatment: 'Cetirizine 10mg daily as needed.',
      date: new Date('2026-03-01'),
      notes: 'Symptoms worse in spring.'
    }
  });

  // Past consultations with Dr. Sarah Khan (Dermatology, 3 weeks ago)
  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

  const appDerm = await prisma.appointment.create({
    data: {
      patientId: pat1.id,
      doctorId: doc1.id,
      type: 'VIDEO',
      dateTime: threeWeeksAgo,
      status: 'COMPLETED',
      amount: doc1.price,
      paymentStatus: 'PAID'
    }
  });

  const consultDerm = await prisma.consultation.create({
    data: {
      appointmentId: appDerm.id,
      reason: 'Eczema flare-up on hands',
      symptoms: 'Dry, itchy, red patches on fingers and palms for 3 weeks.',
      notes: 'Eczema flare-up consistent with contact dermatitis. Advised soap-free cleansers and regular application of thick emollients. Prescribed Hydrocortisone cream.',
      summary: 'Consulted for severe skin irritation and itching on hands. Diagnosed as contact dermatitis. Advised to avoid harsh dish soaps, apply intensive ceramides moisturizer, and apply Hydrocortisone 1% cream twice daily for 7 days.',
      status: 'COMPLETED'
    }
  });

  await prisma.prescription.create({
    data: {
      consultationId: consultDerm.id,
      medicine: 'Hydrocortisone 1% Cream',
      dosage: 'Apply thin layer',
      duration: '7 Days',
      instructions: 'Apply to affected areas twice daily after washing hands.'
    }
  });

  // Seed documents
  await prisma.document.create({
    data: {
      patientId: pat1.id,
      name: 'Blood Panel Report - March 2026.pdf',
      fileUrl: '#',
      fileType: 'pdf',
      uploadedAt: new Date('2026-03-15')
    }
  });

  await prisma.document.create({
    data: {
      patientId: pat1.id,
      name: 'Cardiology Referral Form.pdf',
      fileUrl: '#',
      fileType: 'pdf',
      uploadedAt: new Date('2026-04-05')
    }
  });

  await prisma.document.create({
    data: {
      patientId: pat1.id,
      name: 'Eczema Progress Photos.jpg',
      fileUrl: '#',
      fileType: 'image',
      uploadedAt: threeWeeksAgo
    }
  });

  // Seeding pending appointments for doctors (Doctor Dashboard Today list)
  const today9AM = new Date();
  today9AM.setHours(9, 0, 0, 0);

  const today1030AM = new Date();
  today1030AM.setHours(10, 30, 0, 0);

  const today12PM = new Date();
  today12PM.setHours(12, 0, 0, 0);

  // John Smith with Dr. Sarah Khan today at 9:00 AM
  await prisma.appointment.create({
    data: {
      patientId: pat2.id,
      doctorId: doc1.id,
      type: 'VIDEO',
      dateTime: today9AM,
      status: 'CONFIRMED',
      amount: doc1.price,
      paymentStatus: 'PAID'
    }
  });

  // Sarah Jenkins with Dr. Sarah Khan today at 10:30 AM (another appointment)
  await prisma.appointment.create({
    data: {
      patientId: pat1.id,
      doctorId: doc1.id,
      type: 'FOLLOWUP',
      dateTime: today1030AM,
      status: 'CONFIRMED',
      amount: doc1.price,
      paymentStatus: 'PAID'
    }
  });

  // Mike Johnson with Dr. Sarah Khan today at 12:00 PM
  await prisma.appointment.create({
    data: {
      patientId: pat3.id,
      doctorId: doc1.id,
      type: 'EMERGENCY',
      dateTime: today12PM,
      status: 'CONFIRMED',
      amount: doc1.price,
      paymentStatus: 'PAID'
    }
  });

  console.log('Seeding 30-day vitals log...');
  // 30-day BP reduction curve: starts high (145/92) and improves with medication to (120/78)
  // Simulates patient Sarah Jenkins responding well to Metoprolol therapy
  const systolicCurve = [
    145, 143, 141, 140, 138, 137, 136, 135, 134, 133,
    132, 131, 130, 129, 128, 127, 126, 125, 124, 123,
    122, 122, 121, 121, 120, 121, 120, 120, 120, 120
  ];
  const diastolicCurve = [
    92, 91, 90, 90, 89, 88, 88, 87, 87, 86,
    85, 85, 84, 84, 83, 83, 82, 82, 81, 80,
    80, 79, 79, 78, 78, 79, 78, 78, 78, 78
  ];
  const heartRateCurve = [
    84, 83, 83, 82, 82, 81, 80, 80, 79, 78,
    77, 76, 76, 75, 74, 73, 73, 72, 72, 71,
    70, 70, 70, 69, 69, 70, 69, 70, 70, 70
  ];
  const glucoseCurve = [
    102, 100, 99, 98, 97, 96, 98, 95, 97, 96,
    95, 94, 96, 95, 93, 94, 92, 93, 92, 91,
    90, 92, 91, 90, 90, 91, 90, 89, 90, 90
  ];

  for (let i = 29; i >= 0; i--) {
    const logDate = new Date();
    logDate.setDate(logDate.getDate() - i);
    logDate.setHours(8, 0, 0, 0);
    await prisma.vitalLog.create({
      data: {
        patientId: pat1.id,
        systolic: systolicCurve[29 - i],
        diastolic: diastolicCurve[29 - i],
        heartRate: heartRateCurve[29 - i],
        glucose: glucoseCurve[29 - i],
        recordedAt: logDate
      }
    });
  }

  console.log('Seeding notifications...');
  const patNotifs = [
    { title: 'Appointment Confirmed', message: 'Your video consultation with Dr. Ahmed Ali has been booked for today at 4:00 PM.' },
    { title: 'New Prescription Added', message: 'Dr. Sarah Khan has uploaded a new prescription for Hydrocortisone 1% Cream.' },
    { title: 'Vitals Reminder', message: 'You have not logged your blood pressure today. Keep your monitoring streak going!' },
    { title: 'Lab Results Ready', message: 'Your blood panel results from March 2026 have been added to your records vault.' },
    { title: 'Care Plan Updated', message: 'Dr. Ahmed Ali has updated your Hypertension Management care plan. Review the changes.' },
  ];
  for (const n of patNotifs) {
    await prisma.notification.create({ data: { userId: pat1User.id, title: n.title, message: n.message } });
  }

  const doc1Notifs = [
    { title: 'New Booking', message: 'John Smith has scheduled a video consultation with you for today at 9:00 AM.' },
    { title: 'Patient Message', message: 'Sarah Jenkins sent you a secure message regarding her medication.' },
    { title: 'RPM Alert', message: 'Sarah Jenkins blood pressure was above 140/90 mmHg this morning. Review her vitals.' },
  ];
  for (const n of doc1Notifs) {
    await prisma.notification.create({ data: { userId: doc1User.id, title: n.title, message: n.message } });
  }

  const doc2Notifs = [
    { title: 'New Booking', message: 'Sarah Jenkins has a confirmed video consultation with you today at 4:00 PM.' },
    { title: 'Follow-up Due', message: 'Sarah Jenkins is due for a 30-day hypertension follow-up. Schedule a call.' },
  ];
  for (const n of doc2Notifs) {
    await prisma.notification.create({ data: { userId: doc2User.id, title: n.title, message: n.message } });
  }

  console.log('Seeding messages...');
  const messages = [
    { senderId: pat1User.id, receiverId: doc2User.id, content: 'Hello Dr. Ahmed, I wanted to ask if I should continue taking Metoprolol even if my BP reading is normal now?', daysAgo: 5 },
    { senderId: doc2User.id, receiverId: pat1User.id, content: 'Hi Sarah! Yes, please continue the medication for the full prescribed duration of 60 days. Stopping early can cause BP to spike again. We will review at your next visit.', daysAgo: 5 },
    { senderId: pat1User.id, receiverId: doc2User.id, content: 'Thank you doctor. I also noticed some mild fatigue in the mornings. Is that a side effect?', daysAgo: 4 },
    { senderId: doc2User.id, receiverId: pat1User.id, content: 'Mild fatigue is a known side effect of beta-blockers in the first 2-3 weeks. It should improve soon. If it persists, we can adjust the dosage at your next consultation.', daysAgo: 4 },
    { senderId: pat1User.id, receiverId: doc2User.id, content: 'Understood. My BP today was 122/80 which looks much better than when we started!', daysAgo: 1 },
    { senderId: doc2User.id, receiverId: pat1User.id, content: 'Excellent progress Sarah! 122/80 is within the target range. Keep monitoring daily and see you at the follow-up consultation.', daysAgo: 0 },
  ];
  for (const msg of messages) {
    const ts = new Date();
    ts.setDate(ts.getDate() - msg.daysAgo);
    ts.setHours(10, 30, 0, 0);
    await prisma.message.create({
      data: { senderId: msg.senderId, receiverId: msg.receiverId, content: msg.content, timestamp: ts }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
