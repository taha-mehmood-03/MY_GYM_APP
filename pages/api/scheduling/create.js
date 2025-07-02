import clientPromise from '@/db/mongodb';

export default async function handler(req, res) {
  // Connect to MongoDB
  let client;
  try {
    client = await clientPromise;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return res.status(500).json({ message: 'Database connection failed' });
  }

  const db = client.db('TAHAKHAN');
  const appointments = db.collection('appointments');

  try {
    switch (req.method) {
      case 'POST':
        // Validate request body
        if (!req.body?.exerciseName || !req.body?.appointmentDate) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        const { exerciseName, appointmentDate } = req.body;

        // Check for existing appointment
        const existingAppointment = await appointments.findOne({
          exerciseName,
          appointmentDate,
        });
        
        if (existingAppointment) {
          return res.status(400).json({ message: 'Appointment already exists' });
        }

        // Create new appointment
        const newAppointment = await appointments.insertOne({ 
          exerciseName, 
          appointmentDate,
          createdAt: new Date() // Add creation timestamp
        });

        return res.status(201).json({
          _id: newAppointment.insertedId.toString(),
          exerciseName,
          appointmentDate,
          createdAt: new Date().toISOString()
        });

      case 'GET':
        // Get all appointments, sorted by date
        const allAppointments = await appointments
          .find({})
          .sort({ appointmentDate: 1 }) // Sort by date ascending
          .toArray();
        
        return res.status(200).json(allAppointments);

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
}