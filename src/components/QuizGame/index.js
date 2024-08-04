import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import './index.css'
import Header from '../Header'
import Question from '../Question'

class QuizGame extends Component {
  state = {
    questions: [],
    currentQuestionIndex: 0,
    selectedOptions: {},
    timer: 15,
    timerIntervalId: null,
    correctAnswersCount: 0,
    isQuizCompleted: false,
  }

  componentDidMount() {
    this.fetchQuestions()
  }

  componentWillUnmount() {
    const {timerIntervalId} = this.state
    if (timerIntervalId) {
      clearInterval(timerIntervalId)
    }
  }

  fetchQuestions = async () => {
    try {
      const response = await fetch('https://apis.ccbp.in/assess/questions')
      if (response.ok) {
        const data = await response.json()
        const updatedData = data.questions.map(question => ({
          id: question.id,
          question: question.question_text,
          options: question.options.map(option => ({
            id: option.id,
            text: option.text,
            imageUrl: option.image_url || '',
            isCorrect: option.is_correct === 'true',
          })),
          optionType: question.options_type,
        }))

        this.setState(
          {
            questions: updatedData,
            timer: 15,
          },
          this.startTimer,
        )
      } else {
        console.error('Error fetching quiz questions:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error)
    }
  }

  startTimer = () => {
    const {timerIntervalId} = this.state
    if (timerIntervalId) {
      clearInterval(timerIntervalId)
    }

    const newTimerIntervalId = setInterval(() => {
      this.setState(prevState => {
        if (prevState.timer <= 0) {
          clearInterval(newTimerIntervalId)
          this.handleNextQuestion()
          return {timer: 15}
        }
        return {timer: prevState.timer - 1}
      })
    }, 1000)

    this.setState({timerIntervalId: newTimerIntervalId})
  }

  handleNextQuestion = () => {
    const {
      timerIntervalId,
      questions,
      currentQuestionIndex,
      selectedOptions,
    } = this.state
    const currentQuestion = questions[currentQuestionIndex]
    const selectedOptionId = selectedOptions[currentQuestion.id]
    const selectedOption = currentQuestion.options.find(
      option => option.id === selectedOptionId,
    )

    this.setState(prevState => {
      const nextIndex = prevState.currentQuestionIndex + 1
      const isCorrectAnswer = selectedOption && selectedOption.isCorrect

      if (nextIndex >= prevState.questions.length) {
        clearInterval(timerIntervalId)
        return {
          currentQuestionIndex: nextIndex,
          timerIntervalId: null,
          isQuizCompleted: true,
          correctAnswersCount: isCorrectAnswer
            ? prevState.correctAnswersCount + 1
            : prevState.correctAnswersCount,
        }
      }

      return {
        currentQuestionIndex: nextIndex,
        selectedOptions: {},
        timer: 15,
        correctAnswersCount: isCorrectAnswer
          ? prevState.correctAnswersCount + 1
          : prevState.correctAnswersCount,
      }
    }, this.startTimer)
  }

  handleQuizSubmit = () => {
    const {history} = this.props
    const {correctAnswersCount, questions, selectedOptions} = this.state
    history.push({
      pathname: '/game-results',
      state: {correctAnswersCount, questions, selectedOptions},
    })
  }

  onSelectOption = (questionId, optionId) => {
    this.setState(prevState => ({
      selectedOptions: {...prevState.selectedOptions, [questionId]: optionId},
    }))
  }

  render() {
    const {
      questions,
      currentQuestionIndex,
      selectedOptions,
      timer,
      isQuizCompleted,
    } = this.state
    const currentQuestion = questions[currentQuestionIndex]

    return (
      <div className="quiz-container">
        <Header />
        <div className="main-quiz-qns-container">
          {currentQuestion ? (
            <Question
              question={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              onNextQuestion={this.handleNextQuestion}
              onSelectOption={this.onSelectOption}
              selectedOptionId={selectedOptions[currentQuestion.id]}
              timer={timer}
              optionType={currentQuestion.optionType}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              onQuizSubmit={this.handleQuizSubmit}
              isQuizCompleted={isQuizCompleted}
            />
          ) : (
            <div className="result-container">
              {/* Render the results page here */}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(QuizGame)
