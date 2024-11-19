import React, { useState } from 'react';
import axios from 'axios';

function InternForm() {
  const [formData, setFormData] = useState({
    company_name: '',
    company_address: '',
    company_reg_number: '',
    external_mentor_name: '',
    external_mentor_contact: '',
    external_mentor_email: '',
    city: '',
    stipend: '',
    start_date: '',
    offer_letter_url: ''
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/interns/', formData);
      alert('Internship details submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Submit Internship Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Company Name</label>
          <input
            type="text"
            name="company_name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          </div>
        {/* Add similar input fields for other form data */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default InternForm;