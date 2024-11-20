import { NextResponse } from "next/server";
import clientPromise from "@/db/mongodb";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    // Get the token from the Authorization header
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Extract token after "Bearer"

    if (!token) {
      return NextResponse.json({ message: 'Authorization token is missing' }, { status: 401 });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log the decoded user information (optional)
    console.log('Authenticated user:', decoded);

    // Proceed with fetching images
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
    console.error("Error:", error);
    return NextResponse.json({ message: "Invalid token or server error" }, { status: 401 });
  }
}
