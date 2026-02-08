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
            return res.status(409).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = {
            id: crypto.randomUUID(),
            username: username.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tasks: [],
        };

        users.push(newUser);
        await writeUSERS(users);

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h', algorithm: 'HS256' }
        );

        res.status(201).json({ message: 'User created successfully', token,
            user: { id: newUser.id, username: newUser.username, createdAt: newUser.createdAt, updatedAt: newUser.updatedAt }
        });
    } catch (error) {
        console.log('Register error:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
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
        if (!userExists) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, userExists.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: userExists.id, username: userExists.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h', algorithm: 'HS256' }
        );

        res.status(200).json({ message: 'Login successful', token,
            user: { id: userExists.id, username: userExists.username, createdAt: userExists.createdAt, updatedAt: userExists.updatedAt }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { currentPassword, newPassword } = req.body;
        if (!currentPassword?.trim() || currentPassword.length < 5 || currentPassword.length > 20) {
            return res.status(400).json({ message: 'Current password must be between 5 and 20 characters long' });
        }
        if (!newPassword?.trim() || newPassword.length < 5 || newPassword.length > 20) {
            return res.status(400).json({ message: 'New password must be between 5 and 20 characters long' });
        }
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password must be different from current password' });
        }

        const users = await readUSERS();
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentUser = users[userIndex];
        const isPasswordCorrect = await bcrypt.compare(currentPassword.trim(), currentUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }
        currentUser.password = await bcrypt.hash(newPassword.trim(), 12);
        currentUser.updatedAt = new Date().toISOString();

        users[userIndex] = currentUser;
        await writeUSERS(users);

        const token = jwt.sign(
            { id: currentUser.id, username: currentUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h', algorithm: 'HS256' }
        )
        res.status(200).json({
            message: 'User updated successfully',
            token: token,
            user: {
                id: currentUser.id,
                username: currentUser.username,
                updatedAt: currentUser.updatedAt,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { password } = req.body;
        if (!password?.trim() || password.length < 5 || password.length > 20) {
            return res.status(400).json({ message: 'Current password must be between 5 and 20 characters long' });
        }

        const users = await readUSERS();
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[userIndex];
        const isPasswordCorrect = await bcrypt.compare(password.trim(), user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        users.splice(userIndex, 1);
        await writeUSERS(users);

        res.status(200).json({ succes: true, message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
};