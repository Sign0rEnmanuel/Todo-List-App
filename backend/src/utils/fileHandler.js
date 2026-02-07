import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../database/users.json');

export const readUSERS = async () => {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return null;
    }
};

export const writeUSERS = async (data) => {
    try {
        await fs.writeFile(dbPath, JSON.stringify(data, null, 4));
        return true;
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return false;
    }
};