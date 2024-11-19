import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Dashboard({ userRole, userId }) {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = userRole === 'mentor' 
        ? `/mentor/dashboard/${userId}`
        : '/coordinator/dashboard';
      
      const response = await axios.get(`http://localhost:3000${endpoint}`);
      setInterns(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [userRole, userId]); // Added dependencies for useCallback

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Only fetchData is needed as a dependency

  function handleViewDetails(internId) {
    history.push(`/intern-details/${internId}`);
  }

  const handleVerify = async (internId) => {
    try {
      await axios.put(`http://localhost:3000/interns/${internId}/verify`);
      // Refresh the interns list after verification
      await fetchData(); // Await the fetchData call
    } catch (err) {
      console.error('Error verifying intern:', err);
      setError('Failed to verify intern');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {userRole === 'mentor' ? 'Mentor Dashboard' : 'Coordinator Dashboard'}
      </h2>
      
      {interns.length === 0 ? (
        <p>No interns found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interns.map((intern) => (
            <div key={intern.id} className="border p-4 rounded shadow hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg">{intern.company_name}</h3>
              <div className="mt-2 space-y-1">
                <p>Start Date: {new Date(intern.start_date).toLocaleDateString()}</p>
                <p>Status: 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    intern.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {intern.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </p>
                <p>City: {intern.city}</p>
                <p>External Mentor: {intern.external_mentor_name}</p>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleViewDetails(intern.id)}
                >
                  View Details
                </button>
                {userRole === 'coordinator' && !intern.is_verified && (
                  <button 
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleVerify(intern.id)}
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;