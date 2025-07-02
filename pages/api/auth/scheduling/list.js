import clientPromise from '@/db/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    const client = await clientPromise;
    const db = client.db('TAHAKHAN');
    const appointmentsCollection = db.collection('Appointments');
    
    // If userId is provided, filter by it; otherwise return all appointments
    const filter = userId ? { userId } : {};
    const appointments = await appointmentsCollection.find(filter).toArray();
    
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
} 