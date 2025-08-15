// client/src/components/editors/ComprehensionEditor.jsx
import { Plus, Trash2 } from 'lucide-react';

const ComprehensionEditor = ({ question, updateQuestion }) => {
    const handleFieldChange = (field, value) => {
        updateQuestion(question.id, { ...question, [field]: value });
    };

    const handleMcqChange = (mcqIndex, field, value) => {
        const newMcqs = question.mcqs.map((mcq, i) => 
            i === mcqIndex ? { ...mcq, [field]: value } : mcq
        );
        handleFieldChange('mcqs', newMcqs);
    };

    const addMcq = () => {
        const newMcqs = [...question.mcqs, { questionText: '', options: ['', ''], correctAnswer: '' }];
        handleFieldChange('mcqs', newMcqs);
    };
    
    const handleOptionChange = (mcqIndex, optionIndex, value) => {
        const newMcqs = question.mcqs.map((mcq, i) => {
            if (i === mcqIndex) {
                const newOptions = mcq.options.map((opt, j) => j === optionIndex ? value : opt);
                return { ...mcq, options: newOptions };
            }
            return mcq;
        });
        handleFieldChange('mcqs', newMcqs);
    };
    
    const addOption = (mcqIndex) => {
        const newMcqs = question.mcqs.map((mcq, i) => {
            if (i === mcqIndex) {
                return { ...mcq, options: [...mcq.options, ''] };
            }
            return mcq;
        });
        handleFieldChange('mcqs', newMcqs);
    };
    
    const removeOption = (mcqIndex, optionIndex) => {
        const newMcqs = question.mcqs.map((mcq, i) => {
            if (i === mcqIndex) {
                const newOptions = mcq.options.filter((_, j) => j !== optionIndex);
                return { ...mcq, options: newOptions };
            }
            return mcq;
        });
        handleFieldChange('mcqs', newMcqs);
    };

    return (
        <div className="space-y-4">
            <input type="text" value={question.title} onChange={(e) => handleFieldChange('title', e.target.value)} placeholder="Overall Title" className="w-full p-2 border border-gray-300 rounded-md" />
            <div>
                <label className="font-semibold text-gray-700 mb-1 block">Passage</label>
                <textarea value={question.comprehensionPassage} onChange={(e) => handleFieldChange('comprehensionPassage', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" rows="6"></textarea>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                <h4 className="font-semibold text-gray-700">Multiple Choice Questions</h4>
                {question.mcqs.map((mcq, mcqIndex) => (
                    <div key={mcqIndex} className="p-4 border rounded-md bg-white">
                        <input type="text" value={mcq.questionText} onChange={(e) => handleMcqChange(mcqIndex, 'questionText', e.target.value)} placeholder={`MCQ ${mcqIndex + 1}`} className="w-full p-2 border border-gray-300 rounded-md mb-3" />
                        <div className="space-y-2">
                            {mcq.options.map((opt, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                    <input type="radio" name={`correct-answer-${mcqIndex}`} checked={mcq.correctAnswer === opt} onChange={() => handleMcqChange(mcqIndex, 'correctAnswer', opt)} className="h-4 w-4 text-indigo-600"/>
                                    <input type="text" value={opt} onChange={(e) => handleOptionChange(mcqIndex, optIndex, e.target.value)} placeholder={`Option ${optIndex + 1}`} className="w-full p-1.5 border border-gray-200 rounded-md text-sm" />
                                    <button onClick={() => removeOption(mcqIndex, optIndex)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => addOption(mcqIndex)} className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"><Plus size={14} className="inline"/> Add Option</button>
                    </div>
                ))}
                <button onClick={addMcq} className="text-sm font-semibold text-indigo-600 hover:underline"><Plus size={16} className="inline"/> Add Another MCQ</button>
            </div>
        </div>
    );
};
export default ComprehensionEditor;