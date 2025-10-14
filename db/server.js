const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

// ====================================================================
// CRITICAL FIX: MOVE CORS MIDDLEWARE TO THE TOP
// This ensures that the Access-Control-Allow-Origin header is set
// for ALL requests, including the /api/v1/tuning-parts endpoint.
// ====================================================================
app.use((req, res, next) => {
    // Setting '*' allows connections from any origin (local file, localhost, etc.)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ====================================================================
// 1. DOCKER DATABASE CONFIGURATION
// ====================================================================
const dbConfig = {
    host: '127.0.0.1',  
    port: 3307,         
    user: 'root',       
    password: '#Kotowaifu13', // Your actual password
    database: 'tuning_db'
};

app.get('/api/v1/tuning-parts', async (req, res) => {
    let connection;
    try {
        console.log(`[API] Attempting to connect to DB on port ${dbConfig.port}...`);
        
        connection = await mysql.createConnection(dbConfig);
        console.log('[API] Database connection successful.');

        const [rows] = await connection.execute('SELECT sku, part_name, category, price, stock_quantity, image_url FROM tuning_parts;');        
        console.log(`[API] Query successful. Returning ${rows.length} rows.`);

        res.status(200).json({ 
            success: true, 
            parts: rows 
        });
    } catch (error) {
        console.error(`[API ERROR] Failed to fetch data:`, error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch data from the database. Check server console for details.',
            error: error.message
        });
    } finally {
        if (connection) {
            connection.end();
        }
    }
});


app.listen(port, () => {
    console.log(`\n✅ Secure API running at http://localhost:${port}`);
    console.log(`   Data endpoint: http://localhost:${port}/api/v1/tuning-parts\n`);
    console.log('--- READY ---');
});
