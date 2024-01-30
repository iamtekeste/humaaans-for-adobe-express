// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import { Canvg } from "canvg";
// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React, { useEffect, useState } from "react";
import "./App.css";

import { AddOnSDKAPI } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import Humaaans from "./Humaaans";
import humaaanListSource from "./humaaanList";

const App = ({ addOnUISdk }: { addOnUISdk: AddOnSDKAPI }) => {
  const [state, setState] = useState({
    searchTerm: "",
    humaaanList: humaaanListSource,
    selectedHumaaan: null,
  });

  const { searchTerm, humaaanList, selectedHumaaan } = state;

  const importHumaaan = (selectedHumaaan) => {
    setState({ ...state, selectedHumaaan });
  };

  function getSVGDimensions(svgString) {
    const parser = new DOMParser();
    const svgDOM = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDOM.documentElement;
    const width = +svgElement.getAttribute("width").replaceAll("px", "");
    const height = +svgElement.getAttribute("height").replaceAll("px", "");

    return { width, height };
  }

  useEffect(() => {
    if (!selectedHumaaan) return;

    const addImageFromBlob = async (selectedHumaaan) => {
      try {
        const { document: adobeExpressDocument } = addOnUISdk.app;
        const { width, height } = getSVGDimensions(selectedHumaaan);
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        new Canvg(ctx, selectedHumaaan);
        const pngDataUrl = canvas.toDataURL("image/png");
        console.log(pngDataUrl);

        await adobeExpressDocument.addImage(selectedHumaaan);
      } catch (error) {
        console.log(error);

        console.log("Failed to add the image to the page.");
      }
    };
    addImageFromBlob(selectedHumaaan);
  }, [selectedHumaaan]);

  const filterHumaaans = (event) => {
    debugger;
    const searchTerm = event.target.value;
    const { humaaanList } = state;

    let filteredHumaaans = humaaanList.filter((humaaan) => {
      return (
        humaaan.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) >= 0
      );
    });
    if (!searchTerm) {
      filteredHumaaans = humaaanListSource;
    }
    setState({ ...state, searchTerm, humaaanList: filteredHumaaans });
  };

  return (
    <div>
      <div className="InputAddOn">
        <span className="InputAddOn-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-search"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          className="InputAddOn-field"
          type="text"
          value={searchTerm}
          onChange={filterHumaaans}
          placeholder="Search illustrations of people"
        />
      </div>
      <Humaaans importHumaaan={importHumaaan} humaaanList={humaaanList} />
      <div className="credits">
        made by{" "}
        <a target="_blank" href="https://twitter.com/tkmadeit">
          @tkmadeit{" "}
        </a>
        with illustrations from{" "}
        <a target="_blank" href="https://www.humaaans.com/">
          Humaaans
        </a>
      </div>
    </div>
  );
};

export default App;
