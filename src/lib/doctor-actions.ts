'use server';

import { prisma } from './db';

interface DoctorFilters {
  specialty?: string;
  language?: string;
  maxPrice?: number;
  minExperience?: number;
  searchQuery?: string;
}

export async function getDoctors(filters: DoctorFilters = {}) {
  try {
    const { specialty, language, maxPrice, minExperience, searchQuery } = filters;

    const where: any = {};

    if (specialty && specialty !== 'All') {
      where.specialty = specialty;
    }

    if (maxPrice) {
      where.price = {
        lte: maxPrice
      };
    }

    if (minExperience) {
      where.experience = {
        gte: minExperience
      };
    }

    if (language && language !== 'All') {
      where.languages = {
        contains: language
      };
    }

    if (searchQuery) {
      where.OR = [
        {
          user: {
            name: {
              contains: searchQuery
            }
          }
        },
        {
          bio: {
            contains: searchQuery
          }
        }
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    return { success: true, doctors };
  } catch (error: any) {
    console.error('getDoctors error:', error);
    return { success: false, error: error.message };
  }
}

export async function getDoctorById(id: string) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
    return { success: true, doctor };
  } catch (error: any) {
    console.error('getDoctorById error:', error);
    return { success: false, error: error.message };
  }
}

export async function getDoctorAppointments(userId: string) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId }
    });

    if (!doctor) {
      return { success: true, appointments: [] };
    }

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
                email: true
              }
            },
            documents: true,
            records: true,
            vitalLogs: {
              orderBy: { recordedAt: 'desc' }
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
    console.error('getDoctorAppointments error:', error);
    return { success: false, error: error.message };
  }
}

export async function getPatientAiReport(patientId: string) {
  try {
    const report = await prisma.aIReport.findFirst({
      where: { 
        patientId,
        type: 'PRE_VISIT_SUMMARY' 
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, report };
  } catch (error: any) {
    console.error('getPatientAiReport error:', error);
    return { success: false, error: error.message };
  }
}
