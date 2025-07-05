import React from 'react';
import { achievements, getUnlockedAchievements } from '../utils/achievements';

const Achievements = ({ newUnlocks = [] }) => {
  const unlockedAchievements = getUnlockedAchievements();
  const unlockedIds = Object.keys(unlockedAchievements);

  if (unlockedIds.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-3xl shadow-2xl border border-yellow-100">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2">Achievements Unlocked!</h3>
        <p className="text-gray-600">Great job! Keep learning and earning more badges! 🎉</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(achievements).map(ach => {
          if (unlockedAchievements[ach.id]) {
            const isNew = newUnlocks.includes(ach.id);
            return (
              <div 
                key={ach.id} 
                className={`p-6 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 ${
                  isNew 
                    ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400 shadow-xl scale-105 animate-pulse' 
                    : 'bg-white/80 border-yellow-200 hover:border-yellow-300 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isNew ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-yellow-300 to-orange-400'
                  }`}>
                    🏅
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-900 mb-2">{ach.name}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{ach.description}</p>
                    {isNew && (
                      <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                        ✨ New!
                      </div>
                    )}
                  </div>
                </div>
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
