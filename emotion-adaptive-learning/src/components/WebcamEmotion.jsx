// src/components/WebcamEmotion.jsx
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function WebcamEmotion({ onEmotionChange }) {
  const videoRef = useRef(null);
  const modelsLoadedRef = useRef(false);
  const detectionIntervalRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream;

    async function setup() {
      try {
        console.log("[WebcamEmotion] mounting…");

        // 1) Load models once
        if (!modelsLoadedRef.current) {
          console.log("[WebcamEmotion] loading face-api models from /models…");
          await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
          await faceapi.nets.faceExpressionNet.loadFromUri("/models");
          modelsLoadedRef.current = true;
          console.log("✅ [WebcamEmotion] face-api models loaded");
        }

        // 2) Ask for webcam access
        console.log("[WebcamEmotion] requesting webcam access…");
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            console.log("🎥 [WebcamEmotion] webcam stream started");
            startDetectionLoop();
          };
        }
      } catch (err) {
        console.error("[WebcamEmotion] error setting up webcam:", err);
        setError(err.name || "Camera error");
      }
    }

    function startDetectionLoop() {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }

      console.log("[WebcamEmotion] starting detection loop…");
      detectionIntervalRef.current = setInterval(async () => {
        if (!videoRef.current) return;

        try {
          const detection = await faceapi
            .detectSingleFace(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceExpressions();

          if (detection && detection.expressions) {
            const emotionState = mapExpressionsToState(detection.expressions);
            // debug:
            // console.log("[WebcamEmotion] expressions:", detection.expressions);
            console.log("[WebcamEmotion] emotion:", emotionState);
            onEmotionChange && onEmotionChange(emotionState);
          } else {
            // no face in frame → DISENGAGED
            console.log("[WebcamEmotion] no face detected → DISENGAGED");
            onEmotionChange && onEmotionChange("DISENGAGED");
          }
        } catch (err) {
          console.error("[WebcamEmotion] error during detection:", err);
        }
      }, 1000); // every 1 second
    }

    setup();

    return () => {
      console.log("[WebcamEmotion] cleaning up…");
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onEmotionChange]);

  // Map to FOCUSED / ENGAGED / CONFUSED / FRUSTRATED / DISENGAGED
  function mapExpressionsToState(expressions) {
    const {
      happy = 0,
      neutral = 0,
      sad = 0,
      angry = 0,
      surprised = 0,
    } = expressions;

    if (sad > 0.5 || angry > 0.5) {
      return "FRUSTRATED";
    }

    if (surprised > 0.6) {
      return "CONFUSED";
    }

    if (neutral > 0.5) {
      return "FOCUSED";
    }

    if (happy > 0.5) {
      return "ENGAGED";
    }

    // low/confusing signal, but face present
    return "DISENGAGED";
  }

  return (
    <div className="webcam-container">
      <p className="webcam-label">Webcam (emotion sensing – debug)</p>
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
        <p style={{ color: "red", marginTop: "8px", fontSize: "14px" }}>
          Camera/model error: {error}. Check browser permissions & reload.
        </p>
      )}
    </div>
  );
}

export default WebcamEmotion;