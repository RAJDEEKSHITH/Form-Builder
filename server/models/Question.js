// server/models/Question.js

import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Categorize', 'Cloze', 'Comprehension']
    },
    title: {
        type: String,
        required: true
    },
    image: String, // URL to the image
    // Fields for 'Categorize' questions
    categories: [String],
    items: [{
        name: String,
        category: String
    }],
    passage: String, 
    options: [String],
    // Fields for 'Comprehension' questions
    comprehensionPassage: String,
    mcqs: [{
        questionText: String,
        options: [String],
        correctAnswer: String
    }]
}, {
    timestamps: true
});

const Question = mongoose.model('Question', questionSchema);
export default Question;