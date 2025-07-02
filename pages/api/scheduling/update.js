import { ObjectId } from 'mongodb';
import clientPromise from '@/db/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id, exerciseName, appointmentDate } = req.body;
    
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const client = await clientPromise;
    const db = client.db('TAHAKHAN');
    const appointments = db.collection('appointments');

    const existingAppointment = await appointments.findOne({ _id: new ObjectId(id) });
    if (!existingAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointments.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: { exerciseName, appointmentDate } }
    );

    return res.status(200).json({ message: 'Appointment updated' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 