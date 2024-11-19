import React, { useState, useEffect } from 'react';

const CATEGORIES = {
  ANIMALS: ['dog', 'bird', 'fish', 'cat', 'rabbit', 'köpek', 'kuş', 'balık', 'kedi', 'tavşan'],
  NATURE: ['sun', 'moon', 'tree', 'snow', 'cloud', 'güneş', 'ay', 'ağaç', 'kar', 'bulut'],
  HOUSEHOLD: ['house', 'table', 'chair', 'door', 'window', 'ev', 'masa', 'sandalye', 'kapı', 'pencere'],
  PERSONAL_ITEMS: ['glasses', 'bag', 'phone', 'watch', 'gözlük', 'çanta', 'telefon', 'saat'],
  CLOTHING: ['shoe', 'shirt', 'hat', 'glove', 'ayakkabı', 'gömlek', 'şapka', 'eldiven'],
  FOOD: ['bread', 'water', 'apple', 'tea', 'ekmek', 'su', 'elma', 'çay'],
  TRANSPORTATION: ['car', 'bus', 'train', 'bike', 'araba', 'otobüs', 'tren', 'bisiklet'],
  TIME: ['day', 'night', 'morning', 'evening', 'gün', 'gece', 'sabah', 'akşam']
};

const TestHistory = ({ history }) => {
  const [openMenu, setOpenMenu] = useState(null);

  // Function to get category for a word
  const getWordCategory = (word) => {
    const lowerWord = word.toLowerCase();
    for (const [category, words] of Object.entries(CATEGORIES)) {
      if (words.some(w => lowerWord.includes(w.toLowerCase()))) {
        return category;
      }
    }
    return 'UNKNOWN';
  };

  // Function to analyze categories
  const analyzeCategories = (test) => {
    const categoryStats = {};
    
    test.questions.forEach(question => {
      const category = getWordCategory(question.correctAnswer);
      if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, correct: 0 };
      }
      categoryStats[category].total++;
      if (question.isCorrect) {
        categoryStats[category].correct++;
      }
    });

    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      total: stats.total,
      correct: stats.correct,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));
  };

  // Add this helper function to get wrong words for a category
  const getWrongWordsForCategory = (questions, category) => {
    return questions
      .filter(q => !q.isCorrect && getWordCategory(q.correctAnswer) === category)
      .map(q => {
        // Extract Turkish and English words
        if (q.question.includes('Turkish word for')) {
          return {
            turkish: q.correctAnswer,
            english: q.question.match(/["']([^"']+)["']/)[1]
          };
        } else {
          return {
            turkish: q.question.match(/["']([^"']+)["']/)[1],
            english: q.correctAnswer
          };
        }
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.category-menu')) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="history-container">
      {history.map((test, testIndex) => (
        <div key={testIndex} className="history-item">
          <div className="history-header">
            <div className="history-date">{test.date}</div>
            <div className="history-score">
              Score: {test.score}/{test.totalQuestions} ({test.percentage}%)
            </div>
          </div>

          {/* Wrong Answers Section */}
          <div className="wrong-answers-section">
            <h3>Incorrect Answers:</h3>
            {test.questions
              .filter(q => !q.isCorrect)
              .map((q, index) => (
                <div key={index} className="wrong-answer-item">
                  <p><strong>Question:</strong> {q.question}</p>
                  <p><strong>Your answer:</strong> {q.userAnswer}</p>
                  <p><strong>Correct answer:</strong> {q.correctAnswer}</p>
                </div>
              ))}
          </div>

          {/* Areas for Improvement Section */}
          <div className="category-analysis">
            <h3>Areas for Improvement:</h3>
            <div className="category-list">
              {analyzeCategories(test).map((category, index) => (
                <div key={index} className="category-item">
                  <div className="category-name">
                    {category.category.replace(/_/g, ' ')}
                  </div>
                  <div className="category-stats">
                    <div className="category-bar">
                      <div 
                        className="category-progress"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span>{category.correct}/{category.total} correct</span>
                    <div className="category-menu">
                      <button 
                        className="menu-dots"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === `${testIndex}-${index}` ? null : `${testIndex}-${index}`);
                        }}
                      >
                        ⋮
                      </button>
                      {openMenu === `${testIndex}-${index}` && (
                        <div className="menu-dropdown">
                          {getWrongWordsForCategory(test.questions, category.category).map((word, wordIndex) => (
                            <div key={wordIndex} className="word-relation">
                              {word.turkish} -- {word.english}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestHistory; 