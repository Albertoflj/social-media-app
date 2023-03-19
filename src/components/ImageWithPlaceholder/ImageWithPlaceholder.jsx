import React, { useEffect } from "react";
import "./imagewithplaceholder.scss";

import { useState } from "react";

const ImageWithPlaceholder = ({ src, alt, className, referrerPolicy }) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <div className="img-placeholder"></div>}
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy={referrerPolicy}
        onLoad={() => setLoading(false)}
      ></img>
    </>
  );
};

export default ImageWithPlaceholder;
