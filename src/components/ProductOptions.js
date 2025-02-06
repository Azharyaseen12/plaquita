import React from "react";

const ProductOptions = ({ changeColor }) => {
  return (
    <>
      <h3>Unisex Staple T-Shirt</h3>
      <div className="d-flex align-items-center mb-3">
        <span className="text-warning me-2">4.5 &#9733;</span>
      </div>
      <button style={{ background: '#293B91', color:'white' }} className="btn btn-outline-primary btn-sm w-100 mb-3 p-3">
          Change Product
        </button>
      <div>
        <h5>Color</h5>
        <div className="color-options d-flex flex-wrap">
          {[
            "rgb(255, 0, 0)",   // Red
            "rgb(255, 223, 79)", // Yellow
            "rgb(0, 204, 0)",   // Green
            "rgb(43, 40, 40)",     // Black
            "rgb(47, 54, 153)", // Dark Blue
            "rgb(211, 36, 130)", // Pink
            "rgb(28, 157, 228)", // Blue
            "rgb(195, 25, 130)", // Dark Pink
            "rgb(255, 87, 87)", // Light Red
            "rgb(120, 63, 193)", // Purple
            "rgb(141, 99, 227)", // Light Purple
            "rgb(194, 135, 247)", // Lavender
            "rgb(72, 235, 215)", // Cyan
            "rgb(132, 150, 234)", // Sky Blue
            "rgb(93, 183, 166)", // Teal
            "rgb(255, 140, 0)",  // Dark Orange
            "rgb(128, 0, 0)",    // Maroon
            "rgb(0, 128, 0)",    // Dark Green
            "rgb(0, 255, 255)",  // Aqua
            "rgb(255, 20, 147)"  // Deep Pink
          ].map((color) => (
            <button
              key={color}
              style={{
                backgroundColor: color,
                width: "35px",
                height: "35px",
                borderRadius: "10px",
                border: "none",
                margin: "5px",
                outline: "2px solid white", // White outline for visibility
                cursor: "pointer",
              }}
              onClick={() => changeColor(color)}
            ></button>
          ))}
        </div>
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Size</h5>
            <a href="/" className="text-decoration-none text-primary">
              Size Guide
            </a>
          </div>
          <div className="size-options d-flex flex-wrap">
            {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
              <div className="d-flex align-items-center me-3 mb-2" key={size}>
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
  );
};

export default ProductOptions;
