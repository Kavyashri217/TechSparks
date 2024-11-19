import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

function InternDetails() {
  const { internId } = useParams();
  const history = useHistory();
  const [intern, setIntern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInternDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/interns/${internId}`);
        setIntern(response.data);
      } catch (err) {
        console.error('Error fetching intern details:', err);
        setError('Failed to fetch intern details');
      } finally {
        setLoading(false);
      }
    };

    fetchInternDetails();
  }, [internId]);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!intern) return <div className="container mx-auto p-4">Intern not found</div>;

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => history.goBack()}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back to Dashboard
      </button>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{intern.company_name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-lg mb-2">Company Information</h3>
            <p><strong>Address:</strong> {intern.company_address}</p>
            <p><strong>Registration Number:</strong> {intern.company_reg_number}</p>
            <p><strong>City:</strong> {intern.city}</p>
            <p><strong>Start Date:</strong> {new Date(intern.start_date).toLocaleDateString()}</p>
            <p><strong>Stipend:</strong> {intern.stipend}</p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">External Mentor Details</h3>
            <p><strong>Name:</strong> {intern.external_mentor_name}</p>
            <p><strong>Email:</strong> {intern.external_mentor_email}</p>
            <p><strong>Contact:</strong> {intern.external_mentor_contact}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-lg mb-2">Status</h3>
          <p className={`inline-block px-3 py-1 rounded ${
            intern.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {intern.is_verified ? 'Verified' : 'Pending Verification'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default InternDetails;