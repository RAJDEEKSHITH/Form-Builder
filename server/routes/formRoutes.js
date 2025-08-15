import express from 'express';
import { createForm, getFormById } from '../controllers/formController.js';

const router = express.Router();

router.post('/', createForm);
router.get('/:id', getFormById);

export default router;