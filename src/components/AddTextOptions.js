import React from "react";

const AddTextOptions = ({
  updateTextStyle,
  addText,
  addTemplate,
}) => {
  return (
    <div>
      <h3>Add Text Options</h3>
      <p>Use the toolbar to customize your text.</p>
      <div className="toolbar">
        <label htmlFor="fontSelector">Font Family:</label>
        <select
          id="fontSelector"
          className="form-select"
          onChange={(e) =>
            updateTextStyle("fontFamily", e.target.value)
          }
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
            <option
              key={font}
              value={font}
              style={{ fontFamily: font }}
            >
              {font}
            </option>
          ))}
        </select>

        <label htmlFor="fontSizeSelector">Font Size:</label>
        <select
          id="fontSizeSelector"
          className="form-select"
          onChange={(e) =>
            updateTextStyle("fontSize", `${e.target.value}px`)
          }
        >
          {[12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56].map(
            (size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            )
          )}
        </select>

        <label htmlFor="textColorPicker">Text Color:</label>
        <input
          type="color"
          id="textColorPicker"
          className="form-control"
          onChange={(e) =>
            updateTextStyle("color", e.target.value)
          }
        />

        <button
          className="btn btn-primary mt-3"
          onClick={addText}
        >
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
            addTemplate(
              "Hello",
              "Arial",
              "16px",
              "normal",
              "normal",
              "#000"
            )
          }
        >
          <p
            style={{
              fontFamily: "Arial",
              fontSize: "16px",
              color: "#000",
            }}
          >
            Hello
          </p>
        </div>
        <div
          className="template p-2 border m-2"
          style={{ cursor: "pointer" }}
          onClick={() =>
            addTemplate(
              "Bold Text",
              "Arial",
              "16px",
              "normal",
              "bold",
              "#000"
            )
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
            addTemplate(
              "Red Text",
              "Arial",
              "16px",
              "normal",
              "bold",
              "red"
            )
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
            addTemplate(
              "Italic Text",
              "Arial",
              "16px",
              "italic",
              "normal",
              "#000"
            )
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
  );
};

export default AddTextOptions;
