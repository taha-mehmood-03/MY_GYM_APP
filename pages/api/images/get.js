import clientPromise from '@/db/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Current Environment:', process.env.NODE_ENV);

    const client = await clientPromise;
    const db = client.db('TAHAKHAN');
    const imagesCollection = db.collection('ExerciseImages');

    const images = await imagesCollection.find({}).limit(1000).toArray();

    console.log(`Retrieved ${images.length} images`);

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json(images);
  } catch (error) {
    console.error('Detailed error fetching images:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    const errorResponse = {
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json(errorResponse);
  }
} 