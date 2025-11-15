import React, { useState } from "react";
import "./App.css";
import Lesson from "./components/Lesson";
import WebcamEmotion from "./components/WebcamEmotion";
import Summary from "./components/Summary";

function App() {
  const [emotionState, setEmotionState] = useState("ENGAGED");
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [viewMode, setViewMode] = useState("CHILD"); // "CHILD" or "ADULT"

  function handleEmotionChange(newEmotion) {
    setEmotionState(newEmotion);
    setEmotionHistory((prev) => [
      ...prev,
      { emotion: newEmotion, time: Date.now() },
    ]);
  }

  function handleToggleView() {
    setViewMode((prev) => (prev === "CHILD" ? "ADULT" : "CHILD"));
  }

  return (
    <div className="app-root">
      {/* no more SignalSchool MVP header – lesson UI is the hero */}

      <main className="main-layout">
        {/* Hidden webcam: computer sees face, child does not */}
        <WebcamEmotion onEmotionChange={handleEmotionChange} />

        {viewMode === "CHILD" ? (
          <div className="child-layout">
            <section className="lesson-panel">
              <Lesson
                emotionState={emotionState}
                score={score}
                correctCount={correctCount}
                onQuestionCorrect={() => {
                  setCorrectCount((prev) => prev + 1);
                  setScore((prev) => prev + 10); // +10 points per correct answer
                }}
                onToggleView={handleToggleView}   // 👈 button inside Lesson
              />
            </section>
          </div>
        ) : (
          <section className="parent-panel">
            <div className="parent-panel-header">
              <h2>Session Insights</h2>
              <button className="header-toggle" onClick={handleToggleView}>
                Back to learner view
              </button>
            </div>

            <p className="tab-description">
              This view is for parents, teachers, or therapists. It summarizes
              how many questions the learner answered and how they seemed to
              feel during this session. No video is stored; all processing stays
              on this device.
            </p>

            <Summary
              emotionHistory={emotionHistory}
              correctCount={correctCount}
              score={score}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
