const PERFORMANCE_KEY = 'quizPerformance';

// Load performance data from localStorage
const loadPerformanceData = () => {
  try {
    const data = localStorage.getItem(PERFORMANCE_KEY);
    return data ? JSON.parse(data) : { incorrectTopics: [] };
  } catch (error) {
    console.error('Failed to load performance data:', error);
    return { incorrectTopics: [] };
  }
};

// Save performance data to localStorage
const savePerformanceData = (data) => {
  try {
    localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save performance data:', error);
  }
};

// Record an incorrect answer for a specific topic
export const recordIncorrectAnswer = (topic) => {
  if (!topic) return;
  const data = loadPerformanceData();
  data.incorrectTopics.push(topic);
  savePerformanceData(data);
};

// Get a topic suggestion based on weak performance
export const getTopicSuggestion = () => {
  const data = loadPerformanceData();
  const { incorrectTopics } = data;

  if (incorrectTopics.length === 0) {
    return null; // No data to base a suggestion on
  }

  // Count frequency of each topic
  const topicCounts = incorrectTopics.reduce((acc, topic) => {
    acc[topic] = (acc[topic] || 0) + 1;
    return acc;
  }, {});

  // Find the topic with the highest count
  const suggestion = Object.keys(topicCounts).reduce((a, b) => 
    topicCounts[a] > topicCounts[b] ? a : b
  );

  return suggestion;
};

// Optional: Function to clear performance data
export const clearPerformanceData = () => {
  localStorage.removeItem(PERFORMANCE_KEY);
};
