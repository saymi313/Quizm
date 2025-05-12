import React from 'react';

const QuizQuestion = ({ question, questionIndex, selectedOption, onSelectOption, showResults, isReview }) => {
  const handleOptionSelect = (optionId) => {
    if (!showResults && !isReview) {
      onSelectOption(question._id, optionId);
    }
  };

  const getOptionClass = (option) => {
    let baseClass = 'p-3 border rounded-md mb-2 cursor-pointer transition-colors';
    
    if (showResults || isReview) {
      if (option.isCorrect) {
        return `${baseClass} bg-green-100 border-green-500`;
      } else if (selectedOption === option._id && !option.isCorrect) {
        return `${baseClass} bg-red-100 border-red-500`;
      }
    }
    
    if (selectedOption === option._id) {
      return `${baseClass} bg-indigo-100 border-indigo-500`;
    }
    
    return `${baseClass} hover:bg-gray-100`;
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Question {questionIndex + 1}</h3>
        {question.points > 1 ? (
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
            {question.points} points
          </span>
        ) : (
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
            1 point
          </span>
        )}
      </div>
      
      <p className="text-lg mb-4">{question.question}</p>
      
      <div className="space-y-2">
        {question.options.map((option) => (
          <div
            key={option._id}
            className={getOptionClass(option)}
            onClick={() => handleOptionSelect(option._id)}
          >
            {option.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;