import express from 'express';
import { createTask, updateTask } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createTask);
router.put('/update/:id', authMiddleware, updateTask);

export default router;