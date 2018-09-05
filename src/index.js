import React from "react"
import ReactDOM from "react-dom"
import "./index.css"

function Square(props) {
  const className = "square " + props.className
  return (
    <button className={className} onClick={props.click}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i, style) {
    const className = style ? "winning" : ""
    return (
      <Square
        className={className}
        value={this.props.squares[i]}
        click={() => this.props.click(i)}
      />
    )
  }

  render() {
    const winFormation = this.props.winFormation
    return (
      <div>
        {[...Array(3)].map((x, i) => {
          return (
            <div className="board-row">
              {[...Array(3)].map((x, j) => {
                const position = 3 * i + j
                const style = winFormation
                  ? winFormation.includes(position)
                  : false
                return this.renderSquare(position, style)
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

class Game extends React.Component {
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumer + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    const { winner } = calculateWinner(squares)
    if (winner || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? "X" : "O"
    this.setState({
      history: history.concat([
        {
          squares: squares,
          positions: [(i % 3) + 1, Math.floor(i / 3) + 1]
        }
      ]),
      stepNumer: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumer: step,
      xIsNext: step % 2 === 0
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          positions: [null, null]
        }
      ],
      stepNumer: 0,
      xIsNext: true
    }
  }
  render() {
    const history = this.state.history
    const current = history[this.state.stepNumer]
    const stepNumer = this.state.stepNumer
    const { winner, winFormation } = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const selected = move === stepNumer ? "selected" : ""
      const [posX, posY] = step.positions
      const desc = move
        ? `Go to move # ${move} (col: ${posX}, row: ${posY})`
        : "Go to game start"
      return (
        <li key={move}>
          <button className={selected} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      )
    })
    let status
    if (winner) {
      status = "Winner: " + winner
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O")
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winFormation={winFormation}
            squares={current.squares}
            click={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Game />, document.getElementById("root"))

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winFormation: lines[i]
      }
    }
  }
  return {
    winner: null,
    winFormation: null
  }
}
