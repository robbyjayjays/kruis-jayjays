import pkg from 'pg';
import dotenv from 'dotenv';

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
  if (req.method === 'PUT') {
    const { email, firstname, lastname, department, province, functions } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      // Check if the user exists
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update the fields that were provided in the request
      const fieldsToUpdate = [];
      const values = [];

      if (firstname) {
        fieldsToUpdate.push('firstname');
        values.push(firstname);
      }

      if (lastname) {
        fieldsToUpdate.push('lastname');
        values.push(lastname);
      }

      if (department) {
        fieldsToUpdate.push('department');
        values.push(department);
      }

      if (province) {
        fieldsToUpdate.push('province');
        values.push(province);
      }

      if (functions) {
        fieldsToUpdate.push('functions');
        values.push(functions);
      }

      // Construct the query dynamically
      const setClause = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`).join(', ');
      values.push(email); // Add the email as the last parameter

      if (fieldsToUpdate.length > 0) {
        await pool.query(
          `UPDATE users SET ${setClause} WHERE email = $${fieldsToUpdate.length + 1}`,
          values
        );
      }

      res.status(200).json({
        message: 'User information updated successfully',
        updatedFields: {
          firstname,
          lastname,
          department,
          province,
          functions,
        },
      });
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
