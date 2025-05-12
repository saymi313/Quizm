const calculateScore = (quiz, userAnswers) => {
  let score = 0;
  const answers = [];
  let totalPossibleScore = 0;

  quiz.questions.forEach((question) => {
    totalPossibleScore += question.points;
    
    const userAnswer = userAnswers.find(
      (answer) => answer.questionId.toString() === question._id.toString()
    );
    
    if (!userAnswer || !userAnswer.selectedOption) {
      // User didn't answer this question
      answers.push({
        questionId: question._id,
        isCorrect: false,
      });
      return;
    }

    const selectedOption = question.options.find(
      (option) => option._id.toString() === userAnswer.selectedOption.toString()
    );

    if (selectedOption && selectedOption.isCorrect) {
      score += question.points;
      answers.push({
        questionId: question._id,
        selectedOption: userAnswer.selectedOption,
        isCorrect: true,
      });
    } else {
      answers.push({
        questionId: question._id,
        selectedOption: userAnswer.selectedOption,
        isCorrect: false,
      });
    }
  });

  return {
    score,
    totalPossibleScore,
    answers,
  };
};

export default calculateScore;