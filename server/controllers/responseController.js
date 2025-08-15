
import Response from '../models/Response.js';

// Submit a response for a form
export const submitResponse = async (req, res) => {
    try {
        const { formId, answers } = req.body;
        const newResponse = new Response({ formId, answers });
        const savedResponse = await newResponse.save();
        res.status(201).json(savedResponse);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting response', error: error.message });
    }
};

// Get all responses for a specific form
export const getResponsesByFormId = async (req, res) => {
    try {
        const { formId } = req.params;
        const responses = await Response.find({ formId: formId });
        if (!responses) {
            return res.status(404).json({ message: 'No responses found for this form' });
        }
        res.status(200).json(responses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching responses', error: error.message });
    }
};