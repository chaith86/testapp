import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CreateBucketForm from './CreateBucketForm'; // Import the CreateBucketForm component

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [imageList, setImageList] = useState([]); // To hold the list of uploaded images

  // Fetch images on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/images');
        setImageList(response.data); // Update state with the image URLs from the backend
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

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
      setImageUrl(fileUrl);
      setImageList((prevList) => [...prevList, fileUrl]); // Add new image URL to the list
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

      {imageUrl && (
        <div className="uploaded-image">
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" className="uploaded-img" />
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">View Image</a>
        </div>
      )}

      {/* Gallery of uploaded images */}
      <div className="gallery">
        <h3>Uploaded Images</h3>
        <div className="image-grid">
          {imageList.map((imgUrl, index) => (
            <div className="image-item" key={index}>
              <img src={imgUrl} alt={`Uploaded ${index}`} className="gallery-img" />
              <a href={imgUrl} target="_blank" rel="noopener noreferrer">View Image</a>
            </div>
          ))}
        </div>
      </div>

      {/* Add the CreateBucketForm component */}
      <CreateBucketForm /> {/* Display the form for creating the bucket */}
    </div>
  );
}

export default App;
