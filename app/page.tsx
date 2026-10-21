import { preload } from "react-dom";
import Car11Client from "@/components/car11/Car11Client";

export default function Home() {
  // start the 6 MB car download with the HTML instead of after three.js and the scene are up;
  // GLTFLoader's fetch (same-origin, CORS mode) then reuses this response
  preload("/models/rb22.glb", { as: "fetch", crossOrigin: "anonymous" });
  return (
    <>
      {/* without JS the intro would never lift */}
      <noscript>
        <style>{".ci{display:none}"}</style>
      </noscript>
      <Car11Client />
    </>
  );
}
