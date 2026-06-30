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

// App state
let currentFilters = {
  grade: "all",
  year: "all",
  searchQuery: ""
};

let activeExamId = null;
let completedExams = new Set();

// DOM elements
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
  
  // Viewer Elements
  viewerTitle: document.getElementById("viewer-title"),
  viewerTags: document.getElementById("viewer-tags"),
  pdfIframe: document.getElementById("pdf-iframe"),
  iframeLoader: document.getElementById("iframe-loader"),
  toggleReadBtn: document.getElementById("toggle-read-btn"),
  externalLink: document.getElementById("external-link"),
  closeViewerBtn: document.getElementById("close-viewer-btn"),
  backToMenuBtn: document.getElementById("back-to-menu-btn"),
  
  // Mobile elements
  sidebar: document.getElementById("sidebar"),
  sidebarOverlay: document.getElementById("sidebar-overlay"),
  mobileMenuToggle: document.getElementById("mobile-menu-toggle"),
  mobileCloseBtn: document.getElementById("mobile-close-btn")
};

// Initialize Application
function init() {
  loadProgress();
  renderExamList();
  setupEventListeners();
  updateProgressUI();
}

// Load viewing progress from LocalStorage
function loadProgress() {
  const saved = localStorage.getItem("ipas_read_progress");
  if (saved) {
    try {
      const ids = JSON.parse(saved);
      completedExams = new Set(ids);
    } catch (e) {
      console.error("Error parsing progress from localStorage:", e);
      completedExams = new Set();
    }
  }
}

// Save progress to LocalStorage
function saveProgress() {
  localStorage.setItem("ipas_read_progress", JSON.stringify(Array.from(completedExams)));
  updateProgressUI();
}

// Update the progress bars and statistics counter UI
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

// Render dynamic exam list matching current filters
function renderExamList() {
  el.examList.innerHTML = "";
  
  const filtered = examFiles.filter(item => {
    // Grade Filter
    if (currentFilters.grade !== "all" && item.grade !== currentFilters.grade) {
      return false;
    }
    // Year Filter
    if (currentFilters.year !== "all" && item.year !== currentFilters.year) {
      return false;
    }
    // Search Query
    if (currentFilters.searchQuery) {
      const q = currentFilters.searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchFileName = item.fileName.toLowerCase().includes(q);
      const matchYear = (item.year + "年").includes(q);
      const matchTerm = item.term.includes(q);
      const matchGrade = item.grade.includes(q);
      
      if (!matchTitle && !matchFileName && !matchYear && !matchTerm && !matchGrade) {
        return false;
      }
    }
    return true;
  });
  
  el.listCount.textContent = `共 ${filtered.length} 份試題`;
  
  if (filtered.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty-state-list";
    emptyLi.style.padding = "24px";
    emptyLi.style.textAlign = "center";
    emptyLi.style.color = "var(--text-muted)";
    emptyLi.style.fontSize = "13px";
    emptyLi.innerHTML = `<i class="fa-regular fa-folder-open" style="font-size: 24px; margin-bottom: 8px; display: block;"></i> 找不到符合篩選條件的試題`;
    el.examList.appendChild(emptyLi);
    return;
  }
  
  filtered.forEach(item => {
    const isCompleted = completedExams.has(item.id);
    const isActive = item.id === activeExamId;
    
    const li = document.createElement("li");
    li.className = `exam-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`;
    li.dataset.id = item.id;
    
    li.innerHTML = `
      <div class="item-tags">
        <span class="tag tag-year">${item.year}年 • ${item.term}</span>
        <span class="tag tag-grade-${item.grade}">${item.grade}</span>
      </div>
      <div class="item-title">${item.title}</div>
      <div class="item-status-icon ${isCompleted ? 'completed' : 'uncompleted'}">
        <i class="${isCompleted ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
      </div>
    `;
    
    li.addEventListener("click", () => selectExam(item.id));
    el.examList.appendChild(li);
  });
}

// Handle selection of a PDF Exam
function selectExam(id) {
  activeExamId = id;
  const exam = examFiles.find(item => item.id === id);
  if (!exam) return;
  
  // Highlight active item in list
  document.querySelectorAll(".exam-item").forEach(item => {
    item.classList.remove("active");
    if (item.dataset.id === id) {
      item.classList.add("active");
    }
  });
  
  // Update viewports
  el.welcomePanel.style.display = "none";
  el.viewerPanel.style.display = "flex";
  
  // Set Viewer details
  el.viewerTitle.textContent = exam.fileName.replace(".pdf", "");
  
  // Create tag elements
  el.viewerTags.innerHTML = `
    <span class="tag tag-year">${exam.year}年 • ${exam.term}</span>
    <span class="tag tag-grade-${exam.grade}">${exam.grade}</span>
  `;
  
  // Load PDF into Iframe
  el.iframeLoader.style.opacity = "1";
  el.iframeLoader.style.display = "flex";
  
  // Update iframe source
  el.pdfIframe.src = encodeURIComponent(exam.fileName);
  
  // Update external link
  el.externalLink.href = exam.fileName;
  
  // Update read/unread button status
  updateReadButtonUI(completedExams.has(id));
  
  // Close sidebar drawer on mobile after selection
  closeMobileSidebar();
}

// Update the "Mark as read" button visual state
function updateReadButtonUI(isRead) {
  if (isRead) {
    el.toggleReadBtn.classList.add("read");
    el.toggleReadBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span class="btn-text">已閱讀</span>`;
  } else {
    el.toggleReadBtn.classList.remove("read");
    el.toggleReadBtn.innerHTML = `<i class="fa-regular fa-circle-check"></i> <span class="btn-text">標記為已讀</span>`;
  }
}

// Close PDF Viewer and return to Welcome Panel
function closeViewer() {
  activeExamId = null;
  el.pdfIframe.src = "";
  el.viewerPanel.style.display = "none";
  el.welcomePanel.style.display = "flex";
  
  document.querySelectorAll(".exam-item").forEach(item => {
    item.classList.remove("active");
  });
}

// Mobile drawer controls
function openMobileSidebar() {
  el.sidebar.classList.add("active");
  el.sidebarOverlay.classList.add("active");
}

function closeMobileSidebar() {
  el.sidebar.classList.remove("active");
  el.sidebarOverlay.classList.remove("active");
}

// Set up all events & listeners
function setupEventListeners() {
  // Search input events
  el.searchInput.addEventListener("input", (e) => {
    currentFilters.searchQuery = e.target.value;
    if (e.target.value.length > 0) {
      el.searchClearBtn.style.display = "block";
    } else {
      el.searchClearBtn.style.display = "none";
    }
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
    pill.addEventListener("click", (e) => {
      el.gradeFilters.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilters.grade = pill.dataset.grade;
      renderExamList();
    });
  });
  
  // Year filters
  el.yearFilters.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", (e) => {
      el.yearFilters.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilters.year = pill.dataset.year;
      renderExamList();
    });
  });
  
  // Reset progress button
  el.resetProgressBtn.addEventListener("click", () => {
    if (confirm("確定要重設所有試題的閱讀進度嗎？")) {
      completedExams.clear();
      saveProgress();
      renderExamList();
      
      // Update toggle button in viewer if open
      if (activeExamId) {
        updateReadButtonUI(false);
      }
    }
  });
  
  // Toggle read status button in viewer
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
    
    // Rerender list item style without reloading whole iframe
    const itemEl = document.querySelector(`.exam-item[data-id="${activeExamId}"]`);
    if (itemEl) {
      const isCompleted = completedExams.has(activeExamId);
      if (isCompleted) {
        itemEl.classList.add("completed");
        itemEl.querySelector(".item-status-icon").className = "item-status-icon completed";
        itemEl.querySelector(".item-status-icon i").className = "fa-solid fa-circle-check";
      } else {
        itemEl.classList.remove("completed");
        itemEl.querySelector(".item-status-icon").className = "item-status-icon uncompleted";
        itemEl.querySelector(".item-status-icon i").className = "fa-regular fa-circle";
      }
    }
  });
  
  // Close Viewer button
  el.closeViewerBtn.addEventListener("click", closeViewer);
  el.backToMenuBtn.addEventListener("click", closeViewer);
  
  // Mobile drawer buttons
  el.mobileMenuToggle.addEventListener("click", openMobileSidebar);
  el.mobileCloseBtn.addEventListener("click", closeMobileSidebar);
  el.sidebarOverlay.addEventListener("click", closeMobileSidebar);
  
  // Iframe load listener
  el.pdfIframe.addEventListener("load", () => {
    el.iframeLoader.style.opacity = "0";
    setTimeout(() => {
      el.iframeLoader.style.display = "none";
    }, 300);
  });
}

// Run init on window load
window.addEventListener("DOMContentLoaded", init);
