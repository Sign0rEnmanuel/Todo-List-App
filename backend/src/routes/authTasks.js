import express from 'express';
import { getTasks, createTask, updateTask, completeTask, deleteTask } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/get', authMiddleware, getTasks);
router.post('/create', authMiddleware, createTask);
router.put('/update/:id', authMiddleware, updateTask);
router.patch('/complete/:id', authMiddleware, completeTask);
router.delete('/delete/:id', authMiddleware, deleteTask);

export default router;