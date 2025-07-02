import clientPromise from '@/db/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const images = req.body;

    if (!Array.isArray(images) || images.length === 0 || images.some(img => !img.bodyPart || !img.imageUrl)) {
      return res.status(400).json({ message: 'Invalid data: an array of images with bodyPart and imageUrl is required' });
    }

    const client = await clientPromise;
    const db = client.db('TAHAKHAN');
    const imagesCollection = db.collection('ExerciseImages');

    const insertResults = await imagesCollection.insertMany(
      images.map(({ bodyPart, imageUrl }) => ({
        bodyPart,
        imageUrl,
        createdAt: new Date(),
      }))
    );

    if (insertResults.acknowledged) {
      return res.status(201).json({ message: 'Images stored successfully', ids: insertResults.insertedIds });
    } else {
      return res.status(500).json({ message: 'Failed to store images' });
    }
  } catch (error) {
    console.error('Error storing images:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
} 