// src/components/Lesson.jsx
import { useEffect, useRef, useState } from "react";
import mathQuestions from "../questions/mathquestions";

function Lesson({ emotionState }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showReengage, setShowReengage] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const prevEmotionRef = useRef(emotionState);

  const currentQuestion = mathQuestions[currentIndex];

  // 🔁 React to emotion changes from webcam
  useEffect(() => {
    const prev = prevEmotionRef.current;
    if (prev === emotionState) return; // ignore if no change
    prevEmotionRef.current = emotionState;

    // Reset any overlays when emotion changes
    setShowHint(false);
    setShowExplanation(false);
    setShowReengage(false);

    if (emotionState === "FRUSTRATED") {
      setShowHint(true);
      setFeedback("It seems a bit frustrating. Let's try a gentle hint 💛");
    } else if (emotionState === "CONFUSED") {
      setShowExplanation(true);
      setFeedback("This looks a little tricky. Let's walk through it together 🧩");
    } else if (emotionState === "DISENGAGED") {
      setShowReengage(true);
      setFeedback("It looks like your attention drifted. Want to try something easier? ⭐");
    } else if (emotionState === "ENGAGED" || emotionState === "FOCUSED") {
      setFeedback("You look ready! Let's keep going 🚀");
    }
  }, [emotionState]);

  function handleAnswerClick(option) {
    if (!currentQuestion) return;

    const isCorrect = option === currentQuestion.answer;

    if (isCorrect) {
      setFeedback("Nice job! 🎉");
      setShowHint(false);
      setShowExplanation(false);
      setShowReengage(false);
      setStreak((s) => s + 1);

      // Move to next question after a short delay
      setTimeout(() => {
        goToNextQuestion();
      }, 800);
    } else {
      setFeedback("Almost! Try again, you’re very close.");
      setStreak(0);
    }
  }

  function goToNextQuestion() {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= mathQuestions.length) {
        setIsComplete(true);
        return prev;
      }
      return next;
    });
  }

  // When disengaged and they want to re-engage: jump to an easier question
  function handleReengageClick() {
    setShowReengage(false);
    setFeedback("Let's try a quick, easier one together ✨");

    // find an easy question (difficulty === 1)
    const easyIndices = mathQuestions
      .map((q, idx) => (q.difficulty === 1 ? idx : -1))
      .filter((idx) => idx !== -1);

    if (easyIndices.length > 0) {
      const randomIdx =
        easyIndices[Math.floor(Math.random() * easyIndices.length)];
      setCurrentIndex(randomIdx);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setIsComplete(false);
    setFeedback("");
    setShowHint(false);
    setShowExplanation(false);
    setShowReengage(false);
    setStreak(0);
  }

  if (isComplete) {
    return (
      <div className="lesson-container">
        <h2>Great work! 🎓</h2>
        <p>You finished all the questions in this practice session.</p>
        <button className="option-button" onClick={handleRestart}>
          Restart practice
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="lesson-container">
        <p>Loading question...</p>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      <h2>Math Practice</h2>

      <p className="question-text">{currentQuestion.question}</p>

      <div className="options">
        {currentQuestion.options.map((opt) => (
          <button
            key={opt}
            className="option-button"
            onClick={() => handleAnswerClick(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback && <p className="feedback-text">{feedback}</p>}

      {showHint && (
        <div className="hint-box">
          <h4>Hint</h4>
          <p>{currentQuestion.hint || "Try breaking the problem into smaller steps."}</p>
        </div>
      )}

      {showExplanation && (
        <div className="explanation-box">
          <h4>Step-by-step explanation</h4>
          <p>
            {currentQuestion.explanation ||
              "Think about what the numbers mean and how you can break them into simpler parts."}
          </p>
          {currentQuestion.videoUrl && (
            <a
              href={currentQuestion.videoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Watch a short explanation video
            </a>
          )}
        </div>
      )}

      {showReengage && (
        <div className="reengage-box">
          <h4>Need something lighter?</h4>
          <p>
            It seems like your attention drifted. That’s totally okay. Want to
            try a fun, easier question to get back into it?
          </p>
          <button className="option-button" onClick={handleReengageClick}>
            Yes, show me an easier one ⭐
          </button>
        </div>
      )}
    </div>
  );
}

export default Lesson;