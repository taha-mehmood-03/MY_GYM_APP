import { NextResponse } from 'next/server';
import clientPromise from '@/db/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { email, password } = await request.json();
  const client = await clientPromise;
  const db = client.db('TAHAKHAN');
  const users = db.collection('GymUSers');

  const user = await users.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  
}
