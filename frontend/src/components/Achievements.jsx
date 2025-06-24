import React from 'react';
import { achievements, getUnlockedAchievements } from '../utils/achievements';

const Achievements = ({ newUnlocks = [] }) => {
  const unlockedAchievements = getUnlockedAchievements();
  const unlockedIds = Object.keys(unlockedAchievements);

  if (unlockedIds.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 bg-white/80 p-6 rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">🏆 Achievements Unlocked</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(achievements).map(ach => {
          if (unlockedAchievements[ach.id]) {
            const isNew = newUnlocks.includes(ach.id);
            return (
              <div 
                key={ach.id} 
                className={`p-4 rounded-lg border-2 transition-all duration-500 ${isNew ? 'bg-yellow-100 border-yellow-400 scale-105' : 'bg-gray-100 border-gray-300'}`}
              >
                <p className="font-bold text-lg text-gray-900">{ach.name}</p>
                <p className="text-gray-600">{ach.description}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Achievements;
