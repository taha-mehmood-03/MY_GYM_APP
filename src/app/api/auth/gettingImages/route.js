import { NextResponse } from "next/server";
import clientPromise from "@/db/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("TAHAKHAN");
    const imagesCollection = db.collection("ExerciseImages");

    const images = await imagesCollection.find({}).toArray();

    // Return empty array instead of 404 if no images found
    return NextResponse.json(images, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error("Error fetching images:", error);
    
    // More detailed error response
    const errorResponse = {
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}