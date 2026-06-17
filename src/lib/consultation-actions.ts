'use server';

import { prisma } from './db';

interface PrescriptionInput {
  medicine: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export async function saveConsultation(data: {
  appointmentId: string;
  reason: string;
  symptoms: string;
  notes: string;
  summary: string;
  prescriptions: PrescriptionInput[];
}) {
  try {
    const { appointmentId, reason, symptoms, notes, summary, prescriptions } = data;

    // Check if appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true }
    });

    if (!appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    // 1. Create or update Consultation record
    const consultation = await prisma.consultation.create({
      data: {
        appointmentId,
        reason,
        symptoms,
        notes,
        summary,
        status: 'COMPLETED'
      }
    });

    // 2. Add Prescriptions
    if (prescriptions && prescriptions.length > 0) {
      for (const p of prescriptions) {
        await prisma.prescription.create({
          data: {
            consultationId: consultation.id,
            medicine: p.medicine,
            dosage: p.dosage,
            duration: p.duration,
            instructions: p.instructions
          }
        });
      }
    }

    // 3. Add a Medical Record entry for patient
    await prisma.medicalRecord.create({
      data: {
        patientId: appointment.patientId,
        diagnosis: reason || 'Routine Checkup',
        treatment: prescriptions.map(p => `${p.medicine} (${p.dosage})`).join(', ') || 'Consultation advisory guidelines',
        notes: notes
      }
    });

    // 4. Update Appointment status to COMPLETED
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'COMPLETED'
      }
    });

    // 5. Create AI Report for follow-up care reminders
    await prisma.aIReport.create({
      data: {
        patientId: appointment.patientId,
        type: 'POST_VISIT_CARE',
        content: JSON.stringify({
          reason: reason,
          advice: notes,
          summary: summary,
          timeline: [
            { day: 'Day 1', task: 'Check instructions and start medications' },
            { day: 'Day 7', task: 'Recovery update - note blood pressure trends' },
            { day: 'Day 14', task: 'Follow-up booking if symptoms persist' }
          ]
        })
      }
    });

    // Send notifications
    await prisma.notification.create({
      data: {
        userId: appointment.patient.userId,
        title: 'Consultation Finalized',
        message: 'Your health records and prescriptions are updated. View post-visit AI guidelines now.'
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error('saveConsultation error:', error);
    return { success: false, error: error.message };
  }
}

export async function getAppointmentDetails(appointmentId: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
                email: true
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        },
        consultation: {
          include: {
            prescriptions: true
          }
        }
      }
    });
    return { success: true, appointment };
  } catch (error: any) {
    console.error('getAppointmentDetails error:', error);
    return { success: false, error: error.message };
  }
}
