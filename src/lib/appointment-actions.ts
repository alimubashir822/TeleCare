'use server';

import { prisma } from './db';

export async function createAppointment(data: {
  patientUserId: string; // The User ID of the patient
  doctorId: string;
  type: string; // 'VIDEO' | 'FOLLOWUP' | 'EMERGENCY'
  dateTime: Date | string;
  amount: number;
}) {
  try {
    const { patientUserId, doctorId, type, dateTime, amount } = data;

    // Find the patient profile linked to this user ID
    const patient = await prisma.patient.findUnique({
      where: { userId: patientUserId }
    });

    if (!patient) {
      return { success: false, error: 'Patient profile not found. Please complete profile registration.' };
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        type,
        dateTime: new Date(dateTime),
        status: 'CONFIRMED',
        amount,
        paymentStatus: 'PAID' // Instant payment simulation
      }
    });

    // Create a mock payment record
    await prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        amount,
        provider: 'Stripe',
        status: 'PAID',
        transactionId: `ch_live_${Math.random().toString(36).substring(2, 11)}`
      }
    });

    // Generate simulated video session room
    await prisma.videoSession.create({
      data: {
        appointmentId: appointment.id,
        roomName: `room-${appointment.id}`,
        active: false
      }
    });

    // Send a notification to the patient
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { user: true }
    });
    
    await prisma.notification.create({
      data: {
        userId: patientUserId,
        title: 'Appointment Confirmed',
        message: `Your ${type.toLowerCase()} consultation with ${doctor?.user.name} is scheduled for ${new Date(dateTime).toLocaleString()}.`
      }
    });

    // Send a notification to the doctor
    if (doctor) {
      await prisma.notification.create({
        data: {
          userId: doctor.userId,
          title: 'New Booking',
          message: `A patient has booked a ${type.toLowerCase()} consultation with you for ${new Date(dateTime).toLocaleString()}.`
        }
      });
    }

    return { success: true, appointmentId: appointment.id };
  } catch (error: any) {
    console.error('createAppointment error:', error);
    return { success: false, error: error.message };
  }
}

export async function getPatientAppointments(userId: string) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId }
    });

    if (!patient) {
      return { success: true, appointments: [] };
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {
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
        consultation: true,
        videoSession: true
      },
      orderBy: { dateTime: 'asc' }
    });

    return { success: true, appointments };
  } catch (error: any) {
    console.error('getPatientAppointments error:', error);
    return { success: false, error: error.message };
  }
}
