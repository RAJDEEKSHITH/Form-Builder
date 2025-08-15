
import express from 'express';
import { submitResponse, getResponsesByFormId } from '../controllers/responseController.js';

const router = express.Router();

// POST a new response
router.post('/', submitResponse);

// GET all responses for a specific form
router.get('/form/:formId', getResponsesByFormId);

export default router;