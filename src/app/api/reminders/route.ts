import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { isActive: true },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(reminders);
  } catch (error: any) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch reminders',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, memo, date, endDate } = body;

    // Validate required fields
    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and date are required' },
        { status: 400 }
      );
    }

    const reminder = await prisma.reminder.create({
      data: {
        title: title.trim(),
        memo: memo?.trim() || null,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
      },
    });

    // Create Notification
    try {
      await prisma.notification.create({
        data: {
          type: 'reminder_create',
          title: 'New Reminder',
          message: reminder.title,
          entityId: reminder.id,
        },
      });
    } catch (notifError: any) {
      console.error('Notification Error:', notifError);
    }

    return NextResponse.json(reminder, { status: 201 });
  } catch (error: any) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      {
        error: 'Failed to create reminder',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, memo, date, endDate, isActive } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const reminder = await prisma.reminder.update({
      where: { id },
      data: {
        title: title ? title.trim() : undefined,
        memo: memo !== undefined ? memo?.trim() || null : undefined,
        date: date ? new Date(date) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive: isActive ?? undefined,
        isRead: body.isRead ?? undefined,
      },
    });

    // Create Notification only if not just marking as read (avoid infinite loop if marking as read triggers update)
    // Actually, "Mark as Read" calls this PUT. If we create a notification for "Mark as Read", we spam.
    // We should ONLY create notification if TITLE or DATE changed, or ISACTIVE changed?
    // User said: "update of the calendar and notes".
    // I should check if `body.isRead` is the ONLY change.
    const isReadUpdate = Object.keys(body).length === 2 && body.isRead !== undefined && body.id;

    if (!isReadUpdate) {
      try {
        await prisma.notification.create({
          data: {
            type: 'reminder_update',
            title: 'Reminder Updated',
            message: reminder.title,
            entityId: reminder.id,
          },
        });
      } catch (notifError: any) {
        // console.error('Notification Update Error:', notifError);
      }
    }

    return NextResponse.json(reminder);
  } catch (error: any) {
    console.error('Error updating reminder:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update reminder',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      );
    }

    await prisma.reminder.update({
      where: { id },
      data: { isActive: false },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        type: 'reminder_delete',
        title: 'Reminder Deleted',
        message: 'A reminder was deleted',
        entityId: id,
      },
    });

    return NextResponse.json({ message: 'Reminder deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting reminder:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to delete reminder',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
