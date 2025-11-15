import { useState } from "react";
import WebcamEmotion from "./components/WebcamEmotion";
import EmotionIndicator from "./components/EmotionIndicator";
import Lesson from "./components/Lesson";
import "./App.css";

function App() {
  const [emotionState, setEmotionState] = useState("FOCUSED");

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Emotion-Adaptive Learning</h1>
        <p className="app-subtitle">
          A calm learning space that adapts to how kids might be feeling.
        </p>
      </header>

      <main className="app-main">
        <section className="panel lesson-panel">
          <Lesson emotionState={emotionState} />
        </section>

        <section className="panel right-panel">
          <WebcamEmotion onEmotionChange={setEmotionState} />
          {console.log("Webcam emotion rendered")}
          <EmotionIndicator emotionState={emotionState} />
        </section>
      </main>
    </div>
  );
}

export default App;