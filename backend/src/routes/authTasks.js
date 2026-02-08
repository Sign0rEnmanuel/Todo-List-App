import express from 'express';
import { createTask, updateTask, completeTask } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createTask);
router.put('/update/:id', authMiddleware, updateTask);
router.put('/complete/:id', authMiddleware, completeTask);

export default router;