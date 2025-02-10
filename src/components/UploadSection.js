import React, { useState } from "react";
import "./UploadSection.css"; // Ensure this file is imported
import galleryImage from "../images/gallery.png";

function UploadSection({ addClipartToCanvas }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addClipartToCanvas(event.target.result);
      };
      reader.readAsDataURL(file);
    }
    setIsPopupOpen(false); // Close popup after upload
  };

  // Handle File Input Change
  const handleInputChange = (e) => {
    handleFileUpload(e.target.files[0]);
    e.target.value = null; // Reset input value
  };

  // Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0]; // Get the dropped file
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div>
      {/* Open Popup Button */}
      <button className="btn btn-primary" onClick={() => setIsPopupOpen(true)}>
        Upload Image
      </button>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="upload-popup-overlay">
          <div
            className={`upload-popup ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <button className="close-btn" onClick={() => setIsPopupOpen(false)}>×</button>
            
            {/* Prevent the gallery image from being dragged */}
            <img 
              src={galleryImage} 
              alt="Upload Icon" 
              className="upload-icon" 
              draggable="false" // Disables drag
              onDragStart={(e) => e.preventDefault()} // Prevents drag behavior
            />
            
            <h3>Drag your files here</h3>
            <p>Submit files in <b>PNG</b> or <b>JPEG</b> format.</p>

            <input
              type="file"
              id="uploadImageInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleInputChange}
            />

            <button
              className="upload-btn"
              onClick={() => document.getElementById("uploadImageInput").click()}
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadSection;
