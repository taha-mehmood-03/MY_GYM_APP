import clientPromise from '@/db/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Missing appointment ID' });
    }

    const client = await clientPromise;
    const db = client.db('TAHAKHAN');
    const appointmentsCollection = db.collection('Appointments');

    const result = await appointmentsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    return res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
} 