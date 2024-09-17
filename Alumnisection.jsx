import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './mainpage.css';

function Alumnisection() {
    const navigate = useNavigate();

    const registration = () => {
        navigate('/Signup');
    };

    const signin = () => {
        navigate('/Signin');
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/search?query=${searchQuery}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching alumni:', error);
        }
    };

    return (
        <div className="alumni-section">
            <nav className="alumni-nav flex justify-end space-x-4 py-4 px-6">
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={registration}
                >
                    Create your profile now
                </button>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={signin}
                >
                    Sign IN!
                </button>
            </nav>

            <div className="alumni-search text-center py-8">
                <h2 className="text-2xl font-bold mb-4">Search Alumni</h2>
                <form onSubmit={handleSearchSubmit} className="flex justify-center space-x-2">
                    <input
                        type="text"
                        placeholder="Search by name or company"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border-2 border-blue-300 rounded-lg px-4 py-2 w-1/2"
                    />
                    <button 
                        type="submit" 
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Search
                    </button>
                </form>
            </div>

            <div className="alumni-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-8">
                {searchResults.length > 0 ? (
                    searchResults.map((alumni, index) => (
                        <div key={index} className="alumni-card bg-white rounded-lg shadow-lg p-6 text-center">
                            <img 
                                src={`http://localhost:5000/uploads/${alumni.profilephoto}`} 
                                alt="Profile" 
                                className="alumni-photo w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500" 
                            />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{alumni.name}</h3>
                            <div className="text-left space-y-2">
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-700">Email:</span> {alumni.email}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-700">Degree:</span> {alumni.degree}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-700">Year of Passout:</span> {alumni.yearofpassout}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-700">Currently Working In:</span> {alumni.currentlyworkingin}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-700">Experienced Companies:</span> {alumni.experiencedCompanies}
                                </p>
                                <p className="text-sm text-blue-500">
                                    <span className="font-semibold text-gray-700">GitHub:</span> 
                                    <a href={alumni.github} target="_blank" rel="noopener noreferrer" className="hover:underline"> {alumni.github}</a>
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-700">Message:</span> {alumni.message}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="alumni-top-cards">
                        <h2 className="text-2xl font-bold text-center mb-6">Our Top Alumni</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="alumni-card bg-white rounded-lg shadow-lg p-6 text-center">
                                <img src="/path/to/profile-photo.jpg" alt="Profile" className="alumni-photo w-24 h-24 rounded-full mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Alumni Name</h3>
                                <p className="text-gray-700">Company: XYZ Ltd.</p>
                            </div>
                            <div className="alumni-card bg-white rounded-lg shadow-lg p-6 text-center">
                                <img src="/path/to/profile-photo.jpg" alt="Profile" className="alumni-photo w-24 h-24 rounded-full mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Alumni Name</h3>
                                <p className="text-gray-700">Company: ABC Corp.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Alumnisection;
