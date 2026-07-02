// ===================================================================
// iPAS AI 應用規劃師歷屆試題庫 - app.js
// ===================================================================

// list of PDF exam files
const examFiles = [
  {
    id: "114-2-mid-1",
    fileName: "114年第二梯次中級AI應用規劃師第一科人工智慧技術應用與規劃.pdf",
    title: "第一科 人工智慧技術應用與規劃",
    year: "114",
    term: "第二梯次",
    grade: "中級",
    subject: "第一科"
  },
  {
    id: "114-2-mid-3",
    fileName: "114年第二梯次中級AI應用規劃師第三科機器學習技術與應用.pdf",
    title: "第三科 機器學習技術與應用",
    year: "114",
    term: "第二梯次",
    grade: "中級",
    subject: "第三科"
  },
  {
    id: "114-2-mid-2",
    fileName: "114年第二梯次中級AI應用規劃師第二科大數據處理分析與應用.pdf",
    title: "第二科 大數據處理分析與應用",
    year: "114",
    term: "第二梯次",
    grade: "中級",
    subject: "第二科"
  },
  {
    id: "114-4-elem-1",
    fileName: "114年第四梯次初級AI應用規劃師第一科人工智慧基礎概論.pdf",
    title: "第一科 人工智慧基礎概論",
    year: "114",
    term: "第四梯次",
    grade: "初級",
    subject: "第一科"
  },
  {
    id: "114-4-elem-2",
    fileName: "114年第四梯次初級AI應用規劃師第二科生成式AI應用與規劃.pdf",
    title: "第二科 生成式AI應用與規劃",
    year: "114",
    term: "第四梯次",
    grade: "初級",
    subject: "第二科"
  },
  {
    id: "115-1-mid-1",
    fileName: "115年第一次中級AI應用規劃師_第一科_人工智慧技術應用與規劃.pdf",
    title: "第一科 人工智慧技術應用與規劃",
    year: "115",
    term: "第一次",
    grade: "中級",
    subject: "第一科"
  },
  {
    id: "115-1-mid-3",
    fileName: "115年第一次中級AI應用規劃師_第三科_機器學習技術與應用.pdf",
    title: "第三科 機器學習技術與應用",
    year: "115",
    term: "第一次",
    grade: "中級",
    subject: "第三科"
  },
  {
    id: "115-1-mid-2",
    fileName: "115年第一次中級AI應用規劃師_第二科_大數據處理分析與應用.pdf",
    title: "第二科 大數據處理分析與應用",
    year: "115",
    term: "第一次",
    grade: "中級",
    subject: "第二科"
  },
  {
    id: "115-1-elem-1",
    fileName: "115年第一次初級AI應用規劃師_第一科_人工智慧基礎概論.pdf",
    title: "第一科 人工智慧基礎概論",
    year: "115",
    term: "第一次",
    grade: "初級",
    subject: "第一科"
  },
  {
    id: "115-1-elem-2",
    fileName: "115年第一次初級AI應用規劃師_第二科_生成式AI應用與規劃.pdf",
    title: "第二科 生成式AI應用與規劃",
    year: "115",
    term: "第一次",
    grade: "初級",
    subject: "第二科"
  },
  {
    id: "115-2-elem-1",
    fileName: "115年第二次初級AI應用規劃師_第一科_人工智慧基礎概論.pdf",
    title: "第一科 人工智慧基礎概論",
    year: "115",
    term: "第二次",
    grade: "初級",
    subject: "第一科"
  },
  {
    id: "115-2-elem-2",
    fileName: "115年第二次初級AI應用規劃師_第二科_生成式AI應用與規劃.pdf",
    title: "第二科 生成式AI應用與規劃",
    year: "115",
    term: "第二次",
    grade: "初級",
    subject: "第二科"
  }
];

// ===================================================================
// App State
// ===================================================================
let currentFilters = {
  grade: "all",
  year: "all",
  searchQuery: ""
};

let activeExamId = null;
let completedExams = new Set();

// Quiz State
let examsData = {};       // keyed by exam id, value = array of question objects
let quizState = {};       // keyed by exam id, value = { answers: {qIdx: chosenOpt}, revealed: {qIdx: true} }
let starredQuestions = {};// keyed by exam id, value = Set of question indices
let filterStarredMode = false;
let currentTab = "quiz"; // "quiz" | "pdf"

// ===================================================================
// DOM Element References
// ===================================================================
const el = {
  examList: document.getElementById("exam-list"),
  searchInput: document.getElementById("search-input"),
  searchClearBtn: document.getElementById("search-clear-btn"),
  gradeFilters: document.getElementById("grade-filters"),
  yearFilters: document.getElementById("year-filters"),
  listCount: document.getElementById("list-count"),
  resetProgressBtn: document.getElementById("reset-progress-btn"),

  // Progress indicators
  progressPercentage: document.getElementById("progress-percentage"),
  progressBarFill: document.getElementById("progress-bar-fill"),
  progressText: document.getElementById("progress-text"),
  statsReadCount: document.getElementById("stats-read-count"),

  // Viewports
  welcomePanel: document.getElementById("welcome-panel"),
  viewerPanel: document.getElementById("viewer-panel"),

  // Viewer Header Elements
  viewerTitle: document.getElementById("viewer-title"),
  viewerTags: document.getElementById("viewer-tags"),
  pdfIframe: document.getElementById("pdf-iframe"),
  iframeLoader: document.getElementById("iframe-loader"),
  toggleReadBtn: document.getElementById("toggle-read-btn"),
  externalLink: document.getElementById("external-link"),
  closeViewerBtn: document.getElementById("close-viewer-btn"),
  backToMenuBtn: document.getElementById("back-to-menu-btn"),

  // Tab buttons
  tabBtnQuiz: document.getElementById("tab-btn-quiz"),
  tabBtnPdf: document.getElementById("tab-btn-pdf"),

  // Quiz containers
  quizViewContainer: document.getElementById("quiz-view-container"),
  iframeViewContainer: document.getElementById("iframe-view-container"),

  // Quiz Dashboard
  quizProgressText: document.getElementById("quiz-progress-text"),
  quizCorrectText: document.getElementById("quiz-correct-text"),
  quizAccuracyText: document.getElementById("quiz-accuracy-text"),

  // Quiz Controls
  filterStarredBtn: document.getElementById("filter-starred-btn"),
  resetQuizBtn: document.getElementById("reset-quiz-btn"),

  // Question Cards Container
  quizQuestionsList: document.getElementById("quiz-questions-list"),

  // Mobile elements
  sidebar: document.getElementById("sidebar"),
  sidebarOverlay: document.getElementById("sidebar-overlay"),
  mobileMenuToggle: document.getElementById("mobile-menu-toggle"),
  mobileCloseBtn: document.getElementById("mobile-close-btn")
};

// ===================================================================
// Initialize Application
// ===================================================================
async function init() {
  // Load exam data FIRST — synchronous from the pre-bundled global (exams_data.js)
  // This must happen before any quiz can be rendered.
  if (typeof EXAMS_DATA !== "undefined") {
    examsData = EXAMS_DATA;
  } else {
    // Fallback: fetch over HTTP (works when served by a web server)
    try {
      const response = await fetch("exams_data.json");
      examsData = await response.json();
    } catch (e) {
      console.error("Failed to load exam data:", e);
      examsData = {};
    }
  }

  loadProgress();
  loadStarredQuestions();
  renderExamList();
  setupEventListeners();
  updateProgressUI();
}


// ===================================================================
// LocalStorage: Reading Progress
// ===================================================================
function loadProgress() {
  const saved = localStorage.getItem("ipas_read_progress");
  if (saved) {
    try {
      completedExams = new Set(JSON.parse(saved));
    } catch (e) {
      completedExams = new Set();
    }
  }
}

function saveProgress() {
  localStorage.setItem("ipas_read_progress", JSON.stringify(Array.from(completedExams)));
  updateProgressUI();
}

function updateProgressUI() {
  const total = examFiles.length;
  const count = completedExams.size;
  const percentage = Math.round((count / total) * 100);

  el.progressPercentage.textContent = `${percentage}%`;
  el.progressBarFill.style.width = `${percentage}%`;
  el.progressText.textContent = `已閱讀 ${count} / ${total} 份`;
  if (el.statsReadCount) {
    el.statsReadCount.textContent = `${count} / ${total}`;
  }
}

// ===================================================================
// LocalStorage: Starred Questions
// ===================================================================
function loadStarredQuestions() {
  const saved = localStorage.getItem("ipas_starred_questions");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Convert arrays back to Sets
      Object.keys(parsed).forEach(id => {
        starredQuestions[id] = new Set(parsed[id]);
      });
    } catch (e) {
      starredQuestions = {};
    }
  }
}

function saveStarredQuestions() {
  const serializable = {};
  Object.keys(starredQuestions).forEach(id => {
    serializable[id] = Array.from(starredQuestions[id]);
  });
  localStorage.setItem("ipas_starred_questions", JSON.stringify(serializable));
}

function isStarred(examId, qIdx) {
  return starredQuestions[examId] && starredQuestions[examId].has(qIdx);
}

function toggleStar(examId, qIdx) {
  if (!starredQuestions[examId]) {
    starredQuestions[examId] = new Set();
  }
  if (starredQuestions[examId].has(qIdx)) {
    starredQuestions[examId].delete(qIdx);
  } else {
    starredQuestions[examId].add(qIdx);
  }
  saveStarredQuestions();
}

// ===================================================================
// LocalStorage: Quiz State
// ===================================================================
function loadQuizState() {
  const saved = localStorage.getItem("ipas_quiz_state");
  if (saved) {
    try {
      quizState = JSON.parse(saved);
    } catch (e) {
      quizState = {};
    }
  }
}

function saveQuizState() {
  localStorage.setItem("ipas_quiz_state", JSON.stringify(quizState));
}

function getQuizStateFor(examId) {
  if (!quizState[examId]) {
    quizState[examId] = { answers: {}, revealed: {} };
  }
  return quizState[examId];
}

// ===================================================================
// Exam List Rendering (Sidebar)
// ===================================================================
function renderExamList() {
  el.examList.innerHTML = "";

  const filtered = examFiles.filter(item => {
    if (currentFilters.grade !== "all" && item.grade !== currentFilters.grade) return false;
    if (currentFilters.year !== "all" && item.year !== currentFilters.year) return false;
    if (currentFilters.searchQuery) {
      const q = currentFilters.searchQuery.toLowerCase();
      const matches = [item.title, item.fileName, item.year + "年", item.term, item.grade]
        .some(s => s.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  el.listCount.textContent = `共 ${filtered.length} 份試題`;

  if (filtered.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty-state-list";
    emptyLi.style.cssText = "padding:24px;text-align:center;color:var(--text-muted);font-size:13px;";
    emptyLi.innerHTML = `<i class="fa-regular fa-folder-open" style="font-size:24px;margin-bottom:8px;display:block;"></i> 找不到符合篩選條件的試題`;
    el.examList.appendChild(emptyLi);
    return;
  }

  filtered.forEach(item => {
    const isCompleted = completedExams.has(item.id);
    const isActive = item.id === activeExamId;

    const li = document.createElement("li");
    li.className = `exam-item ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`;
    li.dataset.id = item.id;

    li.innerHTML = `
      <div class="item-tags">
        <span class="tag tag-year">${item.year}年 • ${item.term}</span>
        <span class="tag tag-grade-${item.grade}">${item.grade}</span>
      </div>
      <div class="item-title">${item.title}</div>
      <div class="item-status-icon ${isCompleted ? "completed" : "uncompleted"}">
        <i class="${isCompleted ? "fa-solid fa-circle-check" : "fa-regular fa-circle"}"></i>
      </div>
    `;

    li.addEventListener("click", () => selectExam(item.id));
    el.examList.appendChild(li);
  });
}

// ===================================================================
// Exam Selection
// ===================================================================
function selectExam(id) {
  activeExamId = id;
  const exam = examFiles.find(item => item.id === id);
  if (!exam) return;

  // Reset the filter starred mode each time a new exam is selected
  filterStarredMode = false;
  updateFilterStarredBtn();

  // Highlight active sidebar item
  document.querySelectorAll(".exam-item").forEach(item => {
    item.classList.toggle("active", item.dataset.id === id);
  });

  // Switch viewport
  el.welcomePanel.style.display = "none";
  el.viewerPanel.style.display = "flex";

  // Update header details
  el.viewerTitle.textContent = exam.fileName.replace(".pdf", "");
  el.viewerTags.innerHTML = `
    <span class="tag tag-year">${exam.year}年 • ${exam.term}</span>
    <span class="tag tag-grade-${exam.grade}">${exam.grade}</span>
  `;

  // Update external link
  el.externalLink.href = exam.fileName;

  // Update read button
  updateReadButtonUI(completedExams.has(id));

  // Show quiz tab by default
  switchTab("quiz");

  // Close mobile sidebar
  closeMobileSidebar();
}

// ===================================================================
// Tab Switching: Quiz ↔ PDF
// ===================================================================
function switchTab(tab) {
  currentTab = tab;

  if (tab === "quiz") {
    el.tabBtnQuiz.classList.add("active");
    el.tabBtnPdf.classList.remove("active");
    el.quizViewContainer.style.display = "flex";
    el.iframeViewContainer.style.display = "none";
    // Render quiz questions for the active exam
    if (activeExamId) {
      renderQuiz(activeExamId);
    }
  } else {
    el.tabBtnPdf.classList.add("active");
    el.tabBtnQuiz.classList.remove("active");
    el.quizViewContainer.style.display = "none";
    el.iframeViewContainer.style.display = "flex";
    // Load PDF if not yet loaded
    if (el.pdfIframe.dataset.loadedFor !== activeExamId) {
      const exam = examFiles.find(e => e.id === activeExamId);
      if (exam) {
        el.iframeLoader.style.opacity = "1";
        el.iframeLoader.style.display = "flex";
        el.pdfIframe.src = encodeURIComponent(exam.fileName);
        el.pdfIframe.dataset.loadedFor = activeExamId;
      }
    }
  }
}

// ===================================================================
// Quiz Rendering
// ===================================================================
function renderQuiz(examId) {
  const examMeta = examFiles.find(e => e.id === examId);
  const questions = examMeta ? examsData[examMeta.fileName] : null;
  if (!questions || questions.length === 0) {
    el.quizQuestionsList.innerHTML = `
      <div class="quiz-empty-state">
        <i class="fa-solid fa-circle-exclamation"></i>
        <p>此試卷尚無題目資料</p>
      </div>
    `;
    return;
  }

  const state = getQuizStateFor(examId);
  const starred = starredQuestions[examId] || new Set();

  // Filter if "starred only" mode active
  const displayQuestions = filterStarredMode
    ? questions.map((q, i) => ({ q, i })).filter(({ i }) => starred.has(i))
    : questions.map((q, i) => ({ q, i }));

  if (filterStarredMode && displayQuestions.length === 0) {
    el.quizQuestionsList.innerHTML = `
      <div class="quiz-empty-state">
        <i class="fa-regular fa-star"></i>
        <p>尚未收藏任何題目</p>
        <span>點擊題目右上角的星號可進行收藏</span>
      </div>
    `;
    updateDashboard(examId, questions, state);
    return;
  }

  // Build HTML
  el.quizQuestionsList.innerHTML = displayQuestions.map(({ q, i }) => {
    const answered = state.answers[i] !== undefined;
    const revealed = state.revealed[i] === true;
    const isStarredQ = starred.has(i);
    const correctLetter = q.answer; // e.g. "A"

    const optionKeys = ["A", "B", "C", "D"];
    const optionsHTML = optionKeys.map(letter => {
      const text = q.options[letter];
      if (!text) return "";

      let btnClass = "option-btn";
      let iconHTML = "";

      if (answered || revealed) {
        if (letter === correctLetter) {
          btnClass += " correct";
          iconHTML = `<i class="fa-solid fa-check option-icon"></i>`;
        } else if (letter === state.answers[i] && letter !== correctLetter) {
          btnClass += " incorrect";
          iconHTML = `<i class="fa-solid fa-xmark option-icon"></i>`;
        }
      }

      const isDisabled = answered || revealed;
      return `
        <button class="${btnClass}" 
                data-q="${i}" 
                data-letter="${letter}"
                ${isDisabled ? "disabled" : ""}
                onclick="handleAnswer('${examId}', ${i}, '${letter}', '${correctLetter}')">
          <span class="option-letter">${letter}</span>
          <span class="option-text">${text}</span>
          ${iconHTML}
        </button>
      `;
    }).join("");

    const revealDisabled = answered || revealed;
    const revealBtnClass = revealed ? "reveal-btn revealed" : "reveal-btn";

    return `
      <div class="question-card" id="qcard-${i}" data-q-index="${i}">
        <div class="question-card-header">
          <span class="question-number">第 ${i + 1} 題</span>
          <button class="star-btn ${isStarredQ ? "starred" : ""}" 
                  onclick="handleStar('${examId}', ${i})" 
                  title="${isStarredQ ? "取消收藏" : "加入收藏"}">
            <i class="${isStarredQ ? "fa-solid fa-star" : "fa-regular fa-star"}"></i>
          </button>
        </div>
        <p class="question-text">${i + 1}. ${q.question}</p>
        <div class="options-group">
          ${optionsHTML}
        </div>
        <div class="question-footer">
          <button class="${revealBtnClass}" 
                  onclick="handleReveal('${examId}', ${i}, '${correctLetter}')"
                  ${revealDisabled ? "disabled" : ""}>
            <i class="fa-solid fa-lightbulb"></i>
            ${revealed ? "已顯示答案" : "直接顯示答案"}
          </button>
          ${(answered || revealed) ? `<span class="correct-answer-badge">正確答案：<strong>${correctLetter}</strong></span>` : ""}
        </div>
      </div>
    `;
  }).join("");

  updateDashboard(examId, questions, state);
}

// ===================================================================
// Handle Answer Click
// ===================================================================
function handleAnswer(examId, qIdx, chosen, correct) {
  const state = getQuizStateFor(examId);
  // Prevent re-answering
  if (state.answers[qIdx] !== undefined || state.revealed[qIdx]) return;

  state.answers[qIdx] = chosen;
  saveQuizState();
  renderQuiz(examId);
  // Smooth scroll to keep the question in view
  requestAnimationFrame(() => {
    const card = document.getElementById(`qcard-${qIdx}`);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

// ===================================================================
// Handle Reveal Answer Button
// ===================================================================
function handleReveal(examId, qIdx, correct) {
  const state = getQuizStateFor(examId);
  if (state.revealed[qIdx] || state.answers[qIdx] !== undefined) return;

  state.revealed[qIdx] = true;
  saveQuizState();
  renderQuiz(examId);
  requestAnimationFrame(() => {
    const card = document.getElementById(`qcard-${qIdx}`);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

// ===================================================================
// Handle Star Toggle
// ===================================================================
function handleStar(examId, qIdx) {
  toggleStar(examId, qIdx);
  // Re-render quiz to update star icon
  renderQuiz(examId);
}

// ===================================================================
// Update Quiz Dashboard Statistics
// ===================================================================
function updateDashboard(examId, questions, state) {
  const total = questions.length;
  const answeredCount = Object.keys(state.answers).length + Object.keys(state.revealed).length;
  // Count correctly answered (not counting revealed-only)
  const correctCount = Object.keys(state.answers).filter(idx => {
    return state.answers[idx] === questions[parseInt(idx)].answer;
  }).length;

  const progressAnswered = Object.keys(state.answers).length + Object.keys(state.revealed).length;
  const accuracy = progressAnswered > 0
    ? Math.round((correctCount / Object.keys(state.answers).length) * 100) || 0
    : null;

  el.quizProgressText.textContent = `${progressAnswered} / ${total} 題`;
  el.quizCorrectText.textContent = `${correctCount} 題`;
  el.quizAccuracyText.textContent = accuracy !== null ? `${accuracy}%` : "--%";
}

// ===================================================================
// Filter Starred Mode Toggle
// ===================================================================
function updateFilterStarredBtn() {
  if (filterStarredMode) {
    el.filterStarredBtn.classList.add("active");
    el.filterStarredBtn.innerHTML = `<i class="fa-solid fa-star"></i> 顯示全部`;
  } else {
    el.filterStarredBtn.classList.remove("active");
    el.filterStarredBtn.innerHTML = `<i class="fa-regular fa-star"></i> 只看收藏`;
  }
}

// ===================================================================
// Reset Quiz for Current Exam
// ===================================================================
function resetQuiz() {
  if (!activeExamId) return;
  if (!confirm("確定要重置本次測驗的所有作答紀錄嗎？")) return;

  delete quizState[activeExamId];
  saveQuizState();
  filterStarredMode = false;
  updateFilterStarredBtn();
  renderQuiz(activeExamId);
}

// ===================================================================
// Viewer: Read/Unread Toggle
// ===================================================================
function updateReadButtonUI(isRead) {
  if (isRead) {
    el.toggleReadBtn.classList.add("read");
    el.toggleReadBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span class="btn-text">已閱讀</span>`;
  } else {
    el.toggleReadBtn.classList.remove("read");
    el.toggleReadBtn.innerHTML = `<i class="fa-regular fa-circle-check"></i> <span class="btn-text">標記為已讀</span>`;
  }
}

// ===================================================================
// Close PDF Viewer
// ===================================================================
function closeViewer() {
  activeExamId = null;
  el.pdfIframe.src = "";
  el.pdfIframe.dataset.loadedFor = "";
  el.viewerPanel.style.display = "none";
  el.welcomePanel.style.display = "flex";

  document.querySelectorAll(".exam-item").forEach(item => {
    item.classList.remove("active");
  });
}

// ===================================================================
// Mobile Sidebar Drawer
// ===================================================================
function openMobileSidebar() {
  el.sidebar.classList.add("active");
  el.sidebarOverlay.classList.add("active");
}

function closeMobileSidebar() {
  el.sidebar.classList.remove("active");
  el.sidebarOverlay.classList.remove("active");
}

// ===================================================================
// Event Listeners
// ===================================================================
function setupEventListeners() {
  // Search
  el.searchInput.addEventListener("input", (e) => {
    currentFilters.searchQuery = e.target.value;
    el.searchClearBtn.style.display = e.target.value.length > 0 ? "block" : "none";
    renderExamList();
  });

  el.searchClearBtn.addEventListener("click", () => {
    el.searchInput.value = "";
    currentFilters.searchQuery = "";
    el.searchClearBtn.style.display = "none";
    renderExamList();
    el.searchInput.focus();
  });

  // Grade filters
  el.gradeFilters.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      el.gradeFilters.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilters.grade = pill.dataset.grade;
      renderExamList();
    });
  });

  // Year filters
  el.yearFilters.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      el.yearFilters.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilters.year = pill.dataset.year;
      renderExamList();
    });
  });

  // Reset reading progress
  el.resetProgressBtn.addEventListener("click", () => {
    if (confirm("確定要重設所有試題的閱讀進度嗎？")) {
      completedExams.clear();
      saveProgress();
      renderExamList();
      if (activeExamId) updateReadButtonUI(false);
    }
  });

  // Toggle read status
  el.toggleReadBtn.addEventListener("click", () => {
    if (!activeExamId) return;
    if (completedExams.has(activeExamId)) {
      completedExams.delete(activeExamId);
      updateReadButtonUI(false);
    } else {
      completedExams.add(activeExamId);
      updateReadButtonUI(true);
    }
    saveProgress();
    const itemEl = document.querySelector(`.exam-item[data-id="${activeExamId}"]`);
    if (itemEl) {
      const isCompleted = completedExams.has(activeExamId);
      itemEl.classList.toggle("completed", isCompleted);
      itemEl.querySelector(".item-status-icon").className = `item-status-icon ${isCompleted ? "completed" : "uncompleted"}`;
      itemEl.querySelector(".item-status-icon i").className = isCompleted ? "fa-solid fa-circle-check" : "fa-regular fa-circle";
    }
  });

  // Tab switching
  el.tabBtnQuiz.addEventListener("click", () => switchTab("quiz"));
  el.tabBtnPdf.addEventListener("click", () => switchTab("pdf"));

  // Filter starred
  el.filterStarredBtn.addEventListener("click", () => {
    filterStarredMode = !filterStarredMode;
    updateFilterStarredBtn();
    if (activeExamId) renderQuiz(activeExamId);
  });

  // Reset quiz
  el.resetQuizBtn.addEventListener("click", resetQuiz);

  // Close viewer
  el.closeViewerBtn.addEventListener("click", closeViewer);
  el.backToMenuBtn.addEventListener("click", closeViewer);

  // Mobile drawer
  el.mobileMenuToggle.addEventListener("click", openMobileSidebar);
  el.mobileCloseBtn.addEventListener("click", closeMobileSidebar);
  el.sidebarOverlay.addEventListener("click", closeMobileSidebar);

  // PDF iframe load event
  el.pdfIframe.addEventListener("load", () => {
    el.iframeLoader.style.opacity = "0";
    setTimeout(() => { el.iframeLoader.style.display = "none"; }, 300);
  });
}

// ===================================================================
// Boot
// ===================================================================
window.addEventListener("DOMContentLoaded", () => {
  loadQuizState();
  init();
});
