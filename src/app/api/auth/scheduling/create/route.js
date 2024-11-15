// /app/api/auth/scheduling/create/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/db/mongodb";


export async function POST(request) {
  const { exerciseName, appointmentDate } = await request.json();
  const client = await clientPromise;
  const db = client.db("TAHAKHAN");
  const appointments = db.collection("appointments");

  // Check if the appointment already exists
  const existingAppointment = await appointments.findOne({
    exerciseName,
    appointmentDate,
  });
  if (existingAppointment) {
    return NextResponse.json(
      { message: "Appointment already exists" },
      { status: 400 }
    );
  }

  // Insert the new appointment
  const newAppointment = await appointments.insertOne({ exerciseName, appointmentDate });

  // Return the created appointment object along with its ID
  return NextResponse.json(
    {
      _id: newAppointment.insertedId.toString(), // Convert ObjectId to string
      exerciseName,
      appointmentDate,
    },
    { status: 201 }
  );
}


export async function GET() {
  const client = await clientPromise;
  const db = client.db("TAHAKHAN");
  const appointments = await db.collection("appointments").find({}).toArray();

  return NextResponse.json(appointments, { status: 200 });
}

// Add PUT and DELETE methods similarly for updating and deleting appointments
