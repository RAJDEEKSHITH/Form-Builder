import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SubmissionSuccess = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-2xl text-center">
                <CheckCircle className="text-green-500 w-20 h-20 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Success!</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Your response has been submitted successfully.
                </p>
                <Link to="/editor" className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all">
                    Create a New Form
                </Link>
            </div>
        </div>
    );
};
export default SubmissionSuccess;