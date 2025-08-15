import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled Form'
    },
    headerImage: {
        type: String
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    createdBy: {
        type: String, 
        default: 'anonymous'
    }
}, {
    timestamps: true
});

const Form = mongoose.model('Form', formSchema);
export default Form;