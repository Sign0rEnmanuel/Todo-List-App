import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../database/users.json');

export const readUSERS = async () => {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        const parsed = JSON.parse(data);

        if (!Array.isArray(parsed)) {
            console.error('Error: Data is not an array');
            return [];
        }

        return parsed;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn('Warning: users.json not found, returning empty array');
            await writeUSERS([]);
            return [];
        }
        if (error instanceof SyntaxError) {
            console.error('Error: users.json is not valid JSON');
            await writeUSERS([]);
            return [];
        }
        console.error(`Error: ${error.message}`);
        return [];
    }
};

export const writeUSERS = async (data) => {
    if (!Array.isArray(data)) {
        console.error('Error: Data is not an array');
        return false;
    }
    try {
        await fs.mkdir(path.dirname(dbPath), { recursive: true });
        await fs.writeFile(dbPath, JSON.stringify(data, null, 4), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return false;
    }
};