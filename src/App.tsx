import { useMemo, useState } from "react";

type Question = {
  prompt: string;
  answers: string[];
  correct: number;
  note: string;
};

const questions: Question[] = [
  { prompt: "کدام سیاره به «سیاره سرخ» معروف است؟", answers: ["زهره", "مریخ", "مشتری", "عطارد"], correct: 1, note: "وجود اکسید آهن در سطح مریخ باعث رنگ سرخ آن شده است." },
  { prompt: "بزرگ‌ترین اقیانوس زمین کدام است؟", answers: ["اطلس", "هند", "آرام", "منجمد شمالی"], correct: 2, note: "اقیانوس آرام بزرگ‌ترین و عمیق‌ترین اقیانوس زمین است." },
  { prompt: "عدد حاصل از ۱۲ ضربدر ۸ چند است؟", answers: ["۸۶", "۹۲", "۹۶", "۱۰۸"], correct: 2, note: "۱۲ × ۸ = ۹۶." },
  { prompt: "کدام عنصر نماد شیمیایی O دارد؟", answers: ["طلا", "اکسیژن", "آهن", "نقره"], correct: 1, note: "نماد O از واژه Oxygen گرفته شده است." },
  { prompt: "پایتخت ژاپن کدام شهر است؟", answers: ["کیوتو", "اوساکا", "توکیو", "هیروشیما"], correct: 2, note: "توکیو پایتخت ژاپن است." },
  { prompt: "کدام جانور پستاندار تخم‌گذار است؟", answers: ["خفاش", "پلاتیپوس", "دلفین", "کانگورو"], correct: 1, note: "پلاتیپوس از معدود پستانداران تخم‌گذار است." },
  { prompt: "یک کیلومتر چند متر است؟", answers: ["۱۰۰", "۵۰۰", "۱۰۰۰", "۱۰٬۰۰۰"], correct: 2, note: "هر کیلومتر برابر با هزار متر است." },
  { prompt: "کدام گاز بیشترین سهم را در هوای زمین دارد؟", answers: ["اکسیژن", "دی‌اکسید کربن", "نیتروژن", "هیدروژن"], correct: 2, note: "حدود ۷۸ درصد جو زمین از نیتروژن تشکیل شده است." },
  { prompt: "کدام قاره بزرگ‌ترین جمعیت را دارد؟", answers: ["آفریقا", "اروپا", "آسیا", "آمریکای جنوبی"], correct: 2, note: "آسیا پرجمعیت‌ترین قاره جهان است." },
  { prompt: "نور خورشید تقریباً چند دقیقه طول می‌کشد تا به زمین برسد؟", answers: ["۲ دقیقه", "۸ دقیقه", "۲۰ دقیقه", "۶۰ دقیقه"], correct: 1, note: "این زمان به‌طور متوسط حدود ۸ دقیقه و ۲۰ ثانیه است." }
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const score = useMemo(
    () => answers.reduce((total, answer, i) => total + (answer === questions[i].correct ? 1 : 0), 0),
    [answers]
  );

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
  };

  const reset = () => {
    setStarted(false);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  };

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); reset(); }}>
          <span className="brand-mark">T</span>
          <span>TON <b>ARENA</b></span>
        </a>
        <span className="top-tag">نسخه آزمایشی</span>
      </header>

      {!started ? (
        <section className="hero">
          <div className="eyebrow"><span className="live-dot" /> بازی کن · یاد بگیر · پیشرفت کن</div>
          <h1>رقابت از <span>اینجا</span> شروع می‌شود.</h1>
          <p className="intro">به دنیای TON ARENA خوش آمدی؛ جایی برای سنجش مهارت، یادگیری و رقابت دوستانه.</p>
          <div className="game-card">
            <div className="game-icon">⚡</div>
            <div className="game-copy">
              <span className="card-kicker">بازی منتخب</span>
              <h2>BRAIN SPRINT</h2>
              <p>۱۰ پرسش · دانش عمومی · یک چالش کوتاه</p>
            </div>
            <span className="free-pill">رایگان</span>
          </div>
          <button className="primary-btn" onClick={() => setStarted(true)}>شروع چالش <span>←</span></button>
          <p className="fine-print">بدون شرط‌بندی یا پرداخت ورودی؛ فقط مهارت و یادگیری.</p>
          <div className="feature-row">
            <div><strong>۱۰</strong><span>پرسش</span></div>
            <div><strong>۱</strong><span>چالش</span></div>
            <div><strong>۰</strong><span>هزینه ورود</span></div>
          </div>
        </section>
      ) : finished ? (
        <section className="quiz-panel result-panel">
          <div className="result-icon">🏆</div>
          <span className="card-kicker">پایان چالش</span>
          <h1>آفرین! تلاش خوبی بود.</h1>
          <div className="score-number">{score}<small> / ۱۰</small></div>
          <p className="intro">این نتیجه فقط در همین پیش‌نمایش روی دستگاه محاسبه شده است.</p>
          <button className="primary-btn" onClick={reset}>بازگشت به خانه <span>←</span></button>
        </section>
      ) : (
        <section className="quiz-panel">
          <div className="quiz-heading">
            <div><span className="card-kicker">BRAIN SPRINT</span><h1>چالش دانش عمومی</h1></div>
            <span className="counter">{index + 1} / ۱۰</span>
          </div>
          <div className="progress-track"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          <p className="question-label">پرسش شماره {index + 1}</p>
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
                  <span className="answer-letter">{["الف", "ب", "ج", "د"][i]}</span>
                  {answer}
                  {isCorrect && <span className="answer-mark">✓</span>}
                  {isChosen && !isCorrect && <span className="answer-mark">×</span>}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <div className="feedback">
              <strong>{selected === questions[index].correct ? "پاسخ درست بود!" : "این بار درست نبود."}</strong>
              <p>{questions[index].note}</p>
              <button className="primary-btn" onClick={next}>{index === 9 ? "دیدن نتیجه" : "پرسش بعدی"} <span>←</span></button>
            </div>
          )}
          <button className="text-btn" onClick={reset}>خروج از چالش</button>
        </section>
      )}

      <footer className="footer">
        <span>یک اکوسیستم، سه تجربه</span>
        <div><span>ARENA</span><i /> <span>ACADEMY</span><i /> <span>CLUB</span></div>
      </footer>
    </main>
  );
}
