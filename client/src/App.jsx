// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FormEditor from './pages/FormEditor';
import FormFill from './pages/FormFill';
import SubmissionSuccess from './pages/SubmissionSuccess';
import ViewFormResponses from './pages/ViewFormResponses';
import NotFound from './components/NotFound';

// Set the base URL for Axios requests
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Fallback for development

function App() {
    return (
        <Router>
            <div className="bg-slate-100 min-h-screen font-sans">
                <Routes>
                    <Route path="/" element={<Navigate to="/editor" />} />
                    <Route path="/editor" element={<FormEditor />} />
                    <Route path="/form/:formId" element={<FormFill />} />
                    <Route path="/form/:formId/responses" element={<ViewFormResponses />} />
                    <Route path="/success" element={<SubmissionSuccess />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;