import { useEffect, useMemo, useState } from "react";

type Question = { prompt: string; answers: string[]; correct: number; note: string };

const QUESTION_SECONDS = 15;

const questions: Question[] = [
  { prompt: "Which planet is known as the Red Planet?", answers: ["Venus", "Mars", "Jupiter", "Mercury"], correct: 1, note: "Iron oxide on the surface gives Mars its reddish appearance." },
  { prompt: "What is the largest ocean on Earth?", answers: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2, note: "The Pacific is Earth's largest and deepest ocean." },
  { prompt: "What is 12 multiplied by 8?", answers: ["86", "92", "96", "108"], correct: 2, note: "12 × 8 = 96." },
  { prompt: "Which chemical element has the symbol O?", answers: ["Gold", "Oxygen", "Iron", "Silver"], correct: 1, note: "The symbol O stands for oxygen." },
  { prompt: "What is the capital of Japan?", answers: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], correct: 2, note: "Tokyo is the capital of Japan." },
  { prompt: "Which of these mammals lays eggs?", answers: ["Bat", "Platypus", "Dolphin", "Kangaroo"], correct: 1, note: "The platypus is one of the few egg-laying mammals." },
  { prompt: "How many meters are in one kilometer?", answers: ["100", "500", "1,000", "10,000"], correct: 2, note: "One kilometer is equal to 1,000 meters." },
  { prompt: "Which gas makes up most of Earth's atmosphere?", answers: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correct: 2, note: "About 78% of Earth's atmosphere is nitrogen." },
  { prompt: "Which continent has the largest population?", answers: ["Africa", "Europe", "Asia", "South America"], correct: 2, note: "Asia is the world's most populous continent." },
  { prompt: "About how long does sunlight take to reach Earth?", answers: ["2 minutes", "8 minutes", "20 minutes", "60 minutes"], correct: 1, note: "Sunlight takes about 8 minutes and 20 seconds to reach Earth." }
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);

  const score = useMemo(
    () => answers.reduce((total, answer, i) => total + (answer === questions[i].correct ? 1 : 0), 0),
    [answers]
  );

  useEffect(() => {
    if (!started || finished || selected !== null) return;
    if (timeLeft === 0) {
      setSelected(-1);
      setAnswers((current) => [...current, -1]);
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [started, finished, selected, timeLeft]);

  const choose = (answer: number) => {
    if (selected !== null) return;
    setSelected(answer);
    setAnswers((current) => [...current, answer]);
  };

  const next = () => {
    if (index === questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
    setTimeLeft(QUESTION_SECONDS);
  };

  const reset = () => {
    setStarted(false);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setTimeLeft(QUESTION_SECONDS);
  };

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); reset(); }}>
          <span className="brand-mark">T</span>
          <span>TON <b>ARENA</b></span>
        </a>
        <span className="top-tag">BETA VERSION</span>
      </header>

      {!started ? (
        <section className="hero">
          <div className="eyebrow"><span className="live-dot" /> PLAY · LEARN · LEVEL UP</div>
          <h1>Competition starts <span>here.</span></h1>
          <p className="intro">Welcome to TON ARENA — a place to test your skills, learn something new, and enjoy friendly competition.</p>
          <div className="game-card">
            <div className="game-icon">⚡</div>
            <div className="game-copy">
              <span className="card-kicker">FEATURED GAME</span>
              <h2>BRAIN SPRINT</h2>
              <p>10 questions · 15 seconds per question</p>
            </div>
            <span className="free-pill">FREE</span>
          </div>
          <button className="primary-btn" onClick={() => { setStarted(true); setTimeLeft(QUESTION_SECONDS); }}>Start Challenge <span>→</span></button>
          <p className="fine-print">No betting or entry fees — just skill and learning.</p>
          <div className="feature-row">
            <div><strong>10</strong><span>Questions</span></div>
            <div><strong>15</strong><span>Seconds each</span></div>
            <div><strong>0</strong><span>Entry fee</span></div>
          </div>
        </section>
      ) : finished ? (
        <section className="quiz-panel result-panel">
          <div className="result-icon">🏆</div>
          <span className="card-kicker">CHALLENGE COMPLETE</span>
          <h1>Great effort!</h1>
          <div className="score-number">{score}<small> / 10</small></div>
          <p className="intro">This score is calculated locally in this preview only.</p>
          <button className="primary-btn" onClick={reset}>Back to Home <span>→</span></button>
        </section>
      ) : (
        <section className="quiz-panel">
          <div className="quiz-heading">
            <div><span className="card-kicker">BRAIN SPRINT</span><h1>General Knowledge Challenge</h1></div>
            <span className="counter">{index + 1} / 10</span>
          </div>
          <div className="progress-track"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          <div className="timer-row">
            <span>Time remaining</span>
            <strong className={timeLeft <= 5 ? "timer-urgent" : ""}>{timeLeft}s</strong>
          </div>
          <div className="timer-track"><span className={timeLeft <= 5 ? "timer-low" : ""} style={{ width: `${(timeLeft / QUESTION_SECONDS) * 100}%` }} /></div>
          <p className="question-label">QUESTION {index + 1}</p>
          <h2 className="question">{questions[index].prompt}</h2>
          <div className="answers">
            {questions[index].answers.map((answer, i) => {
              const isChosen = selected === i;
              const isCorrect = selected !== null && i === questions[index].correct;
              return (
                <button
                  key={answer}
                  className={`answer-btn ${isCorrect ? "correct" : ""} ${isChosen && !isCorrect ? "wrong" : ""}`}
                  onClick={() => choose(i)}
                  disabled={selected !== null}
                >
                  <span className="answer-letter">{["A", "B", "C", "D"][i]}</span>
                  {answer}
                  {isCorrect && <span className="answer-mark">✓</span>}
                  {isChosen && !isCorrect && <span className="answer-mark">×</span>}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <div className="feedback">
              <strong>{selected === -1 ? "Time is up!" : selected === questions[index].correct ? "Correct answer!" : "Not quite!"}</strong>
              <p>{questions[index].note}</p>
              <button className="primary-btn" onClick={next}>{index === 9 ? "View Results" : "Next Question"} <span>→</span></button>
            </div>
          )}
          <button className="text-btn" onClick={reset}>Exit Challenge</button>
        </section>
      )}

      <footer className="footer">
        <span>ONE ECOSYSTEM. THREE EXPERIENCES.</span>
        <div><span>ARENA</span><i /> <span>ACADEMY</span><i /> <span>CLUB</span></div>
      </footer>
    </main>
  );
}
