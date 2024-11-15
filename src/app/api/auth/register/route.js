import { NextResponse } from 'next/server';
import clientPromise from '@/db/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { email, password,currentWeight,targetWeight, } = await request.json();
  const client = await clientPromise;
  const db = client.db('TAHAKHAN');
  const users = db.collection('GymUSers');

  const existingUser = await users.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await users.insertOne({ email,currentWeight,targetWeight, password: hashedPassword });

  return NextResponse.json({ message: 'User created' }, { status: 201 });
}
