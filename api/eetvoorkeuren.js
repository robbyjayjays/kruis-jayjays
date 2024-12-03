export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const query = 'SELECT preference_name FROM eetvoorkeuren;';
            const result = await pool.query(query);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error fetching dietary preferences:', error.message);
            res.status(500).json({ error: 'Server error while fetching dietary preferences' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
