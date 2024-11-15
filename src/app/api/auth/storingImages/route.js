import { NextResponse } from 'next/server';
import clientPromise from '@/db/mongodb';

export async function POST(request) {
  try {
    const images = await request.json();

    // Validate data
    if (!Array.isArray(images) || images.length === 0 || images.some(img => !img.bodyPart || !img.imageUrl)) {
      return NextResponse.json({ message: 'Invalid data: an array of images with bodyPart and imageUrl is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('TAHAKHAN');
    
    // Collection to store images
    const imagesCollection = db.collection('ExerciseImages');

    // Store image data in MongoDB
    const insertResults = await imagesCollection.insertMany(
      images.map(({ bodyPart, imageUrl }) => ({
        bodyPart,
        imageUrl,
        createdAt: new Date(),
      }))
    );

    if (insertResults.acknowledged) {
      return NextResponse.json({ message: 'Images stored successfully', ids: insertResults.insertedIds }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Failed to store images' }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error storing images:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
