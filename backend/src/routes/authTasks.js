import express from 'express';
import { createTask, updateTask, completeTask, deleteTask } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createTask);
router.put('/update/:id', authMiddleware, updateTask);
router.put('/complete/:id', authMiddleware, completeTask);
router.delete('/delete/:id', authMiddleware, deleteTask);

export default router;