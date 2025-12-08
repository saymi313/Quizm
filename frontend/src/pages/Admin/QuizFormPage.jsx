import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  PlusCircle, 
  Trash, 
  ArrowLeft, 
  Check, 
  X, 
  AlertCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import quizService from '../../services/quizService';
import uploadService from '../../services/uploadService';

const QuizFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchQuiz = async () => {
        try {
          const quiz = await quizService.getQuizById(id);
          setTitle(quiz.title);
          setDescription(quiz.description);
          setTimeLimit(quiz.timeLimit);
          setQuestions(quiz.questions);
          setIsPublished(quiz.isPublished);
          setImageUrl(quiz.imageUrl || '');
          setLoading(false);
        } catch (error) {
          setError('Failed to load quiz. Please try again later.');
          setLoading(false);
        }
      };

      fetchQuiz();
    }
  }, [id, isEditMode]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        _id: `temp_${Date.now()}`,
        question: '',
        options: [
          { _id: `temp_option_1_${Date.now()}`, text: '', isCorrect: false },
          { _id: `temp_option_2_${Date.now()}`, text: '', isCorrect: false },
        ],
        points: 1,
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      _id: `temp_option_${Date.now()}`,
      text: '',
      isCorrect: false,
    });
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const setCorrectOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    // Reset all options to incorrect
    updatedQuestions[questionIndex].options.forEach((option, idx) => {
      option.isCorrect = idx === optionIndex;
    });
    setQuestions(updatedQuestions);
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Quiz title is required');
      return false;
    }
    
    if (!description.trim()) {
      setError('Quiz description is required');
      return false;
    }
    
    if (timeLimit <= 0) {
      setError('Time limit must be greater than 0');
      return false;
    }
    
    if (questions.length === 0) {
      setError('Quiz must have at least one question');
      return false;
    }
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      if (!question.question.trim()) {
        setError(`Question ${i + 1} text is required`);
        return false;
      }
      
      if (question.options.length < 2) {
        setError(`Question ${i + 1} must have at least 2 options`);
        return false;
      }
      
      const hasCorrectOption = question.options.some(option => option.isCorrect);
      if (!hasCorrectOption) {
        setError(`Question ${i + 1} must have at least one correct option`);
        return false;
      }
      
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].text.trim()) {
          setError(`Option ${j + 1} in Question ${i + 1} text is required`);
          return false;
        }
      }
    }
    
    return true;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const response = await uploadService.uploadImage(file);
      setImageUrl(response.imageUrl);
      setSuccess('Image uploaded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      const quizData = {
        title,
        description,
        timeLimit,
        questions,
        isPublished,
        imageUrl: imageUrl || null,
      };
      
      if (isEditMode) {
        await quizService.updateQuiz(id, quizData);
        setSuccess('Quiz updated successfully!');
      } else {
        const newQuiz = await quizService.createQuiz(quizData);
        setSuccess('Quiz created successfully!');
        
        // Redirect to edit page after a short delay
        setTimeout(() => {
          navigate(`/admin/quiz/edit/${newQuiz._id}`);
        }, 1500);
      }
      
      setSaving(false);
    } catch (error) {
      setError('Failed to save quiz. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
        </h1>
        <button
          onClick={() => navigate('/admin')}
          className="btn btn-secondary flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <Check className="h-5 w-5 mr-2" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>
          
          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-input min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter quiz description"
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label htmlFor="timeLimit" className="form-label">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              id="timeLimit"
              className="form-input"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
              min="1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              Quiz Image (Optional)
            </label>
            <div className="space-y-3">
              {imageUrl && (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Quiz preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Image URL:</p>
                    <p className="text-xs text-gray-500 break-all">{imageUrl}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {uploading ? 'Uploading...' : imageUrl ? 'Change Image' : 'Upload Image'}
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                {uploading && (
                  <span className="text-sm text-gray-600">Uploading image...</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-600"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Publish Quiz</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              {isPublished
                ? 'Quiz is visible to all users'
                : 'Quiz is in draft mode and only visible to admins'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="btn btn-primary flex items-center"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No questions added yet.</p>
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-primary mt-4"
              >
                Add Your First Question
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div
                  key={question._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold">Question {questionIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Question Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(questionIndex, 'question', e.target.value)
                      }
                      placeholder="Enter question text"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Points</label>
                    <input
                      type="number"
                      className="form-input"
                      value={question.points}
                      onChange={(e) =>
                        updateQuestion(questionIndex, 'points', parseInt(e.target.value))
                      }
                      min="1"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="form-label">Options</label>
                      <button
                        type="button"
                        onClick={() => addOption(questionIndex)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add Option
                      </button>
                    </div>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={option._id}
                          className="flex items-center space-x-2"
                        >
                          <button
                            type="button"
                            onClick={() => setCorrectOption(questionIndex, optionIndex)}
                            className={`p-2 rounded-full ${
                              option.isCorrect
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                            title={option.isCorrect ? 'Correct Answer' : 'Mark as Correct'}
                          >
                            {option.isCorrect ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                          <input
                            type="text"
                            className="form-input flex-grow"
                            value={option.text}
                            onChange={(e) =>
                              updateOption(questionIndex, optionIndex, 'text', e.target.value)
                            }
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(questionIndex, optionIndex)}
                            className="text-red-600 hover:text-red-800"
                            disabled={question.options.length <= 2}
                            title={
                              question.options.length <= 2
                                ? 'Minimum 2 options required'
                                : 'Remove Option'
                            }
                          >
                            <Trash
                              className={`h-5 w-5 ${
                                question.options.length <= 2 ? 'opacity-50' : ''
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Click the circle icon to mark the correct answer
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mb-8">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center"
            disabled={saving}
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizFormPage;