import React, { useState, useEffect, useMemo } from "react";
import mathQuestions from "../questions/mathQuestions";
import scienceQuestions from "../questions/scienceQuestions";
import englishQuestions from "../questions/englishQuestions";
import EmotionIndicator from "./EmotionIndicator";

const QUESTION_BANK = {
  math: mathQuestions,
  science: scienceQuestions,
  english: englishQuestions,
};

const SUBJECT_LABEL = {
  math: "Math",
  science: "Science",
  english: "English",
};

const EMOTION_COPY = {
  ENGAGED: {
    title: "You're focused ✨",
    helper:
      "Let's keep the flow going. Try the next question when you're ready.",
  },
  FOCUSED: {
    // treat FOCUSED like ENGAGED
    title: "You're focused ✨",
    helper: "You look focused. Let's keep going at this pace.",
  },
  FRUSTRATED: {
    title: "This feels tricky 😣",
    helper:
      "It's okay to take a breath. Try the hint or go step-by-step. Small wins count.",
  },
  CONFUSED: {
    title: "This looks confusing 🧩",
    helper:
      "That's totally okay. Let's slow down, use a hint, or walk through it step-by-step.",
  },
  DISENGAGED: {
    title: "Your mind might have wandered 🌥️",
    helper:
      "Happens to everyone. Try the next question, use a hint, or take a tiny stretch break.",
  },
  NEUTRAL: {
    title: "You're doing fine 🙂",
    helper: "Move at your own pace. Answer when you feel ready.",
  },
};

function Lesson({
  emotionState = "ENGAGED",
  onQuestionCorrect,
  score = 0,
  correctCount = 0,
  onToggleView,
}) {
  const [subject, setSubject] = useState("math");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [attemptsOnQuestion, setAttemptsOnQuestion] = useState(0);
  const [hasAnsweredCorrectlyOnce, setHasAnsweredCorrectlyOnce] =
    useState(false);

  const questions = useMemo(() => QUESTION_BANK[subject] || [], [subject]);
  const currentQuestion = questions[currentIndex] || {};

  const choices =
    currentQuestion.options ||
    currentQuestion.choices ||
    currentQuestion.answers ||
    [];

  const correctAnswer =
    currentQuestion.answer ??
    currentQuestion.correctAnswer ??
    currentQuestion.solution;

  // any emotion coming from WebcamEmotion that we don't have copy for
  // falls back to NEUTRAL
  const emotionKey = EMOTION_COPY[emotionState] ? emotionState : "NEUTRAL";
  const emotionConfig = EMOTION_COPY[emotionKey];

  // 🔁 React to emotion from webcam
  useEffect(() => {
    if (emotionKey === "FRUSTRATED") {
      setShowHint(true);
      if (!feedback) {
        setFeedback("It seems a bit frustrating. Here's a hint to help 💛");
      }
    }

    if (emotionKey === "CONFUSED") {
      setShowHint(true);
      setShowExplanation(true);
      if (!feedback) {
        setFeedback(
          "This one looks confusing. Let's slow down and walk through it together."
        );
      }
    }

    if (emotionKey === "DISENGAGED") {
      if (!feedback) {
        setFeedback(
          "Looks like your attention drifted for a moment. Try this one, or tap Skip / Next for a fresh question."
        );
      }
    }

    if (emotionKey === "BORED" && attemptsOnQuestion === 0) {
      setFeedback(
        "Want to try a more challenging one? You can switch subjects anytime."
      );
    }
  }, [emotionKey, attemptsOnQuestion, feedback]);

  // reset when subject changes
  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswer("");
    setFeedback("");
    setIsCorrect(null);
    setIsFinished(false);
    setShowHint(false);
    setShowExplanation(false);
    setStreak(0);
    setAttemptsOnQuestion(0);
    setHasAnsweredCorrectlyOnce(false);
  }, [subject]);

  // reset when question changes
  useEffect(() => {
    setUserAnswer("");
    setFeedback("");
    setIsCorrect(null);
    setShowHint(false);
    setShowExplanation(false);
    setAttemptsOnQuestion(0);
    setHasAnsweredCorrectlyOnce(false);
  }, [currentIndex]);

  if (!questions.length) {
    return (
      <div className="lesson-container">
        <div className="lesson-card">
          <h2 className="lesson-title">No questions found</h2>
          <p className="lesson-text">
            It looks like the question bank for this subject is empty. Make sure{" "}
            <code>mathQuestions</code>, <code>scienceQuestions</code>, and{" "}
            <code>englishQuestions</code> are exported correctly.
          </p>
        </div>
      </div>
    );
  }

  const totalQuestions = questions.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const normalize = (val) =>
    String(val).trim().toLowerCase().replace(/\s+/g, " ");

  const checkAnswer = (answer) => {
    if (correctAnswer == null) {
      setFeedback("Answer recorded. This question has no auto-check key.");
      setIsCorrect(null);
      return;
    }

    const submitted = normalize(answer);
    const correctNorm = Array.isArray(correctAnswer)
      ? correctAnswer.map(normalize)
      : [normalize(correctAnswer)];

    const correct = correctNorm.includes(submitted);

    setIsCorrect(correct);
    setAttemptsOnQuestion((prev) => prev + 1);

    if (correct) {
      setFeedback(currentQuestion.positiveFeedback || "Nice job! 🎉");
      setStreak((prev) => prev + 1);

      if (!hasAnsweredCorrectlyOnce && typeof onQuestionCorrect === "function") {
        onQuestionCorrect({
          subject,
          index: currentIndex,
          question: currentQuestion,
        });
        setHasAnsweredCorrectlyOnce(true);
      }
    } else {
      setFeedback(
        currentQuestion.negativeFeedback ||
          "Not quite yet. Try thinking about it a different way."
      );
      setStreak(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      setFeedback("Try entering an answer first 🙂");
      return;
    }
    checkAnswer(userAnswer);
  };

  const handleChoiceClick = (choice) => {
    setUserAnswer(choice);
    checkAnswer(choice);
  };

  const goToNextQuestion = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const restartSubject = () => {
    setCurrentIndex(0);
    setIsFinished(false);
    setUserAnswer("");
    setFeedback("");
    setIsCorrect(null);
    setShowHint(false);
    setShowExplanation(false);
    setStreak(0);
    setAttemptsOnQuestion(0);
    setHasAnsweredCorrectlyOnce(false);
  };

  const handleShowHint = () => {
    setShowHint(true);
    if (!feedback) {
      setFeedback("Here's a hint to help you move forward 🧩");
    }
  };

  const emotionClass = `lesson-emotion-banner lesson-emotion-${emotionKey.toLowerCase()}`;

  return (
    <div className="lesson-wrapper">
      {/* top bar: NEUROLEARN + Parental insights + emotion */}
      <div className="lesson-header-row">
        <div className="lesson-logo">NEUROLEARN</div>

        <div className="lesson-header-right">
          {onToggleView && (
            <button
              type="button"
              className="header-toggle"
              onClick={onToggleView}
            >
              Parental insights
            </button>
          )}

          {/* compact badge version of the emotion indicator */}
          <div className="lesson-emotion-badge">
          </div>
        </div>
      </div>

      <div className="lesson-container">
        <section className={emotionClass}>
          <div className="lesson-emotion-content">
            <h3 className="lesson-emotion-title">{emotionConfig.title}</h3>
            <p className="lesson-emotion-helper">{emotionConfig.helper}</p>
          </div>
        </section>

        <section className="lesson-top-row">
          <div className="lesson-subject-switcher">
            {Object.keys(QUESTION_BANK).map((key) => (
              <button
                key={key}
                className={`subject-pill subject-pill-${key} ${
                  key === subject
                    ? `subject-pill-active subject-pill-active-${key}`
                    : ""
                }`}
                onClick={() => setSubject(key)}
              >
                {SUBJECT_LABEL[key] || key}
              </button>
            ))}
          </div>

          <div className="lesson-score-panel">
            <div className="lesson-score-item">
              <span className="label">Score</span>
              <span className="value">{score}</span>
            </div>
            <div className="lesson-score-item">
              <span className="label">Correct</span>
              <span className="value">
                {correctCount}/{totalQuestions}
              </span>
            </div>
            <div className="lesson-score-item">
              <span className="label">Streak</span>
              <span className="value">{streak}</span>
            </div>
          </div>
        </section>

        <section className="lesson-progress">
          <div className="lesson-progress-label">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
          <div className="lesson-progress-bar">
            <div
              className="lesson-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </section>

        <div className="lesson-grid">
          <section className="lesson-card">
            {isFinished ? (
              <div className="lesson-finished">
                <h2 className="lesson-title">
                  Great work on {SUBJECT_LABEL[subject]} 🎓
                </h2>
                <p className="lesson-text">
                  You answered <strong>{correctCount}</strong> out of{" "}
                  <strong>{totalQuestions}</strong> questions correctly.
                </p>
                <p className="lesson-text subtle">
                  You can restart this subject or try another one when you are
                  ready.
                </p>
                <div className="lesson-finished-actions">
                  <button
                    className="lesson-button primary"
                    onClick={restartSubject}
                  >
                    Restart {SUBJECT_LABEL[subject]}
                  </button>
                  <button
                    className="lesson-button ghost"
                    onClick={() => setSubject("math")}
                  >
                    Switch Subject
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="lesson-title">
                  {currentQuestion.title ||
                    currentQuestion.question ||
                    "Question"}
                </h2>
                {currentQuestion.prompt && (
                  <p className="lesson-text">{currentQuestion.prompt}</p>
                )}

                {choices && choices.length > 0 ? (
                  <div className="lesson-choices">
                    {choices.map((choice, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`choice-chip ${
                          normalize(userAnswer) === normalize(choice)
                            ? "choice-chip-selected"
                            : ""
                        }`}
                        onClick={() => handleChoiceClick(choice)}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                ) : (
                  <form className="lesson-form" onSubmit={handleSubmit}>
                    <label className="lesson-label" htmlFor="answer-input">
                      Your answer
                    </label>
                    <input
                      id="answer-input"
                      type="text"
                      className="lesson-input"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here"
                    />
                    <button className="lesson-button primary" type="submit">
                      Check answer
                    </button>
                  </form>
                )}

                <div className="lesson-actions-row">
                  <button
                    type="button"
                    className="lesson-button secondary"
                    onClick={handleShowHint}
                  >
                    Need a hint?
                  </button>
                  <button
                    type="button"
                    className="lesson-button ghost"
                    onClick={goToNextQuestion}
                  >
                    Skip / Next
                  </button>
                </div>

                {showHint && currentQuestion.hint && (
                  <div className="lesson-hint-card">
                    <span className="hint-label">Hint</span>
                    <p className="hint-text">{currentQuestion.hint}</p>
                  </div>
                )}

                {showExplanation && (
                  <div className="lesson-hint-card lesson-explanation-card">
                    <span className="hint-label">Step-by-step help</span>
                    <p className="hint-text">
                      {currentQuestion.explanation ||
                        "Let's break this down: think about what each number means and do one small step at a time."}
                    </p>
                  </div>
                )}

                {feedback && (
                  <div
                    className={`lesson-feedback ${
                      isCorrect === true
                        ? "lesson-feedback-correct"
                        : isCorrect === false
                        ? "lesson-feedback-incorrect"
                        : "lesson-feedback-neutral"
                    }`}
                  >
                    {feedback}
                  </div>
                )}
              </>
            )}
          </section>

          <aside className="lesson-side-panel">
            <h3 className="lesson-side-title">Today’s learning snapshot</h3>
            <ul className="lesson-stats-list">
              <li>
                <span className="label">Emotion</span>
                <span className="value-badge">{emotionKey}</span>
              </li>
              <li>
                <span className="label">Attempts on this question</span>
                <span className="value">{attemptsOnQuestion}</span>
              </li>
              <li>
                <span className="label">Subject</span>
                <span className="value">{SUBJECT_LABEL[subject]}</span>
              </li>
            </ul>
            <p className="lesson-side-note">
              This space can be used later to show trends from the facial
              recognition model — like when the learner is most engaged or when
              to offer breaks.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Lesson;