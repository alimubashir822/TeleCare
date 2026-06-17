'use server';

import { prisma } from './db';

export async function getNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    const unreadCount = notifications.filter(n => !n.read).length;
    return { success: true, notifications, unreadCount };
  } catch (error: any) {
    console.error('getNotifications error:', error);
    return { success: false, notifications: [], unreadCount: 0 };
  }
}

export async function markNotificationRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
    return { success: true };
  } catch (error: any) {
    console.error('markNotificationRead error:', error);
    return { success: false };
  }
}

export async function markAllNotificationsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
    return { success: true };
  } catch (error: any) {
    console.error('markAllNotificationsRead error:', error);
    return { success: false };
  }
}
