/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const words = [
  'banana',
  'computer',
  'elephant',
  'pizza',
  'react',
  'javascript',
  'school',
  'football',
  'canada',
  'orange'
]

function App () {
  const [gameWords, setGameWords] = React.useState(() => {
    return JSON.parse(localStorage.getItem('gameWords')) || shuffle(words)
  })

  const [points, setPoints] = React.useState(() => {
    return parseInt(localStorage.getItem('points')) || 0
  })

  const [strikes, setStrikes] = React.useState(() => {
    return parseInt(localStorage.getItem('strikes')) || 0
  })

  const [passes, setPasses] = React.useState(() => {
    return parseInt(localStorage.getItem('passes')) || 3
  })

  const [message, setMessage] = React.useState(() => {
    return localStorage.getItem('message') || ''
  })

  const [guess, setGuess] = React.useState('')

  const [scrambledWord, setScrambledWord] = React.useState(() => {
    const savedWord = localStorage.getItem('scrambledWord')

    if (savedWord) {
      return savedWord
    }

    if (gameWords.length > 0) {
      return shuffle(gameWords[0])
    }

    return ''
  })

  const maxStrikes = 3

  const gameOver = gameWords.length === 0 || strikes >= maxStrikes

  function guessHandler (e) {
    setGuess(e.target.value)
  }

  function nextWord () {
    const newWords = gameWords.slice(1)

    setGameWords(newWords)

    if (newWords.length > 0) {
      setScrambledWord(shuffle(newWords[0]))
    } else {
      setScrambledWord('')
    }
  }

  function submitHandler (e) {
    e.preventDefault()

    if (guess.toLowerCase() === gameWords[0].toLowerCase()) {
      setPoints(points + 1)
      setMessage('Correct! Next word.')
      nextWord()
    } else {
      setStrikes(strikes + 1)
      setMessage('Wrong! Try again.')
    }

    setGuess('')
  }

  function passHandler () {
    if (passes > 0) {
      setPasses(passes - 1)
      setMessage('You passed! Next word.')
      nextWord()
    }
  }

  function restartHandler () {
    const newWords = shuffle(words)

    setGameWords(newWords)
    setPoints(0)
    setStrikes(0)
    setPasses(3)
    setMessage('')
    setGuess('')
    setScrambledWord(shuffle(newWords[0]))
  }

  React.useEffect(() => {
    localStorage.setItem('gameWords', JSON.stringify(gameWords))
    localStorage.setItem('points', points)
    localStorage.setItem('strikes', strikes)
    localStorage.setItem('passes', passes)
    localStorage.setItem('message', message)
    localStorage.setItem('scrambledWord', scrambledWord)
  }, [
    JSON.stringify(gameWords),
    points,
    strikes,
    passes,
    message,
    scrambledWord
  ])

  return (
    <main className="game">
      <h1>Welcome to Scramble</h1>

      <div className="score">
        <p>Points: {points}</p>
        <p>Strikes: {strikes} / {maxStrikes}</p>
      </div>

      {!gameOver ? (
        <React.Fragment>
          <h2 className="word">{scrambledWord}</h2>

          <form onSubmit={submitHandler}>
            <input
              type="text"
              value={guess}
              onChange={guessHandler}
              placeholder="Enter your guess"
            />

            <button type="submit">
              Guess
            </button>
          </form>

          <button
            className="pass"
            onClick={passHandler}
            disabled={passes === 0}
          >
            Pass ({passes} remaining)
          </button>

          <p className="message">{message}</p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h2>Game Over</h2>

          <p>Your score: {points}</p>

          <button onClick={restartHandler}>
            Play Again
          </button>
        </React.Fragment>
      )}
    </main>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)