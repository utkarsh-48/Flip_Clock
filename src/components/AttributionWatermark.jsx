import React from "react";
import { ATTRIBUTION_TEXT, GITHUB_PROFILE_URL } from "../config/branding";

function AttributionWatermark() {
  return (
    <div className="credit-watermark" aria-label="Attribution watermark">
      <a
        className="credit-watermark-link"
        href={GITHUB_PROFILE_URL}
        target="_blank"
        rel="noreferrer"
      >
        {ATTRIBUTION_TEXT}
      </a>
    </div>
  );
}

export default AttributionWatermark;
