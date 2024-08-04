import {Component} from 'react'
import './index.css'

class Question extends Component {
  state = {
    selectedOptionId: null,
    isOptionSelected: false,
  }

  componentDidUpdate(prevProps) {
    const {question} = this.props
    if (prevProps.question.id !== question.id) {
      this.setState({selectedOptionId: null, isOptionSelected: false})
    }
  }

  onSelectOption = optionId => {
    const {isOptionSelected} = this.state
    if (isOptionSelected) return

    const {question} = this.props

    this.setState(
      {
        selectedOptionId: optionId,
        isOptionSelected: true,
      },
      () => {
        const {onSelectOption} = this.props
        if (onSelectOption) {
          onSelectOption(question.id, optionId)
        }
      },
    )
  }

  getOptionClassName = option => {
    const {selectedOptionId, isOptionSelected} = this.state
    const {id, isCorrect} = option

    if (!isOptionSelected) {
      return ''
    }

    if (id === selectedOptionId) {
      return isCorrect ? 'correct' : 'incorrect'
    }

    return isCorrect ? 'correct' : ''
  }

  getIconUrl = optionId => {
    const {selectedOptionId, isOptionSelected} = this.state
    const {question} = this.props

    if (!isOptionSelected) return ''

    if (optionId === selectedOptionId) {
      const selectedOption = question.options.find(
        option => option.id === optionId,
      )
      if (selectedOption) {
        return selectedOption.isCorrect
          ? 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
          : 'https://assets.ccbp.in/frontend/react-js/quiz-game-close-circle-img.png'
      }
    }

    const correctOption = question.options.find(option => option.isCorrect)
    if (correctOption && correctOption.id === optionId) {
      return 'https://assets.ccbp.in/frontend/react-js/quiz-game-check-circle-img.png'
    }

    return ''
  }

  renderOptions = () => {
    const {question} = this.props
    const {optionType} = question
    const {isOptionSelected} = this.state

    return question.options.map((option, index) => {
      const {id, text, imageUrl} = option
      const optionClassName = this.getOptionClassName(option)
      const iconUrl = this.getIconUrl(id)
      const {selectedOptionId} = this.state

      if (optionType === 'IMAGE') {
        return (
          <li key={id} className="image-option">
            <button
              type="button"
              className={`image-option-btn ${optionClassName}`}
              onClick={() => this.onSelectOption(id)}
              disabled={isOptionSelected}
            >
              <img
                src={imageUrl}
                alt={`Option ${index}`}
                className="option-img"
              />
            </button>
            {iconUrl && (
              <img src={iconUrl} alt="icon" className="option-icon" />
            )}
          </li>
        )
      }

      if (optionType === 'SINGLE_SELECT') {
        return (
          <li key={id} className="radio-option">
            <label className="radio-container">
              <input
                type="radio"
                name="single-select-option"
                value={id}
                checked={isOptionSelected && id === selectedOptionId}
                onChange={() => this.onSelectOption(id)}
                disabled={isOptionSelected}
              />
              <span className="radio-label">{text}</span>
              {iconUrl && (
                <img src={iconUrl} alt="icon" className="option-icon" />
              )}
            </label>
          </li>
        )
      }

      return (
        <li key={id} className="option">
          <button
            type="button"
            className={`option-btn ${optionClassName}`}
            onClick={() => this.onSelectOption(id)}
            disabled={isOptionSelected}
          >
            {String.fromCharCode(65 + index)}. {text}
          </button>
          {iconUrl && <img src={iconUrl} alt="icon" className="option-icon" />}
        </li>
      )
    })
  }

  render() {
    const {
      question,
      currentQuestionIndex,
      onNextQuestion,
      timer,
      isLastQuestion,
      onQuizSubmit,
      isQuizCompleted,
    } = this.props
    const {isOptionSelected} = this.state

    return (
      <div className="question-container">
        <div className="qn-top-header">
          <div className="qn-num-container">
            <p className="qn-num-head">Question</p>
            <h1 className="qn-num">{currentQuestionIndex + 1}/20</h1>
          </div>
          <div className="fifteen-container">
            <p className="fifteen">{timer}</p>
          </div>
        </div>

        <div className="current-qn-container">
          <h2 className="question">{question.question}</h2>
          <ul className="options-list">{this.renderOptions()}</ul>
        </div>

        <div className="btn-container">
          {!isQuizCompleted && (
            <button
              className="next-question-btn"
              type="button"
              onClick={() => {
                this.setState({isOptionSelected: false, selectedOptionId: null})
                if (isLastQuestion) {
                  onQuizSubmit()
                } else {
                  onNextQuestion()
                }
              }}
              disabled={!isOptionSelected}
            >
              {isLastQuestion ? 'Submit' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    )
  }
}

export default Question
