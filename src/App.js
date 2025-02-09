import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import CreateBucketForm from './CreateBucketForm'; // Import the CreateBucketForm component

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState(''); // Preview of the image before upload

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus('Please select a file to upload.');
      return;
    }

    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { fileUrl } = response.data;

      setStatus('Upload successful!');
    } catch (error) {
      setStatus('Upload failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Upload Photo to S3</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" required />
        <button type="submit">Upload</button>
      </form>

      {preview && (
        <div className="preview-container">
          <h3>Image Preview:</h3>
          <img src={preview} alt="Preview" className="preview-img" />
        </div>
      )}

      <div className="status">{status}</div>

      {/* Removed the image gallery and uploaded image display */}
      {/* <div className="gallery">
        <h3>Uploaded Images</h3>
        <div className="image-grid">
          {imageList.map((imgUrl, index) => (
            <div className="image-item" key={index}>
              <img src={imgUrl} alt={`Uploaded ${index}`} className="gallery-img" />
              <a href={imgUrl} target="_blank" rel="noopener noreferrer">View Image</a>
            </div>
          ))}
        </div>
      </div> */}

      {/* Add the CreateBucketForm component */}
      <CreateBucketForm /> {/* Display the form for creating the bucket */}
    </div>
  );
}

export default App;
