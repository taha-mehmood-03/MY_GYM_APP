import clientPromise from '@/db/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { exercise, date, userId } = req.body;
    console.log('Received appointment data:', { exercise, date, userId });
    console.log('Request body:', req.body);
    
    if (!exercise || !date) {
      console.log('Missing required fields:', { exercise: !!exercise, date: !!date });
      return res.status(400).json({ message: 'Missing required fields: exercise and date' });
    }

    const client = await clientPromise;
    const db = client.db('TAHAKHAN');
    const appointmentsCollection = db.collection('Appointments');

    const newAppointment = {
      exercise,
      date: new Date(date),
      userId: userId || 'anonymous',
      createdAt: new Date(),
    };

    const result = await appointmentsCollection.insertOne(newAppointment);

    // Return the full appointment object with the inserted ID
    const createdAppointment = {
      _id: result.insertedId,
      ...newAppointment,
    };

    return res.status(201).json(createdAppointment);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
} 