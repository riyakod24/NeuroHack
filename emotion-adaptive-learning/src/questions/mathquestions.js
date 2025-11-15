// src/questions/mathQuestions.js

const mathQuestions = [
  {
    id: 1,
    difficulty: 1,
    question: "What is 2 + 3?",
    options: [3, 4, 5],
    answer: 5,
    hint: "Try counting up from 2: 3, 4, 5.",
    explanation: "2 + 3 = 5 because you count three steps forward starting from 2.",
    videoUrl: "",
  },
  {
    id: 2,
    difficulty: 1,
    question: "What is 7 - 4?",
    options: [1, 3, 5],
    answer: 3,
    hint: "Think: 7, then count backwards 4 steps.",
    explanation:
      "Start at 7. Count backward: 6, 5, 4, 3. That's 4 steps, landing on 3.",
    videoUrl: "",
  },
  {
    id: 3,
    difficulty: 2,
    question: "What is 18 + 6?",
    options: [12, 13, 14],
    answer: 14,
    hint: "Try 8 + 2 first = 10, then add 4.",
    explanation:
      "Break the 6 into 2 and 4. 8 + 2 = 10, then add 4 to get 14.",
    videoUrl: "",
  },
  // Add more...
];

export default mathQuestions;