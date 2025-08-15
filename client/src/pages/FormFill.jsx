// client/src/pages/FormFill.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategorizeView from '../components/question-views/CategorizeView';
import ClozeView from '../components/question-views/ClozeView';
import ComprehensionView from '../components/question-views/ComprehensionView';

const FormFill = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const { data } = await axios.get(`/api/forms/${formId}`);
                setForm(data);
                const initialResponses = {};
                data.questions.forEach(q => { initialResponses[q._id] = null; });
                setResponses(initialResponses);
            } catch (error) {
                console.error("Failed to fetch form", error);
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [formId]);

    const handleAnswerChange = (questionId, value) => {
        setResponses(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formattedAnswers = Object.entries(responses).map(([questionId, value]) => ({ questionId, value }));
        try {
            await axios.post('/api/responses', { formId, answers: formattedAnswers });
            navigate('/success');
        } catch (error) {
            console.error('Failed to submit response', error);
            alert('Submission failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading Form...</div>;
    if (!form) return <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-500">Form Not Found</div>;

    const renderQuestionView = (q) => {
        const commonProps = { question: q, onAnswerChange: (value) => handleAnswerChange(q._id, value) };
        switch (q.type) {
            case 'Categorize': return <CategorizeView key={q._id} {...commonProps} />;
            case 'Cloze': return <ClozeView key={q._id} {...commonProps} />;
            case 'Comprehension': return <ComprehensionView key={q._id} {...commonProps} />;
            default: return <div key={q._id} className="p-4 my-2 bg-yellow-100 rounded-md"><p>Unsupported question type: {q.type}</p></div>;
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-xl shadow-2xl">
                <div className="p-8 md:p-12">
                    <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">{form.title}</h1>
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {form.questions.map(q => renderQuestionView(q))}
                        <div className="text-center pt-6">
                            <button type="submit" disabled={isSubmitting} className="px-12 py-4 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-indigo-700 disabled:bg-indigo-300 transform hover:scale-105 transition-all duration-300">
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default FormFill;