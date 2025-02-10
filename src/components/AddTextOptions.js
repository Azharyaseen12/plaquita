import React, { useState, useEffect } from "react";
import "./AddTextOptions.css"; // Import CSS file

const AddTextOptions = ({
  updateTextStyle,
  addText,
  addTemplate,
  selectedLayerType,
  selectedLayerId,
  selectedLayerText,
  selectedLayerPosition, // Ensure this is received
  updateLayerText,
  updateLayerPosition,
}) => {
  const isImageSelected = selectedLayerType === "clipart";
  const [textInput, setTextInput] = useState("");
  // Position update function
  const handleMove = (direction) => {
    if (!selectedLayerPosition) return; // Prevent errors if position is undefined
    const { top, left } = selectedLayerPosition;

    const newPosition = {
      top:
        direction === "up"
          ? `${parseInt(top) - 10}px`
          : direction === "down"
          ? `${parseInt(top) + 10}px`
          : top,
      left:
        direction === "left"
          ? `${parseInt(left) - 10}px`
          : direction === "right"
          ? `${parseInt(left) + 10}px`
          : left,
    };

    updateLayerPosition(selectedLayerId, newPosition);
  };
  useEffect(() => {
    setTextInput(selectedLayerText);
  }, [selectedLayerText]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setTextInput(newText);
    updateLayerText(selectedLayerId, newText); // Update text in the main component
  };
  const [fontSize, setFontSize] = useState(16);
  const [outline, setOutline] = useState(0);
  const [outlineColor, setOutlineColor] = useState("#000000");

  // Track Font Style States
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const toggleStyle = (style) => {
    if (style === "fontWeight") {
      setIsBold(!isBold);
      updateTextStyle("fontWeight", isBold ? "normal" : "bold");
    }
    if (style === "fontStyle") {
      setIsItalic(!isItalic);
      updateTextStyle("fontStyle", isItalic ? "normal" : "italic");
    }
    if (style === "textDecoration") {
      setIsUnderline(!isUnderline);
      updateTextStyle("textDecoration", isUnderline ? "none" : "underline");
    }
  };

  return (
    <div className="text-options-container">
      {/* Font Family & Color Selection */}
      <div className="option-group">
        <h2 className="tshirt-titile-option">Unisex Staple T-Shirt</h2>
        {/* Rating Section */}
        <div className="rating-container">
          <span className="rating-value">4.5</span>
          <span className="star">⭐</span>
        </div>
        <label className="text-lable-option">Text</label>
        <textarea
          className="text-area-options"
          value={textInput}
          onChange={handleTextChange}
          disabled={isImageSelected}
          rows={4} // Adjust the number of visible lines
          placeholder="Enter text here..."
        />
      </div>
      <div className="option-row">
        <div className="option-group">
          <label>Font Family</label>
          <select
            className="custom-select"
            onChange={(e) => updateTextStyle("fontFamily", e.target.value)}
            disabled={isImageSelected}
          >
            {[
              "Arial",
              "Verdana",
              "Georgia",
              "Courier New",
              "Times New Roman",
              "Trebuchet MS",
              "Comic Sans MS",
              "Impact",
              "Tahoma",
              "Helvetica",
            ].map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>
        <div className="option-group">
          <label>Color</label>
          <input
            type="color"
            className="color-picker"
            onChange={(e) => updateTextStyle("color", e.target.value)}
            disabled={isImageSelected}
          />
        </div>
      </div>

      {/* Font Size & Font Style */}
      <div className="option-row">
        <div className="option-group">
          <label>Font Size</label>
          <div className="font-size-controls">
            <input
              type="number"
              className="font-size-input"
              value={fontSize}
              min={10}
              max={200}
              onChange={(e) => {
                setFontSize(e.target.value);
                updateTextStyle("fontSize", `${e.target.value}px`);
              }}
              disabled={isImageSelected}
            />
          </div>
        </div>
        <div className="option-group font-style">
          <label>Font Style</label>
          <div className="style-buttons">
            <button
              className={isBold ? "active" : ""}
              onClick={() => toggleStyle("fontWeight")}
              disabled={isImageSelected}
            >
              B
            </button>
            <button
              className={isItalic ? "active" : ""}
              onClick={() => toggleStyle("fontStyle")}
              disabled={isImageSelected}
            >
              I
            </button>
            <button
              className={isUnderline ? "active" : ""}
              onClick={() => toggleStyle("textDecoration")}
              disabled={isImageSelected}
            >
              U
            </button>
          </div>
        </div>
      </div>

      {/* Position Controls */}
      {/* Position Controls */}
      <div className="option-group position-controls">
        <label>Position</label>
        <div className="position-buttons">
          <button onClick={() => handleMove("up")}>
            ↑
          </button>
          <button onClick={() => handleMove("left")}>
            ←
          </button>
          <button
            onClick={() => handleMove("right")}
          >
            →
          </button>
          <button onClick={() => handleMove("down")}>
            ↓
          </button>
        </div>
      </div>

      {/* Outline Controls */}
      <div className="option-row">
        <div className="option-group">
          <label>Outline</label>
          <input
            type="range"
            className="outline-slider"
            min="0"
            max="100"
            value={outline}
            onChange={(e) => {
              setOutline(e.target.value);
              updateTextStyle("WebkitTextStrokeWidth", `${e.target.value}px`);
            }}
            disabled={isImageSelected}
          />
        </div>
        <div className="outline-value">
          <input
            type="number"
            value={outline}
            min="0"
            max="100"
            onChange={(e) => {
              setOutline(e.target.value);
              updateTextStyle("WebkitTextStrokeWidth", `${e.target.value}px`);
            }}
            disabled={isImageSelected}
          />
        </div>
        <div className="option-group">
          <label>Outline Color</label>
          <input
            type="color"
            className="color-picker"
            value={outlineColor}
            onChange={(e) => {
              setOutlineColor(e.target.value);
              updateTextStyle("WebkitTextStrokeColor", e.target.value);
            }}
            disabled={isImageSelected}
          />
        </div>
      </div>

      {/* Display Predefined Templates */}
      <h5 className="section-title">Text Presets</h5>
      <div className="predefined-templates">
        {[
          {
            text: "Hello",
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
            color: "#000",
          },
          {
            text: "Hello",
            fontWeight: "bold",
            fontStyle: "normal",
            textDecoration: "none",
            color: "#000",
          },
          {
            text: "Hello",
            fontWeight: "bold",
            fontStyle: "normal",
            textDecoration: "none",
            color: "red",
          },
          {
            text: "Hello",
            fontWeight: "italic",
            fontStyle: "italic",
            textDecoration: "none",
            color: "#000",
          },
          {
            text: "HELLO",
            fontWeight: "bold",
            fontStyle: "italic",
            textDecoration: "underline",
            color: "#007bff",
            textTransform: "uppercase",
          },
          {
            text: "Hello",
            fontWeight: "bold",
            fontStyle: "normal",
            textDecoration: "underline",
            color: "#ff6600",
            letterSpacing: "2px",
          },
          {
            text: "Hello",
            fontWeight: "bold",
            fontStyle: "normal",
            textDecoration: "none",
            color: "#333",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          },
          {
            text: "Hello",
            fontWeight: "normal",
            fontStyle: "italic",
            textDecoration: "none",
            color: "#555",
            fontFamily: "Courier New",
          },
        ].map((template, index) => (
          <div
            key={index}
            className="template"
            onClick={() =>
              addTemplate(
                template.text,
                template.fontFamily || "Arial",
                "16px",
                template.fontStyle,
                template.fontWeight,
                template.color
              )
            }
          >
            <p
              style={{
                fontFamily: template.fontFamily || "Arial",
                fontSize: "16px",
                color: template.color,
                fontWeight: template.fontWeight,
                fontStyle: template.fontStyle,
                textDecoration: template.textDecoration,
                textTransform: template.textTransform,
                letterSpacing: template.letterSpacing,
                textShadow: template.textShadow,
              }}
            >
              {template.text}
            </p>
          </div>
        ))}
      </div>

      {/* Add Text Button */}
      <button className="add-text-btn" onClick={addText}>
        Add Text
      </button>
    </div>
  );
};

export default AddTextOptions;
