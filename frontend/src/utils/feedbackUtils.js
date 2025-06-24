const feedback = {
  excellent: {
    captions: [
      "You scored {score}%! The AI thinks you might be the next Einstein.",
      "A perfect score of {score}%! Are you secretly a supercomputer?",
      "{score}%! You're on fire! 🔥",
      "Wow, {score}%! You've officially mastered this topic."
    ],
    memes: [
      '/memes/excellent_1.jpg', // Galaxy Brain
      '/memes/excellent_2.jpg', // Salt Bae
      '/memes/excellent_3.jpg'  // Drake Hotline Bling
    ]
  },
  good: {
    captions: [
      "{score}% is a great score! Keep it up!",
      "Nice work! You got {score}% correct.",
      "You're doing great with {score}%! Almost at the top!",
      "A solid {score}%! You really know your stuff."
    ],
    memes: [
      '/memes/good_1.png', // Success Kid
      '/memes/good_2.jpg', // Not Bad Obama
      '/memes/good_3.png'  // Drakeposting
    ]
  },
  average: {
    captions: [
      "You got {score}%. Not bad, but there's room to improve!",
      "{score}%... A valiant effort! Let's try again.",
      "You're halfway there with {score}%! Keep practicing.",
      "An average score of {score}%. You've got this, let's aim higher next time!"
    ],
    memes: [
      '/memes/average_1.jpg', // Confused Nick Young
      '/memes/average_2.gif', // I have no idea what I'm doing
      '/memes/average_3.jpg'  // "I tried" star
    ]
  },
  needsWork: {
    captions: [
      "Oof, {score}%. Don't worry, practice makes perfect!",
      "Well, that's a start! You scored {score}%.",
      "It's fine, I'm fine, everything is fine. You scored {score}%.",
      "Don't give up! You got {score}%. Let's review and try again."
    ],
    memes: [
      '/memes/needsWork_1.jpeg', // This is fine dog
      '/memes/needsWork_2.jpg', // Sad Keanu
      '/memes/needsWork_3.jpg'  // Hide the pain Harold
    ]
  }
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getFeedbackForScore = (percentage) => {
  let category;
  if (percentage >= 90) {
    category = 'excellent';
  } else if (percentage >= 70) {
    category = 'good';
  } else if (percentage >= 50) {
    category = 'average';
  } else {
    category = 'needsWork';
  }

  const feedbackCategory = feedback[category];
  const captionTemplate = getRandomItem(feedbackCategory.captions);
  const caption = captionTemplate.replace('{score}', percentage);
  const meme = getRandomItem(feedbackCategory.memes);

  return { caption, meme };
};
