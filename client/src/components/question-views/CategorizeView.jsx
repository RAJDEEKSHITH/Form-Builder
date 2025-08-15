// client/src/components/views/CategorizeView.jsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';

const CategorizeView = ({ question, onAnswerChange }) => {
    const initialItems = (question.items || []).map(item => ({ id: item.name, content: item.name }));

    const [state, setState] = useState({
        items: initialItems,
        categories: (question.categories || []).reduce((acc, cat) => ({ ...acc, [cat]: [] }), {}),
        source: initialItems,
    });

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceId = source.droppableId;
        const destId = destination.droppableId;

        const newState = { ...state };
        const sourceList = sourceId === 'source' ? [...newState.source] : [...newState.categories[sourceId]];
        const [movedItem] = sourceList.splice(source.index, 1);

        if (sourceId === destId) {
            sourceList.splice(destination.index, 0, movedItem);
            if (sourceId === 'source') newState.source = sourceList;
            else newState.categories[sourceId] = sourceList;
        } else {
            const destList = destId === 'source' ? [...newState.source] : [...newState.categories[destId]];
            destList.splice(destination.index, 0, movedItem);
            if (sourceId === 'source') newState.source = sourceList;
            else newState.categories[sourceId] = sourceList;
            if (destId === 'source') newState.source = destList;
            else newState.categories[destId] = destList;
        }
        
        setState(newState);
        onAnswerChange(newState.categories);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="p-6 my-4 bg-slate-50 rounded-xl shadow-inner border">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{question.title}</h3>
                <div className="flex gap-4 flex-col md:flex-row">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(question.categories || []).map(categoryName => (
                            <Droppable key={categoryName} droppableId={categoryName}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className={`p-4 rounded-lg min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-100' : 'bg-white border'}`}>
                                        <h4 className="font-semibold text-center mb-4">{categoryName}</h4>
                                        {(state.categories[categoryName] || []).map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 mb-2 bg-slate-200 rounded shadow text-center">
                                                        {item.content}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                    <Droppable droppableId="source">
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className={`p-4 rounded-lg w-full md:w-64 transition-colors ${snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-slate-200'}`}>
                                <h4 className="font-semibold text-center mb-4">Items</h4>
                                {state.source.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-3 mb-2 bg-white rounded shadow flex items-center justify-between">
                                                <span>{item.content}</span>
                                                <GripVertical className="text-gray-400"/>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
        </DragDropContext>
    );
};
export default CategorizeView;