// src/components/SimpleWebcamTest.jsx
import { useEffect, useRef, useState } from "react";

function SimpleWebcamTest() {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream;

    async function setup() {
      try {
        console.log("Requesting webcam in SimpleWebcamTest...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            console.log("✅ Simple webcam stream started");
          };
        }
      } catch (err) {
        console.error("Simple webcam error:", err);
        setError(err.name || "Camera error");
      }
    }

    setup();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Simple Webcam Test</h2>
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        style={{
          width: "320px",
          height: "240px",
          backgroundColor: "#000",
          borderRadius: "8px",
          display: "block",
        }}
      />
      {error && (
        <p style={{ color: "red", marginTop: "8px" }}>
          Camera error: {error}. Check browser permissions & system settings.
        </p>
      )}
    </div>
  );
}

export default SimpleWebcamTest;