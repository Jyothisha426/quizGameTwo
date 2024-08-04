import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

class GameResults extends Component {
  state = {
    isWinner: false,
  }

  componentDidMount() {
    const {location} = this.props
    const {correctAnswersCount} = location.state

    this.setState({isWinner: correctAnswersCount > 5})
  }

  render() {
    const {isWinner} = this.state
    const {location} = this.props
    const {questions, selectedOptions} = location.state || {
      questions: [],
      selectedOptions: {},
    }

    return (
      <div className="results-container">
        {isWinner ? (
          <div className="winner-container">
            <h1>Congratulations! You Won!</h1>
            <img
              src="https://assets.ccbp.in/frontend/react-js/quiz-game-winner-img.png"
              alt="winner"
            />
          </div>
        ) : (
          <div className="loser-container">
            <h1>Sorry, You Lost!</h1>
            <img
              src="https://assets.ccbp.in/frontend/react-js/quiz-game-loser-img.png"
              alt="loser"
            />
          </div>
        )}
        <Link
          to={{
            pathname: '/game-report',
            state: {questions, selectedOptions},
          }}
        >
          <button type="button" className="report-btn">
            Report
          </button>
        </Link>
      </div>
    )
  }
}

export default withRouter(GameResults)
