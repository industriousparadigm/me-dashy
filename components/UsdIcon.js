import React from "react";

export default function Icon({ width, height }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 480 480"
      version="1.1"
      viewBox="0 0 480 480"
      xmlSpace="preserve"
      width={width}
      height={height}
    >
      <path fill="#304F1E" d="M448 160L80 96 64 160"></path>
      <path fill="#406928" d="M0 160H480V384H0z"></path>
      <path
        fill="#589137"
        d="M416 352H64c0-17.6-14.4-32-32-32v-96c17.6 0 32-14.4 32-32h352c0 17.6 14.4 32 32 32v96c-17.6 0-32 14.4-32 32z"
      ></path>
      <g fill="#304F1E">
        <path d="M24 184H40V200H24z"></path>
        <path d="M440 184H456V200H440z"></path>
        <path d="M440 344H456V360H440z"></path>
        <path d="M24 344H40V360H24z"></path>
      </g>
      <g fill="#404040">
        <path d="M256 312h-48v-16h48c4.8 0 8-3.2 8-8s-3.2-8-8-8h-32c-13.6 0-24-10.4-24-24s10.4-24 24-24h48v16h-48c-4.8 0-8 3.2-8 8s3.2 8 8 8h32c13.6 0 24 10.4 24 24s-10.4 24-24 24z"></path>
        <path d="M232 216H248V240H232z"></path>
        <path d="M232 304H248V328H232z"></path>
      </g>
      <g fill="#6EB545">
        <circle cx="104" cy="272" r="24"></circle>
        <circle cx="376" cy="272" r="24"></circle>
      </g>
    </svg>
  );
}
