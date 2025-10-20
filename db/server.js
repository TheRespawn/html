const express = require('express');
const mysql = require('mysql2/promise');

// ====================================================================
// 1. LOAD ENVIRONMENT VARIABLES FROM .env FILE
// This line MUST be at the top, before you use any environment variables.
// ====================================================================
require('dotenv').config();

const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ====================================================================
// 2. DOCKER DATABASE CONFIGURATION
// Use process.env to securely access the variables loaded by dotenv.
// ====================================================================
const dbConfig = {
    host: '127.0.0.1',  
    port: 3307,         
    user: 'root',       
    // CORRECT: Access the password via process.env
    password: process.env.DB_PASSWORD, 
    database: 'tuning_db'
};

app.get('/api/v1/tuning-parts', async (req, res) => {
    let connection;
    try {
        // You can add a check to make sure the password was loaded
        if (!dbConfig.password) {
            throw new Error('Database password is not defined. Check your .env file.');
        }

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