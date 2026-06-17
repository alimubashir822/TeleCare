'use server';

import { prisma } from './db';

/** Get all conversations for a user (unique partners they've messaged) */
export async function getConversations(userId: string) {
  try {
    // Get all messages where user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true, role: true } },
        receiver: { select: { id: true, name: true, avatar: true, role: true } }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Build unique conversation partners
    const partnersMap = new Map<string, any>();
    for (const msg of messages) {
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!partnersMap.has(partner.id)) {
        partnersMap.set(partner.id, {
          partner,
          lastMessage: msg.content,
          lastTimestamp: msg.timestamp,
          unread: msg.receiverId === userId ? 1 : 0
        });
      } else {
        const existing = partnersMap.get(partner.id);
        if (msg.receiverId === userId) {
          existing.unread += 1;
        }
      }
    }

    return { success: true, conversations: Array.from(partnersMap.values()) };
  } catch (error: any) {
    console.error('getConversations error:', error);
    return { success: false, conversations: [] };
  }
}

/** Get message thread between two users */
export async function getMessages(userId: string, partnerId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true, role: true } }
      },
      orderBy: { timestamp: 'asc' }
    });
    return { success: true, messages };
  } catch (error: any) {
    console.error('getMessages error:', error);
    return { success: false, messages: [] };
  }
}

/** Send a new message */
export async function sendMessage(senderId: string, receiverId: string, content: string) {
  try {
    if (!content.trim()) return { success: false, error: 'Message cannot be empty.' };

    const message = await prisma.message.create({
      data: { senderId, receiverId, content: content.trim() },
      include: {
        sender: { select: { id: true, name: true, avatar: true, role: true } }
      }
    });

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: 'New Secure Message',
        message: `You have a new message. Click to view.`
      }
    });

    return { success: true, message };
  } catch (error: any) {
    console.error('sendMessage error:', error);
    return { success: false, error: error.message };
  }
}

/** Get all doctors/patients a user can message (conversation partners) */
export async function getMessageableUsers(userId: string, role: string) {
  try {
    if (role === 'PATIENT') {
      // Patient can message their doctors (from appointments)
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) return { success: true, users: [] };

      const appointments = await prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: { doctor: { include: { user: { select: { id: true, name: true, avatar: true, role: true } } } } },
        distinct: ['doctorId']
      });
      const users = appointments.map(a => a.doctor.user);
      return { success: true, users };
    } else if (role === 'DOCTOR') {
      // Doctor can message all their patients
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) return { success: true, users: [] };

      const appointments = await prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: { patient: { include: { user: { select: { id: true, name: true, avatar: true, role: true } } } } },
        distinct: ['patientId']
      });
      const users = appointments.map(a => a.patient.user);
      return { success: true, users };
    }
    return { success: true, users: [] };
  } catch (error: any) {
    console.error('getMessageableUsers error:', error);
    return { success: false, users: [] };
  }
}
