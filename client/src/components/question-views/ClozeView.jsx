import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Helper function to shuffle the array
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const ClozeView = ({ question, onAnswerChange }) => {
    const blanks = useMemo(() => (question.passage || '').split('__'), [question.passage]);
    
    const initialOptions = useMemo(() => {
        const options = (question.options || []).map((opt, index) => ({
            id: `option-${opt}-${index}`, // Ensure unique ID
            content: opt
        }));
        return shuffleArray(options);
    }, [question.options]);

    const [state, setState] = useState({
        options: initialOptions,
        blanks: Array(blanks.length - 1).fill(null)
    });

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const newState = {
            options: [...state.options],
            blanks: [...state.blanks]
        };

        const sourceId = source.droppableId;
        const destId = destination.droppableId;
        
        // Item is from the options bank
        if (sourceId === 'options') {
            const [movedItem] = newState.options.splice(source.index, 1);
            // and is dropped on a blank
            if (destId.startsWith('blank-')) {
                const destIndex = parseInt(destId.split('-')[1]);
                // if the blank was already filled, return the old item to the options bank
                if (newState.blanks[destIndex]) {
                    newState.options.splice(source.index, 0, newState.blanks[destIndex]);
                }
                newState.blanks[destIndex] = movedItem;
            } else { // if dropped outside a valid blank, return it
                 newState.options.splice(source.index, 0, movedItem);
            }
        } 
        // Item is from a blank
        else if (sourceId.startsWith('blank-')) {
            const sourceIndex = parseInt(sourceId.split('-')[1]);
            const movedItem = newState.blanks[sourceIndex];
            
            if (!movedItem) return;

            // and is dropped on the options bank
            if (destId === 'options') {
                newState.blanks[sourceIndex] = null;
                newState.options.splice(destination.index, 0, movedItem);
            }
            // and is dropped on another blank (swap)
            else if (destId.startsWith('blank-')) {
                const destIndex = parseInt(destId.split('-')[1]);
                // Swap items between the two blanks
                newState.blanks[sourceIndex] = newState.blanks[destIndex];
                newState.blanks[destIndex] = movedItem;
            }
        }

        setState(newState);
        onAnswerChange(newState.blanks.map(b => b ? b.content : null));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="p-6 my-4 bg-slate-50 rounded-xl shadow-inner border">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{question.title}</h3>
                <div className="text-lg leading-loose p-4 bg-white rounded-lg border mb-6">
                    {blanks.map((part, index) => (
                        <span key={index}>
                            {part}
                            {index < blanks.length - 1 && (
                                <Droppable droppableId={`blank-${index}`} direction="horizontal">
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps} className={`inline-block mx-2 px-2 py-1 rounded-md min-w-[120px] h-10 text-center transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-100' : 'bg-slate-200'}`}>
                                            {state.blanks[index] ? (
                                                <Draggable draggableId={state.blanks[index].id} index={0}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-indigo-500 text-white font-semibold rounded-md shadow px-3 py-1">
                                                            {state.blanks[index].content}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ) : <span className="text-gray-400 text-sm">Drop here</span>}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            )}
                        </span>
                    ))}
                </div>
                <Droppable droppableId="options" direction="horizontal">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className={`flex flex-wrap gap-3 p-4 rounded-lg min-h-[60px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-slate-200'}`}>
                            {state.options.map((option, index) => (
                                <Draggable key={option.id} draggableId={option.id} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white font-semibold rounded-md shadow px-4 py-2 cursor-pointer">
                                            {option.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};
export default ClozeView;