import React, { useState } from 'react';
import axios from 'axios';

function ReportSubmission() {
  const [report, setReport] = useState({
    type: 'fortnightly',
    content: ''
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/reports/', report);
      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report');
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Submit Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Report Type</label>
          <select
            onChange={(e) => setReport({ ...report, type: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="fortnightly">Fortnightly Report</option>
            <option value="assignment">Assignment</option>
            <option value="evaluation">Evaluation</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Content</label>
          <textarea
            onChange={(e) => setReport({ ...report, content: e.target.value })}
            className="w-full p-2 border rounded"
            rows="6"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}

export default ReportSubmission;