import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        value: mongoose.Schema.Types.Mixed // Flexible to store different answer types
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const Response = mongoose.model('Response', responseSchema);
export default Response;