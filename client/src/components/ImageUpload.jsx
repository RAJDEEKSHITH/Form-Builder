// client/src/components/ImageUpload.jsx

import React from 'react';

const ImageUpload = ({ onImageUpload, currentImage }) => {
    const handleUploadClick = () => {
        // In a real app, this would open a file dialog and handle the upload process.
        // For this assignment, we'll use a placeholder image.
        const placeholderImageUrl = 'https://via.placeholder.com/800x200.png?text=Header+Image';
        onImageUpload(placeholderImageUrl);
    };

    return (
        <div className="mt-2">
            <button
                type="button"
                onClick={handleUploadClick}
                className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
                {currentImage ? 'Change Image' : 'Add Image'}
            </button>
            {currentImage && <img src={currentImage} alt="Upload preview" className="mt-4 rounded-md max-h-40" />}
        </div>
    );
};

export default ImageUpload;