// client/src/components/editors/CategorizeEditor.jsx
import { Plus, Trash2 } from 'lucide-react';

const InputField = ({ value, onChange, placeholder }) => (
    <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
);

const CategorizeEditor = ({ question, updateQuestion }) => {
    const handleFieldChange = (field, value) => {
        updateQuestion(question.id, { ...question, [field]: value });
    };

    const handleCategoryChange = (index, value) => {
        const newCategories = question.categories.map((cat, i) => i === index ? value : cat);
        handleFieldChange('categories', newCategories);
    };

    const addCategory = () => {
        handleFieldChange('categories', [...question.categories, '']);
    };
    
    const removeCategory = (index) => {
        const newCategories = question.categories.filter((_, i) => i !== index);
        handleFieldChange('categories', newCategories);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = question.items.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
        );
        handleFieldChange('items', newItems);
    };

    const addItem = () => {
        handleFieldChange('items', [...question.items, { name: '', category: '' }]);
    };

    const removeItem = (index) => {
        const newItems = question.items.filter((_, i) => i !== index);
        handleFieldChange('items', newItems);
    };

    return (
        <div className="space-y-4">
            <InputField value={question.title} onChange={(e) => handleFieldChange('title', e.target.value)} placeholder="Question Title" />
            <div className="flex gap-6">
                <div className="w-1/2 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-2 text-gray-700">Categories</h4>
                    {question.categories.map((cat, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <InputField value={cat} onChange={(e) => handleCategoryChange(index, e.target.value)} placeholder={`Category ${index + 1}`} />
                            <button onClick={() => removeCategory(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                        </div>
                    ))}
                    <button onClick={addCategory} className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1"><Plus size={16} /> Add Category</button>
                </div>
                <div className="w-1/2 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-2 text-gray-700">Items & Correct Answers</h4>
                    {question.items.map((item, index) => (
                         <div key={index} className="flex items-center gap-2 mb-2">
                            <InputField value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} placeholder={`Item ${index + 1}`} />
                            <select value={item.category} onChange={(e) => handleItemChange(index, 'category', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                                <option value="">Assign Category</option>
                                {question.categories.map(cat => cat && <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                        </div>
                    ))}
                    <button onClick={addItem} className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1"><Plus size={16} /> Add Item</button>
                </div>
            </div>
        </div>
    );
};
export default CategorizeEditor;