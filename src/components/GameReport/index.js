import {Component} from 'react'
import './index.css'

class GameReport extends Component {
  render() {
    const {location} = this.props
    const {questions, selectedOptions} = location.state || {
      questions: [],
      selectedOptions: {},
    }
    console.log(questions)
    return (
      <div className="report-container">
        <h1>Game Report</h1>
        <ul className="questions-list">
          {questions.map(question => (
            <li key={question.id} className="question-item">
              <h1 className="question-text">{question.question}</h1>
              <ul className="options-list">
                {question.options.map(option => (
                  <li key={option.id} className="option-item">
                    <p
                      className={`option-text ${
                        option.isCorrect ? 'correct' : ''
                      } ${
                        selectedOptions[question.id] === option.id
                          ? 'selected'
                          : ''
                      }`}
                    >
                      {option.text}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default GameReport
