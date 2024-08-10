import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/userController';

const router = Router();

router.get('/users', getAllUsers);
router.post('/users', createUser);

export default router;
