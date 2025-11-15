import React, { useMemo } from "react";

function Summary({ emotionHistory, correctCount, score }) {
  const counts = useMemo(() => {
    const base = { ENGAGED: 0, CONFUSED: 0, FRUSTRATED: 0 };
    if (!emotionHistory || emotionHistory.length === 0) return base;

    return emotionHistory.reduce((acc, entry) => {
      const key = entry.emotion;
      if (acc[key] !== undefined) {
        acc[key] += 1;
      }
      return acc;
    }, base);
  }, [emotionHistory]);

  const totalEmotions =
    counts.ENGAGED + counts.CONFUSED + counts.FRUSTRATED || 1;

  const engagedPct = Math.round((counts.ENGAGED / totalEmotions) * 100);
  const confusedPct = Math.round((counts.CONFUSED / totalEmotions) * 100);
  const frustratedPct = Math.round((counts.FRUSTRATED / totalEmotions) * 100);

  return (
    <div className="summary-box">
      <h3>Session Summary</h3>
      <p className="summary-highlight">
        You answered <strong>{correctCount}</strong>{" "}
        {correctCount === 1 ? "question" : "questions"} today.
      </p>
      <p className="summary-subtext">
        Points earned: <strong>{score}</strong> pts
      </p>

      <div className="summary-emotions">
        <p>How you seemed to feel:</p>
        <ul>
          <li>Engaged: {engagedPct}% of the time</li>
          <li>Confused: {confusedPct}% of the time</li>
          <li>Frustrated: {frustratedPct}% of the time</li>
        </ul>
      </div>

      <p className="summary-message">
        Even when things felt confusing or frustrating, you kept going. That is
        real learning. 💛
      </p>
    </div>
  );
}

export default Summary;
