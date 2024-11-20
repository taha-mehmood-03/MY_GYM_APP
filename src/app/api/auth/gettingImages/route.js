import { NextResponse } from "next/server";
import clientPromise from "@/db/mongodb";

export async function GET() {
  try {
    // Log environment details for debugging
    console.log('Current Environment:', process.env.NODE_ENV);
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

    const client = await clientPromise;
    const db = client.db("TAHAKHAN");
    const imagesCollection = db.collection("ExerciseImages");

    const images = await imagesCollection.find({}).toArray();

    // Explicitly log images count
    console.log(`Retrieved ${images.length} images`);

    return NextResponse.json(images, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_API_URL, // Correctly reference the environment variable
      }
    });
  } catch (error) {
    console.error("Detailed error fetching images:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    const errorResponse = {
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Add CORS header for fallback
      }
    });
  }
}
