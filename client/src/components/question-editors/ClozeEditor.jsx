import React, { useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const ClozeEditor = ({ question, updateQuestion }) => {
    const blankCount = useMemo(() => (question.passage.match(/__/g) || []).length, [question.passage]);

    const handleFieldChange = (field, value) => {
        updateQuestion(question.id, { ...question, [field]: value });
    };
    
    const handleOptionChange = (index, value) => {
        const newOptions = [...(question.options || [])];
        // Ensure the array is long enough
        while (newOptions.length <= index) {
            newOptions.push('');
        }
        newOptions[index] = value;
        handleFieldChange('options', newOptions);
    };

    return (
        <div className="space-y-4">
            <input type="text" value={question.title} onChange={(e) => handleFieldChange('title', e.target.value)} placeholder="Question Title" className="w-full p-2 border border-gray-300 rounded-md" />
            <div>
                <label className="font-semibold text-gray-700 mb-1 block">Passage</label>
                <textarea value={question.passage} onChange={(e) => handleFieldChange('passage', e.target.value)} placeholder="Use __ (two underscores) for each blank." className="w-full p-2 border border-gray-300 rounded-md" rows="3"></textarea>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2 text-gray-700">Correct Answers for Blanks (in order)</h4>
                {Array.from({ length: blankCount }).map((_, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-600">{index + 1}.</span>
                        <input 
                            type="text" 
                            value={question.options[index] || ''} 
                            onChange={(e) => handleOptionChange(index, e.target.value)} 
                            placeholder={`Answer for blank #${index + 1}`} 
                            className="w-full p-2 border border-gray-300 rounded-md" 
                        />
                    </div>
                ))}
                {blankCount === 0 && <p className="text-sm text-gray-500">Add blanks `__` to the passage to define answers.</p>}
            </div>
        </div>
    );
};

export default ClozeEditor;