import React from "react";

const ProductOptions = ({ changeColor }) => {
  return (
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
