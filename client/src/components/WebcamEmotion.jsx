import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

function WebcamEmotion({ onEmotionChange }) {
  const videoRef = useRef(null);
  const lastEmotionRef = useRef("ENGAGED"); // for smoothing

  useEffect(() => {
    let stream;
    let intervalId;

    async function setup() {
      // 1. Load models from /models
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      } catch (e) {
        console.error("Error loading face-api models:", e);
        return;
      }

      // 2. Get webcam stream
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        console.error("Error accessing webcam:", e);
        return;
      }

      // 3. Periodically analyze expressions
      intervalId = setInterval(async () => {
        if (!videoRef.current) return;

        const detections = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();

        if (detections && detections.expressions) {
          const emotion = mapExpressionsToState(detections.expressions);
          // simple smoothing: only update if emotion actually changed
          if (emotion !== lastEmotionRef.current) {
            lastEmotionRef.current = emotion;
            onEmotionChange(emotion);
          }
        }
      }, 1000);
    }

    setup();

    // cleanup on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [onEmotionChange]);

  return (
    // Hidden video: computer sees, user does not
    <video
      ref={videoRef}
      style={{ display: "none" }}
      muted
      playsInline
    />
  );
}

// map raw expressions → app-level states
function mapExpressionsToState(expr) {
  const { happy = 0, neutral = 0, sad = 0, angry = 0, fearful = 0, surprised = 0 } = expr;

  if (sad > 0.4 || angry > 0.4 || fearful > 0.4) {
    return "FRUSTRATED";
  }
  if (surprised > 0.5) {
    return "CONFUSED";
  }
  if (happy > 0.4 || neutral > 0.4) {
    return "ENGAGED";
  }

  return "ENGAGED";
}

export default WebcamEmotion;
