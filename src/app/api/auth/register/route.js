import { NextResponse } from "next/server";
import clientPromise from "@/db/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password, currentWeight, targetWeight } =
      await request.json();

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("TAHAKHAN");
    const users = db.collection("GymUSers");

    // Check if the user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert the new user into the database
    await users.insertOne({
      email,
      currentWeight,
      targetWeight,
      password: hashedPassword,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    // Catch any unexpected errors
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred. Please try again later.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
