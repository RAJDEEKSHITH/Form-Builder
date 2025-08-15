// client/src/pages/FormEditor.jsx
import { useState, useCallback } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, GripVertical, Trash2, FileText, CheckSquare, ListTodo } from 'lucide-react';

import CategorizeEditor from '../components/question-editors/CategorizeEditor';
import ClozeEditor from '../components/question-editors/ClozeEditor';
import ComprehensionEditor from '../components/question-editors/ComprehensionEditor';

const QuestionTypeButton = ({ type, icon, label, onClick }) => (
    <button
        onClick={() => onClick(type)}
        className="flex flex-col items-center justify-center p-4 w-full h-24 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-all duration-200"
    >
        {icon}
        <span className="mt-2 text-sm font-semibold">{label}</span>
    </button>
);

const FormEditor = () => {
    const [formTitle, setFormTitle] = useState('Enter You Form Title');
    const [questions, setQuestions] = useState([]);
    const [savedForm, setSavedForm] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const addQuestion = useCallback((type) => {
        const newQuestion = {
            id: `question-${Date.now()}`,
            type,
            title: `New ${type} Question`,
            ...(type === 'Categorize' && { categories: ['Category 1', 'Category 2'], items: [{ name: 'Item 1', category: 'Category 1' }, { name: 'Item 2', category: 'Category 2' }] }),
            ...(type === 'Cloze' && { passage: 'The quick brown fox __ over the lazy __.', options: ['jumps', 'dog'] }),
            ...(type === 'Comprehension' && { comprehensionPassage: 'Read the passage and answer.', mcqs: [{ questionText: 'What is the main idea?', options: ['Option A', 'Option B'], correctAnswer: 'Option A' }] }),
        };
        setQuestions(prev => [...prev, newQuestion]);
    }, []);

    const updateQuestion = useCallback((id, updatedData) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updatedData } : q));
    }, []);

    const removeQuestion = useCallback((id) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    }, []);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(questions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setQuestions(items);
    };

    const saveForm = async () => {
        setIsSaving(true);
        try {
            const questionsToSave = questions.map(({ id, ...rest }) => rest);
            const response = await axios.post('/api/forms', { title: formTitle, questions: questionsToSave });
            setSavedForm({
                id: response.data._id,
                fillLink: `${window.location.origin}/form/${response.data._id}`,
                responsesLink: `${window.location.origin}/form/${response.data._id}/responses`
            });
            alert('Form saved successfully!');
        } catch (error) {
            console.error('Error saving form:', error.response ? error.response.data : error.message);
            alert(`Failed to save form. Please check the console for details.`);
        } finally {
            setIsSaving(false);
        }
    };

    const renderQuestionEditor = (question, index) => {
        const props = { question, updateQuestion };
        const editorComponent = {
            'Categorize': <CategorizeEditor {...props} />,
            'Cloze': <ClozeEditor {...props} />,
            'Comprehension': <ComprehensionEditor {...props} />,
        }[question.type];

        return (
            <Draggable key={question.id} draggableId={question.id} index={index}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 mr-3"><GripVertical /></div>
                                    <span className="font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full text-sm">{question.type}</span>
                                </div>
                                <button onClick={() => removeQuestion(question.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                            </div>
                            {editorComponent}
                        </div>
                    </div>
                )}
            </Draggable>
        );
    };

    return (
        <div className="flex h-screen">
            <aside className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">Form Builder</h1>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Questions</h2>
                <div className="space-y-4">
                    <QuestionTypeButton type="Categorize" icon={<ListTodo size={24} />} label="Categorize" onClick={addQuestion} />
                    <QuestionTypeButton type="Cloze" icon={<CheckSquare size={24} />} label="Cloze (Fill in)" onClick={addQuestion} />
                    <QuestionTypeButton type="Comprehension" icon={<FileText size={24} />} label="Comprehension" onClick={addQuestion} />
                </div>
                <div className="mt-auto">
                    <button onClick={saveForm} disabled={isSaving || questions.length === 0} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-all">
                        {isSaving ? 'Saving...' : 'Save Form'}
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
                        <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Form Title" className="text-3xl font-bold w-full border-none focus:ring-0 p-2 -ml-2" />
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="questions">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {questions.map((q, i) => renderQuestionEditor(q, i))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    {questions.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-500">Your form is empty!</h2>
                            <p className="text-gray-400 mt-2">Add questions from the sidebar to get started.</p>
                        </div>
                    )}
                    {savedForm && (
                        <div className="mt-8 p-6 bg-green-100 border border-green-400 text-green-800 rounded-lg text-center shadow-lg">
                            <h3 className="font-bold text-lg mb-2">Form Saved!</h3>
                            <div className="space-y-2">
                                <p><strong>Fill Link:</strong> <a href={savedForm.fillLink} target="_blank" rel="noopener noreferrer" className="font-mono text-blue-600 hover:underline break-all">{savedForm.fillLink}</a></p>
                                <p><strong>Responses Link:</strong> <a href={savedForm.responsesLink} target="_blank" rel="noopener noreferrer" className="font-mono text-blue-600 hover:underline break-all">{savedForm.responsesLink}</a></p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
export default FormEditor;