// client/src/pages/ViewFormResponses.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ViewFormResponses = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const formRes = await axios.get(`/api/forms/${formId}`);
                setForm(formRes.data);
                const responsesRes = await axios.get(`/api/responses/form/${formId}`);
                setResponses(responsesRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [formId]);

    const getQuestionData = (questionId) => {
        return form?.questions.find(q => q._id === questionId);
    };
    
    const renderAnswer = (answer) => {
        if (answer.value === null) return <span className="text-gray-400 italic">Not answered</span>;
        const question = getQuestionData(answer.questionId);
        if (!question) return <span className="text-red-500">Question data not found.</span>;

        switch (question.type) {
            case 'Categorize':
                return (
                    <div className="space-y-2">
                        {Object.entries(answer.value).map(([category, items]) => (
                            <div key={category}>
                                <strong className="font-semibold text-gray-600">{category}:</strong>
                                <span className="ml-2 text-gray-800">{(items || []).map(item => item.content).join(', ') || 'None'}</span>
                            </div>
                        ))}
                    </div>
                );
            case 'Cloze':
                const passageParts = question.passage.split('__');
                return (
                    <p className="text-gray-800 bg-gray-100 p-3 rounded-md">
                        {passageParts.map((part, index) => (
                            <span key={index}>
                                {part}
                                {index < passageParts.length - 1 && (
                                    <strong className="text-indigo-600 mx-1">{answer.value[index] || '___'}</strong>
                                )}
                            </span>
                        ))}
                    </p>
                );
            case 'Comprehension':
                 return (
                    <div className="space-y-2">
                        {Object.entries(answer.value).map(([mcqIndex, selectedOption]) => {
                             const mcq = question.mcqs[mcqIndex];
                             if (!mcq) return null;
                             return <p key={mcqIndex}><strong>Q: </strong>{mcq.questionText} <br/><strong>A: </strong><span className="text-indigo-600">{selectedOption}</span></p>
                        })}
                    </div>
                 );
            default:
                return <span className="text-gray-800">{String(answer.value)}</span>;
        }
    };

    if (loading) return <div className="text-center p-10">Loading Responses...</div>;
    if (!form) return <div className="text-center p-10">Form not found.</div>;

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">{form.title}</h1>
                    <p className="text-gray-500">Viewing all submitted responses.</p>
                </div>
                <Link to={`/form/${formId}`} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700">
                    View Form
                </Link>
            </div>
            {responses.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-500">No responses yet.</h2>
                    <p className="text-gray-400 mt-2">Share the form link to collect responses.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {responses.map((response, index) => (
                        <div key={response._id} className="bg-white p-6 rounded-xl shadow-lg border">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Response #{index + 1}</h2>
                            <div className="space-y-4">
                                {response.answers.map(answer => (
                                    <div key={answer.questionId}>
                                        <h3 className="font-semibold text-gray-600">{getQuestionData(answer.questionId)?.title}</h3>
                                        {renderAnswer(answer)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ViewFormResponses;