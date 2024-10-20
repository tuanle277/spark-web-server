import React, { useState } from 'react';

function SyllabusUploader({ onSyllabusUpload }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Upload file to backend and get extracted text
            const response = await fetch('http://localhost:8000/extract-pdf-text', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            console.log('Extracted text:', result.text);

            // Pass the extracted text to the parent component
            onSyllabusUpload(result.text);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <h3>Upload Syllabus</h3>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and Extract Schedule</button>
        </div>
    );
}

export default SyllabusUploader;
