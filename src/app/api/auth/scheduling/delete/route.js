import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import clientPromise from "@/db/mongodb";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    console.log("Received delete request for id:", id);

    if (!id || !ObjectId.isValid(id)) {
      console.log("Invalid ID format:", id);
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("TAHAKHAN");
    const appointments = db.collection("appointments");

    console.log("Searching for appointment with id:", id);
    const existingAppointment = await appointments.findOne({ _id: new ObjectId(id) });
    if (!existingAppointment) {
      console.log("Appointment not found for id:", id);
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    console.log("Deleting appointment with id:", id);
    const result = await appointments.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      console.log("Successfully deleted appointment with id:", id);
      return NextResponse.json({ message: "Appointment deleted" }, { status: 200 });
    } else {
      console.log("Failed to delete appointment with id:", id);
      return NextResponse.json({ message: "Failed to delete appointment" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error deleting appointment:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}