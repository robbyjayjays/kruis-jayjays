import pkg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken

dotenv.config(); // Load environment variables

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.PORT || 5432,
  ssl: {
    rejectUnauthorized: false, // Necessary for many cloud providers
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Check if the user exists
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = userResult.rows[0];

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email }, // Payload
        process.env.JWT_SECRET,             // Secret key from .env
        { expiresIn: '1h' }                 // Expiry time (optional)
      );

      // On success, return the token and user data
      res.status(200).json({
        message: 'Login successful',
        token, // Send the JWT token to the client
        user: { id: user.id, email: user.email, creator: user.creator }, // You can return user data as well, if needed
      });
    } catch (error) {
      console.error('Error logging in:', error.message);
      res.status(500).send('Server error');
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
