'use server';

import { prisma } from './db';

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { role: 'asc' }
    });
    return { success: true, users };
  } catch (error: any) {
    console.error('getUsers error:', error);
    return { success: false, error: error.message };
  }
}

export async function verifyLogin(email: string, passwordHash: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Invalid password' };
    }

    // Load additional role-specific profiles
    let profileId = '';
    if (user.role === 'DOCTOR') {
      const doc = await prisma.doctor.findUnique({ where: { userId: user.id } });
      if (doc) profileId = doc.id;
    } else if (user.role === 'PATIENT') {
      const pat = await prisma.patient.findUnique({ where: { userId: user.id } });
      if (pat) profileId = pat.id;
    }

    return { 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        profileId
      }
    };
  } catch (error: any) {
    console.error('verifyLogin error:', error);
    return { success: false, error: error.message };
  }
}

export async function getProfileDetails(userId: string, role: string) {
  try {
    if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId },
        include: { user: true }
      });
      return { success: true, data: doctor };
    } else if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId },
        include: { 
          user: true,
          records: { orderBy: { date: 'desc' } },
          documents: { orderBy: { uploadedAt: 'desc' } },
          appointments: {
            include: { doctor: { include: { user: true } } },
            orderBy: { dateTime: 'desc' }
          }
        }
      });
      return { success: true, data: patient };
    }
    return { success: false, error: 'No profile for admin role' };
  } catch (error: any) {
    console.error('getProfileDetails error:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserWithProfile(userId: string, role: string) {
  try {
    let profileId = '';
    if (role === 'DOCTOR') {
      const doc = await prisma.doctor.findUnique({ where: { userId } });
      if (doc) profileId = doc.id;
    } else if (role === 'PATIENT') {
      const pat = await prisma.patient.findUnique({ where: { userId } });
      if (pat) profileId = pat.id;
    }
    return { success: true, profileId };
  } catch (error: any) {
    console.error('getUserWithProfile error:', error);
    return { success: false, profileId: '' };
  }
}

