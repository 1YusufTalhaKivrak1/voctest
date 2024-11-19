import React, { useState, useEffect } from 'react';
import './App.css';
import TestHistory from './components/TestHistory';

const questionBank = [
  { turkish: 'kar', english: 'snow', turkishDistractors: ['yağmur', 'rüzgar', 'bulut'], englishDistractors: ['rain', 'wind', 'cloud'] },
  { turkish: 'güneş', english: 'sun', turkishDistractors: ['ay', 'yıldız', 'gezegen'], englishDistractors: ['moon', 'star', 'planet'] },
  { turkish: 'kitap', english: 'book', turkishDistractors: ['kalem', 'kağıt', 'masa'], englishDistractors: ['pen', 'paper', 'desk'] },
  { turkish: 'ev', english: 'house', turkishDistractors: ['araba', 'yol', 'bahçe'], englishDistractors: ['car', 'road', 'garden'] },
  { turkish: 'ağaç', english: 'tree', turkishDistractors: ['çiçek', 'çimen', 'yaprak'], englishDistractors: ['flower', 'grass', 'leaf'] },
  { turkish: 'deniz', english: 'sea', turkishDistractors: ['göl', 'nehir', 'okyanus'], englishDistractors: ['lake', 'river', 'ocean'] },
  { turkish: 'ekmek', english: 'bread', turkishDistractors: ['su', 'süt', 'çay'], englishDistractors: ['water', 'milk', 'tea'] },
  { turkish: 'köpek', english: 'dog', turkishDistractors: ['kedi', 'kuş', 'balık'], englishDistractors: ['cat', 'bird', 'fish'] },
  { turkish: 'ay', english: 'moon', turkishDistractors: ['güneş', 'yıldız', 'bulut'], englishDistractors: ['sun', 'star', 'cloud'] },
  { turkish: 'araba', english: 'car', turkishDistractors: ['otobüs', 'tren', 'bisiklet'], englishDistractors: ['bus', 'train', 'bike'] },
  { turkish: 'kuş', english: 'bird', turkishDistractors: ['kedi', 'köpek', 'tavşan'], englishDistractors: ['cat', 'dog', 'rabbit'] },
  { turkish: 'su', english: 'water', turkishDistractors: ['çay', 'kahve', 'meyve suyu'], englishDistractors: ['tea', 'coffee', 'juice'] },
  { turkish: 'çiçek', english: 'flower', turkishDistractors: ['ağaç', 'çimen', 'yaprak'], englishDistractors: ['tree', 'grass', 'leaf'] },
  { turkish: 'masa', english: 'table', turkishDistractors: ['sandalye', 'koltuk', 'yatak'], englishDistractors: ['chair', 'sofa', 'bed'] },
  { turkish: 'kalem', english: 'pen', turkishDistractors: ['kurşun kalem', 'kitap', 'kağıt'], englishDistractors: ['pencil', 'book', 'paper'] },
  { turkish: 'gözlük', english: 'glasses', turkishDistractors: ['saat', 'şapka', 'ayakkabı'], englishDistractors: ['watch', 'hat', 'shoe'] },
  { turkish: 'telefon', english: 'phone', turkishDistractors: ['bilgisayar', 'tablet', 'radyo'], englishDistractors: ['computer', 'tablet', 'radio'] },
  { turkish: 'kapı', english: 'door', turkishDistractors: ['pencere', 'duvar', 'zemin'], englishDistractors: ['window', 'wall', 'floor'] },
  { turkish: 'pencere', english: 'window', turkishDistractors: ['kapı', 'duvar', 'çatı'], englishDistractors: ['door', 'wall', 'roof'] },
  { turkish: 'sandalye', english: 'chair', turkishDistractors: ['masa', 'koltuk', 'yatak'], englishDistractors: ['table', 'sofa', 'bed'] },
  { turkish: 'elma', english: 'apple', turkishDistractors: ['muz', 'portakal', 'armut'], englishDistractors: ['banana', 'orange', 'pear'] },
  { turkish: 'çanta', english: 'bag', turkishDistractors: ['kutu', 'sepet', 'cüzdan'], englishDistractors: ['box', 'basket', 'wallet'] },
  { turkish: 'ayakkabı', english: 'shoe', turkishDistractors: ['çorap', 'şapka', 'eldiven'], englishDistractors: ['sock', 'hat', 'glove'] },
  { turkish: 'gömlek', english: 'shirt', turkishDistractors: ['pantolon', 'ceket', 'elbise'], englishDistractors: ['pants', 'jacket', 'dress'] },
  { turkish: 'saat', english: 'clock', turkishDistractors: ['kol saati', 'takvim', 'telefon'], englishDistractors: ['watch', 'calendar', 'phone'] }
];

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(5).fill(''));
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [score, setScore] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [questionResults, setQuestionResults] = useState([]);
  const [activeTab, setActiveTab] = useState('test');
  const [testHistory, setTestHistory] = useState(() => {
    const savedHistory = localStorage.getItem('testHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 5).map(q => {
      const isEnglishQuestion = Math.random() > 0.5;
      const choices = isEnglishQuestion ? 
        [...q.turkishDistractors] : 
        [...q.englishDistractors];
      const correctAnswer = isEnglishQuestion ? q.turkish : q.english;
      choices.push(correctAnswer);
      
      return {
        question: isEnglishQuestion ? 
          `What is the Turkish word for "${q.english}"?` :
          `What is the English word for "${q.turkish}"?`,
        choices: choices.sort(() => 0.5 - Math.random()),
        correctAnswer
      };
    });
    setQuestions(selectedQuestions);
  }, []);

  useEffect(() => {
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
  }, [testHistory]);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(curr => curr - 1);
      setShowResult(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = answer;
    setUserAnswers(newUserAnswers);
  };

  const checkAnswer = () => {
    if (!answeredQuestions.has(currentQuestion)) {
      const isCorrect = userAnswers[currentQuestion] === questions[currentQuestion].correctAnswer;
      
      const newQuestionResult = {
        question: questions[currentQuestion].question,
        userAnswer: userAnswers[currentQuestion],
        correctAnswer: questions[currentQuestion].correctAnswer,
        isCorrect
      };

      setQuestionResults(prev => [...prev, newQuestionResult]);
      
      setShowResult(true);
      const newAnsweredQuestions = new Set(answeredQuestions);
      newAnsweredQuestions.add(currentQuestion);
      setAnsweredQuestions(newAnsweredQuestions);
      
      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      }

      if (newAnsweredQuestions.size === questions.length) {
        setTimeout(() => {
          const finalQuestionResults = [...questionResults, newQuestionResult];
          const finalScore = finalQuestionResults.filter(q => q.isCorrect).length;
          
          const testResult = {
            score: finalScore,
            totalQuestions: questions.length,
            questions: finalQuestionResults,
            date: new Date().toLocaleString(),
            percentage: Math.round((finalScore/questions.length) * 100)
          };

          setTestHistory(prev => [testResult, ...prev]);
          setIsTestComplete(true);
        }, 0);
      }
    }
  };

  const saveTestResults = () => {
    console.log('Saving test results:', {
      questions: questionResults,
      totalQuestions: questions.length,
      score
    });
    
    const testResult = {
      score,
      totalQuestions: questions.length,
      questions: questionResults,
      date: new Date().toLocaleString(),
      percentage: Math.round((score/questions.length) * 100)
    };
    
    setTestHistory(prev => {
      console.log('Previous history:', prev);
      console.log('New test result:', testResult);
      return [testResult, ...prev];
    });
    setIsTestComplete(true);
  };

  const resetTest = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setUserAnswers(Array(5).fill(''));
    setShowResult(false);
    setAnsweredQuestions(new Set());
    setScore(0);
    setIsTestComplete(false);
    setQuestionResults([]);
    setActiveTab('test');
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 5).map(q => {
      const isEnglishQuestion = Math.random() > 0.5;
      const choices = isEnglishQuestion ? 
        [...q.turkishDistractors] : 
        [...q.englishDistractors];
      const correctAnswer = isEnglishQuestion ? q.turkish : q.english;
      choices.push(correctAnswer);
      
      return {
        question: isEnglishQuestion ? 
          `What is the Turkish word for "${q.english}"?` :
          `What is the English word for "${q.turkish}"?`,
        choices: choices.sort(() => 0.5 - Math.random()),
        correctAnswer
      };
    });
    setQuestions(selectedQuestions);
  };

  const getStudyAdvice = () => {
    const incorrectCategories = questionResults
      .filter(result => !result.isCorrect)
      .map(result => {
        if (result.question.includes('Turkish')) {
          return 'Turkish vocabulary';
        } else {
          return 'English vocabulary';
        }
      });
    
    const uniqueCategories = [...new Set(incorrectCategories)];
    
    if (score === questions.length) {
      return "Excellent work! You've mastered these vocabulary words!";
    } else if (score >= questions.length * 0.7) {
      return `Good job! To improve, focus on reviewing ${uniqueCategories.join(' and ')}.`;
    } else {
      return `Keep practicing! Focus on ${uniqueCategories.join(' and ')}. Try making flashcards for the words you missed.`;
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all test history?')) {
      setTestHistory([]);
      localStorage.removeItem('testHistory');
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <div className="App">
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'test' ? 'active' : ''}`}
          onClick={() => setActiveTab('test')}
        >
          Test
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Previous Results
        </button>
      </div>

      {activeTab === 'test' ? (
        <div className="quiz-container">
          {isTestComplete ? (
            <div className="question-card results-card">
              <h2>Test Complete!</h2>
              <div className="final-score">
                Final Score: {score}/{questions.length} ({Math.round(score/questions.length * 100)}%)
              </div>
              
              <div className="results-summary">
                <h3>Question Summary:</h3>
                {questionResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <p><strong>Question {index + 1}:</strong> {result.question}</p>
                    <p>Your answer: {result.userAnswer}</p>
                    {!result.isCorrect && (
                      <p>Correct answer: {result.correctAnswer}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="study-advice">
                <h3>Study Advice:</h3>
                <p>{getStudyAdvice()}</p>
              </div>

              <button 
                onClick={resetTest} 
                className="retry-button"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="question-card">
              <div className="score-display">
                {score}/{questions.length}
              </div>
              <h2>Question {currentQuestion + 1} of {questions.length}</h2>
              <p>{questions[currentQuestion].question}</p>
              
              <div className="options">
                {questions[currentQuestion].choices.map((choice, index) => (
                  <label 
                    key={index} 
                    className={`option ${answeredQuestions.has(currentQuestion) ? 'disabled' : ''}`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={choice}
                      checked={userAnswers[currentQuestion] === choice}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                      disabled={answeredQuestions.has(currentQuestion)}
                    />
                    {choice}
                  </label>
                ))}
              </div>

              {showResult && answeredQuestions.has(currentQuestion) && (
                <div className={`result ${userAnswers[currentQuestion] === questions[currentQuestion].correctAnswer ? 'correct' : 'incorrect'}`}>
                  {userAnswers[currentQuestion] === questions[currentQuestion].correctAnswer ? 
                    'Correct!' : 
                    `Incorrect. The correct answer is: ${questions[currentQuestion].correctAnswer}`}
                </div>
              )}

              <div className="button-container">
                <button onClick={handlePrevious} disabled={currentQuestion === 0}>
                  Previous
                </button>
                {!answeredQuestions.has(currentQuestion) && (
                  <button onClick={checkAnswer}>Check Answer</button>
                )}
                <button onClick={handleNext} disabled={currentQuestion === questions.length - 1}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="quiz-container">
          {testHistory.length > 0 && (
            <button 
              onClick={clearHistory}
              className="clear-history-button"
            >
              Clear History
            </button>
          )}
          <TestHistory history={testHistory} />
        </div>
      )}
    </div>
  );
}

export default App;
