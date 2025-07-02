import clientPromise from '@/db/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    console.log('Password provided:', password);
    
    const client = await clientPromise;
    const db = client.db('TAHAKHAN');
    const users = db.collection('GymUSers');

    const user = await users.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', { email: user.email, hasPassword: !!user.password });
    console.log('Stored password hash:', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ 
      message: 'Login successful',
      user: {
        email: user.email,
        name: user.name || email.split('@')[0],
        currentWeight: user.currentWeight,
        targetWeight: user.targetWeight
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 