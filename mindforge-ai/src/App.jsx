import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SUBJECTS = [
  { id: "all", name: "All Subjects", icon: "◈" },
  { id: "math", name: "Mathematics", icon: "∑" },
  { id: "programming", name: "Programming", icon: "</>" },
  { id: "science", name: "Science", icon: "⚗" },
  { id: "general", name: "General Knowledge", icon: "◎" },
];

const QUESTIONS = [
  {
    id: "m1",
    subject: "math",
    topic: "Algebra",
    difficulty: "Beginner",
    question: "Solve the equation: 2x + 6 = 16",
    options: ["x = 4", "x = 5", "x = 6", "x = 11"],
    answer: 1,
    explanation:
      "Subtract 6 from both sides: 2x = 10. Divide both sides by 2 to get x = 5.",
    hints: [
      "Your goal is to isolate x on one side.",
      "First, subtract 6 from both sides of the equation.",
      "You now have 2x = 10. What happens when you divide both sides by 2?",
    ],
    misconceptions: {
      0: "Check your subtraction and division steps.",
      2: "Recheck the result of subtracting 6 before dividing.",
      3: "Remember that you must divide by the coefficient of x.",
    },
  },
  {
    id: "m2",
    subject: "math",
    topic: "Arithmetic",
    difficulty: "Beginner",
    question: "What is 15% of 200?",
    options: ["15", "20", "30", "35"],
    answer: 2,
    explanation:
      "15% means 15/100. Therefore, (15/100) × 200 = 30.",
    hints: [
      "Convert the percentage into a fraction out of 100.",
      "Calculate 15 divided by 100, then multiply by 200.",
      "10% of 200 is 20, and 5% is 10. Add them together.",
    ],
    misconceptions: {
      0: "You may have used 15 instead of calculating 15% of 200.",
      1: "Check the difference between 10% and 15%.",
      3: "Calculate the percentage directly instead of estimating.",
    },
  },
  {
    id: "m3",
    subject: "math",
    topic: "Patterns",
    difficulty: "Beginner",
    question: "What is the next number in the sequence: 3, 6, 12, 24, ...?",
    options: ["30", "36", "42", "48"],
    answer: 3,
    explanation:
      "Each number is twice the previous number. Therefore, 24 × 2 = 48.",
    hints: [
      "Compare each number with the number immediately before it.",
      "Look for a multiplication pattern.",
      "Each term is multiplied by 2. Apply the same rule to 24.",
    ],
    misconceptions: {
      0: "Look for a consistent rule rather than adding a fixed amount.",
      1: "Check whether the sequence follows multiplication.",
      2: "Compare the ratio between consecutive terms.",
    },
  },
  {
    id: "p1",
    subject: "programming",
    topic: "Java Fundamentals",
    difficulty: "Beginner",
    question: "What is the output of this Java code?",
    code: "int x = 5;\nint y = 2;\nSystem.out.println(x / y);",
    options: ["2", "2.5", "3", "Error"],
    answer: 0,
    explanation:
      "Both operands are integers. Java performs integer division and discards the fractional part, producing 2.",
    hints: [
      "Look carefully at the data types of x and y.",
      "Both variables are integers. Consider how Java divides integers.",
      "Integer division discards the fractional part rather than rounding.",
    ],
    misconceptions: {
      1: "You may be applying floating-point division to two integer operands.",
      2: "Integer division truncates the fractional part; it does not round.",
      3: "Java permits division between these integer values.",
    },
  },
  {
    id: "p2",
    subject: "programming",
    topic: "Loops",
    difficulty: "Beginner",
    question: "How many times does this loop execute?",
    code: "for (int i = 0; i < 4; i++) {\n    System.out.println(i);\n}",
    options: ["3 times", "4 times", "5 times", "Infinitely"],
    answer: 1,
    explanation:
      "The loop executes for i = 0, 1, 2, and 3. When i becomes 4, the condition is false.",
    hints: [
      "Start counting from the initial value of i.",
      "The loop continues while i is strictly less than 4.",
      "The valid values are 0, 1, 2, and 3.",
    ],
    misconceptions: {
      0: "Remember that the initial value is 0, and the loop includes it.",
      2: "The condition is i < 4, not i <= 4.",
      3: "Check what happens when i reaches 4.",
    },
  },
  {
    id: "p3",
    subject: "programming",
    topic: "Conditionals",
    difficulty: "Beginner",
    question: "What will this Java code print?",
    code: 'int n = 7;\nif (n % 2 == 0) {\n    System.out.println("Even");\n} else {\n    System.out.println("Odd");\n}',
    options: ["Even", "Odd", "7", "Error"],
    answer: 1,
    explanation:
      "The remainder of 7 divided by 2 is 1. The condition is false, so the else block prints Odd.",
    hints: [
      "The % operator returns the remainder.",
      "Check the remainder when 7 is divided by 2.",
      "A number with remainder 1 is not divisible by 2.",
    ],
    misconceptions: {
      0: "An even integer has remainder 0 when divided by 2.",
      2: "Follow the conditional branches to determine what gets printed.",
      3: "Check whether the operators and syntax are valid.",
    },
  },
  {
    id: "s1",
    subject: "science",
    topic: "Physics",
    difficulty: "Beginner",
    question: "What happens to the kinetic energy of an object if its speed doubles?",
    options: [
      "It doubles",
      "It triples",
      "It becomes four times larger",
      "It remains unchanged",
    ],
    answer: 2,
    explanation:
      "Kinetic energy is KE = ½mv². Doubling the speed multiplies the squared speed by four.",
    hints: [
      "Recall the formula for kinetic energy.",
      "Notice that speed is squared in the formula.",
      "Substitute 2v for v and simplify (2v)².",
    ],
    misconceptions: {
      0: "The relationship is not linear because speed is squared.",
      1: "Calculate the square of the speed multiplier.",
      3: "Kinetic energy depends on speed.",
    },
  },
  {
    id: "s2",
    subject: "science",
    topic: "Biology",
    difficulty: "Beginner",
    question: "Which cell structure is primarily responsible for producing ATP during cellular respiration?",
    options: [
      "Nucleus",
      "Mitochondrion",
      "Ribosome",
      "Cell membrane",
    ],
    answer: 1,
    explanation:
      "Mitochondria are the main sites of aerobic cellular respiration and ATP production in eukaryotic cells.",
    hints: [
      "Think about the organelle associated with cellular respiration.",
      "It is often called the powerhouse of the cell.",
      "Look for the organelle responsible for much of the cell's ATP production.",
    ],
    misconceptions: {
      0: "The nucleus primarily stores genetic information.",
      2: "Ribosomes synthesize proteins.",
      3: "The cell membrane regulates movement into and out of the cell.",
    },
  },
  {
    id: "s3",
    subject: "science",
    topic: "Chemistry",
    difficulty: "Beginner",
    question: "What is the approximate pH of pure water at 25°C?",
    options: ["0", "5", "7", "14"],
    answer: 2,
    explanation:
      "Pure water is neutral at approximately pH 7 at 25°C.",
    hints: [
      "Recall the pH value associated with a neutral solution.",
      "A neutral solution is neither acidic nor basic.",
      "The neutral point on the standard pH scale is 7 at 25°C.",
    ],
    misconceptions: {
      0: "A pH near 0 indicates a strongly acidic solution.",
      1: "A pH below 7 is acidic.",
      3: "A pH near 14 indicates a strongly basic solution.",
    },
  },
  {
    id: "g1",
    subject: "general",
    topic: "Critical Thinking",
    difficulty: "Beginner",
    question:
      "A website claims that a new study method improves exam scores. What is the best first step before accepting the claim?",
    options: [
      "Share the claim immediately",
      "Check the study's evidence and methodology",
      "Assume it is correct because it is popular",
      "Reject it because it is unfamiliar",
    ],
    answer: 1,
    explanation:
      "Evaluating the evidence, methodology, and limitations helps determine whether a claim is well supported.",
    hints: [
      "Think about how claims should be evaluated.",
      "Popularity and unfamiliarity do not establish whether a claim is true.",
      "Look for reliable evidence and examine how the study was conducted.",
    ],
    misconceptions: {
      0: "Sharing a claim before checking it can spread misinformation.",
      2: "Popularity does not establish that a claim is accurate.",
      3: "Unfamiliarity alone is not evidence that a claim is false.",
    },
  },
  {
    id: "g2",
    subject: "general",
    topic: "Logical Reasoning",
    difficulty: "Beginner",
    question:
      "All roses in a garden are flowers. Some flowers in the garden are red. Which conclusion must be true?",
    options: [
      "All roses are red",
      "Some roses are red",
      "All roses in the garden are flowers",
      "No roses are red",
    ],
    answer: 2,
    explanation:
      "The first statement explicitly establishes that all roses in the garden are flowers. The second statement does not establish the colour of any rose.",
    hints: [
      "Separate what the statements explicitly say from what you might assume.",
      "The fact that some flowers are red does not tell you whether those flowers are roses.",
      "Choose the conclusion directly guaranteed by the first statement.",
    ],
    misconceptions: {
      0: "The statements do not establish that every rose is red.",
      1: "The red flowers are not necessarily roses.",
      3: "The statements do not establish that roses cannot be red.",
    },
  },
  {
    id: "g3",
    subject: "general",
    topic: "Information Literacy",
    difficulty: "Beginner",
    question:
      "Two sources report different statistics about the same event. What is the most reasonable next step?",
    options: [
      "Always trust the larger number",
      "Always trust the first source",
      "Compare the sources, dates, definitions, and supporting evidence",
      "Average the numbers immediately",
    ],
    answer: 2,
    explanation:
      "Differences can result from varying definitions, time periods, methods, or data quality. Compare the underlying evidence before drawing conclusions.",
    hints: [
      "Think about why two statistics might differ.",
      "Consider when the data was collected and how the figures were calculated.",
      "Investigate the sources and methods before deciding which figure is more reliable.",
    ],
    misconceptions: {
      0: "A larger figure is not necessarily more accurate.",
      1: "Being published first does not guarantee reliability.",
      3: "Averaging incompatible statistics can produce a misleading result.",
    },
  },
];

// Unseen transfer questions: same broad concepts as the baseline, but new examples.
// These are deliberately separate from QUESTIONS so the post-practice test is not a repeat.
const TRANSFER_QUESTIONS = [
  { id: "tm1", subject: "math", topic: "Algebra", difficulty: "Beginner", question: "Solve: 3x + 4 = 19", options: ["x = 3", "x = 5", "x = 7", "x = 15"], answer: 1, explanation: "Subtract 4 from both sides to get 3x = 15, then divide by 3: x = 5.", hints: ["Isolate the term containing x.", "Subtract 4 from both sides first.", "3x = 15, so divide both sides by 3."], misconceptions: { 0: "Check the subtraction and division.", 2: "Divide 15 by the coefficient 3.", 3: "Remember to divide after subtracting 4." } },
  { id: "tm2", subject: "math", topic: "Arithmetic", difficulty: "Beginner", question: "What is 20% of 150?", options: ["20", "25", "30", "35"], answer: 2, explanation: "20% = 0.20, and 0.20 × 150 = 30.", hints: ["Convert 20% to a decimal or fraction.", "10% of 150 is 15.", "20% is twice 10%, so double 15."], misconceptions: { 0: "Calculate the percentage of 150, not just the percentage number.", 1: "Check the multiplication: 0.2 × 150.", 3: "Try finding 10% first, then doubling it." } },
  { id: "tm3", subject: "math", topic: "Patterns", difficulty: "Beginner", question: "What comes next: 5, 10, 20, 40, ...?", options: ["45", "60", "75", "80"], answer: 3, explanation: "Each term is doubled, so 40 × 2 = 80.", hints: ["Compare each term with the previous one.", "Look for a repeated multiplication rule.", "Double 40 to get the next term."], misconceptions: { 0: "The pattern is multiplication, not adding 5.", 1: "Check the multiplier between consecutive terms.", 2: "Apply the same rule to 40." } },
  { id: "tp1", subject: "programming", topic: "Java Fundamentals", difficulty: "Beginner", question: "What does this Java expression print?", code: "int a = 9;\nint b = 4;\nSystem.out.println(a / b);", options: ["2", "2.25", "3", "Error"], answer: 0, explanation: "Both operands are integers, so Java integer division discards the fractional part and prints 2.", hints: ["Check the types of both variables.", "Both values are integers.", "Integer division truncates rather than rounding."], misconceptions: { 1: "That would be floating-point division.", 2: "Integer division does not round up.", 3: "These integer operands are valid." } },
  { id: "tp2", subject: "programming", topic: "Loops", difficulty: "Beginner", question: "How many times does this loop run?", code: "for (int i = 1; i <= 3; i++) {\n    System.out.println(i);\n}", options: ["2 times", "3 times", "4 times", "Infinitely"], answer: 1, explanation: "The loop runs for i = 1, 2, and 3. It stops when i becomes 4.", hints: ["List the values of i that satisfy the condition.", "The condition includes 3 because it uses <=.", "The valid values are 1, 2, and 3."], misconceptions: { 0: "Count the starting value too.", 2: "When i is 4, the condition is false.", 3: "The counter increases and eventually makes the condition false." } },
  { id: "tp3", subject: "programming", topic: "Conditionals", difficulty: "Beginner", question: "What does this Java code print?", code: `int n = 12;\nif (n % 2 == 0) {\n    System.out.println("Even");\n} else {\n    System.out.println("Odd");\n}`, options: ["Odd", "Even", "12", "Error"], answer: 1, explanation: "12 divided by 2 has remainder 0, so the condition is true and the code prints Even.", hints: ["The % operator gives the remainder.", "Check the remainder when 12 is divided by 2.", "A remainder of 0 makes the condition true."], misconceptions: { 0: "A number divisible by 2 is even.", 2: "Follow the selected print statement in the if/else.", 3: "The code and operators are valid." } },
  { id: "ts1", subject: "science", topic: "Physics", difficulty: "Beginner", question: "If an object's speed triples, by what factor does its kinetic energy change?", options: ["3 times", "6 times", "9 times", "It stays the same"], answer: 2, explanation: "Kinetic energy is proportional to speed squared. Tripling speed multiplies kinetic energy by 3² = 9.", hints: ["Recall the kinetic energy formula.", "Speed is squared in the formula.", "Square the speed multiplier 3."], misconceptions: { 0: "The relationship is quadratic, not linear.", 1: "Square 3 rather than doubling it.", 3: "Kinetic energy depends on speed." } },
  { id: "ts2", subject: "science", topic: "Biology", difficulty: "Beginner", question: "Which organelle contains most of a eukaryotic cell's genetic material?", options: ["Ribosome", "Nucleus", "Mitochondrial membrane", "Golgi apparatus"], answer: 1, explanation: "The nucleus contains most of a eukaryotic cell's DNA.", hints: ["Think of the cell's main information-storage compartment.", "It is often called the control centre of the cell.", "The organelle is the nucleus."], misconceptions: { 0: "Ribosomes make proteins.", 2: "This is not the main location of cellular DNA.", 3: "The Golgi apparatus modifies and packages molecules." } },
  { id: "ts3", subject: "science", topic: "Chemistry", difficulty: "Beginner", question: "A solution with pH 3 is best described as:", options: ["Neutral", "Acidic", "Basic", "Always pure water"], answer: 1, explanation: "Values below 7 are acidic at the usual reference conditions.", hints: ["Recall where acids lie on the pH scale.", "Values below 7 are not neutral.", "pH 3 is below 7."], misconceptions: { 0: "Neutral is approximately pH 7.", 2: "Basic solutions are generally above pH 7.", 3: "pH 3 indicates acidity." } },
  { id: "tg1", subject: "general", topic: "Critical Thinking", difficulty: "Beginner", question: "A viral post says a supplement guarantees better memory. What should you do first?", options: ["Buy it immediately", "Check reliable evidence and study quality", "Trust it because many people shared it", "Assume every claim online is false"], answer: 1, explanation: "Check the evidence, methods, conflicts of interest, and limitations before accepting a claim.", hints: ["Popularity is not the same as evidence.", "Look for independent research and how it was conducted.", "Evaluate the source and methodology."], misconceptions: { 0: "Do not act on a claim before evaluating it.", 2: "Shares do not establish truth.", 3: "Evaluate claims individually rather than rejecting all of them." } },
  { id: "tg2", subject: "general", topic: "Logical Reasoning", difficulty: "Beginner", question: "All robins are birds. Some birds migrate. Which statement must be true?", options: ["All robins migrate", "Some robins migrate", "All robins are birds", "No robins migrate"], answer: 2, explanation: "Only the first statement guarantees that all robins are birds. The second does not say whether migrating birds are robins.", hints: ["Choose only what the statements guarantee.", "The migrating birds may or may not be robins.", "The first statement directly supports one option."], misconceptions: { 0: "The premises do not say all robins migrate.", 1: "The migrating birds are not necessarily robins.", 3: "The premises do not rule out robin migration." } },
  { id: "tg3", subject: "general", topic: "Information Literacy", difficulty: "Beginner", question: "A chart uses a truncated vertical axis that makes a small change look huge. What should you do?", options: ["Accept the visual impression", "Ignore the chart title", "Inspect the axis scale and underlying data", "Share it because it looks clear"], answer: 2, explanation: "Axis scales can exaggerate differences. Inspect the scale, data, source, and context before interpreting the chart.", hints: ["Visual design can affect how data is perceived.", "Check whether the axis starts at zero and what intervals are used.", "Inspect the scale and original numbers."], misconceptions: { 0: "The visual impression may be misleading.", 1: "The title alone is not enough; inspect the scale and data.", 3: "Clarity of presentation does not guarantee fair representation." } },
];

const FLAW_QUESTIONS = [
  { id: "f1", subject: "general", topic: "Find the Flaw", difficulty: "Beginner", question: 'A student says: "Every student who studies for 5 hours gets an A. I studied for 5 hours, so I will definitely get an A." What is the main flaw?', options: ["The conclusion is guaranteed by the evidence", "The claim assumes study time alone guarantees a grade", "Grades never depend on studying", "Five hours is always too little"], answer: 1, explanation: "Study time alone does not guarantee a grade. Prior knowledge, study quality, exam difficulty, and other factors also matter.", hints: ["Separate the amount of time spent from the result.", "Does the statement prove that study time is the only factor?", "The argument makes a guarantee without enough evidence."], misconceptions: { 0: "The conclusion goes beyond what the evidence establishes.", 2: "The flaw is not that studying is useless; it is that the guarantee is unsupported.", 3: "The exact number of hours is not the logical issue." } },
  { id: "f2", subject: "general", topic: "Find the Flaw", difficulty: "Beginner", question: 'A post says: "This app has 1 million downloads, so it must be the best learning app." Which issue is most important?', options: ["Popularity alone does not prove learning quality", "Popular apps cannot be useful", "Downloads are always fake", "The app must be expensive"], answer: 0, explanation: "Downloads measure adoption, not whether an app improves learning. Evidence about learning outcomes is needed.", hints: ["What does a download count actually measure?", "Popularity and effectiveness are different things.", "Look for evidence of learning outcomes, not just usage."], misconceptions: { 1: "Popularity does not prove quality, but it also does not prove the app is useless.", 2: "There is no evidence that the downloads are fake.", 3: "Price is not implied by the download count." } },
  { id: "f3", subject: "science", topic: "Find the Flaw", difficulty: "Beginner", question: 'A person says: "I wore my lucky bracelet and passed the exam, so the bracelet caused me to pass." What is missing?', options: ["A larger bracelet", "Evidence that rules out other explanations", "Proof that exams are impossible", "A second bracelet"], answer: 1, explanation: "One event does not establish causation. Preparation and other factors may explain the result; a controlled comparison would be needed.", hints: ["Did the observation compare outcomes with and without the bracelet?", "Correlation or sequence alone does not establish cause.", "Other explanations have not been ruled out."], misconceptions: { 0: "The size of the bracelet is irrelevant.", 2: "The claim is about causation, not whether exams are possible.", 3: "Adding another bracelet would not establish causation." } },
  { id: "f4", subject: "programming", topic: "Find the Flaw", difficulty: "Beginner", question: 'A programmer says: "My code worked once, so it is definitely bug-free." What is the flaw?', options: ["One successful test cannot cover every case", "Code should never be tested", "If code runs once, it cannot run again", "All bugs are visible immediately"], answer: 0, explanation: "A single successful test only checks one situation. Testing edge cases and different inputs helps reveal hidden bugs.", hints: ["How many inputs were tested?", "Think about edge cases and unusual inputs.", "One passing test cannot guarantee correctness for all inputs."], misconceptions: { 1: "Testing is important; the problem is too little testing.", 2: "The statement about running again is unrelated.", 3: "Many bugs only appear under specific conditions." } },
];

const STORAGE_KEY = "mindforge-v2";

function loadSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? { attempts: [], completedSessions: 0, assessments: [], recallSchedule: {}, recallHistory: [], xp: 0, streak: 0, lastActiveDate: null, achievements: [], ...JSON.parse(saved) }
      : { attempts: [], completedSessions: 0, assessments: [], recallSchedule: {}, recallHistory: [], xp: 0, streak: 0, lastActiveDate: null, achievements: [] };
  } catch {
    return { attempts: [], completedSessions: 0, assessments: [], recallSchedule: {}, recallHistory: [], xp: 0, streak: 0, lastActiveDate: null, achievements: [] };
  }
}

function accuracy(items) {
  if (!items.length) return 0;

  const correct = items.filter((item) => item.correct).length;
  return Math.round((correct / items.length) * 100);
}

function nextRecallDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function formatRecallDate(value) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function getAssistanceGap(assistedItems, independentItems) {
  if (!assistedItems.length || !independentItems.length) return null;

  return accuracy(assistedItems) - accuracy(independentItems);
}

function App() {
  const [savedData, setSavedData] = useState(loadSavedData);
  const [view, setView] = useState("home");
  const [subject, setSubject] = useState("all");
  const [mode, setMode] = useState("assisted");
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [sessionAttempts, setSessionAttempts] = useState([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [workflow, setWorkflow] = useState("practice");
  const [baselineResult, setBaselineResult] = useState(null);
  const [currentCycleId, setCurrentCycleId] = useState(null);
  const [recallQuestionIds, setRecallQuestionIds] = useState([]);
  const [arenaNotice, setArenaNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
  }, [savedData]);

  const currentQuestion = sessionQuestions[questionIndex];

  const filteredQuestions = useMemo(() => {
    if (subject === "all") return QUESTIONS;
    return QUESTIONS.filter((question) => question.subject === subject);
  }, [subject]);

  const totalAttempts = savedData.attempts.length;
  const overallAccuracy = accuracy(savedData.attempts);
  const averageHints = totalAttempts
    ? (
        savedData.attempts.reduce(
          (sum, attempt) => sum + (attempt.hints || 0),
          0,
        ) / totalAttempts
      ).toFixed(1)
    : "0.0";

  const assistedAttempts = savedData.attempts.filter(
    (attempt) => attempt.mode === "assisted",
  );
  const independentAttempts = savedData.attempts.filter(
    (attempt) => attempt.mode === "independent" && attempt.workflow !== "baseline",
  );

  const assistanceGap = getAssistanceGap(
    assistedAttempts,
    independentAttempts,
  );

  const subjectStats = SUBJECTS.filter((item) => item.id !== "all").map(
    (item) => {
      const attempts = savedData.attempts.filter(
        (attempt) => attempt.subject === item.id,
      );

      return {
        ...item,
        attempts: attempts.length,
        accuracy: accuracy(attempts),
      };
    },
  );

  function startSession(selectedSubject, selectedMode, selectedWorkflow = "practice", cycleId = null) {
    const sourceQuestions = selectedWorkflow === "transfer" ? TRANSFER_QUESTIONS : QUESTIONS;
    const pool =
      selectedSubject === "all"
        ? sourceQuestions
        : sourceQuestions.filter((question) => question.subject === selectedSubject);

    if (!pool.length) return;

    setSubject(selectedSubject);
    setMode(selectedMode);
    setWorkflow(selectedWorkflow);
    setCurrentCycleId(cycleId);

    // Rotate the question order so successive sessions are less predictable.
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    setSessionQuestions(shuffled);
    setQuestionIndex(0);
    setSelected(null);
    setSubmitted(false);
    setHintLevel(0);
    setSessionAttempts([]);
    setSessionFinished(false);
    setView("session");
  }

  function startRecallSession(questionIds) {
    const bank = [...QUESTIONS, ...TRANSFER_QUESTIONS];
    const selectedQuestions = questionIds.map((id) => bank.find((question) => question.id === id)).filter(Boolean);
    if (!selectedQuestions.length) return;
    setRecallQuestionIds(questionIds);
    setSubject("all");
    setMode("independent");
    setWorkflow("recall");
    setCurrentCycleId(null);
    setSessionQuestions(selectedQuestions);
    setQuestionIndex(0);
    setSelected(null);
    setSubmitted(false);
    setHintLevel(0);
    setSessionAttempts([]);
    setSessionFinished(false);
    setView("session");
  }

  function submitAnswer() {
    if (selected === null || submitted || !currentQuestion) return;

    const isCorrect = selected === currentQuestion.answer;

    const attempt = {
      id: `${Date.now()}-${currentQuestion.id}`,
      questionId: currentQuestion.id,
      subject: currentQuestion.subject,
      topic: currentQuestion.topic,
      mode,
      workflow,
      cycleId: currentCycleId,
      correct: isCorrect,
      hints: mode === "assisted" ? hintLevel : 0,
      timestamp: new Date().toISOString(),
    };

    setSessionAttempts((previous) => [...previous, attempt]);
    setSavedData((previous) => {
      const schedule = { ...(previous.recallSchedule || {}) };
      const history = [...(previous.recallHistory || [])];
      const old = schedule[currentQuestion.id];
      let intervalDays = 1;
      let repetitions = 0;
      if (workflow === "recall") {
        repetitions = isCorrect ? (old?.repetitions || 0) + 1 : 0;
        intervalDays = isCorrect ? (repetitions === 1 ? 3 : 7) : 1;
        history.push({ questionId: currentQuestion.id, correct: isCorrect, timestamp: new Date().toISOString(), intervalDays });
      } else if (workflow !== "baseline") {
        repetitions = isCorrect ? 1 : 0;
        intervalDays = isCorrect ? 3 : 1;
      } else {
        // Baseline questions are scheduled only if the student missed them.
        intervalDays = isCorrect ? 3 : 1;
      }
      schedule[currentQuestion.id] = {
        questionId: currentQuestion.id,
        subject: currentQuestion.subject,
        topic: currentQuestion.topic,
        dueAt: nextRecallDate(intervalDays),
        intervalDays,
        repetitions,
        lastCorrect: isCorrect,
        lastReviewedAt: new Date().toISOString(),
      };
      const today = new Date().toISOString().slice(0, 10);
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().slice(0, 10);
      const previousDay = previous.lastActiveDate;
      const streak = previousDay === today ? (previous.streak || 1) : previousDay === yesterday ? (previous.streak || 0) + 1 : 1;
      let earned = isCorrect ? (workflow === "recall" ? 25 : workflow === "transfer" ? 30 : mode === "independent" ? 20 : 10) : 3;
      if (isCorrect && mode === "assisted" && hintLevel > 0) earned = 8;
      const xp = (previous.xp || 0) + earned;
      const achievements = new Set(previous.achievements || []);
      const allAttempts = [...previous.attempts, attempt];
      if (allAttempts.length >= 1) achievements.add("first-step");
      if (allAttempts.filter((a) => a.correct && a.mode === "independent").length + (isCorrect && mode === "independent" ? 1 : 0) >= 10) achievements.add("independent-10");
      if (allAttempts.some((a) => a.workflow === "recall") || workflow === "recall") achievements.add("memory-builder");
      if (allAttempts.length >= 25) achievements.add("steady-practice");
      return {
        ...previous,
        attempts: [...previous.attempts, attempt],
        recallSchedule: schedule,
        recallHistory: history,
        xp, streak, lastActiveDate: today, achievements: [...achievements],
      };
    });
    setSubmitted(true);
  }

  function requestHint() {
    if (
      mode !== "assisted" || workflow === "baseline" ||
      submitted ||
      !currentQuestion ||
      hintLevel >= currentQuestion.hints.length
    ) {
      return;
    }

    setHintLevel((previous) => previous + 1);
  }

  function nextQuestion() {
    if (questionIndex + 1 >= sessionQuestions.length) {
      setSessionFinished(true);
      setSavedData((previous) => ({
        ...previous,
        completedSessions: previous.completedSessions + 1,
      }));
      if (workflow === "baseline") {
        const result = { subject, cycleId: currentCycleId, accuracy: accuracy(sessionAttempts), total: sessionAttempts.length, correct: sessionAttempts.filter((item) => item.correct).length, timestamp: new Date().toISOString() };
        setBaselineResult(result);
        setSavedData((previous) => ({ ...previous, assessments: [...(previous.assessments || []), { ...result, type: "baseline" }] }));
      } else if (workflow === "independent" || workflow === "transfer") {
        const result = { subject, cycleId: currentCycleId, accuracy: accuracy(sessionAttempts), total: sessionAttempts.length, correct: sessionAttempts.filter((item) => item.correct).length, timestamp: new Date().toISOString() };
        setSavedData((previous) => ({ ...previous, assessments: [...(previous.assessments || []), { ...result, type: workflow }] }));
      }
      setView("results");
      return;
    }

    setQuestionIndex((previous) => previous + 1);
    setSelected(null);
    setSubmitted(false);
    setHintLevel(0);
  }

  function resetAllProgress() {
    const confirmed = window.confirm(
      "Delete all saved MindForge learning history from this browser?",
    );

    if (!confirmed) return;

    setSavedData({ attempts: [], completedSessions: 0, assessments: [], recallSchedule: {}, recallHistory: [], xp: 0, streak: 0, lastActiveDate: null, achievements: [] });
    setBaselineResult(null);
  }

  function startGame(game) {
    const pool = game === "transfer" ? TRANSFER_QUESTIONS : game === "flaw" ? FLAW_QUESTIONS : QUESTIONS;
    const shuffled = shuffleArray(pool);
    const count = game === "quickfire" ? 5 : game === "boss" ? 8 : game === "flaw" ? 4 : pool.length;
    const chosen = shuffled.slice(0, Math.min(count, shuffled.length));
    setSubject("all");
    setMode("independent");
    setWorkflow(game === "transfer" ? "transfer" : game);
    setCurrentCycleId(null);
    setSessionQuestions(chosen);
    setQuestionIndex(0);
    setSelected(null);
    setSubmitted(false);
    setHintLevel(0);
    setSessionAttempts([]);
    setSessionFinished(false);
    setArenaNotice("");
    setView("session");
  }

  function startIndependentChallenge() {
    startSession(subject, "independent", "independent");
  }

  function startBaseline(selectedSubject = "all") {
    const cycleId = `cycle-${Date.now()}`;
    setBaselineResult({ cycleId, subject: selectedSubject });
    startSession(selectedSubject, "independent", "baseline", cycleId);
  }

  function startGuidedPractice() {
    startSession(baselineResult?.subject || subject, "assisted", "practice", baselineResult?.cycleId || null);
  }

  function startTransferAssessment() {
    startSession(baselineResult?.subject || subject, "independent", "transfer", baselineResult?.cycleId || null);
  }

  function subjectName(id) {
    return SUBJECTS.find((item) => item.id === id)?.name || id;
  }

  function renderHeader() {
    return (
      <header className="topbar">
        <div className="breadcrumb">
          MindForge <span>/</span>{" "}
          {view === "home"
            ? "Learning Studio"
            : view === "progress"
              ? "My Progress"
              : view === "recall"
                ? "Smart Recall"
                : view === "arena"
                  ? "Brain Arena"
                  : view === "session"
                  ? "Learning Session"
                  : "Session Results"}
        </div>

        <div className="topbar-right">
          <span className="status-dot" />
          Independent learning mode
          <div className="top-avatar">S</div>
        </div>
      </header>
    );
  }

  function renderSidebar() {
    return (
      <aside className="sidebar">
        <button className="brand brand-button" onClick={() => setView("home")}>
          <div className="brand-icon">M</div>
          <div>
            <h2>
              MindForge<span>AI</span>
            </h2>
            <p>THINK BEYOND ANSWERS</p>
          </div>
        </button>

        <div className="nav-label">WORKSPACE</div>

        <button
          className={`nav-item ${view === "home" || view === "session" || view === "results" ? "active" : ""}`}
          onClick={() => setView("home")}
        >
          <span>◈</span> Learning Studio
        </button>

        <button
          className={`nav-item ${view === "progress" ? "active" : ""}`}
          onClick={() => setView("progress")}
        >
          <span>▥</span> My Progress
        </button>

        <button
          className={`nav-item ${view === "recall" ? "active" : ""}`}
          onClick={() => setView("recall")}
        >
          <span>◷</span> Smart Recall
        </button>

        <button
          className={`nav-item ${view === "arena" ? "active" : ""}`}
          onClick={() => setView("arena")}
        >
          <span>⚔</span> Brain Arena
        </button>

        <div className="sidebar-bottom">
          <div className="brain-card">
            <div className="brain-icon">✳</div>
            <h3>Train your thinking.</h3>
            <p>Understand concepts, test your reasoning, and learn independently.</p>
          </div>

          <div className="profile">
            <div className="avatar">S</div>
            <div>
              <strong>Student</strong>
              <p>Independent learner</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  function renderHome() {
    return (
      <>
        <section className="welcome-section">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" />
              YOUR PERSONAL LEARNING SPACE
            </div>

            <h1>
              Think deeper.
              <br />
              <span>Learn smarter.</span>
            </h1>

            <p>
              Learn across subjects. Practice independently. Understand why.
            </p>
          </div>

          <div className="welcome-art">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="core">✳</div>
            <span className="art-dot dot-one" />
            <span className="art-dot dot-two" />
            <span className="art-dot dot-three" />
          </div>
        </section>

        <section className="stats-grid">
          <StatCard
            label="Overall accuracy"
            value={`${overallAccuracy}%`}
            caption="Across recorded attempts"
            icon="◎"
            color="purple"
          />

          <StatCard
            label="Questions attempted"
            value={totalAttempts}
            caption="Your recorded learning activity"
            icon="↗"
            color="blue"
          />

          <StatCard
            label="Average hints"
            value={averageHints}
            caption="Hints per recorded question"
            icon="✳"
            color="orange"
          />
        </section>

        <section className="game-summary panel-card">
          <div className="game-summary-main">
            <div className="panel-kicker">YOUR THINKING PROFILE</div>
            <h2>Level {Math.floor((savedData.xp || 0) / 250) + 1} · {getLevelName(savedData.xp || 0)}</h2>
            <p>Earn XP for thoughtful effort, independent answers, transfer challenges, and recall.</p>
            <div className="xp-track"><span style={{ width: `${((savedData.xp || 0) % 250) / 250 * 100}%` }} /></div>
            <small>{(savedData.xp || 0) % 250} / 250 XP to next level · {savedData.xp || 0} total XP</small>
          </div>
          <div className="game-mini-stat"><strong>🔥 {savedData.streak || 0}</strong><span>day streak</span></div>
          <div className="game-mini-stat"><strong>🏅 {(savedData.achievements || []).length}</strong><span>achievements</span></div>
          <button className="primary-button" onClick={() => setView("arena")}>Enter Brain Arena <span>→</span></button>
        </section>

        <section className="missions-panel panel-card">
          <div className="panel-kicker">SMALL STEPS, REAL SKILL</div>
          <h2>Today's brain missions</h2>
          <p>Short goals reward practice without encouraging endless screen time.</p>
          <div className="mission-grid">
            <Mission title="Warm-up" detail="Answer 3 questions" done={savedData.attempts.filter((a) => isToday(a.timestamp)).length >= 3} reward="+30 XP" />
            <Mission title="Think independently" detail="Get 2 answers correct without hints" done={savedData.attempts.filter((a) => isToday(a.timestamp) && a.mode === "independent" && a.correct).length >= 2} reward="+40 XP" />
            <Mission title="Remember it" detail="Complete 1 recall question" done={savedData.attempts.some((a) => isToday(a.timestamp) && a.workflow === "recall")} reward="+25 XP" />
          </div>
          <p className="metric-note">Missions currently track your activity; rewards are awarded for recorded learning actions rather than claimed automatically for mission completion.</p>
        </section>

        <section className="subject-section">
          <div className="section-title-row">
            <div>
              <div className="panel-kicker">CHOOSE YOUR PATH</div>
              <h2>What would you like to learn?</h2>
            </div>
          </div>

          <div className="subject-grid">
            {SUBJECTS.filter((item) => item.id !== "all").map((item) => {
              const stats = subjectStats.find(
                (stat) => stat.id === item.id,
              );

              return (
                <button
                  key={item.id}
                  className="subject-card"
                  onClick={() => {
                    setSubject(item.id);
                    startSession(item.id, "assisted");
                  }}
                >
                  <div className={`subject-icon ${item.id}`}>
                    {item.icon}
                  </div>

                  <h3>{item.name}</h3>

                  <p>
                    {stats.attempts
                      ? `${stats.attempts} attempts · ${stats.accuracy}% accuracy`
                      : "Start a new learning journey"}
                  </p>

                  <span className="subject-arrow">→</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="learning-layout">
          <div className="question-panel overview-panel">
            <div className="panel-kicker">YOUR LEARNING ENGINE</div>
            <h2>Understand, don't memorize.</h2>
            <p className="overview-copy">
              MindForge guides you through a cycle of thinking, practice,
              independent application, and reflection.
            </p>

            <div className="workflow-list">
              <WorkflowItem
                number="01"
                title="Think first"
                description="Attempt a problem before requesting assistance."
              />
              <WorkflowItem
                number="02"
                title="Learn with guidance"
                description="Use hints and feedback to understand mistakes."
              />
              <WorkflowItem
                number="03"
                title="Prove your understanding"
                description="Test your ability to solve problems independently."
              />
            </div>

            <button
              className="primary-button"
              onClick={() => startBaseline("all")}
            >
              Start baseline assessment <span>→</span>
            </button>
            <button
              className="secondary-button"
              onClick={() => startSession("all", "assisted", "practice")}
            >
              Start guided practice
            </button>
          </div>

          <aside className="coach-panel">
            <div className="coach-heading">
              <div className="coach-symbol">✳</div>
              <div>
                <h3>Thinking coach</h3>
                <p>GUIDANCE, NOT ANSWERS</p>
              </div>
            </div>

            <div className="coach-message">
              <div className="coach-mini-icon">✳</div>
              <div>
                <strong>Your effort matters.</strong>
                <p>
                  A wrong answer can reveal what you need to learn next. Take
                  your time and explain your reasoning.
                </p>
              </div>
            </div>

            <div className="coach-divider" />

            <h4>YOUR LEARNING PRINCIPLES</h4>

            <Principle
              number="01"
              title="Attempt first"
              description="Make your own prediction before seeking help."
            />

            <Principle
              number="02"
              title="Understand why"
              description="Focus on the reasoning behind an answer."
            />

            <Principle
              number="03"
              title="Apply independently"
              description="Test what you can do without assistance."
            />
          </aside>
        </section>

        <footer className="page-footer">
          <span>MINDFORGE AI © 2026</span>
          <span>Designed to strengthen independent thinking.</span>
          <button onClick={() => setView("progress")}>View progress</button>
        </footer>
      </>
    );
  }

  function renderArena() {
    const xp = savedData.xp || 0;
    const achievementInfo = [
      ["first-step", "🌱 First Step", "Record your first attempt"],
      ["independent-10", "🧠 Independent Thinker", "Get 10 independent answers correct"],
      ["memory-builder", "🔁 Memory Builder", "Complete a Smart Recall review"],
      ["steady-practice", "⚒ Consistent Practice", "Record 25 attempts"],
    ];
    return (
      <section className="arena-page">
        <div className="eyebrow"><span className="eyebrow-line" /> PLAY WITH PURPOSE</div>
        <h1>Welcome to the <span>Brain Arena.</span></h1>
        <p className="arena-lead">Choose a mission. Earn experience by thinking carefully, learning from mistakes, and applying ideas independently.</p>
        <div className="arena-hero panel-card">
          <div><div className="panel-kicker">YOUR CURRENT RANK</div><h2>Level {Math.floor(xp / 250) + 1} — {getLevelName(xp)}</h2><p>{xp} XP earned · {250 - (xp % 250)} XP to your next level</p><div className="xp-track"><span style={{ width: `${(xp % 250) / 250 * 100}%` }} /></div></div>
          <div className="arena-emblem">⚔</div>
        </div>
        <div className="arena-grid">
          <GameCard icon="⚡" title="Quickfire" badge="5 QUESTIONS" detail="A short, no-hint challenge to practise independent recall." reward="Independent correct answers earn bonus XP." onClick={() => startGame("quickfire")} />
          <GameCard icon="🧩" title="Logic Quest" badge="ALL SUBJECTS" detail="Work through mixed questions and focus on the reasoning behind each choice." reward="Build consistency across subjects." onClick={() => startGame("logic")} />
          <GameCard icon="👾" title="Boss Battle" badge="8 QUESTIONS" detail="A longer challenge. Learn from misses and finish the full round." reward="Earn XP for each thoughtful attempt." onClick={() => startGame("boss")} />
          <GameCard icon="🔍" title="Find the Flaw" badge="CRITICAL THINKING" detail="Inspect claims and explanations. Look for what the evidence actually supports." reward="Practise careful reasoning, not blind trust." onClick={() => startGame("flaw")} />
          <GameCard icon="🛡️" title="No-Hint Challenge" badge="INDEPENDENT MODE" detail="Test what you can do without support." reward="+20 XP for a correct independent answer." onClick={() => startSession("all", "independent", "independent")} />
          <GameCard icon="🔄" title="Transfer Trial" badge="UNSEEN QUESTIONS" detail="Apply familiar concepts to different questions." reward="Transfer answers earn the highest per-answer XP." onClick={() => startGame("transfer")} />
        </div>
        <div className="panel-card achievement-panel"><div className="panel-kicker">ACHIEVEMENT CASE</div><h2>Milestones you've unlocked</h2><div className="achievement-grid">{achievementInfo.map(([id, title, detail]) => <div className={`achievement-tile ${(savedData.achievements || []).includes(id) ? "unlocked" : "locked"}`} key={id}><strong>{title}</strong><p>{detail}</p><span>{(savedData.achievements || []).includes(id) ? "UNLOCKED" : "NOT YET"}</span></div>)}</div></div>
        <p className="metric-note">Game rewards are motivational signals, not a measure of intelligence. XP and streaks are stored in this browser. The prototype's question bank is limited, so scores are exploratory.</p>
      </section>
    );
  }

  function renderSession() {
    if (!currentQuestion) {
      return <p>No questions available for this subject.</p>;
    }

    const isCorrect = submitted && selected === currentQuestion.answer;
    const canHint =
      mode === "assisted" &&
      workflow !== "baseline" &&
      !submitted &&
      hintLevel < currentQuestion.hints.length;

    return (
      <>
        <section className="session-intro">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" />
              {mode === "assisted"
                ? "GUIDED LEARNING"
                : "INDEPENDENT CHALLENGE"}
            </div>

            <h1>
              {workflow === "recall" ? "Remember without hints." : workflow === "baseline" ? "Measure your starting point." : workflow === "transfer" ? "Apply what you learned." : workflow === "quickfire" ? "Quickfire: trust your thinking." : workflow === "boss" ? "Boss battle: show your mastery." : workflow === "flaw" ? "Find the flaw." : mode === "assisted" ? "Learn through practice." : "Think independently."}
            </h1>

            <p>
              {workflow === "recall"
                ? "Recall questions are due for review. Answer independently to update your next review date."
                : workflow === "quickfire"
                  ? "Five questions. No hints. Focus on reasoning, not rushing."
                  : workflow === "boss"
                    ? "A longer challenge across concepts. Each answer is progress; learn from every miss."
                    : workflow === "flaw"
                      ? "Inspect each claim carefully and choose the reasoning that holds up."
                : workflow === "transfer"
                ? "These are new questions on related concepts. Hints are disabled."
                : mode === "assisted"
                  ? "Try the question first. Ask for a hint if you need help."
                  : "Hints are disabled for this challenge. Apply what you know."}
            </p>
          </div>

          <button className="secondary-button" onClick={() => setView("home")}>
            Exit session
          </button>
        </section>

        <section className="learning-layout session-layout">
          <div className="question-panel">
            <div className="panel-header">
              <div>
                <div className="panel-kicker">
                  {workflow === "recall" ? "SMART RECALL · NO HINTS" : workflow === "baseline" ? "BASELINE TEST · NO HINTS" : workflow === "transfer" ? "UNSEEN TRANSFER TEST · NO HINTS" : mode === "assisted" ? "ASSISTED PRACTICE" : "INDEPENDENT TEST"}
                </div>
                <h2>Challenge yourself</h2>
              </div>

              <span className="question-count">
                {questionIndex + 1} / {sessionQuestions.length}
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${((questionIndex + 1) / sessionQuestions.length) * 100}%`,
                }}
              />
            </div>

            <div className="question-meta">
              <span className="topic-tag">{currentQuestion.topic}</span>
              <span className="difficulty">
                <span /> {currentQuestion.difficulty}
              </span>
              <span className="topic-tag">
                {subjectName(currentQuestion.subject)}
              </span>
            </div>

            <h3 className="question-title">{currentQuestion.question}</h3>

            {currentQuestion.code && (
              <pre className="code-block">
                <div className="code-top">
                  <span>● ● ●</span>
                  <span>Code</span>
                </div>
                <code>{currentQuestion.code}</code>
              </pre>
            )}

            <div className="answer-heading">
              <span>YOUR ANSWER</span>
              <span>Select one option</span>
            </div>

            <div className="options-grid">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option}
                  className={`option ${
                    selected === index ? "selected" : ""
                  } ${
                    submitted && index === currentQuestion.answer
                      ? "correct-option"
                      : ""
                  } ${
                    submitted &&
                    selected === index &&
                    !isCorrect
                      ? "wrong-option"
                      : ""
                  }`}
                  onClick={() => !submitted && setSelected(index)}
                  disabled={submitted}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>

                  {submitted && index === currentQuestion.answer && (
                    <span className="option-check">✓</span>
                  )}
                </button>
              ))}
            </div>

            {hintLevel > 0 && mode === "assisted" && !submitted && (
              <div className="hint-box">
                <span>✳</span>
                <div>
                  <strong>Hint {hintLevel}</strong>
                  <p>{currentQuestion.hints[hintLevel - 1]}</p>
                </div>
              </div>
            )}

            {submitted && (
              <div className={`feedback ${isCorrect ? "feedback-correct" : ""}`}>
                <strong>
                  {isCorrect ? "✓ Correct answer" : "↗ Let's learn from this"}
                </strong>

                <p>{currentQuestion.explanation}</p>

                {!isCorrect && currentQuestion.misconceptions[selected] && (
                  <p>
                    <strong>What to review: </strong>
                    {currentQuestion.misconceptions[selected]}
                  </p>
                )}

                <small>
                  {mode === "independent"
                    ? "Independent result recorded without hints."
                    : hintLevel === 0
                      ? "You answered without hints. Keep practising."
                      : `You used ${hintLevel} hint(s). Apply what you learned to the next challenge.`}
                </small>
              </div>
            )}

            <div className="question-actions">
              <button
                className="hint-button"
                onClick={requestHint}
                disabled={!canHint}
              >
                ✳{" "}
                {mode === "independent"
                  ? "Hints disabled"
                  : hintLevel >= currentQuestion.hints.length
                    ? "All hints used"
                    : "Get a hint"}
              </button>

              {!submitted ? (
                <button
                  className="primary-button"
                  onClick={submitAnswer}
                  disabled={selected === null}
                >
                  Submit answer <span>→</span>
                </button>
              ) : (
                <button className="primary-button" onClick={nextQuestion}>
                  {questionIndex + 1 >= sessionQuestions.length
                    ? "View results"
                    : "Next question"}{" "}
                  <span>→</span>
                </button>
              )}
            </div>
          </div>

          <aside className="coach-panel">
            <div className="coach-heading">
              <div className="coach-symbol">✳</div>
              <div>
                <h3>Thinking coach</h3>
                <p>YOUR LEARNING COMPANION</p>
              </div>
            </div>

            <div className="coach-message">
              <div className="coach-mini-icon">✳</div>
              <div>
                <strong>
                  {mode === "assisted"
                    ? "Think before you reveal."
                    : "Trust your understanding."}
                </strong>
                <p>
                  {mode === "assisted"
                    ? "Attempt the problem first. Each hint is a step toward understanding."
                    : "Take your time. Use your own reasoning before submitting."}
                </p>
              </div>
            </div>

            <div className="coach-divider" />

            <h4>SESSION PROGRESS</h4>

            <Principle
              number="01"
              title="Questions completed"
              description={`${sessionAttempts.length} of ${sessionQuestions.length}`}
            />

            <Principle
              number="02"
              title="Hints requested"
              description={`${sessionAttempts.reduce((sum, item) => sum + item.hints, 0) + hintLevel} during this session`}
            />

            <Principle
              number="03"
              title="Learning mode"
              description={
                mode === "assisted"
                  ? "Hints available"
                  : "Independent assessment"
              }
            />

            {mode === "assisted" && workflow !== "baseline" && (
              <button
                className="secondary-button full-width"
                onClick={startIndependentChallenge}
              >
                Switch to independent mode
              </button>
            )}
          </aside>
        </section>
      </>
    );
  }

  function renderResults() {
    const assistedCorrect = sessionAttempts.filter(
      (item) => item.correct,
    ).length;

    const sessionAccuracy = accuracy(sessionAttempts);

    return (
      <section className="results-page">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          SESSION COMPLETE
        </div>

        <h1>
          Every attempt is <span>a chance to grow.</span>
        </h1>

        <p className="progress-description">
          Here is what your latest learning session demonstrates.
        </p>

        <div className="stats-grid">
          <StatCard
            label="Questions completed"
            value={sessionAttempts.length}
            caption="Recorded in this session"
            icon="↗"
            color="blue"
          />

          <StatCard
            label="Session accuracy"
            value={`${sessionAccuracy}%`}
            caption={`${assistedCorrect} correct answers`}
            icon="◎"
            color="purple"
          />

          <StatCard
            label="Hints used"
            value={sessionAttempts.reduce((sum, item) => sum + item.hints, 0)}
            caption="During completed questions"
            icon="✳"
            color="orange"
          />
        </div>

        <div className="question-panel result-panel">
          <h2>What should you do next?</h2>

          <p className="overview-copy">
            {sessionAccuracy >= 80
              ? "You performed well in this session. Try an independent challenge to see whether you can apply these concepts without hints."
              : "Review the explanations for questions you missed, then try another session. Focus on understanding the reasoning behind each answer."}
          </p>

          <div className="question-actions">
            <button
              className="hint-button"
              onClick={() => setView("progress")}
            >
              View learning history
            </button>

            {workflow === "recall" ? (
              <button className="primary-button" onClick={() => setView("recall")}>Back to Smart Recall <span>→</span></button>
            ) : workflow === "baseline" ? (
              <button className="primary-button" onClick={startGuidedPractice}>
                Continue to guided practice <span>→</span>
              </button>
            ) : workflow === "practice" ? (
              <button className="primary-button" onClick={startTransferAssessment}>
                Take unseen transfer test <span>→</span>
              </button>
            ) : workflow === "independent" ? (
              <button className="primary-button" onClick={startTransferAssessment}>
                Take unseen transfer test <span>→</span>
              </button>
            ) : (
              <button className="primary-button" onClick={() => setView("progress")}>
                View learning comparison <span>→</span>
              </button>
            )}
          </div>
        </div>

        <div className="question-panel result-panel">
          <h2>Session review</h2>

          {sessionAttempts.map((attempt, index) => {
            const question = [...QUESTIONS, ...TRANSFER_QUESTIONS].find(
              (item) => item.id === attempt.questionId,
            );

            return (
              <div className="history-row" key={attempt.id}>
                <div>
                  <strong>
                    {index + 1}. {question?.topic || "Question"}
                  </strong>
                  <p>{subjectName(attempt.subject)}</p>
                </div>

                <span
                  className={`history-result ${
                    attempt.correct ? "result-correct" : "result-wrong"
                  }`}
                >
                  {attempt.correct ? "Correct" : "Needs practice"}
                </span>
              </div>
            );
          })}
        </div>

        <button className="primary-button back-button" onClick={() => setView("home")}>
          Return to dashboard
        </button>
      </section>
    );
  }

  function renderRecall() {
    const bank = [...QUESTIONS, ...TRANSFER_QUESTIONS];
    const schedule = savedData.recallSchedule || {};
    const entries = Object.values(schedule).sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
    const now = Date.now();
    const due = entries.filter((item) => new Date(item.dueAt).getTime() <= now);
    const upcoming = entries.filter((item) => new Date(item.dueAt).getTime() > now);
    const history = savedData.recallHistory || [];
    const recallAccuracy = history.length ? accuracy(history.map((item) => ({ correct: item.correct }))) : 0;
    const dueIds = due.map((item) => item.questionId);
    return (
      <section className="progress-page">
        <div className="eyebrow"><span className="eyebrow-line" /> SPACED REPETITION</div>
        <h1>Smart Recall, <span>stronger memory.</span></h1>
        <p className="progress-description">Review concepts at planned intervals, answer without hints, and let your performance schedule the next review.</p>
        <div className="stats-grid">
          <StatCard label="Due today" value={due.length} caption="Concepts ready to review" icon="◷" color="purple" />
          <StatCard label="Upcoming" value={upcoming.length} caption="Scheduled for later" icon="↗" color="blue" />
          <StatCard label="Recall accuracy" value={`${recallAccuracy}%`} caption={`${history.length} recall reviews completed`} icon="◎" color="orange" />
        </div>
        <div className="question-panel result-panel">
          <div className="panel-kicker">YOUR NEXT REVIEW</div>
          <h2>{due.length ? `${due.length} question${due.length === 1 ? "" : "s"} ready` : "You're up to date"}</h2>
          <p className="overview-copy">Incorrect answers return in 1 day. A correct first recall schedules 3 days; repeated successful recall schedules 7 days. These are simple prototype rules and can be tuned after testing.</p>
          <button className="primary-button" disabled={!due.length} onClick={() => startRecallSession(dueIds)}>Start due recall <span>→</span></button>
          {entries.length > 0 && !due.length && (
            <>
              <button
                className="secondary-button"
                style={{ marginTop: 12 }}
                onClick={() => startRecallSession(entries.map((item) => item.questionId))}
              >
                Practise all scheduled concepts now
              </button>
              <p className="metric-note">
                You have no reviews due right now. You can still practise scheduled concepts early; this does not change their planned review dates.
              </p>
            </>
          )}
          {!entries.length && <p className="empty-history">No reviews scheduled yet. Complete a baseline or practice session and MindForge will begin scheduling questions here.</p>}
        </div>
        <div className="question-panel result-panel">
          <div className="panel-kicker">REVIEW QUEUE</div><h2>Concepts to revisit</h2>
          {entries.length ? entries.map((item) => {
            const question = bank.find((q) => q.id === item.questionId);
            const isDue = new Date(item.dueAt).getTime() <= now;
            return <div className="history-row" key={item.questionId}>
              <div><strong>{item.topic || question?.topic || "Concept"}</strong><p>{SUBJECTS.find((s) => s.id === item.subject)?.name || item.subject} · {item.intervalDays}-day interval · {item.repetitions || 0} successful recall(s)</p><small>Next review: {formatRecallDate(item.dueAt)}</small></div>
              <span className={`history-result ${isDue ? "result-wrong" : "result-correct"}`}>{isDue ? "Due" : "Upcoming"}</span>
            </div>;
          }) : <p className="empty-history">Your scheduled concepts will appear here after your first learning session.</p>}
        </div>
        <div className="question-panel result-panel">
          <div className="panel-kicker">RECENT RECALL HISTORY</div><h2>How well are you remembering?</h2>
          {history.length ? history.slice().reverse().slice(0, 12).map((item, index) => <div className="history-row" key={`${item.questionId}-${item.timestamp}-${index}`}>
            <div><strong>{bank.find((q) => q.id === item.questionId)?.topic || "Concept"}</strong><p>{formatRecallDate(item.timestamp)} · next interval: {item.intervalDays} day(s)</p></div>
            <span className={`history-result ${item.correct ? "result-correct" : "result-wrong"}`}>{item.correct ? "Recalled" : "Review again"}</span>
          </div>) : <p className="empty-history">Your recall results will be recorded here after you review a due question.</p>}
          <p className="metric-note">Smart Recall is a study aid, not a clinical memory test. Accuracy depends on question difficulty and the size of the current question bank.</p>
        </div>
        <div className="question-actions"><button className="primary-button" onClick={() => setView("home")}>Back to learning <span>→</span></button></div>
      </section>
    );
  }

  function renderProgress() {
    const assessments = savedData.assessments || [];
    // Pair the latest transfer with its own baseline, not a baseline from another cycle.
    const latestTransfer = assessments
      .filter((item) => item.type === "transfer" && item.cycleId)
      .slice()
      .reverse()[0];
    const latestBaseline = latestTransfer
      ? assessments.find(
          (item) => item.type === "baseline" && item.cycleId === latestTransfer.cycleId,
        )
      : null;
    const learningCycleChange = latestBaseline && latestTransfer
      ? latestTransfer.accuracy - latestBaseline.accuracy
      : null;
    const guidedAttemptsInCycle = latestBaseline && latestTransfer
      ? savedData.attempts.filter(
          (attempt) => attempt.workflow === "practice" && attempt.cycleId === latestBaseline.cycleId,
        )
      : [];
    const guidedHintsInCycle = guidedAttemptsInCycle.reduce((sum, attempt) => sum + (attempt.hints || 0), 0);
    const gapText =
      assistanceGap === null
        ? "Complete both assisted and independent questions to calculate your Assistance Gap."
        : assistanceGap > 0
          ? `Your assisted accuracy is ${assistanceGap} percentage points higher than your independent accuracy. More independent practice may help.`
          : assistanceGap < 0
            ? `Your independent accuracy is ${Math.abs(assistanceGap)} percentage points higher than your assisted accuracy. Keep practising independently.`
            : "Your assisted and independent accuracy are currently equal.";

    return (
      <section className="progress-page">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          YOUR LEARNING JOURNEY
        </div>

        <h1>
          Your progress, <span>your growth.</span>
        </h1>

        <p className="progress-description">
          Track your practice history and compare assisted and independent
          performance.
        </p>

        <div className="stats-grid">
          <StatCard
            label="Overall accuracy"
            value={`${overallAccuracy}%`}
            caption="Across all recorded attempts"
            icon="◎"
            color="purple"
          />

          <StatCard
            label="Completed questions"
            value={totalAttempts}
            caption="Stored in this browser"
            icon="↗"
            color="blue"
          />

          <StatCard
            label="Completed sessions"
            value={savedData.completedSessions}
            caption="Finished learning sessions"
            icon="✳"
            color="orange"
          />
        </div>

        <div className="question-panel result-panel">
          <div className="panel-kicker">INDEPENDENT THINKING METRIC</div>
          <h2>Assistance Gap</h2>

          <div className="gap-value">
            {assistanceGap === null
              ? "—"
              : `${assistanceGap > 0 ? "+" : ""}${assistanceGap} pp`}
          </div>

          <p className="overview-copy">{gapText}</p>

          <div className="comparison-grid">
            <div className="comparison-card">
              <span>Assisted accuracy</span>
              <strong>{accuracy(assistedAttempts)}%</strong>
              <small>{assistedAttempts.length} attempts</small>
            </div>

            <div className="comparison-card">
              <span>Independent accuracy</span>
              <strong>{accuracy(independentAttempts)}%</strong>
              <small>{independentAttempts.length} attempts</small>
            </div>
          </div>

          <div className="comparison-grid">
            <div className="comparison-card">
              <span>Latest baseline</span>
              <strong>{savedData.assessments?.filter((item) => item.type === "baseline").slice(-1)[0]?.accuracy ?? "—"}{savedData.assessments?.some((item) => item.type === "baseline") ? "%" : ""}</strong>
              <small>Before guided practice</small>
            </div>
            <div className="comparison-card">
              <span>Latest independent test</span>
              <strong>{savedData.assessments?.filter((item) => item.type === "transfer" || item.type === "independent").slice(-1)[0]?.accuracy ?? "—"}{savedData.assessments?.some((item) => item.type === "transfer" || item.type === "independent") ? "%" : ""}</strong>
              <small>After practice · transfer or independent test</small>
            </div>
          </div>
          <p className="metric-note">
            The transfer test uses different questions targeting the same broad concepts as the baseline. Results are descriptive, not proof of lasting improvement; difficulty is not formally calibrated, and each subject currently has a small question set.
          </p>
        </div>

        <div className="question-panel result-panel learning-cycle-panel">
          <div className="panel-kicker">BASELINE → PRACTICE → TRANSFER</div>
          <h2>Your latest learning cycle</h2>
          <p className="overview-copy">
            Follow your progress from the first unaided assessment, through guided practice, to a new-question transfer test.
          </p>

          {latestBaseline && latestTransfer ? (
            <>
              <div className="comparison-grid">
                <div className="comparison-card">
                  <span>Baseline · before practice</span>
                  <strong>{latestBaseline.accuracy}%</strong>
                  <small>{latestBaseline.correct} of {latestBaseline.total} correct</small>
                </div>
                <div className="comparison-card">
                  <span>Transfer · after practice</span>
                  <strong>{latestTransfer.accuracy}%</strong>
                  <small>{latestTransfer.correct} of {latestTransfer.total} correct</small>
                </div>
              </div>
              <div className="comparison-grid">
                <div className="comparison-card">
                  <span>Observed score change</span>
                  <strong>{learningCycleChange > 0 ? "+" : ""}{learningCycleChange} pp</strong>
                  <small>{learningCycleChange > 0 ? "Higher than baseline" : learningCycleChange < 0 ? "Lower than baseline" : "Same as baseline"}</small>
                </div>
                <div className="comparison-card">
                  <span>Guided practice in between</span>
                  <strong>{guidedAttemptsInCycle.length}</strong>
                  <small>{guidedHintsInCycle} hints used across these attempts</small>
                </div>
              </div>
              <p className="metric-note">
                This report pairs the most recently recorded baseline and transfer assessment. It is a useful progress snapshot, not a controlled experiment: question difficulty may differ, and the latest assessments may not represent a perfectly matched session.
              </p>
            </>
          ) : (
            <p className="empty-history">
              Complete a baseline assessment, guided practice, and an unseen transfer test to build your first learning-cycle report.
            </p>
          )}
        </div>

        <div className="question-panel result-panel">
          <div className="panel-kicker">SUBJECT BREAKDOWN</div>
          <h2>Your learning map</h2>

          {subjectStats.map((item) => (
            <div className="subject-progress-row" key={item.id}>
              <div className="subject-progress-info">
                <span className={`subject-icon small ${item.id}`}>
                  {item.icon}
                </span>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.attempts} attempts</p>
                </div>
              </div>

              <div className="subject-progress-meter">
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${item.accuracy}%` }}
                  />
                </div>
                <span>{item.accuracy}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="history-panel">
          <h2>Recent attempts</h2>

          {savedData.attempts.length === 0 ? (
            <p className="empty-history">
              No recorded attempts yet. Start a session to see your history.
            </p>
          ) : (
            savedData.attempts
              .slice()
              .reverse()
              .slice(0, 20)
              .map((attempt) => {
                const question = [...QUESTIONS, ...TRANSFER_QUESTIONS].find(
                  (item) => item.id === attempt.questionId,
                );

                return (
                  <div className="history-row" key={attempt.id}>
                    <div>
                      <strong>{question?.topic || "Question"}</strong>
                      <p>
                        {subjectName(attempt.subject)} · {attempt.mode} mode ·{" "}
                        {attempt.hints} hints
                      </p>
                    </div>

                    <span
                      className={`history-result ${
                        attempt.correct ? "result-correct" : "result-wrong"
                      }`}
                    >
                      {attempt.correct ? "Correct" : "Needs practice"}
                    </span>
                  </div>
                );
              })
          )}
        </div>

        <div className="question-actions">
          <button className="primary-button" onClick={() => setView("home")}>
            Back to learning <span>→</span>
          </button>

          <button className="hint-button" onClick={resetAllProgress}>
            Reset saved progress
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="app-shell">
      {renderSidebar()}

      <main className="main-content">
        {renderHeader()}

        {view === "home" && renderHome()}
        {view === "session" && renderSession()}
        {view === "results" && renderResults()}
        {view === "progress" && renderProgress()}
        {view === "recall" && renderRecall()}
        {view === "arena" && renderArena()}
      </main>
    </div>
  );
}

function isToday(timestamp) {
  return Boolean(timestamp) && new Date(timestamp).toDateString() === new Date().toDateString();
}

function getLevelName(xp) {
  const names = ["Curious Mind", "Pattern Seeker", "Logic Explorer", "Critical Thinker", "Independent Learner", "MindForge Master"];
  return names[Math.min(Math.floor((xp || 0) / 250), names.length - 1)];
}

function shuffleArray(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function Mission({ title, detail, done, reward }) {
  return <div className={`mission-card ${done ? "mission-done" : ""}`}><div className="mission-check">{done ? "✓" : "○"}</div><div><strong>{title}</strong><p>{detail}</p></div><span>{done ? "DONE" : reward}</span></div>;
}

function GameCard({ icon, title, badge, detail, reward, onClick }) {
  return <button className="game-card" onClick={onClick}><div className="game-card-top"><span className="game-card-icon">{icon}</span><span className="game-badge">{badge}</span></div><h3>{title}</h3><p>{detail}</p><div className="game-card-bottom"><small>{reward}</small><span>Start mission →</span></div></button>;
}

function StatCard({ label, value, caption, icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-icon ${color}`}>{icon}</span>
      </div>
      <div className="stat-value">{value}</div>
      <p>{caption}</p>
    </div>
  );
}

function WorkflowItem({ number, title, description }) {
  return (
    <div className="workflow-item">
      <span className="workflow-number">{number}</span>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Principle({ number, title, description }) {
  return (
    <div className="principle">
      <span className="principle-number">{number}</span>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default App;