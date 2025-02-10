import React from "react";
import clipart1 from "../cliparts/clipart1.png";
import clipart2 from "../cliparts/clipart2.png";
import clipart3 from "../cliparts/clipart3.png";
import clipart4 from "../cliparts/clipart4.png";
import clipart5 from "../cliparts/clipart5.png";
import clipart6 from "../cliparts/clipart6.png";
import clipart7 from "../cliparts/clipart7.png";
import { Dropdown } from "bootstrap";
function ClipartSection({ addClipartToCanvas }) {
  return (
    <div>
      <h2 className="tshirt-titile-option">Unisex Staple T-Shirt</h2>
      {/* Rating Section */}
      <div className="rating-container">
        <span className="rating-value">4.5</span>
        <span className="star">⭐</span>
      </div>
      <input
        className="search-for-clipart"
        placeholder="Search Clip art"
        type="text"
        name=""
        id="search-for-clipart"
      />
      <div className="dropdowns-container">
        <div>
          <select className="clipart-dropdown" name="" id="">
            <option value="">All Cliparts</option>
            <option value="option 1">Option 1</option>
            <option value="option 2">Option 2</option>
          </select>
        </div>

        <div>
          <select  className="clipart-dropdown" name="" id="">
            <option value="">Categories</option>
            <option value="category 1">Category 1</option>
            <option value="category 2">Category 2</option>
          </select>
        </div>
      </div>
      <div className="clipart-gallery d-flex flex-wrap" style={{ justifyContent: "space-between" }}>
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
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "100%",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClipartSection;
