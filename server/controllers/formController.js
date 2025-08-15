import Form from '../models/Form.js';
import Question from '../models/Question.js';

// Create a new form
export const createForm = async (req, res) => {
    try {
        const { title, headerImage, questions } = req.body;

        const questionIds = await Promise.all(questions.map(async q => {
            const newQuestion = new Question(q);
            const savedQuestion = await newQuestion.save();
            return savedQuestion._id;
        }));

        const newForm = new Form({
            title,
            headerImage,
            questions: questionIds
        });

        const savedForm = await newForm.save();
        res.status(201).json(savedForm);
    } catch (error) {
        res.status(500).json({ message: 'Error creating form', error: error.message });
    }
};

// Get a form by ID
export const getFormById = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id).populate('questions');
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching form', error: error.message });
    }
};