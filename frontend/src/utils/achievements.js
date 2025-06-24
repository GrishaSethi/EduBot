export const achievements = {
  FIRST_QUIZ: {
    id: 'FIRST_QUIZ',
    name: 'Quiz Novice 🥳',
    description: 'Completed your very first quiz!',
  },
  NO_HINTS: {
    id: 'NO_HINTS',
    name: 'Sharp Mind 🎯',
    description: 'Finished a quiz without using any hints.',
  },
  PERFECT_SCORE: {
    id: 'PERFECT_SCORE',
    name: 'Perfectionist 🔥',
    description: 'Achieved a perfect score on a quiz.',
  },
};

export const getUnlockedAchievements = () => {
  try {
    const unlocked = localStorage.getItem('unlockedAchievements');
    return unlocked ? JSON.parse(unlocked) : {};
  } catch (error) {
    console.error('Failed to parse achievements from localStorage', error);
    return {};
  }
};

export const unlockAchievement = (achievementId) => {
  const unlocked = getUnlockedAchievements();
  if (!unlocked[achievementId]) {
    const newUnlocked = { ...unlocked, [achievementId]: true };
    localStorage.setItem('unlockedAchievements', JSON.stringify(newUnlocked));
    return true; // Returns true if it's a new unlock
  }
  return false;
};
