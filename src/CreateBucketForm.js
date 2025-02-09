// CreateBucketForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './CreateBucketForm.css';

const CreateBucketForm = () => {
  const [bucketName, setBucketName] = useState('');
  const [location, setLocation] = useState('US');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/create-bucket', {
        bucketName,
        location,
      });

      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setMessage('');
      setError(`Error: ${err.response.data.error}`);
    }
  };

  return (
    <div>
      <h2>Create Google Cloud Storage Bucket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Bucket Name:</label>
          <input
            type="text"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Bucket</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateBucketForm;
