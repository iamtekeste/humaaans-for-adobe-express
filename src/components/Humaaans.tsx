import * as React from "react";
import { useEffect, useState } from "react";

const SvgInline = (props) => {
  let [svg, setSvg] = useState(null);
  let [svgMod, setSvgMod] = useState(null);
  let [svgBlob, setSvgBlob] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isErrored, setIsErrored] = useState(false);

  useEffect(() => {
    const fetchSVG = async (svgUrl: string) => {
      const res = await fetch(props.url, { cache: "force-cache" });
      const blobRes = res.clone();
      const blob = await blobRes.blob();
      const svgText = await res.text();
      let svgMod = svgText.replace(/width="[0-9]{1,}px"/, "width=100%");
      svgMod = svgText.replace(/height="[0-9]{1,}px"/, "height=100%");
      setSvg(svgText);
      setSvgMod(svgMod);
      setSvgBlob(blob);
      setIsLoaded(true);
    };
    fetchSVG(props.url);
  }, [props.url]);

  return (
    <div
      className={`svgInline svgInline--${isLoaded ? "loaded" : "loading"} ${
        isErrored ? "svgInline--errored" : ""
      }`}
      dangerouslySetInnerHTML={{ __html: svgMod }}
      onClick={() => props.importHumaaan(svg)}
    />
  );
};

export default ({ importHumaaan, humaaanList }) => {
  let allHumaaans = [];
  allHumaaans = humaaanList.map((humaaan) => {
    return (
      <SvgInline
        key={humaaan}
        url={`https://raw.githubusercontent.com/iamtekeste/hdt/master/docs/objects/${humaaan}.svg?sanitize=true`}
        importHumaaan={importHumaaan}
      />
    );
  });
  return (
    <div className="all-humaaans">
      {allHumaaans.length > 0 ? (
        allHumaaans
      ) : (
        <span className="no-result">No search result.</span>
      )}
    </div>
  );
};
