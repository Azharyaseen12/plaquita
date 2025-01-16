import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./tshirtcustumizer.css";
import Tshirtimg from "../images/tshirt.png";
import Logo from "../images/logo.png";
import clipart1 from "../cliparts/clipart1.png"
import clipart2 from "../cliparts/clipart2.png"
import clipart3 from "../cliparts/clipart3.png"
import clipart4 from "../cliparts/clipart4.png"
import clipart5 from "../cliparts/clipart5.png"
import clipart6 from "../cliparts/clipart6.png"
import clipart7 from "../cliparts/clipart7.png"
const TShirtCustomizer = () => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const dragRegionRef = useRef(null);
  const [dragRegionStyle, setDragRegionStyle] = useState({});
  const [activeSidebar, setActiveSidebar] = useState("product");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [currentTextBox, setCurrentTextBox] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = Tshirtimg;
    imgRef.current = image;

    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      centerDragRegion();
    };

    window.addEventListener("resize", centerDragRegion);
    return () => window.removeEventListener("resize", centerDragRegion);
  }, []);

  const centerDragRegion = () => {
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    setDragRegionStyle({
      width: "40%",
      height: "50%",
      left: `${(canvasRect.width - canvasRect.width * 0.4) / 2}px`,
      top: `${(canvasRect.height - canvasRect.height * 0.5) / 2}px`,
    });
  };

  const saveState = () => {
    setUndoStack((prev) => [...prev, dragRegionRef.current.innerHTML]);
    setRedoStack([]);
  };
  const initializeEventListeners = () => {
    const dragRegion = dragRegionRef.current;
    const textBoxes = dragRegion.querySelectorAll(".text-area");
  
    textBoxes.forEach((textBox) => {
      // Ensure the textBox has all event listeners reattached
      textBox
        .querySelector(".handle.close")
        .addEventListener("click", () => {
          dragRegion.removeChild(textBox);
          saveState();
        });
  
      textBox
        .querySelector(".handle.rotate")
        .addEventListener("click", () => {
          const currentRotation =
            textBox.style.transform.replace(/[^0-9]/g, "") || 0;
          textBox.style.transform = `rotate(${parseInt(currentRotation) + 15}deg)`;
          saveState();
        });
  
      textBox
        .querySelector(".handle.copy")
        .addEventListener("click", () => {
          const input = textBox.querySelector("input");
          const inputStyle = input.getAttribute("style");
          addText({
            value: input.value,
            top: `${parseInt(textBox.style.top) + 20}px`,
            left: `${parseInt(textBox.style.left) + 20}px`,
            style: inputStyle, // Pass the style attribute of the input
          });
        });
  
      textBox.addEventListener("mousedown", (e) => handleDragStart(e, textBox));
      textBox
        .querySelector(".handle.resize")
        .addEventListener("mousedown", (e) => handleResizeStart(e, textBox));
    });
  };
  const undo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop();
      setRedoStack((prev) => [...prev, dragRegionRef.current.innerHTML]);
      dragRegionRef.current.innerHTML = lastState;
      setUndoStack([...undoStack]);
  
      // Reinitialize event listeners after restoring state
      initializeEventListeners();
    } else {
      alert("Nothing to undo!");
    }
  };
  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setUndoStack((prev) => [...prev, dragRegionRef.current.innerHTML]);
      dragRegionRef.current.innerHTML = nextState;
      setRedoStack([...redoStack]);
  
      // Reinitialize event listeners after restoring state
      initializeEventListeners();
    } else {
      alert("Nothing to redo!");
    }
  };
  const handleDragStart = (e, textBox) => {
    setCurrentTextBox(textBox);
  
    const dragRegion = dragRegionRef.current;
    const dragRegionRect = dragRegion.getBoundingClientRect();
    const textBoxRect = textBox.getBoundingClientRect();
  
    const offsetX = e.clientX - textBoxRect.left;
    const offsetY = e.clientY - textBoxRect.top;
  
    const handleDragging = (e) => {
      if (!textBox || !dragRegion) return; // Null check to prevent errors
  
      const newLeft = e.clientX - offsetX - dragRegionRect.left;
      const newTop = e.clientY - offsetY - dragRegionRect.top;
  
      // Apply new positions
      textBox.style.left = `${newLeft}px`;
      textBox.style.top = `${newTop}px`;
  
      const input = textBox.querySelector("input, img"); // Support both input and img
  
      if (input) {
        // Ensure `input` exists before accessing its style
        const textBoxRect = textBox.getBoundingClientRect();
        const isOutsideLeft = newLeft < 0;
        const isOutsideTop = newTop < 0;
        const isOutsideRight = newLeft + textBoxRect.width > dragRegionRect.width;
        const isOutsideBottom = newTop + textBoxRect.height > dragRegionRect.height;
  
        const clipLeft = isOutsideLeft ? Math.abs(newLeft) : 0;
        const clipTop = isOutsideTop ? Math.abs(newTop) : 0;
        const clipRight = isOutsideRight
          ? dragRegionRect.width - newLeft
          : textBoxRect.width;
        const clipBottom = isOutsideBottom
          ? dragRegionRect.height - newTop
          : textBoxRect.height;
  
        input.style.clipPath = `inset(${clipTop}px ${textBoxRect.width - clipRight}px ${textBoxRect.height - clipBottom}px ${clipLeft}px)`;
      }
    };
  
    const handleDragEnd = () => {
      document.removeEventListener("mousemove", handleDragging);
      document.removeEventListener("mouseup", handleDragEnd);
      saveState(); // Save the current state after dragging
    };
  
    document.addEventListener("mousemove", handleDragging);
    document.addEventListener("mouseup", handleDragEnd);
  };
  
  const handleResizeStart = (e, textBox) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = textBox.offsetWidth;
    const startHeight = textBox.offsetHeight;

    const handleResizing = (e) => {
      const newWidth = Math.max(startWidth + (e.clientX - startX), 50);
      const newHeight = Math.max(startHeight + (e.clientY - startY), 30);
      textBox.style.width = `${newWidth}px`;
      textBox.style.height = `${newHeight}px`;
    };

    const handleResizeEnd = () => {
      document.removeEventListener("mousemove", handleResizing);
      document.removeEventListener("mouseup", handleResizeEnd);
      saveState();
    };

    document.addEventListener("mousemove", handleResizing);
    document.addEventListener("mouseup", handleResizeEnd);
  };
  const addText = (copyData = null) => {
    const dragRegion = dragRegionRef.current;
    const textBox = document.createElement("div");
    textBox.classList.add("text-area");
  
    // If copyData is provided, use its values; otherwise, set defaults
    const textValue = copyData?.value || "Your Text";
    const textTop = copyData?.top || "50px";
    const textLeft = copyData?.left || "50px";
    const textStyle =
      copyData?.style || "font-family: Arial; font-size: 16px; color: black;";
  
    textBox.innerHTML = `
      <input type="text" value="${textValue}" style="${textStyle}" />
      <div class="handle close">X</div>
      <div class="handle resize"><i class="fas fa-expand-arrows-alt"></i></div>
      <div class="handle rotate">↻</div>
      <div class="handle copy">⧉</div>
    `;
  
    // Position the text box
    textBox.style.position = "absolute";
    textBox.style.top = textTop;
    textBox.style.left = textLeft;
  
    dragRegion.appendChild(textBox);
    saveState();
  
    // Add event listeners for functionality
    textBox.querySelector(".handle.close").addEventListener("click", () => {
      dragRegion.removeChild(textBox);
      saveState();
    });
  
    textBox.querySelector(".handle.rotate").addEventListener("click", () => {
      const currentRotation =
        textBox.style.transform.replace(/[^0-9]/g, "") || 0;
      textBox.style.transform = `rotate(${parseInt(currentRotation) + 15}deg)`;
      saveState();
    });
  
    textBox.querySelector(".handle.copy").addEventListener("click", () => {
      const input = textBox.querySelector("input");
      const inputStyle = input.getAttribute("style");
      addText({
        value: input.value,
        top: `${parseInt(textBox.style.top) + 20}px`,
        left: `${parseInt(textBox.style.left) + 20}px`,
        style: inputStyle, // Pass the style attribute of the input
      });
    });
  
    textBox.addEventListener("mousedown", (e) => handleDragStart(e, textBox));
    textBox
      .querySelector(".handle.resize")
      .addEventListener("mousedown", (e) => handleResizeStart(e, textBox));
  };
  const changeColor = (color) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = imgRef.current;

    setSelectedColor(color);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

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
  };

  const saveCanvasWithOverlays = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = imgRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

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

    const dragRegion = dragRegionRef.current;
    const overlays = dragRegion.querySelectorAll(".text-area");

    overlays.forEach((overlay) => {
      const rect = overlay.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const x = rect.left - canvasRect.left;
      const y = rect.top - canvasRect.top;

      if (overlay.querySelector("input")) {
        const input = overlay.querySelector("input");
        const font = window.getComputedStyle(input).font;
        const color = window.getComputedStyle(input).color;

        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(
          input.value,
          x,
          y + parseInt(window.getComputedStyle(input).fontSize)
        );
      }
    });

    const link = document.createElement("a");
    link.download = "tshirt_design.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  const updateTextStyle = (styleProp, value) => {
    if (currentTextBox) {
      const input = currentTextBox.querySelector("input");
      input.style[styleProp] = value;
      saveState(); // Save the updated state for undo/redo functionality
    }
  };
  const printCanvas = () => {
    const canvas = canvasRef.current;
  
    // Convert canvas to image data
    const dataUrl = canvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<html><head><title>Print T-Shirt Design</title></head><body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background-color:white;"><img src="${dataUrl}" style="max-width:100%;height:auto;"></body></html>`
    );
    printWindow.document.close();
    printWindow.print();
  };
  const addTemplate = (
    text,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    color,
    positionTop = "50px",
    positionLeft = "50px"
  ) => {
    const dragRegion = dragRegionRef.current;
    const textBox = document.createElement("div");
    textBox.classList.add("text-area");
  
    // Construct the text style
    const textStyle = `font-family: ${fontFamily}; font-size: ${fontSize}; font-style: ${fontStyle}; font-weight: ${fontWeight}; color: ${color};`;
  
    // Set the HTML for the text box
    textBox.innerHTML = `
      <input type="text" value="${text}" style="${textStyle}" />
      <div class="handle close">X</div>
      <div class="handle resize"><i class="fas fa-expand-arrows-alt"></i></div>
      <div class="handle rotate">↻</div>
      <div class="handle copy">⧉</div>
    `;
  
    // Position the text box
    textBox.style.position = "absolute";
    textBox.style.top = positionTop;
    textBox.style.left = positionLeft;
  
    dragRegion.appendChild(textBox);
    saveState();
  
    // Add event listeners for functionality
    textBox.querySelector(".handle.close").addEventListener("click", () => {
      dragRegion.removeChild(textBox);
      saveState();
    });
  
    textBox.querySelector(".handle.rotate").addEventListener("click", () => {
      const currentRotation =
        textBox.style.transform.replace(/[^0-9]/g, "") || 0;
      textBox.style.transform = `rotate(${parseInt(currentRotation) + 15}deg)`;
      saveState();
    });
  
    textBox.querySelector(".handle.copy").addEventListener("click", () => {
      const input = textBox.querySelector("input");
      const inputStyle = input.getAttribute("style");
      addText({
        value: input.value,
        top: `${parseInt(textBox.style.top) + 20}px`,
        left: `${parseInt(textBox.style.left) + 20}px`,
        style: inputStyle,
      });
    });
  
    textBox.addEventListener("mousedown", (e) => handleDragStart(e, textBox));
    textBox
      .querySelector(".handle.resize")
      .addEventListener("mousedown", (e) => handleResizeStart(e, textBox));
  };
  const addClipartToCanvas = (
    clipartSrc,
    positionTop = "50px",
    positionLeft = "50px",
    width = "100px",
    height = "100px"
  ) => {
    const dragRegion = dragRegionRef.current;
    const clipartBox = document.createElement("div");
    clipartBox.classList.add("text-area");
  
    // Set the HTML for the clipart box
    clipartBox.innerHTML = `
      <img src="${clipartSrc}" style="width: ${width}; height: ${height};" />
      <div class="handle close">X</div>
      <div class="handle resize"><i class="fas fa-expand-arrows-alt"></i></div>
      <div class="handle rotate">↻</div>
      <div class="handle copy">⧉</div>
    `;
  
    // Position the clipart box
    clipartBox.style.position = "absolute";
    clipartBox.style.top = positionTop;
    clipartBox.style.left = positionLeft;
  
    dragRegion.appendChild(clipartBox);
    saveState();
  
    // Add event listeners for functionality
    clipartBox.querySelector(".handle.close").addEventListener("click", () => {
      dragRegion.removeChild(clipartBox);
      saveState();
    });
  
    clipartBox.querySelector(".handle.rotate").addEventListener("click", () => {
      const currentRotation =
        clipartBox.style.transform.replace(/[^0-9]/g, "") || 0;
      clipartBox.style.transform = `rotate(${parseInt(currentRotation) + 15}deg)`;
      saveState();
    });
  
    clipartBox.querySelector(".handle.copy").addEventListener("click", () => {
      addClipartToCanvas(
        clipartSrc,
        `${parseInt(clipartBox.style.top) + 20}px`,
        `${parseInt(clipartBox.style.left) + 20}px`,
        width,
        height
      );
    });
  
    clipartBox.addEventListener("mousedown", (e) => handleDragStart(e, clipartBox));
    clipartBox
      .querySelector(".handle.resize")
      .addEventListener("mousedown", (e) => handleResizeStart(e, clipartBox));
  };
  
  
    
  return (
    <div>
    <nav className="navbar navbar-light bg-white px-4 py-2 border-bottom">
      <a className="navbar-brand" href="/">
        <img src={Logo} alt="Logo" style={{ height: "40px" }} />
      </a>
      <div className="d-flex align-items-center">
        <select className="form-select me-3" style={{ width: "100px" }}>
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
        <span className="me-3 fw-bold">$10.15</span>
        <button className="btn btn-primary">Add to Cart</button>
      </div>
    </nav>
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-2 col-md-3 sidebar">
          <nav className="nav flex-column">
            <a
              className={`nav-link ${
                activeSidebar === "product" ? "active" : ""
              }`}
              href="#"
              onClick={() => setActiveSidebar("product")}
            >
              <i className="fas fa-tshirt"></i> Product
            </a>
            <a
              className={`nav-link ${
                activeSidebar === "addText" ? "active" : ""
              }`}
              href="#"
              onClick={() => setActiveSidebar("addText")}
            >
              <i className="fas fa-font"></i> Add Text
            </a>
            <a className="nav-link" href="#">
              <i className="fas fa-upload"></i> Upload
            </a>
            <a
              className={`nav-link ${activeSidebar === "clipart" ? "active" : ""}`}
              href="#"
              onClick={() => setActiveSidebar("clipart")}
            >
              <i className="fas fa-images"></i> Clip Arts
            </a>
            <a className="nav-link" href="#">
              <i className="fas fa-layer-group"></i> Layers
            </a>
            <a className="nav-link" href="#">
              <i className="fas fa-folder-open"></i> Shapes
            </a>
          </nav>
        </div>
  
        {/* Main Content */}
        <div className="col-lg-10 col-md-9">
          <div className="row">
            {/* Left Section */}
            <div className="col-lg-4 col-md-12 pt-4 mb-4 left-section">
              {activeSidebar === "product" ? (
                <>
                  <h3>Unisex Staple T-Shirt</h3>
                  <div className="d-flex align-items-center mb-3">
                    <span className="text-warning me-2">4.5 &#9733;</span>
                    <button className="btn btn-outline-primary btn-sm">
                      Change Product
                    </button>
                  </div>
                  <div>
                    <h5>Color</h5>
                    <div className="color-options d-flex flex-wrap">
                      {[
                        "rgb(255, 0, 0)",
                        "rgb(0, 0, 255)",
                        "rgb(0, 255, 0)",
                        "rgb(255, 255, 0)",
                        "rgb(128, 0, 128)",
                        "rgb(0, 0, 0)",
                        "rgb(255, 192, 203)",
                        "rgb(255, 165, 0)",
                        "rgb(0, 128, 128)",
                        "rgb(165, 42, 42)",
                      ].map((color) => (
                        <button
                          key={color}
                          style={{
                            backgroundColor: color,
                            width: "35px",
                            height: "35px",
                            borderRadius: "10px",
                            border: "none",
                            margin: "10px",
                          }}
                          onClick={() => changeColor(color)}
                        ></button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">Size</h5>
                        <a
                          href="/"
                          className="text-decoration-none text-primary"
                        >
                          Size Guide
                        </a>
                      </div>
                      <div className="size-options d-flex flex-wrap">
                        {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                          <div
                            className="d-flex align-items-center me-3 mb-2"
                            key={size}
                          >
                            <div className="size-option me-2">{size}</div>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: "50px" }}
                              placeholder="Qty"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : activeSidebar === "addText" ? (
                <div>
                  <h3>Add Text Options</h3>
                  <p>Use the toolbar to customize your text.</p>
                  <div className="toolbar">
                    <label htmlFor="fontSelector">Font Family:</label>
                    <select
                      id="fontSelector"
                      className="form-select"
                      onChange={(e) => updateTextStyle("fontFamily", e.target.value)}
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
              
                    <label htmlFor="fontSizeSelector">Font Size:</label>
                    <select
                      id="fontSizeSelector"
                      className="form-select"
                      onChange={(e) => updateTextStyle("fontSize", `${e.target.value}px`)}
                    >
                      {[12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56].map((size) => (
                        <option key={size} value={size}>
                          {size}px
                        </option>
                      ))}
                    </select>
              
                    <label htmlFor="textColorPicker">Text Color:</label>
                    <input
                      type="color"
                      id="textColorPicker"
                      className="form-control"
                      onChange={(e) => updateTextStyle("color", e.target.value)}
                    />
              
                    <button className="btn btn-primary mt-3" onClick={addText}>
                      Add Text
                    </button>
                  </div>
              
                  {/* Display Predefined Templates */}
                  <h5 className="mt-4">Predefined Templates</h5>
                  <div className="predefined-templates d-flex flex-wrap">
                    <div
                      className="template p-2 border m-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        addTemplate("Hello", "Arial", "16px", "normal", "normal", "#000")
                      }
                    >
                      <p style={{ fontFamily: "Arial", fontSize: "16px", color: "#000" }}>
                        Hello
                      </p>
                    </div>
                    <div
                      className="template p-2 border m-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        addTemplate("Bold Text", "Arial", "16px", "normal", "bold", "#000")
                      }
                    >
                      <p
                        style={{
                          fontFamily: "Arial",
                          fontSize: "16px",
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        Bold Text
                      </p>
                    </div>
                    <div
                      className="template p-2 border m-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        addTemplate("Red Text", "Arial", "16px", "normal", "bold", "red")
                      }
                    >
                      <p
                        style={{
                          fontFamily: "Arial",
                          fontSize: "16px",
                          color: "red",
                          fontWeight: "bold",
                        }}
                      >
                        Red Text
                      </p>
                    </div>
                    <div
                      className="template p-2 border m-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        addTemplate("Italic Text", "Arial", "16px", "italic", "normal", "#000")
                      }
                    >
                      <p
                        style={{
                          fontFamily: "Arial",
                          fontSize: "16px",
                          color: "#000",
                          fontStyle: "italic",
                        }}
                      >
                        Italic Text
                      </p>
                    </div>
                  </div>
                </div>
              ) : activeSidebar === "addText" ? (
                <div>
                  <h3>Add Text Options</h3>
                  <p>Use the toolbar to customize your text.</p>
                  <div className="toolbar">
                    {/* Toolbar for text options */}
                  </div>
                  <h5 className="mt-4">Predefined Templates</h5>
                  <div className="predefined-templates d-flex flex-wrap">
                    {/* Predefined text templates */}
                  </div>
                </div>
              ) : activeSidebar === "clipart" ? (
                <div>
                <h3>Select Clipart</h3>
                <p>Choose from the available cliparts below:</p>
                <div className="clipart-gallery d-flex flex-wrap">
                  {[
                    { src: clipart1, alt: "Clipart 1" },
                    { src: clipart2, alt: "Clipart 2" },
                    { src: clipart3, alt: "Clipart 3" },
                    { src: clipart4, alt: "Clipart 4" },
                    { src: clipart5, alt: "Clipart 5" },
                    { src: clipart6, alt: "Clipart 6" },
                    { src: clipart7, alt: "Clipart 7" },
                  ].map((clipart, index) => (
                    <div
                      key={index}
                      className="clipart-item p-2 border m-2"
                      style={{
                        cursor: "pointer",
                        width: "100px",
                        height: "100px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => addClipartToCanvas(clipart.src)}
                    >
                      <img
                        src={clipart.src}
                        alt={clipart.alt}
                        style={{ width: "100%", height: "auto", maxHeight: "100%" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              ) : null}
              
            </div>
  
            {/* Right Section */}
            <div className="col-lg-8 col-md-12 pt-4 right-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="product-tabs">
                  {["Front", "Back", "Left Sleeve", "Right Sleeve"].map(
                    (tab, index) => (
                      <button
                        key={tab}
                        className={index === 0 ? "active" : ""}
                      >
                        {tab}
                      </button>
                    )
                  )}
                </div>
                <button className="btn btn-outline-danger btn-sm">
                  Back to Shop
                </button>
              </div>
              <div className="text-center card p-3">
                <div className="canvas-container">
                  <canvas
                    ref={canvasRef}
                    id="tshirtCanvas"
                    width={500}
                    height={600}
                    style={{ border: "1px solid #ccc" }}
                  ></canvas>
                  <div
                    ref={dragRegionRef}
                    id="dragRegion"
                    style={{
                      position: "absolute",
                      border: "2px dashed #999",
                      ...dragRegionStyle,
                    }}
                  ></div>
                </div>
                <div className="action-buttons d-flex justify-content-around align-items-center">
                  {[
                    { icon: "fa-undo", label: "Undo", action: undo },
                    { icon: "fa-redo", label: "Redo", action: redo },
                    { icon: "fa-print", label: "Print", action: printCanvas },
                    {
                      icon: "fa-save",
                      label: "Save",
                      action: saveCanvasWithOverlays,
                    },
                    {
                      icon: "fa-share-alt",
                      label: "Share",
                      action: () =>
                        alert("Share functionality not implemented yet!"),
                    },
                  ].map(({ icon, label, action }) => (
                    <div
                      className="action-item text-center"
                      key={label}
                      onClick={action}
                      style={{ cursor: "pointer" }}
                    >
                      <i className={`fas ${icon}`}></i>
                      <p className="mt-1 mb-0 small">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default TShirtCustomizer;