import {Component} from 'react'
import {Redirect} from 'react-router-dom' // Import Redirect
import Header from '../Header'
import './index.css'

class Home extends Component {
  state = {
    isQuizStarted: false,
    loading: false,
  }

  onClickStartQuiz = async () => {
    this.setState({loading: true})
    // Redirect to /quiz-game after fetching questions
    this.setState({isQuizStarted: true})
  }

  render() {
    const {isQuizStarted, loading} = this.state

    if (isQuizStarted) {
      // Redirect to /quiz-game when the quiz starts
      return <Redirect to="/quiz-game" />
    }

    return (
      <div className="home-container">
        <Header />
        <div className="start-quiz-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/quiz-game-start-the-quiz-img.png"
            alt="start quiz game"
            className="start-quiz-img"
          />
          <h1 className="start-quiz-heading">
            How Many Of These Questions Do You Actually Know?
          </h1>
          <p className="start-quiz-para">
            Test yourself with these easy quiz questions and answers
          </p>
          <button
            className="start-quiz-btn"
            type="button"
            onClick={this.onClickStartQuiz}
          >
            Start Quiz
          </button>
          {loading && <p>Loading...</p>}
        </div>
        <p className="alert">
          All the progress will be lost if you reload during the quiz
        </p>
      </div>
    )
  }
}

export default Home
