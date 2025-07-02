import clientPromise from '@/db/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, currentWeight, targetWeight } = req.body;

    const client = await clientPromise;
    const db = client.db('TAHAKHAN');
    const users = db.collection('GymUSers');

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await users.insertOne({
      email,
      currentWeight,
      targetWeight,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again later.',
      error: error.message,
    });
  }
} 