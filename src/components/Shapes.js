import React from "react";
import icon1 from "../icons/leaf.png";
import icon2 from "../icons/leaf2.png";
import icon3 from "../icons/braslet.png";
import icon4 from "../icons/horse.png";

function Shapes({ addClipartToCanvas }) {
  return (
    <div>
      <h3>Select an Icon</h3>
      <p>Choose from the available shapes below:</p>
      <div className="icon-list d-flex flex-wrap">
        {[
          { src: icon1, alt: "Leaf" },
          { src: icon2, alt: "Leaf 2" },
          { src: icon3, alt: "Bracelet" },
          { src: icon4, alt: "Horse" },
        ].map((icon, index) => (
          <div
            key={index}
            className="icon-item p-2 m-2"
            style={{
              cursor: "pointer",
              width: "100px",
              height: "100px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
            onClick={() => addClipartToCanvas(icon.src)}
          >
            <img
              src={icon.src}
              alt={icon.alt}
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

export default Shapes;
