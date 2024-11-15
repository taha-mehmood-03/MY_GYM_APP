import { NextResponse } from "next/server";
import clientPromise from "@/db/mongodb"; // Adjust import path as needed

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("TAHAKHAN");

    // Collection where images are stored
    const imagesCollection = db.collection("ExerciseImages");

    // Fetch all stored images from the database
    const images = await imagesCollection.find({}).toArray();

    if (images.length === 0) {
      return NextResponse.json({ message: "No images found" }, { status: 404 });
    }

    // Return the images
    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
