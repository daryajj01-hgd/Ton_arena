import { useCallback, useEffect, useState } from "react";
import { localeOptions, translations, type Locale } from "./i18n";
import { authenticateTelegram, getCurrentPlayer, getPlayerProgress, getLeaderboard, startBrainSprint, submitBrainSprintAnswer, type PlayerProgress, type LeaderboardEntry } from "./api";

const QUESTION_SECONDS = 15;

export default function App() {
  const [language, setLanguage] = useState<Locale>(() => {
    try {
      const saved = window.localStorage.getItem("ton-arena-language");
      return saved && localeOptions.some((item) => item.code === saved) ? (saved as Locale) : "en";
    } catch {
      return "en";
    }
  });
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [questionOrder, setQuestionOrder] = useState<number[]>(Array.from({ length: 10 }, (_, i) => i));
  const [serverGame, setServerGame] = useState(false);
  const [serverScore, setServerScore] = useState(0);
  const [serverCorrect, setServerCorrect] = useState<boolean | null>(null);
  const [serverCorrectAnswer, setServerCorrectAnswer] = useState<number | null>(null);
  const [apiBusy, setApiBusy] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isTelegramApp, setIsTelegramApp] = useState(false);

  const t = translations[language];
  const locale = localeOptions.find((item) => item.code === language)!;
  const questions = t.questions;
  const currentQuestion = questions[questionOrder[index] ?? index];
  const score = serverScore;

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp?.initData) return;
    setIsTelegramApp(true);
    setAuthLoading(true);
    webApp.ready();
    webApp.expand();
    let cancelled = false;
    void (async () => {
      try {
        const auth = await authenticateTelegram(webApp.initData);
        const profile = await getCurrentPlayer(auth.session.token);
        if (!cancelled) {
          setSessionToken(auth.session.token);
          setPlayerName(profile.player.firstName ?? profile.player.username ?? null);
        }
        try {
          const progress = await getPlayerProgress(auth.session.token);
          if (!cancelled) setPlayerProgress(progress.progress);
        } catch {
          // Authentication remains valid even if the optional progress read fails.
        }
        try {
          const ranking = await getLeaderboard(auth.session.token);
          if (!cancelled) setLeaderboard(ranking.leaderboard);
        } catch {
          // The game remains playable if the leaderboard is unavailable.
        }
      } catch {
        if (!cancelled) setPlayerName(null);
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = locale.dir;
  }, [language, locale.dir]);

  const submitAnswer = useCallback(async (answer: number) => {
    if (selected !== null || apiBusy) return;
    setApiBusy(true);
    setGameError(null);
    try {
      if (serverGame && sessionToken && gameSessionId) {
        const response = await submitBrainSprintAnswer(sessionToken, gameSessionId, index, answer);
        setServerScore(response.result.score);
        setServerCorrect(response.result.isCorrect);
        setServerCorrectAnswer(response.result.correctAnswerIndex);
        if (response.result.completed) {
          setXpEarned(response.result.xpEarned);
          setPlayerProgress((current) => ({
            xp: response.result.totalXp ?? current?.xp ?? 0,
            level: response.result.level ?? current?.level ?? 1,
            gamesPlayed: (current?.gamesPlayed ?? 0) + 1,
            totalCorrect: (current?.totalCorrect ?? 0) + response.result.score,
            bestScore: Math.max(current?.bestScore ?? 0, response.result.score),
            dailyStreak: response.result.dailyStreak ?? current?.dailyStreak ?? 0,
            dailyMissionCompleteToday: response.result.dailyMissionCompleteToday
          }));
          if (sessionToken) {
            try {
              const ranking = await getLeaderboard(sessionToken);
              setLeaderboard(ranking.leaderboard);
            } catch {
              // Keep the completed result even if the ranking refresh fails.
            }
          }
        }
      } else {
        setServerCorrect(null);
        setServerCorrectAnswer(null);
      }
      setSelected(answer);
    } catch {
      setGameError("Your answer could not be saved. Please try again.");
      setTimeLeft(QUESTION_SECONDS);
    } finally {
      setApiBusy(false);
    }
  }, [selected, apiBusy, serverGame, sessionToken, gameSessionId, index]);

  useEffect(() => {
    if (!started || finished || selected !== null || apiBusy) return;
    if (timeLeft === 0) {
      void submitAnswer(-1);
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [started, finished, selected, timeLeft, apiBusy, submitAnswer]);

  const choose = (answer: number) => {
    void submitAnswer(answer);
  };

  const startGame = async () => {
    setGameError(null);
    setIndex(0);
    setSelected(null);
    setFinished(false);
    setTimeLeft(QUESTION_SECONDS);
    setServerScore(0);
    setXpEarned(0);
    setServerCorrect(null);
    setServerCorrectAnswer(null);
    setQuestionOrder(Array.from({ length: 10 }, (_, i) => i));
    if (isTelegramApp && !sessionToken) {
      setGameError("Telegram sign-in is not ready. Please reopen the Mini App and try again.");
      return;
    }
    if (sessionToken) {
      setApiBusy(true);
      try {
        const response = await startBrainSprint(sessionToken);
        setGameSessionId(response.game.sessionId);
        setQuestionOrder(response.game.questionOrder);
        setServerGame(true);
        setStarted(true);
      } catch {
        setGameError("The online game is not available yet. Please try again later.");
      } finally {
        setApiBusy(false);
      }
      return;
    }
    setGameSessionId(null);
    setServerGame(false);
    setStarted(true);
  };

  const next = () => {
    if (index === questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
    setTimeLeft(QUESTION_SECONDS);
    setServerCorrect(null);
    setServerCorrectAnswer(null);
  };

  const reset = () => {
    setStarted(false);
    setIndex(0);
    setSelected(null);
    setFinished(false);
    setTimeLeft(QUESTION_SECONDS);
    setGameSessionId(null);
    setServerGame(false);
    setServerScore(0);
    setServerCorrect(null);
    setServerCorrectAnswer(null);
    setGameError(null);
  };

  const changeLanguage = (value: string) => {
    const nextLanguage = value as Locale;
    setLanguage(nextLanguage);
    try {
      window.localStorage.setItem("ton-arena-language", nextLanguage);
    } catch {
      // Language preference remains available for the current session.
    }
    reset();
  };

  return (
    <main className="shell" dir={locale.dir}>
      <header className="topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); reset(); }}>
          <span className="brand-mark">T</span>
          <span>TON <b>ARENA</b></span>
        </a>
        <div className="header-actions">
          <select className="language-select" aria-label="Choose language" value={language} onChange={(event) => changeLanguage(event.target.value)}>
            {localeOptions.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
          </select>
          {playerName && <span className="player-chip" title="Signed in with Telegram">{playerName}</span>}
          {playerProgress && <span className="progress-chip" title="Your saved progress">LV {playerProgress.level} · {playerProgress.xp} XP</span>}
          <span className="top-tag">{t.beta}</span>
        </div>
      </header>

      {!started ? (
        <section className="hero">
          <div className="eyebrow"><span className="live-dot" /> {t.tagline}</div>
          <h1>{t.headline} <span>{t.headlineAccent}</span></h1>
          <p className="intro">{t.intro}</p>
          <div className="game-card">
            <div className="game-icon">⚡</div>
            <div className="game-copy">
              <span className="card-kicker">{t.featured}</span>
              <h2>BRAIN SPRINT</h2>
              <p>{t.gameMeta}</p>
            </div>
            <span className="free-pill">{t.free}</span>
          </div>
          <button className="primary-btn" onClick={() => { void startGame(); }} disabled={apiBusy || authLoading}>{t.start} <span>{locale.dir === "rtl" ? "←" : "→"}</span></button>
          <p className="fine-print">{t.noBetting}</p>
          {gameError && <p className="game-error" role="alert">{gameError}</p>}
          <div className="feature-row">
            <div><strong>10</strong><span>{t.questionsLabel}</span></div>
            <div><strong>15</strong><span>{t.secondsEach}</span></div>
            <div><strong>0</strong><span>{t.entryFee}</span></div>
          </div>
          {playerProgress && (
            <div className="daily-mission-card">
              <strong>{t.dailyMission}</strong>
              <span>{playerProgress.dailyMissionCompleteToday ? t.dailyComplete : t.dailyIncomplete}</span>
              <b>🔥 {playerProgress.dailyStreak}</b>
            </div>
          )}
          {leaderboard.length > 0 && (
            <section className="leaderboard-card">
              <h2>{t.leaderboardTitle}</h2>
              {leaderboard.slice(0, 5).map((entry) => (
                <div className="leaderboard-row" key={entry.rank}>
                  <span className="leaderboard-rank">#{entry.rank}</span>
                  <strong>{entry.displayName}</strong>
                  <span className="leaderboard-level">LV {entry.level}</span>
                  <b>{entry.xp} XP</b>
                </div>
              ))}
            </section>
          )}
        </section>
      ) : finished ? (
        <section className="quiz-panel result-panel">
          <div className="result-icon">🏆</div>
          <span className="card-kicker">{t.complete}</span>
          <h1>{t.great}</h1>
          <div className="score-number">{serverGame ? score : "—"}{serverGame && <small> / 10</small>}</div>
          <p className="intro">{serverGame ? "Your score has been verified by the TON ARENA server." : t.localScore}</p>
          {serverGame && <p className="xp-earned">+{xpEarned} XP earned · Total {playerProgress?.xp ?? xpEarned} XP</p>}
          <button className="primary-btn" onClick={reset}>{t.home} <span>{locale.dir === "rtl" ? "←" : "→"}</span></button>
        </section>
      ) : (
        <section className="quiz-panel">
          <div className="quiz-heading">
            <div><span className="card-kicker">BRAIN SPRINT</span><h1>{t.challenge}</h1></div>
            <span className="counter">{index + 1} / 10</span>
          </div>
          <div className="progress-track"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          <div className="timer-row">
            <span>{t.time}</span>
            <strong className={timeLeft <= 5 ? "timer-urgent" : ""}>{timeLeft}s</strong>
          </div>
          <div className="timer-track"><span className={timeLeft <= 5 ? "timer-low" : ""} style={{ width: `${(timeLeft / QUESTION_SECONDS) * 100}%` }} /></div>
          <p className="question-label">{t.question} {index + 1}</p>
          <h2 className="question">{currentQuestion.prompt}</h2>
          <div className="answers">
            {currentQuestion.answers.map((answer, i) => {
              const isChosen = selected === i;
              const correctIndex = serverCorrectAnswer ?? -1;
              const isCorrect = selected !== null && serverGame && i === correctIndex;
              return (
                <button key={answer} className={`answer-btn ${isCorrect ? "correct" : ""} ${isChosen && !isCorrect ? "wrong" : ""}`} onClick={() => choose(i)} disabled={selected !== null || apiBusy}>
                  <span className="answer-letter">{["A", "B", "C", "D"][i]}</span>
                  {answer}
                  {isCorrect && <span className="answer-mark">✓</span>}
                  {isChosen && !isCorrect && <span className="answer-mark">×</span>}
                </button>
              );
            })}
          </div>
          {gameError && <p className="game-error" role="alert">{gameError}</p>}
          {selected !== null && (
            <div className="feedback">
              <strong>{selected === -1 ? t.timeUp : serverGame ? (serverCorrect ? t.correct : t.incorrect) : "Preview mode"}</strong>
              <p>{currentQuestion.note}</p>
              <button className="primary-btn" onClick={next}>{index === 9 ? t.results : t.next} <span>{locale.dir === "rtl" ? "←" : "→"}</span></button>
            </div>
          )}
          <button className="text-btn" onClick={reset} disabled={apiBusy}>{t.exit}</button>
        </section>
      )}

      <footer className="footer">
        <span>{t.footer}</span>
        <div><span>ARENA</span><i /> <span>ACADEMY</span><i /> <span>CLUB</span></div>
      </footer>
    </main>
  );
}
