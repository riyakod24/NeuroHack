// src/components/EmotionIndicator.jsx

function EmotionIndicator({ emotionState }) {
  const labelMap = {
    FOCUSED: "Focused",
    ENGAGED: "Engaged",
    CONFUSED: "Confused",
    FRUSTRATED: "Frustrated",
  };

  const messageMap = {
    FOCUSED: "You look calm and focused. Let's keep going at this pace. 🌱",
    ENGAGED: "You seem engaged and happy! Great job, let's gently level up. ⭐",
    CONFUSED:
      "This might feel a bit tricky. We can slow down and try a hint together. 🧩",
    FRUSTRATED:
      "This looks frustrating. It's okay to pause, breathe, or get extra help. 💛",
  };

  const emojiMap = {
    FOCUSED: "🧘‍♀️",
    ENGAGED: "😄",
    CONFUSED: "🤔",
    FRUSTRATED: "😣",
  };

  const label = labelMap[emotionState] || "Focused";
  const message = messageMap[emotionState] || messageMap.FOCUSED;
  const emoji = emojiMap[emotionState] || emojiMap.FOCUSED;

  return (
    <div className="emotion-indicator">
      <h3 className="emotion-title">How you might be feeling:</h3>
      <div className="emotion-main-row">
        <span className="emotion-emoji">{emoji}</span>
        <span className="emotion-label">{label}</span>
      </div>
      <p className="emotion-message">{message}</p>
    </div>
  );
}

export default EmotionIndicator;