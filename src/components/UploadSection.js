import React from "react";

function UploadSection({ addClipartToCanvas }) {
  return (
    <div>
      <h3>Upload Image</h3>
      <p>Upload your custom image to add it to the canvas:</p>
      <input
        type="file"
        id="uploadImageInput"
        style={{ display: "none" }}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              // Call addClipartToCanvas with the uploaded image
              addClipartToCanvas(event.target.result);
            };
            reader.readAsDataURL(file); // Read the uploaded image as a data URL
          }
          // Reset input value to allow re-uploading the same file
          e.target.value = null;
        }}
      />
      <button
        className="btn btn-primary"
        onClick={() => document.getElementById("uploadImageInput").click()}
      >
        Upload Image
      </button>
    </div>
  );
}

export default UploadSection;
