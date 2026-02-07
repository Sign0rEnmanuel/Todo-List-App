import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { readUSERS, writeUSERS } from '../utils/fileHandler.js';

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username?.trim() || username.length < 5 || username.length > 20) {
            return res.status(400).json({ message: 'Username must be between 5 and 20 characters long' });
        }
        if (!password?.trim() || password.length < 5 || password.length > 20) {
            return res.status(400).json({ message: 'Password must be between 5 and 20 characters long' });
        }

        const users = await readUSERS();
        const userExists = users.find(user => user.username.toLowerCase() === username.trim().toLowerCase());
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = {
            id: crypto.randomUUID(),
            username: username.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            task: [],
        };

        users.push(newUser);
        await writeUSERS(users);

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h', algorithm: 'HS256' }
        );

        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};