import { useState } from 'react';

const ComprehensionView = ({ question, onAnswerChange }) => {
    const [answers, setAnswers] = useState({});

    const handleSelection = (mcqIndex, option) => {
        const newAnswers = { ...answers, [mcqIndex]: option };
        setAnswers(newAnswers);
        onAnswerChange(newAnswers);
    };

    return (
        <div className="p-6 my-4 bg-slate-50 rounded-xl shadow-inner border">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{question.title}</h3>
            
            <div className="prose max-w-none p-4 bg-white border rounded-md mb-6 text-gray-700">
                <p>{question.comprehensionPassage}</p>
            </div>

            <div className="space-y-6">
                {question.mcqs.map((mcq, index) => (
                    <div key={index}>
                        <p className="font-semibold text-gray-800 text-lg">{index + 1}. {mcq.questionText}</p>
                        <div className="mt-3 space-y-3">
                            {mcq.options.map(option => (
                                <label key={option} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${answers[index] === option ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name={`mcq-${question._id}-${index}`}
                                        value={option}
                                        checked={answers[index] === option}
                                        onChange={() => handleSelection(index, option)}
                                        className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className={`ml-4 text-md ${answers[index] === option ? 'font-bold text-indigo-800' : 'text-gray-700'}`}>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComprehensionView;