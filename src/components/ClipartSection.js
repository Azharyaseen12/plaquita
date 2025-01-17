import React from "react";
import clipart1 from "../cliparts/clipart1.png";
import clipart2 from "../cliparts/clipart2.png";
import clipart3 from "../cliparts/clipart3.png";
import clipart4 from "../cliparts/clipart4.png";
import clipart5 from "../cliparts/clipart5.png";
import clipart6 from "../cliparts/clipart6.png";
import clipart7 from "../cliparts/clipart7.png";
function ClipartSection({ addClipartToCanvas }) {
  return (
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
