import React from "react";

export default function LayersOptions({ layers, deleteLayer, selectLayer, selectedLayerId }) {
  const handleLayerClick = (e, layerId) => {
    // Only select the layer if the delete button is not clicked
    if (e.target.closest(".handle.close")) return;
    selectLayer(layerId); // Call the selectLayer function to highlight the layer
  };

  return (
    <div className="layers-container">
      <h3 className="layers-title">Layers</h3>
      <ul className="layers-list">
        {layers.map((layer) => (
          <li
            key={layer.id}
            className={`layer-item ${layer.id === selectedLayerId ? "selected" : ""}`} // Apply "selected" class if it's the selected layer
            onClick={(e) => handleLayerClick(e, layer.id)} // Select layer on click
          >
            <div className="layer-icon">
              {layer.type === "text" ? (
                <span style={{ marginRight: "10px", fontSize: "20px", fontWeight: "bold", color: "#555" }}>T</span>
              ) : (
                <img
                  src={layer.src} // For clipart, display the image source URL
                  alt="Clipart"
                />
              )}
              <span>{layer.type === "text" ? layer.content : "Image"}</span>
            </div>
            <div className="layer-actions">
              <button
                className="layer-delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from propagating to the list item
                  deleteLayer(layer.id); // Use deleteLayer from props
                }}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
