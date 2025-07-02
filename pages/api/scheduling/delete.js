import { ObjectId } from 'mongodb';
import clientPromise from '@/db/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    console.log('Received delete request for id:', id);

    if (!id || !ObjectId.isValid(id)) {
      console.log('Invalid ID format:', id);
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const client = await clientPromise;
    const db = client.db('TAHAKHAN');
    const appointments = db.collection('appointments');

    console.log('Searching for appointment with id:', id);
    const existingAppointment = await appointments.findOne({ _id: new ObjectId(id) });
    if (!existingAppointment) {
      console.log('Appointment not found for id:', id);
      return res.status(404).json({ message: 'Appointment not found' });
    }

    console.log('Deleting appointment with id:', id);
    const result = await appointments.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      console.log('Successfully deleted appointment with id:', id);
      return res.status(200).json({ message: 'Appointment deleted' });
    } else {
      console.log('Failed to delete appointment with id:', id);
      return res.status(500).json({ message: 'Failed to delete appointment' });
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
} 