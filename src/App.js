import {Route, Switch} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import QuizGame from './components/QuizGame'
import GameResults from './components/GameResults'
import GameReport from './components/GameReport'
import NotFound from './components/NotFound'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <Route exact path="/" component={Home} />
    <Route exact path="/quiz-game" component={QuizGame} />
    <Route exact path="/game-results" component={GameResults} />
    <Route exact path="/game-report" component={GameReport} />
    <Route path="*" component={NotFound} /> {/* Fix NotFound route */}
  </Switch>
)

export default App
