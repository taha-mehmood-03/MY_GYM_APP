import { NextResponse } from "next/server";
import clientPromise from "@/db/mongodb";

export async function GET(request) {
  try {
    // Extensive logging
    console.log('Request Origin:', request.headers.get('origin'));
    console.log('Current Environment:', process.env.NODE_ENV);
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

    // Establish MongoDB connection
    const client = await clientPromise;
    const db = client.db("TAHAKHAN");
    const imagesCollection = db.collection("ExerciseImages");

    // Fetch images
    const images = await imagesCollection.find({}).toArray();

    // Log images details
    console.log(`Retrieved ${images.length} images`);
    console.log('First image (if exists):', images[0]);

    // Improved CORS handling
    const allowedOrigins = [
      'http://localhost:3000',
      'https://my-gym-app-co8y-icfsgooy7-taha-mehmoods-projects-175bb778.vercel.app'
    ];
    const origin = request.headers.get('origin') || '';
    const corsHeaders = {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
    };

    // Return response with dynamic CORS headers
    return NextResponse.json(images, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Detailed error fetching images:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Improved error response
    const errorResponse = {
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }
}

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}