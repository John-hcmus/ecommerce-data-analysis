const chatEl = document.getElementById("chat");
const formEl = document.getElementById("input-form");
const inputEl = document.getElementById("answer-input");
const resultEl = document.getElementById("result");

const questions = [
  {
    key: "goals",
    text: "Coach: Start strong. What are your top 1-3 goals for the next 90 days across health, productivity, and money? Be specific.",
  },
  {
    key: "routine",
    text: "Coach: Walk me through your current weekday routine from wake-up to bedtime.",
  },
  {
    key: "breakdowns",
    text: "Coach: Where does your day usually break down? Name the exact times or triggers.",
  },
  {
    key: "sleep",
    text: "Coach: What time do you sleep and wake now, and what's realistic on a bad day?",
  },
  {
    key: "healthConstraint",
    text: "Coach: What blocks consistent health habits most: time, energy, food environment, or something else?",
  },
  {
    key: "focusPattern",
    text: "Coach: When are your 2 highest-focus hours usually available?",
  },
  {
    key: "moneyPriority",
    text: "Coach: What's the single money move that would matter most this quarter (e.g., budgeting, debt, sales outreach, investing)?",
  },
  {
    key: "friction",
    text: "Coach: What habit have you failed to keep repeatedly, and why did it fail?",
  },
];

const answers = {};
let idx = 0;

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function askNext() {
  if (idx < questions.length) {
    addMessage("coach", questions[idx].text);
  } else {
    finishInterview();
  }
}

function simplifyHabit(habit) {
  return {
    ...habit,
    action: habit.action
      .replace("60", "20")
      .replace("45", "15")
      .replace("30", "10"),
    note: `${habit.note} (simplified for bad days)`
  };
}

function extractHours(text) {
  const matches = text.match(/\b([01]?\d|2[0-3])(?::[0-5]\d)?\b/g);
  return matches ? matches.slice(0, 2) : [];
}

function finishInterview() {
  formEl.classList.add("hidden");

  const habits = [
    {
      title: "Wake & sleep anchors",
      action: "Fixed wake time and lights-out window within 60 minutes daily.",
      why: "Stable sleep timing drives energy, discipline, and better decisions.",
      note: "No phone in bed."
    },
    {
      title: "Morning movement",
      action: "10-20 minutes of walking, mobility, or bodyweight work before deep work.",
      why: "Immediate movement improves mood and focus with low friction.",
      note: "Done before checking social apps."
    },
    {
      title: "Protein + water first",
      action: "Drink water on waking and eat a protein-first first meal.",
      why: "Reduces energy crashes and impulsive food choices.",
      note: "Keep defaults easy (eggs, yogurt, shake)."
    },
    {
      title: "Top-3 plan",
      action: "Write top 3 outcomes for the day in under 3 minutes.",
      why: "Prevents reactive days and protects meaningful progress.",
      note: "If unclear, choose the hardest meaningful task first."
    },
    {
      title: "Deep work block",
      action: "One 60-minute distraction-free block for your highest-value task.",
      why: "Single focused blocks compound faster than scattered effort.",
      note: "Phone out of room; notifications off."
    },
    {
      title: "Money checkpoint",
      action: "15-minute daily money action tied to your priority.",
      why: "Daily touches beat occasional financial panic.",
      note: "Examples: track spend, send offer, review pipeline."
    },
    {
      title: "Shutdown ritual",
      action: "10-minute evening review: wins, misses, and tomorrow's first task.",
      why: "Creates continuity and lowers late-night decision fatigue.",
      note: "Set out tomorrow's work and workout gear."
    },
  ];

  const breakdownText = (answers.breakdowns || "").toLowerCase();
  const frictionText = (answers.friction || "").toLowerCase();

  const strictFeedback = [];
  if (!answers.goals || answers.goals.split(" ").length < 8) {
    strictFeedback.push("Your goals were vague. Rewrite them with numbers and dates.");
  }
  if (breakdownText.includes("night") || breakdownText.includes("late")) {
    strictFeedback.push("You lose control late in the day. Non-negotiable: hard shutdown time.");
  }
  if (frictionText.includes("too much") || frictionText.includes("overwhelm")) {
    strictFeedback.push("You are overbuilding. Cut each habit to a 10-minute floor.");
  }

  const focusHours = extractHours(answers.focusPattern || "");
  const deepWorkTiming = focusHours.length
    ? `${focusHours[0]}:00-${focusHours[1] || Number(focusHours[0]) + 1}:00`
    : "your first available high-energy hour";

  const weekdayRules = [
    "Wake/sleep anchors are mandatory.",
    `Deep work is scheduled in ${deepWorkTiming}.`,
    "Money checkpoint happens before dinner.",
  ];

  const weekendRules = [
    "Keep wake time within +90 minutes of weekday baseline.",
    "Do movement and shutdown ritual, but deep work can be replaced with planning.",
    "Run a 30-minute weekly money review on Sunday.",
  ];

  const minimumDay = habits.slice(0, 5).map((h) => simplifyHabit(h));

  resultEl.classList.remove("hidden");
  resultEl.innerHTML = `
    <h2>Non-Negotiable Daily Habits (Autopilot Set)</h2>
    <ul>
      ${habits
        .map(
          (h) =>
            `<li><strong>${h.title}:</strong> ${h.action}<br><em>Why:</em> ${h.why}<br><em>Strict rule:</em> ${h.note}</li>`
        )
        .join("")}
    </ul>

    <h3>Weekly Version</h3>
    <p><strong>Mon-Fri</strong></p>
    <ul>${weekdayRules.map((r) => `<li>${r}</li>`).join("")}</ul>
    <p><strong>Weekend</strong></p>
    <ul>${weekendRules.map((r) => `<li>${r}</li>`).join("")}</ul>

    <h3>Minimum Viable Day (Bad-Day Version)</h3>
    <ul>
      ${minimumDay
        .map((h) => `<li><strong>${h.title}:</strong> ${h.action} <em>${h.note}</em></li>`)
        .join("")}
    </ul>

    <h3>Strict Coach Feedback</h3>
    <ul>
      ${
        strictFeedback.length
          ? strictFeedback.map((f) => `<li>${f}</li>`).join("")
          : "<li>No excuses: stick to this for 14 straight days before adjusting.</li>"
      }
    </ul>
  `;

  addMessage(
    "coach",
    "Interview complete. Your plan is below. If any habit feels unrealistic, shrink it now rather than skipping it later."
  );
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = inputEl.value.trim();
  if (!value) return;

  addMessage("user", value);
  answers[questions[idx].key] = value;
  idx += 1;
  inputEl.value = "";
  askNext();
});

addMessage(
  "coach",
  "I will ask one question at a time. I will challenge vague or unrealistic habits and force simpler versions that survive bad days."
);
askNext();
