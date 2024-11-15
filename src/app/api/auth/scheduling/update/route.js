import { NextResponse } from 'next/server';
import clientPromise from '@/db/mongodb';

export async function PUT(request) {
  const { id, exerciseName, appointmentDate } = await request.json();
  const client = await clientPromise;
  const db = client.db('exerciseDB');
  const appointments = db.collection('appointments');

  const existingAppointment = await appointments.findOne({ _id: ObjectId(id) });
  if (!existingAppointment) {
    return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
  }

  await appointments.updateOne({ _id: ObjectId(id) }, { $set: { exerciseName, appointmentDate } });

  return NextResponse.json({ message: 'Appointment updated' }, { status: 200 });
}