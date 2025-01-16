import React, { useEffect, useRef, useState } from "react";
import "./styles.css"; // Your custom styles

const TShirtDesigner = () => {
  const canvasRef = useRef(null);
  const dragRegionRef = useRef(null);
  const imageUploaderRef = useRef(null);
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (image) {
      const img = new Image();
      img.src = image;

      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        centerDragRegion();
      };
    }
  }, [image]);

  const centerDragRegion = () => {
    const canvasRect = canvas.getBoundingClientRect();
    dragRegion.style.width = "40%";
    dragRegion.style.height = "50%";
    dragRegion.style.left = `${
      (canvasRect.width - canvasRect.width * 0.4) / 2
    }px`;
    dragRegion.style.top = `${
      (canvasRect.height - canvasRect.height * 0.5) / 1.5
    }px`;
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

const changeColor = (color)=> {
  selectedColor = color; // Save the selected color in the global variable

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const [red, green, blue] = color.match(/\d+/g).map(Number);

  for (let i = 0; i < data.length; i += 4) {
    const lightness = (data[i] + data[i + 1] + data[i + 2]) / 3 / 255;
    if (lightness > 0.2 && data[i + 3] > 0) {
      data[i] = red * lightness;
      data[i + 1] = green * lightness;
      data[i + 2] = blue * lightness;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
const addText = (copyData = null) =>{
  const textBox = document.createElement("div");
  textBox.classList.add("text-area");
  console.log(copyData?.style);

  // If copyData is provided, use its values; otherwise, set defaults
  const textValue = copyData?.value || "Your Text";
  const textTop = copyData?.top || "50px";
  const textLeft = copyData?.left || "50px";
  const textStyle =
    copyData?.style || "font-family: Arial; font-size: 16px; color: black;";

  textBox.innerHTML = `
        <input type="text" id="text" value="${textValue}" style="${textStyle}" />
        <div class="handle close" onclick="removeText(this)">X</div>
        <div class="handle resize"><i class="fas fa-expand-arrows-alt"></i></div>
        <div class="handle rotate" onclick="rotateText(this)">↻</div>
        <div class="handle copy" onclick="addText({
          value: this.parentElement.querySelector('input').value,
          top: '${parseInt(textTop) + 20}px',
          left: '${parseInt(textLeft) + 20}px',
          style: this.parentElement.querySelector('input').getAttribute('style')
        })">⧉</div> <!-- Copy Button -->
    `;

  // Position the text box
  textBox.style.position = "absolute";
  textBox.style.top = textTop;
  textBox.style.left = textLeft;

  dragRegion.style.display = "block"; // Ensure dragRegion is visible
  dragRegion.appendChild(textBox);

  // Add event listeners for dragging and resizing
  textBox.addEventListener("mousedown", (e) => handleDragStart(e, textBox));
  textBox
    .querySelector(".handle.resize")
    .addEventListener("mousedown", (e) => handleResizeStart(e, textBox));

  // Add event listener for input click
  textBox.querySelector("input").addEventListener("click", (e) => {
    currentTextBox = textBox;
    textBox.classList.add("selected");
    toolbar.style.display = "flex"; // Show the toolbar when a text box is selected
    dragRegion.style.border = "4px dashed #999";

    // Show handles
    textBox.querySelectorAll(".handle").forEach((handle) => {
      handle.style.display = "block";
    });
    document.querySelectorAll(".text-area").forEach((textarea) => {
      textarea.style.border = "1px dashed #999";
    });

    e.stopPropagation();
  });

  currentTextBox = textBox; // Set the newly added text box as the current text box
}
const addTemplate = (
  text,
  font,
  fontSize,
  fontStyle,
  fontWeight,
  color,
  positionTop = "50px",
  positionLeft = "50px"
) => {
  const textBox = document.createElement("div");
  textBox.classList.add("text-area");
  textBox.innerHTML = `
      <input type="text" value="${text}" style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; font-weight: ${fontWeight}; color: ${color}" />
      <div class="handle close" onclick="removeText(this)">X</div>
      <div class="handle resize"><i class="fas fa-expand-arrows-alt"></i></div>
      <div class="handle rotate" onclick="rotateText(this)">↻</div>
      <div class="handle copy" onclick="addText({
        value: this.parentElement.querySelector('input').value,
        top: '${parseInt(positionTop) + 20}px',
        left: '${parseInt(positionLeft) + 20}px',
        style: this.parentElement.querySelector('input').getAttribute('style')
      })">⧉</div> <!-- Copy Button -->
  `;

  // Position the text box
  textBox.style.position = "absolute";
  textBox.style.top = positionTop;
  textBox.style.left = positionLeft;

  dragRegion.style.display = "block"; // Ensure dragRegion is visible
  dragRegion.appendChild(textBox);

  // Add event listeners for the text box
  textBox.addEventListener("mousedown", (e) => handleDragStart(e, textBox));
  textBox
    .querySelector(".handle.resize")
    .addEventListener("mousedown", (e) => handleResizeStart(e, textBox));
  textBox.querySelector("input").addEventListener("click", (e) => {
    currentTextBox = textBox;
    textBox.classList.add("selected");
    toolbar.style.display = "flex"; // Show the toolbar when a text box is selected
    dragRegion.style.border = "4px dashed #999";

    // Show handles
    textBox.querySelectorAll(".handle").forEach((handle) => {
      handle.style.display = "block";
    });
    document.querySelectorAll(".text-area").forEach((textarea) => {
      textarea.style.border = "1px dashed #999";
    });

    e.stopPropagation();
  });

  currentTextBox = textBox; // Set the newly added text box as the current text box
}
const removeText = (element)=> {
  element.parentElement.remove();

  if (!dragRegion.querySelector(".text-area")) {
    dragRegion.style.display = "none"; // Hide dragRegion if no text boxes remain
    toolbar.style.display = "none"; // Hide toolbar if no text boxes remain
    dragRegion.style.border = "none";
  }
}
const rotateText = (element) =>{
  const textBox = element.parentElement;
  const currentRotation = textBox.style.transform.replace(/[^0-9]/g, "") || 0;
  textBox.style.transform = `rotate(${parseInt(currentRotation) + 15}deg)`;
}
const handleDragStart =(e, textBox)=> {
  currentTextBox = textBox;
  isDragging = true;
  initialX = e.clientX - textBox.offsetLeft;
  initialY = e.clientY - textBox.offsetTop;

  document.addEventListener("mousemove", handleDragging);
  document.addEventListener("mouseup", handleDragEnd);
}
const handleDragging = (e) => {
  if (isDragging && currentTextBox) {
    const newLeft = e.clientX - initialX;
    const newTop = e.clientY - initialY;

    currentTextBox.style.left = `${newLeft}px`;
    currentTextBox.style.top = `${newTop}px`;
  }
}
const handleDragEnd =()=> {
  isDragging = false;
  document.removeEventListener("mousemove", handleDragging);
  document.removeEventListener("mouseup", handleDragEnd);
}
const handleResizeStart = (e, textBox) => {
  isResizing = true;
  startX = e.clientX;
  startY = e.clientY;
  startWidth = textBox.offsetWidth;
  startHeight = textBox.offsetHeight;
  currentTextBox = textBox;

  document.addEventListener("mousemove", handleResizing);
  document.addEventListener("mouseup", handleResizeEnd);
  e.stopPropagation();
}
const handleResizing = (e) => {
  if (isResizing && currentTextBox) {
    const newWidth = startWidth + (e.clientX - startX);
    const newHeight = startHeight + (e.clientY - startY);

    currentTextBox.style.width = `${Math.max(newWidth, 50)}px`;
    currentTextBox.style.height = `${Math.max(newHeight, 30)}px`;
  }
}
const handleResizeEnd = () => {
  isResizing = false;
  document.removeEventListener("mousemove", handleResizing);
  document.removeEventListener("mouseup", handleResizeEnd);
}
// Update font settings for the current text box
fontSelector.addEventListener("change", (e) => {
  if (currentTextBox) {
    currentTextBox.querySelector("input").style.fontFamily = fontSelector.value;
    e.stopPropagation();
  }
});

textColorPicker.addEventListener("input", (e) => {
  if (currentTextBox) {
    currentTextBox.querySelector("input").style.color = textColorPicker.value;
    e.stopPropagation();
  }
});
fontSizeSelector.addEventListener("change", (e) => {
  if (currentTextBox) {
    currentTextBox.querySelector(
      "input"
    ).style.fontSize = `${fontSizeSelector.value}px`;
    e.stopPropagation();
  }
});
// Hide toolbar and handles when clicking outside, excluding the toolbar itself
document.addEventListener("click", (e) => {
  if (dragRegion.contains(e.target)) {
    if (e.target.closest(".text-area")) {
      // If the clicked element is inside a text box or icon box
      const textBox = e.target.closest(".text-area");
      currentTextBox = textBox; // Set the current text box
      toolbar.style.display = "flex"; // Show the toolbar
      dragRegion.style.border = "4px dashed #999"; // Highlight the drag region

      // Show handles and highlight the current text box
      textBox.querySelectorAll(".handle").forEach((handle) => {
        handle.style.display = "block";
      });
      document.querySelectorAll(".text-area").forEach((textarea) => {
        textarea.style.border = "1px dashed #999";
      });
    }
  } else if (!toolbar.contains(e.target)) {
    // If the click is outside the drag region and toolbar
    toolbar.style.display = "none"; // Hide the toolbar
    dragRegion.style.border = "none"; // Remove border
    document.querySelectorAll(".handle").forEach((handle) => {
      handle.style.display = "none"; // Hide handles
    });
    document.querySelectorAll(".text-area").forEach((textarea) => {
      textarea.style.border = "none"; // Remove border
    });
    currentTextBox = null; // Clear the current text box selection
  }
});
const uploadImageToTextBox = (copyData = null) => {
  // Create a new text box with the uploaded image or copy existing one
  const textBox = document.createElement("div");
  textBox.classList.add("text-area");

  const imgSrc = copyData?.imgSrc || "";
  const textTop = copyData?.top || "50px";
  const textLeft = copyData?.left || "50px";

  if (!copyData) {
    // Trigger file input dialog if no copy data provided
    const galleryUploader = document.getElementById("galleryUploader");
    galleryUploader.click();
    galleryUploader.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadImageToTextBox({
            imgSrc: e.target.result,
            top: "50px",
            left: "50px",
          });
        };
        reader.readAsDataURL(file); // Read the selected file as Base64
      }
    };
    return;
  }

  // HTML content for the image text box
  textBox.innerHTML = `
      <div class="image-container" style="width: 100%; height: 100%;">
          <img src="${imgSrc}" style="width: 100%; height: 100%;" />
      </div>
      <div class="handle close" onclick="removeText(this)">X</div>
      <div class="handle resize"><i class="fas fa-expand-arrows-alt"></i></div>
      <div class="handle rotate" onclick="rotateText(this)">↻</div>
      <div class="handle copy" onclick="uploadImageToTextBox({
        imgSrc: '${imgSrc}',
        top: '${parseInt(textTop) + 20}px',
        left: '${parseInt(textLeft) + 20}px'
      })">⧉</div>
    `;

  // Position the text box
  textBox.style.position = "absolute";
  textBox.style.top = textTop;
  textBox.style.left = textLeft;

  dragRegion.style.display = "block"; // Ensure dragRegion is visible
  dragRegion.appendChild(textBox);

  // Add event listeners for dragging and resizing
  textBox.addEventListener("mousedown", (e) => handleDragStart(e, textBox));
  textBox
    .querySelector(".handle.resize")
    .addEventListener("mousedown", (e) => handleResizeStart(e, textBox));

  currentTextBox = textBox; // Set the uploaded image box as the current text box
}
const openIconList = () => {
  document.getElementById("iconModal").style.display = "flex";
}
const closeIconList = () => {
  document.getElementById("iconModal").style.display = "none";
}
const addIconToCanvas = (iconSrc, copyData = null) => {
  const textBox = document.createElement("div");
  textBox.classList.add("text-area");

  const textTop = copyData?.top || "50px";
  const textLeft = copyData?.left || "50px";
  const textWidth = copyData?.width || "100px";
  const textHeight = copyData?.height || "100px";

  textBox.innerHTML = `
    <div class="image-container" style="width: ${textWidth}; height: ${textHeight};">
      <img src="${iconSrc}" style="width: 100%; height: 100%;" />
    </div>
    <div class="handle close" onclick="removeText(this)">X</div>
    <div class="handle resize"><i class="fas fa-expand-arrows-alt"></i></div>
    <div class="handle rotate" onclick="rotateText(this)">↻</div>
    <div class="handle copy" onclick="addIconToCanvas(
      '${iconSrc}', 
      {
        top: '${parseInt(textTop) + 20}px',
        left: '${parseInt(textLeft) + 20}px',
        width: '${textWidth}',
        height: '${textHeight}'
      }
    )">⧉</div> <!-- Copy Button -->
  `;

  textBox.style.position = "absolute";
  textBox.style.top = textTop;
  textBox.style.left = textLeft;

  dragRegion.appendChild(textBox);

  textBox.addEventListener("mousedown", (e) => handleDragStart(e, textBox));
  textBox
    .querySelector(".handle.resize")
    .addEventListener("mousedown", (e) => handleResizeStart(e, textBox));
}
const openClipartModal = () =>{
  document.getElementById("clipartModal").style.display = "flex";
}
const closeClipartModal= () => {
  document.getElementById("clipartModal").style.display = "none";
}
const openTemplateModal= () => {
  document.getElementById("templateModal").style.display = "flex";
}
const closeTemplateModal = () => {
  document.getElementById("templateModal").style.display = "none";
}
const addClipartToCanvas= (clipartSrc) => {
  const textBox = document.createElement("div");
  textBox.classList.add("text-area");

  // Default size and position
  const top = "50px";
  const left = "50px";
  const width = "100px";
  const height = "100px";

  textBox.innerHTML = `
    <div class="image-container" style="width: ${width}; height: ${height};">
      <img src="${clipartSrc}" style="width: 100%; height: 100%;" />
    </div>
    <div class="handle close" onclick="removeText(this)">X</div>
    <div class="handle resize"><i class="fas fa-expand-arrows-alt"></i></div>
    <div class="handle rotate" onclick="rotateText(this)">↻</div>
    <div class="handle copy" onclick="addClipartToCanvas('${clipartSrc}')">⧉</div>
  `;

  // Position the clipart on the canvas
  textBox.style.position = "absolute";
  textBox.style.top = top;
  textBox.style.left = left;

  dragRegion.style.display = "block"; // Ensure dragRegion is visible
  dragRegion.appendChild(textBox);

  // Add event listeners for dragging and resizing
  textBox.addEventListener("mousedown", (e) => handleDragStart(e, textBox));
  textBox
    .querySelector(".handle.resize")
    .addEventListener("mousedown", (e) => handleResizeStart(e, textBox));

  // Close the modal after selecting a clipart
  closeClipartModal();
}
const saveCanvasWithOverlays = () => {
  const canvas = document.getElementById("tshirtCanvas");
  const ctx = canvas.getContext("2d");

  // Clear the canvas and draw the T-shirt base image
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!baseImage) {
    alert("T-shirt base image is missing.");
    return;
  }

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height); // Use the stored base image

  // Reapply the selected color
  if (selectedColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const [red, green, blue] = selectedColor.match(/\d+/g).map(Number);

    for (let i = 0; i < data.length; i += 4) {
      const lightness = (data[i] + data[i + 1] + data[i + 2]) / 3 / 255;
      if (lightness > 0.2 && data[i + 3] > 0) {
        data[i] = red * lightness;
        data[i + 1] = green * lightness;
        data[i + 2] = blue * lightness;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  // Get all overlays (text and images) within the drag region
  const overlays = document.querySelectorAll(".text-area");

  overlays.forEach((overlay) => {
    const overlayRect = overlay.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const x = overlayRect.left - canvasRect.left;
    const y = overlayRect.top - canvasRect.top;

    // Render text overlays
    if (overlay.querySelector("input")) {
      const textInput = overlay.querySelector("input");
      const textValue = textInput.value;
      const font = window.getComputedStyle(textInput).font;
      const color = window.getComputedStyle(textInput).color;

      ctx.font = font;
      ctx.fillStyle = color;
      ctx.fillText(
        textValue,
        x,
        y + parseInt(window.getComputedStyle(textInput).fontSize)
      );
    }

    // Render image overlays
    if (overlay.querySelector("img")) {
      const img = overlay.querySelector("img");
      const width = parseInt(window.getComputedStyle(img).width);
      const height = parseInt(window.getComputedStyle(img).height);
      ctx.drawImage(img, x, y, width, height);
    }
  });

  // Save the canvas as an image
  const link = document.createElement("a");
  link.download = "tshirt_design.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
window.addEventListener("resize", centerDragRegion);
return (
  <div className="overall-edit-page">
    {/* Upload Section */}
    <div id="upload-container">
      <h2>Upload T-Shirt Image</h2>
      <input type="file" id="imageUploader" accept="image/png" />
    </div>

    {/* Canvas Section */}
    <div className="canvas-container" id="canvas-container">
      <h1>T-Shirt Designer</h1>
      <canvas id="tshirtCanvas" width="500" height="600"></canvas>
      <div className="text-wrapper" id="dragRegion"></div>
      <button onClick={() => console.log("Save Design")}>Save Design</button>
    </div>

    {/* Controls Section */}
    <div className="controls-container">
      {/* Toolbar */}
      <div className="toolbar" id="toolbar">
        <label htmlFor="fontSelector">Font Family:</label>
        <select id="fontSelector">
          <option value="Arial" style={{ fontFamily: "Arial" }}>
            Arial
          </option>
          <option value="Verdana" style={{ fontFamily: "Verdana" }}>
            Verdana
          </option>
          <option value="Georgia" style={{ fontFamily: "Georgia" }}>
            Georgia
          </option>
          <option value="Courier New" style={{ fontFamily: "Courier New" }}>
            Courier New
          </option>
          <option
            value="Times New Roman"
            style={{ fontFamily: "Times New Roman" }}
          >
            Times New Roman
          </option>
          <option value="Trebuchet MS" style={{ fontFamily: "Trebuchet MS" }}>
            Trebuchet MS
          </option>
          <option
            value="Comic Sans MS"
            style={{ fontFamily: "Comic Sans MS" }}
          >
            Comic Sans MS
          </option>
          <option value="Impact" style={{ fontFamily: "Impact" }}>
            Impact
          </option>
          <option value="Tahoma" style={{ fontFamily: "Tahoma" }}>
            Tahoma
          </option>
          <option value="Helvetica" style={{ fontFamily: "Helvetica" }}>
            Helvetica
          </option>
        </select>

        <label htmlFor="textColorPicker">Text Color:</label>
        <input type="color" id="textColorPicker" />

        <label htmlFor="fontSizeSelector">Font Size:</label>
        <select id="fontSizeSelector">
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="20" selected>
            20px
          </option>
          <option value="24">24px</option>
          <option value="28">28px</option>
          <option value="32">32px</option>
          <option value="36">36px</option>
          <option value="40">40px</option>
          <option value="48">48px</option>
          <option value="56">56px</option>
        </select>
      </div>

      {/* T-Shirt Color Options */}
      <h2>Select a T-Shirt Color</h2>
      <div className="color-options">
        {[
          "red",
          "blue",
          "green",
          "yellow",
          "purple",
          "orange",
          "gray",
          "pink",
          "cyan",
          "brown",
        ].map((color) => (
          <button
            key={color}
            className="color-button"
            style={{ backgroundColor: color }}
            onClick={() => console.log(`Change color to ${color}`)}
          ></button>
        ))}
      </div>

      {/* Controls */}
      <button onClick={() => console.log("Add Text")}>Add Text</button>
      <button onClick={() => console.log("Upload from Gallery")}>
        Upload From Gallery
      </button>
      <button onClick={openIconModal}>Choose Icon</button>
      <button onClick={openClipartModal}>Add Clipart</button>
      <button onClick={openTemplateModal}>Predefined Templates</button>

      {/* Clipart Modal */}
      {clipartModalOpen && (
        <div id="clipartModal" className="modal">
          <div className="modal-content">
            <span className="clipartModal close" onClick={closeClipartModal}>
              &times;
            </span>
            <h2>Select a Clipart</h2>
            <div className="clipart-list">
              {["clipart1.png", "clipart2.png", "clipart3.png"].map(
                (clipart) => (
                  <img
                    key={clipart}
                    src={`path/to/${clipart}`}
                    className="clipart"
                    onClick={() => console.log(`Add ${clipart}`)}
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Icon List Modal */}
      {iconModalOpen && (
        <div id="iconModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeIconModal}>
              &times;
            </span>
            <h2>Select an Icon</h2>
            <div className="icon-list">
              {["leaf.png", "leaf2.png", "braslet.png", "horse.png"].map(
                (icon) => (
                  <img
                    key={icon}
                    src={`path/to/${icon}`}
                    className="icon"
                    onClick={() => console.log(`Add ${icon}`)}
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Predefined Templates Modal */}
      {templateModalOpen && (
        <div id="templateModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeTemplateModal}>
              &times;
            </span>
            <h2>Select a Predefined Template</h2>
            <div className="predefined-templates">
              {["Hello", "Welcome", "Sample"].map((template, index) => (
                <div
                  key={index}
                  className="template"
                  onClick={() => console.log(`Add template: ${template}`)}
                >
                  <p
                    style={{
                      fontFamily: "Arial",
                      fontSize: "16px",
                      color: "#000",
                    }}
                  >
                    {template}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default TShirtDesigner;
