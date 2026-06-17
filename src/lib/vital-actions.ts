'use server';

import { prisma } from './db';

export async function addVitalLog(data: {
  userId: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  glucose: number;
}) {
  try {
    const { userId, systolic, diastolic, heartRate, glucose } = data;

    // Find patient profile
    const patient = await prisma.patient.findUnique({
      where: { userId }
    });

    if (!patient) {
      return { success: false, error: 'Patient profile not found.' };
    }

    const log = await prisma.vitalLog.create({
      data: {
        patientId: patient.id,
        systolic,
        diastolic,
        heartRate,
        glucose
      }
    });

    // Notify patient
    await prisma.notification.create({
      data: {
        userId,
        title: 'Vitals Sync Complete',
        message: `Vitals recorded: Blood Pressure ${systolic}/${diastolic} mmHg, Glucose ${glucose} mg/dL.`
      }
    });

    return { success: true, log };
  } catch (error: any) {
    console.error('addVitalLog error:', error);
    return { success: false, error: error.message };
  }
}

export async function getPatientVitals(patientId: string) {
  try {
    const vitalLogs = await prisma.vitalLog.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' }
    });
    return { success: true, vitalLogs };
  } catch (error: any) {
    console.error('getPatientVitals error:', error);
    return { success: false, error: error.message };
  }
}
