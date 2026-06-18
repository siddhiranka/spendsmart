const fs = require('fs');
const path = require('path');

let dbInstance = null;

async function getDB() {
    if (dbInstance) return dbInstance;

    const sqlite3 = require('@libsql/sqlite3');
    const { open } = require('sqlite');

    const dbPath = process.env.VERCEL ? '/tmp/database.sqlite' : path.join(__dirname, '../../database.sqlite');
    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Enable foreign keys
    await dbInstance.exec('PRAGMA foreign_keys = ON;');

    // Execute Schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await dbInstance.exec(schema);
        console.log('Database schema applied successfully.');
    } else {
        console.warn('schema.sql not found at', schemaPath);
    }

    return dbInstance;
}

module.exports = { getDB };
