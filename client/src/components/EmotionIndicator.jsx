import React from "react";

function EmotionIndicator({ emotionState }) {
  const messages = {
    ENGAGED: "You look focused. Let's keep going at this pace 💪",
    CONFUSED: "This looks a little tricky. We can slow down and add more help 🧩",
    FRUSTRATED:
      "It seems a bit overwhelming. It's okay to pause or ask for a hint 💛",
  };

  const friendlyLabel = {
    ENGAGED: "Focused",
    CONFUSED: "A bit unsure",
    FRUSTRATED: "Feeling stuck",
  };

  const message = messages[emotionState] || messages.ENGAGED;
  const label = friendlyLabel[emotionState] || friendlyLabel.ENGAGED;

  return (
    <div className={`emotion-indicator emotion-${emotionState.toLowerCase()}`}>
      <h3>How you might be feeling:</h3>
      <p className="emotion-label">{label}</p>
      <p className="emotion-message">{message}</p>
    </div>
  );
}

export default EmotionIndicator;
