'use server';

import { prisma } from './db';

export async function getAdminStats() {
  try {
    const docCount = await prisma.doctor.count();
    const patCount = await prisma.patient.count();
    const appCount = await prisma.appointment.count();

    // Calculate total revenue from appointments
    const paidAppointments = await prisma.appointment.findMany({
      where: { paymentStatus: 'PAID' }
    });
    const revenue = paidAppointments.reduce((sum: number, app: any) => sum + app.amount, 0);

    const doctors = await prisma.doctor.findMany({
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        appointments: { where: { paymentStatus: 'PAID' } }
      }
    });

    const appointments = await prisma.appointment.findMany({
      include: {
        patient: { include: { user: { select: { name: true, avatar: true } } } },
        doctor: {
          include: {
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { dateTime: 'desc' }
    });

    // Build specialty distribution
    const specialtyMap: Record<string, number> = {};
    doctors.forEach((d: any) => {
      specialtyMap[d.specialty] = (specialtyMap[d.specialty] || 0) + 1;
    });

    // Mock monthly revenue data (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyRevenue = [4200, 5800, 7100, 6300, 8900, revenue > 0 ? revenue : 9500];
    const monthlyConsultations = [28, 34, 42, 38, 51, appCount > 0 ? appCount * 3 : 58];

    // Patient engagement scoring (mock scores based on appointment activity)
    const patients = await prisma.patient.findMany({
      include: {
        user: { select: { name: true, avatar: true } },
        appointments: true,
        vitalLogs: { take: 1, orderBy: { recordedAt: 'desc' } }
      }
    });

    const patientEngagement = patients.map(p => {
      const totalApps = p.appointments.length;
      const completedApps = p.appointments.filter(a => a.status === 'COMPLETED').length;
      const hasRecentVitals = p.vitalLogs.length > 0;
      const score = Math.min(100, completedApps * 25 + totalApps * 15 + (hasRecentVitals ? 20 : 0));
      const risk = score < 30 ? 'High' : score < 60 ? 'Medium' : 'Low';
      return {
        id: p.id,
        name: p.user.name,
        avatar: p.user.avatar,
        score,
        risk,
        totalVisits: totalApps,
        completedVisits: completedApps,
        hasVitals: hasRecentVitals
      };
    });

    // Top doctor by bookings
    const topDoctor = doctors.reduce((top: any, d: any) => 
      d.appointments.length > (top?.appointments?.length || 0) ? d : top, doctors[0]);

    return {
      success: true,
      stats: { docCount, patCount, appCount, revenue },
      doctors,
      appointments,
      specialtyMap,
      monthlyRevenue,
      monthlyConsultations,
      months,
      patientEngagement,
      topDoctor
    };
  } catch (error: any) {
    console.error('getAdminStats error:', error);
    return { success: false, error: error.message };
  }
}
