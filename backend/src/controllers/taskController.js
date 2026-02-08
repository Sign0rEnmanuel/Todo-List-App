import { readUSERS, writeUSERS } from '../utils/fileHandler.js';
import crypto from 'node:crypto';

export const createTask = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { name, description } = req.body;
        if (!name?.trim() || name.length < 5 || name.length > 20) {
            return res.status(400).json({ message: 'Name must be between 5 and 20 characters long' });
        }
        if (!description?.trim() || description.length < 5 || description.length > 200) {
            return res.status(400).json({ message: 'Description must be between 5 and 200 characters long' });
        }

        const users = await readUSERS();
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(400).json({ message: 'User not found' });
        }
        const user = users[userIndex];
        if (!Array.isArray(user.tasks)) {
            user.tasks = [];
        }

        const task = {
            id: crypto.randomUUID(),
            name: name.trim(),
            description: description.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'pending'
        };

        user.tasks.push(task);
        users[userIndex] = user;
        await writeUSERS(users);

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTask = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Task ID not found' });
        }

        const { name, description } = req.body;
        if (!name?.trim() || name.length < 5 || name.length > 20) {
            return res.status(400).json({ message: 'Name must be between 5 and 20 characters long' });
        }
        if (!description?.trim() || description.length < 5 || description.length > 200) {
            return res.status(400).json({ message: 'Description must be between 5 and 200 characters long' });
        }

        const users = await readUSERS();
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(400).json({ message: 'User not found' });
        }
        const user = users[userIndex];
        if (!Array.isArray(user.tasks)) {
            return res.status(400).json({ message: 'User has no tasks' });
        }
        const taskIndex = user.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            return res.status(400).json({ message: 'Task not found' });
        }

        const task = user.tasks[taskIndex];
        task.name = name.trim();
        task.description = description.trim();
        task.updatedAt = new Date().toISOString();

        user.tasks[taskIndex] = task;
        users[userIndex] = user;
        await writeUSERS(users);

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};