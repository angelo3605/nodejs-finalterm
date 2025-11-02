import { useState } from "react";
import clsx from "clsx";
import { FaImage } from "react-icons/fa6";

export function Image({ ...props }) {
  const [error, setError] = useState(false);

  if (!props.src || error) {
    return (
      <div
        className={clsx("flex justify-center items-center bg-gray-200", props.className)}
        style={{
          width: props.width,
          height: props.height,
          ...props.style,
        }}
      >
        <FaImage className="size-1/3 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      loading="lazy"
      style={{
        objectFit: "cover",
        ...props.style,
      }}
      {...props}
      onError={() => setError(true)}
    />
  );
}
