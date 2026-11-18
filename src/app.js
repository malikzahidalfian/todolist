// To Do List & Target Kerja - Logika Aplikasi Mandiri
// Fitur: Kategori Toko & Akun Fleksibel, Target Sasaran, Jobdesk Harian Auto-Reset, Kalender Pelacak Riwayat, & Vision Board
(() => {
  let todos = [];
  let categories = [];
  let agendas = [];
  let selectedCategory = ''; // active category name (no 'all')
  let currentFilter = 'all';
  let searchQuery = '';

  // Goals & Quotes State
  let goals = [];
  let customQuote = '';
  let currentQuoteIndex = 0;

  // History & Calendar State
  let historyData = {};
  const now = new Date();
  let calYear = now.getFullYear();
  let calMonth = now.getMonth(); // 0 - 11
  let selectedDateStr = getTodayDateStr();
  const openSubtaskIds = new Set();

  const DEFAULT_CATEGORIES = [
    { id: 'cat-ricko-shopee', name: "Ricko's Media Player - Shopee", icon: '🏪', color: '#ef8e06', group: 'Toko Bisnis' },
    { id: 'cat-shopee-mp3', name: 'Toko Shopee MP3 Player', icon: '🏪', color: '#f97316', group: 'Toko Bisnis' },
    { id: 'cat-zyra-jewelry', name: 'Toko Zyra Jewelry', icon: '💎', color: '#ec4899', group: 'Toko Bisnis' },
    { id: 'cat-affiliate-sepatu', name: 'Akun Affiliate @reviewsepatucowok', icon: '👟', color: '#3b82f6', group: 'Akun Affiliate & TikTok' },
    { id: 'cat-umum', name: 'Operasional & Markas', icon: '🏢', color: '#6366f1', group: 'Operasional & Markas' }
  ];

  const DEFAULT_GOALS = [
    {
      id: 'goal-tecno',
      title: 'Beli HP Tecno Camon 50 Pro',
      category: 'Gadget & Kerja AI',
      icon: '📱',
      image: 'assets/targets/target-tecno.jpg',
      targetPrice: 'Rp 4.500.000',
      status: 'on_progress',
      note: 'Senjata tempur baru untuk kendali 6 studio AI, foto & video jernih, dan pantau bisnis di genggaman setiap saat.',
      targetDate: '2026'
    },
    {
      id: 'goal-nmax',
      title: 'Beli Motor Yamaha NMAX',
      category: 'Kendaraan Keluarga',
      icon: '🛵',
      image: 'assets/targets/target-nmax.jpg',
      targetPrice: 'Rp 35.000.000',
      status: 'on_progress',
      note: 'Kendaraan andalan keluarga yang nyaman, gagah, dan siap mengantar rezeki serta mobilitas harian.',
      targetDate: '2026'
    },
    {
      id: 'goal-umroh',
      title: 'Umroh Bareng Istri',
      category: 'Ibadah Suci & Berkah',
      icon: '🕋',
      image: 'assets/targets/target-umroh.jpg',
      targetPrice: 'Paket Berdua Makkah & Madinah',
      status: 'on_progress',
      note: 'Impian suci berdua bersama istri tercinta ke Baitullah Makkah & Madinah. Ibadah khusyuk, doa terkabul, barokah dunia dan akhirat.',
      targetDate: '2026 / 2027'
    }
  ];

  const DEFAULT_QUOTES = [
    {
      text: "Bismillah! Setiap baris konten, video, dan postingan yang tim buat hari ini adalah langkah nyata menjemput rezeki berkah. Ingat target muliamu: HP Tecno Camon 50 Pro baru, Yamaha NMAX terparkir di rumah, dan melangkah thawaf di Ka'bah bareng istri tercinta. Jangan pernah lelah berikhtiar, Bos Ricko!",
      author: "Pesan Harian Markas"
    },
    {
      text: "Kerja keras, konsisten, dan ikhlas. 6 studio AI (Gemi, Afi, Tara, Naila, Vidi, Kael) bekerja tanpa henti di sampingmu. Terus melangkah, target besar itu semakin dekat setiap harinya!",
      author: "Tim 6 Studio AI"
    },
    {
      text: "Niat yang tulus untuk membahagiakan istri dan keluarga selalu dibukakan pintu rezeki dari arah yang tak disangka-sangka. Bismillah untuk hari yang produktif, Bos Ricko!",
      author: "Semangat Pagi Markas"
    },
    {
      text: "Kantor boleh virtual, tapi hasil kerja dan impiannya sangat nyata. Dari meja kerja ini, HP Tecno Camon 50 Pro, NMAX impian, dan tiket ke Tanah Suci sedang diperjuangkan!",
      author: "Visi & Ikhtiar Bos Ricko"
    },
    {
      text: "Fokus satu langkah setiap hari. Hasil besar dibangun dari ketekunan harian. Tetap semangat memimpin markas, Bos Ricko!",
      author: "Energi Positif Markas"
    },
    {
      text: "Awali hari dengan rasa syukur dan doa. Selangkah demi selangkah, impian punya HP baru, motor baru, dan sujud di depan Ka'bah bersama istri akan segera terwujud!",
      author: "Doa & Harapan Bos Ricko"
    },
    {
      text: "Pemimpin hebat bukan yang tak pernah lelah, tapi yang tahu untuk siapa ia berjuang. Tetap kuat dan penuh semangat, Bos!",
      author: "Motivasi Markas"
    }
  ];

  // DOM Elements - Vision & Quotes
  const sectionVision = document.getElementById('section-vision');
  const btnToggleVision = document.getElementById('btn-toggle-vision');
  const quoteContent = document.getElementById('quote-content');
  const quoteAuthor = document.getElementById('quote-author');
  const btnShuffleQuote = document.getElementById('btn-shuffle-quote');
  const btnEditQuote = document.getElementById('btn-edit-quote');
  const goalsGrid = document.getElementById('goals-grid');
  const btnAddGoal = document.getElementById('btn-add-goal');
  const btnResetGoals = document.getElementById('btn-reset-goals');

  // DOM Elements - Goal Modal & Lightbox
  const goalModal = document.getElementById('goal-modal');
  const goalForm = document.getElementById('goal-form');
  const goalModalHeading = document.getElementById('goal-modal-heading');
  const goalId = document.getElementById('goal-id');
  const goalTitle = document.getElementById('goal-title');
  const goalCategory = document.getElementById('goal-category');
  const goalIcon = document.getElementById('goal-icon');
  const goalPrice = document.getElementById('goal-price');
  const goalImageSelect = document.getElementById('goal-image-select');
  const goalImage = document.getElementById('goal-image');
  const goalNote = document.getElementById('goal-note');
  const btnCloseGoalModal = document.getElementById('btn-close-goal-modal');
  const btnCancelGoalModal = document.getElementById('btn-cancel-goal-modal');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const btnCloseLightbox = document.getElementById('btn-close-lightbox');

  // DOM Elements - Category Navigation & Modal
  const categoryTabs = document.getElementById('category-tabs');
  const btnAddCategory = document.getElementById('btn-add-category');
  const btnManageCategories = document.getElementById('btn-manage-categories');
  const categoryModal = document.getElementById('category-modal');
  const categoryForm = document.getElementById('category-form');
  const newCatName = document.getElementById('new-cat-name');
  const newCatIcon = document.getElementById('new-cat-icon');
  const newCatColor = document.getElementById('new-cat-color');
  const btnCloseCategoryModal = document.getElementById('btn-close-category-modal');
  const btnCancelCategoryModal = document.getElementById('btn-cancel-category-modal');
  const catModalError = document.getElementById('cat-modal-error');
  const btnQuickAddCatFromForm = document.getElementById('btn-quick-add-cat-from-form');
  const btnSidebarAddCat = document.getElementById('btn-sidebar-add-cat');
  const btnSidebarManageCat = document.getElementById('btn-sidebar-manage-cat');
  const sidebarCategoriesList = document.getElementById('sidebar-categories-list');

  const manageCategoryModal = document.getElementById('manage-category-modal');
  const manageCategoriesList = document.getElementById('manage-categories-list');
  const btnCloseManageCategoryModal = document.getElementById('btn-close-manage-category-modal');
  const btnCloseManageCategoryModalBottom = document.getElementById('btn-close-manage-category-modal-bottom');
  const btnManageAddNewCat = document.getElementById('btn-manage-add-new-cat');

  // DOM Elements - Todo Modal & Form
  const todoModal = document.getElementById('todo-modal');
  const btnOpenTodoModal = document.getElementById('btn-open-todo-modal');
  const btnCloseTodoModal = document.getElementById('btn-close-todo-modal');
  const btnCancelTodoModal = document.getElementById('btn-cancel-todo-modal');
  const todoModalError = document.getElementById('todo-modal-error');
  const todoForm = document.getElementById('todo-form');
  const inputTitle = document.getElementById('input-title');
  const selectCategory = document.getElementById('select-category');
  const selectType = document.getElementById('select-type');
  const selectPriority = document.getElementById('select-priority');

  const panelTargets = document.getElementById('panel-targets');
  const targetsGrid = document.getElementById('targets-grid');
  const badgeTargetCount = document.getElementById('badge-target-count');

  const todoItemsList = document.getElementById('todo-items-list');
  const inputSearch = document.getElementById('input-search');
  const btnClearCompleted = document.getElementById('btn-clear-completed');

  const btnOpenData = document.getElementById('btn-open-data');
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const todayDateDisplay = document.getElementById('today-date-display');
  const appVersionBadge = document.getElementById('app-version');

  // Stats Elements
  const statTargetNum = document.getElementById('stat-target-num');
  const statDailyNum = document.getElementById('stat-daily-num');
  const statGeneralNum = document.getElementById('stat-general-num');
  const statActiveNum = document.getElementById('stat-active-num');
  const statDoneNum = document.getElementById('stat-done-num');

  const cAll = document.getElementById('c-all');
  const cTarget = document.getElementById('c-target');
  const cDaily = document.getElementById('c-daily');
  const cGeneral = document.getElementById('c-general');
  const cActive = document.getElementById('c-active');
  const cCompleted = document.getElementById('c-completed');

  // Modal Elements - Todo Edit
  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');
  const editId = document.getElementById('edit-id');
  const editTitle = document.getElementById('edit-title');
  const editCategory = document.getElementById('edit-category');
  const editType = document.getElementById('edit-type');
  const editPriority = document.getElementById('edit-priority');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');

  // DOM Elements - Calendar & Agenda Section
  const btnTopAddAgenda = document.getElementById('btn-top-add-agenda');
  const btnQuickAddAgenda = document.getElementById('btn-quick-add-agenda');
  const btnCalYesterday = document.getElementById('btn-cal-yesterday');
  const btnCalToday = document.getElementById('btn-cal-today');
  const btnCalPrev = document.getElementById('btn-cal-prev');
  const btnCalNext = document.getElementById('btn-cal-next');
  const calMonthYear = document.getElementById('cal-month-year');
  const calDaysGrid = document.getElementById('cal-days-grid');

  const calDetailRelative = document.getElementById('cal-detail-relative');
  const calDetailDate = document.getElementById('cal-detail-date');
  const calDetailScore = document.getElementById('cal-detail-score');
  const calDetailProgressFill = document.getElementById('cal-detail-progress-fill');
  const calCountAgendas = document.getElementById('cal-count-agendas');
  const calListAgendas = document.getElementById('cal-list-agendas');
  const calCountUncompleted = document.getElementById('cal-count-uncompleted');
  const calListUncompleted = document.getElementById('cal-list-uncompleted');
  const calCountCompleted = document.getElementById('cal-count-completed');
  const calListCompleted = document.getElementById('cal-list-completed');

  // Modal Elements - Agenda
  const agendaModal = document.getElementById('agenda-modal');
  const agendaForm = document.getElementById('agenda-form');
  const agendaId = document.getElementById('agenda-id');
  const agendaTitle = document.getElementById('agenda-title');
  const agendaDate = document.getElementById('agenda-date');
  const agendaTime = document.getElementById('agenda-time');
  const agendaCategory = document.getElementById('agenda-category');
  const agendaNote = document.getElementById('agenda-note');
  const btnCloseAgendaModal = document.getElementById('btn-close-agenda-modal');
  const btnCancelAgendaModal = document.getElementById('btn-cancel-agenda-modal');

  // Mobile Access & Responsive Elements
  const btnMobileAccess = document.getElementById('btn-mobile-access');
  const btnTopMobileAccess = document.getElementById('btn-top-mobile-access');
  const mobileAccessModal = document.getElementById('mobile-access-modal');
  const btnCloseMobileModal = document.getElementById('btn-close-mobile-modal');
  const btnCloseMobileModalBottom = document.getElementById('btn-close-mobile-modal-bottom');
  const mobileUrlInput = document.getElementById('mobile-url-input');
  const mobileQrBox = document.getElementById('mobile-qr-box');
  const btnCopyMobileUrl = document.getElementById('btn-copy-mobile-url');
  const btnMobileMenuToggle = document.getElementById('btn-mobile-menu-toggle');
  const appSidebar = document.getElementById('app-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const mobileBottomNav = document.getElementById('mobile-bottom-nav');
  const mobBadgeTodos = document.getElementById('mob-badge-todos');
  const mobBtnCategories = document.getElementById('mob-btn-categories');
  const mobBtnServer = document.getElementById('mob-btn-server');

  // Utility helpers
  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getTodayDateStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getYesterdayDateStr() {
    const d = new Date(Date.now() - 86400000);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function formatDateIndo(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(y, m, day);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${days[d.getDay()]}, ${day} ${months[m]} ${y}`;
  }

  function formatDisplayDate() {
    const d = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `📅 ${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function showToast(message, type = 'toast-success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // REST API Helpers for Web / Mobile Browser access
  async function apiGet(endpoint) {
    try {
      const res = await fetch(endpoint, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  }

  async function apiPost(endpoint, data) {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {}
  }

  // --- Supabase Cloud Database Integration ---
  const SUPABASE_CONFIG = {
    url: 'https://qoxruyniqxwdgwoukkmw.supabase.co',
    key: 'sb_publishable_Qcsd4DqFOXkfee5j_eknQw_XDPDZSCX'
  };

  let supabaseClient = null;
  let isSupabaseOnline = false;
  let isRemoteSyncInProgress = false;

  function updateCloudStatus(status, text) {
    const pill = document.getElementById('cloud-status-pill');
    const label = document.getElementById('cloud-status-text');
    if (!pill || !label) return;
    pill.classList.remove('connected', 'syncing');
    if (status === 'connected') {
      pill.classList.add('connected');
      label.textContent = text || '☁️ Cloud Sync';
    } else if (status === 'syncing') {
      pill.classList.add('syncing');
      label.textContent = text || '☁️ Menyimpan...';
    } else {
      label.textContent = text || '☁️ Mode Lokal';
    }
  }

  async function supabaseGet(key) {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/app_state?key=eq.${encodeURIComponent(key)}&select=data`, {
        headers: {
          'apikey': SUPABASE_CONFIG.key,
          'Authorization': `Bearer ${SUPABASE_CONFIG.key}`
        },
        cache: 'no-store'
      });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0].data !== undefined) {
          isSupabaseOnline = true;
          updateCloudStatus('connected', '☁️ Cloud Online');
          return rows[0].data;
        }
      }
    } catch (e) {
      console.warn('Supabase fetch failed for', key, e.message);
    }
    return null;
  }

  async function supabasePut(key, data) {
    try {
      updateCloudStatus('syncing', '☁️ Menyimpan...');
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/app_state`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_CONFIG.key,
          'Authorization': `Bearer ${SUPABASE_CONFIG.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          key,
          data,
          updated_at: new Date().toISOString()
        })
      });
      if (res.ok) {
        isSupabaseOnline = true;
        updateCloudStatus('connected', '☁️ Tersimpan');
        setTimeout(() => {
          if (isSupabaseOnline) updateCloudStatus('connected', '☁️ Cloud Online');
        }, 1200);
        return true;
      }
    } catch (e) {
      console.warn('Supabase save failed for', key, e.message);
    }
    updateCloudStatus('offline', '☁️ Mode Lokal');
    return false;
  }

  function setupSupabaseRealtime() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') return;
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
      supabaseClient
        .channel('app_state_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'app_state' },
          (payload) => {
            const row = payload.new;
            if (!row || !row.key || row.data === undefined) return;
            handleRemoteStateChange(row.key, row.data);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            isSupabaseOnline = true;
            updateCloudStatus('connected', '☁️ Live Sync');
          }
        });
    } catch (e) {
      console.warn('Supabase realtime init error:', e);
    }
  }

  function handleRemoteStateChange(key, data) {
    if (isRemoteSyncInProgress) return;
    try {
      isRemoteSyncInProgress = true;
      if (key === 'todos' && Array.isArray(data)) {
        const incomingJson = JSON.stringify(data);
        if (incomingJson !== JSON.stringify(todos)) {
          todos = data;
          autoRegisterCategoriesFromTodos();
          localStorage.setItem('todolist_standalone_todos', incomingJson);
          renderCategories();
          renderUI();
          showToast('🔄 Perubahan tugas disinkronkan dari perangkat lain');
        }
      } else if (key === 'categories' && Array.isArray(data)) {
        const incomingJson = JSON.stringify(data);
        if (incomingJson !== JSON.stringify(categories)) {
          categories = data;
          localStorage.setItem('todolist_standalone_categories', incomingJson);
          renderCategories();
          populateCategorySelects();
          renderUI();
        }
      } else if (key === 'goals' && data && Array.isArray(data.goals)) {
        goals = data.goals;
        customQuote = data.customQuote || '';
        currentQuoteIndex = data.currentQuoteIndex || 0;
        renderVisionBoard();
      } else if (key === 'agendas' && Array.isArray(data)) {
        agendas = data;
        renderCalendar();
      } else if (key === 'history' && data && typeof data === 'object') {
        historyData = data;
      }
    } finally {
      setTimeout(() => { isRemoteSyncInProgress = false; }, 300);
    }
  }

  // Storage Handlers - Categories
  async function loadCategoriesData() {
    try {
      // 1. Coba dari Supabase Cloud
      const cloudData = await supabaseGet('categories');
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        categories = cloudData;
        localStorage.setItem('todolist_standalone_categories', JSON.stringify(categories));
        return;
      }

      // 2. Coba dari Electron
      if (window.todoAPI && typeof window.todoAPI.loadCategories === 'function') {
        const data = await window.todoAPI.loadCategories();
        if (Array.isArray(data) && data.length > 0) {
          categories = data;
          supabasePut('categories', categories);
          return;
        }
      }
      // 3. Web / HP fetch from server
      const serverData = await apiGet('/api/categories');
      if (Array.isArray(serverData) && serverData.length > 0) {
        categories = serverData;
        supabasePut('categories', categories);
        return;
      }
      // 4. LocalStorage
      const raw = localStorage.getItem('todolist_standalone_categories');
      if (raw) {
        categories = JSON.parse(raw);
        return;
      }
    } catch (err) {
      console.warn('Gagal memuat categories:', err);
    }
    categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
  }

  async function saveCategoriesData() {
    try {
      supabasePut('categories', categories);
      if (window.todoAPI && typeof window.todoAPI.saveCategories === 'function') {
        await window.todoAPI.saveCategories(categories);
      } else {
        await apiPost('/api/categories', categories);
      }
      localStorage.setItem('todolist_standalone_categories', JSON.stringify(categories));
    } catch (err) {
      console.error('Gagal menyimpan categories:', err);
    }
  }

  // Storage Handlers - Todos
  async function loadTodosData() {
    try {
      // 1. Coba dari Supabase Cloud
      const cloudData = await supabaseGet('todos');
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        cloudData.forEach(item => {
          if (!item.category) item.category = 'Operasional & Markas';
        });
        localStorage.setItem('todolist_standalone_todos', JSON.stringify(cloudData));
        return cloudData;
      }

      // 2. Coba dari Electron
      if (window.todoAPI && typeof window.todoAPI.loadTodos === 'function') {
        const data = await window.todoAPI.loadTodos();
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(item => {
            if (!item.category) item.category = 'Operasional & Markas';
          });
          supabasePut('todos', data);
          return data;
        }
      }
      // 3. Web / HP fetch from server
      const serverData = await apiGet('/api/todos');
      if (Array.isArray(serverData)) {
        serverData.forEach(item => {
          if (!item.category) item.category = 'Operasional & Markas';
        });
        supabasePut('todos', serverData);
        return serverData;
      }
      // 4. LocalStorage
      const raw = localStorage.getItem('todolist_standalone_todos');
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.forEach(item => {
          if (!item.category) item.category = 'Operasional & Markas';
        });
        return parsed;
      }
    } catch (err) {
      console.warn('Gagal memuat todos:', err);
    }
    return [];
  }

  async function saveTodosData() {
    try {
      supabasePut('todos', todos);
      if (window.todoAPI && typeof window.todoAPI.saveTodos === 'function') {
        await window.todoAPI.saveTodos(todos);
      } else {
        await apiPost('/api/todos', todos);
      }
      localStorage.setItem('todolist_standalone_todos', JSON.stringify(todos));
    } catch (err) {
      console.error('Gagal menyimpan todos:', err);
    }
  }

  // Storage Handlers - Goals
  async function loadGoalsData() {
    try {
      // 1. Coba dari Supabase Cloud
      const cloudData = await supabaseGet('goals');
      if (cloudData && Array.isArray(cloudData.goals) && cloudData.goals.length > 0) {
        goals = cloudData.goals;
        customQuote = cloudData.customQuote || '';
        currentQuoteIndex = cloudData.currentQuoteIndex || 0;
        localStorage.setItem('todolist_standalone_goals', JSON.stringify(cloudData));
        return;
      }

      // 2. Coba dari Electron
      if (window.todoAPI && typeof window.todoAPI.loadGoals === 'function') {
        const data = await window.todoAPI.loadGoals();
        if (data && Array.isArray(data.goals) && data.goals.length > 0) {
          goals = data.goals;
          customQuote = data.customQuote || '';
          currentQuoteIndex = data.currentQuoteIndex || 0;
          supabasePut('goals', data);
          return;
        }
      }
      // 3. Web / HP fetch from server
      const serverData = await apiGet('/api/goals');
      if (serverData && Array.isArray(serverData.goals) && serverData.goals.length > 0) {
        goals = serverData.goals;
        customQuote = serverData.customQuote || '';
        currentQuoteIndex = serverData.currentQuoteIndex || 0;
        supabasePut('goals', serverData);
        return;
      }
      // 4. LocalStorage
      const raw = localStorage.getItem('todolist_standalone_goals');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.goals)) {
          goals = parsed.goals;
          customQuote = parsed.customQuote || '';
          currentQuoteIndex = parsed.currentQuoteIndex || 0;
          return;
        }
      }
    } catch (err) {
      console.warn('Gagal memuat goals:', err);
    }
    goals = JSON.parse(JSON.stringify(DEFAULT_GOALS));
    customQuote = '';
    currentQuoteIndex = 0;
  }

  async function saveGoalsData() {
    const payload = {
      goals,
      customQuote,
      currentQuoteIndex
    };
    try {
      supabasePut('goals', payload);
      if (window.todoAPI && typeof window.todoAPI.saveGoals === 'function') {
        await window.todoAPI.saveGoals(payload);
      } else {
        await apiPost('/api/goals', payload);
      }
      localStorage.setItem('todolist_standalone_goals', JSON.stringify(payload));
    } catch (err) {
      console.error('Gagal menyimpan goals:', err);
    }
  }

  // Storage Handlers - History
  async function loadHistoryData() {
    try {
      // 1. Coba dari Supabase Cloud
      const cloudData = await supabaseGet('history');
      if (cloudData && typeof cloudData === 'object' && Object.keys(cloudData).length > 0) {
        historyData = cloudData;
        localStorage.setItem('todolist_standalone_history', JSON.stringify(historyData));
        return;
      }

      // 2. Coba dari Electron
      if (window.todoAPI && typeof window.todoAPI.loadHistory === 'function') {
        const data = await window.todoAPI.loadHistory();
        if (data && typeof data === 'object') {
          historyData = data;
          supabasePut('history', historyData);
          return;
        }
      }
      // 3. Web / HP fetch from server
      const serverData = await apiGet('/api/history');
      if (serverData && typeof serverData === 'object') {
        historyData = serverData;
        supabasePut('history', historyData);
        return;
      }
      // 4. LocalStorage
      const raw = localStorage.getItem('todolist_standalone_history');
      if (raw) {
        historyData = JSON.parse(raw);
        return;
      }
    } catch (err) {
      console.warn('Gagal memuat history:', err);
    }
    historyData = {};
  }

  async function saveHistoryData() {
    try {
      supabasePut('history', historyData);
      if (window.todoAPI && typeof window.todoAPI.saveHistory === 'function') {
        await window.todoAPI.saveHistory(historyData);
      } else {
        await apiPost('/api/history', historyData);
      }
      localStorage.setItem('todolist_standalone_history', JSON.stringify(historyData));
    } catch (err) {
      console.error('Gagal menyimpan history:', err);
    }
  }

  // Storage Handlers - Agendas
  async function loadAgendasData() {
    try {
      // 1. Coba dari Supabase Cloud
      const cloudData = await supabaseGet('agendas');
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        agendas = cloudData;
        localStorage.setItem('todolist_standalone_agendas', JSON.stringify(agendas));
        return;
      }

      // 2. Coba dari Electron
      if (window.todoAPI && typeof window.todoAPI.loadAgendas === 'function') {
        const data = await window.todoAPI.loadAgendas();
        if (Array.isArray(data)) {
          agendas = data;
          supabasePut('agendas', agendas);
          return;
        }
      }
      // 3. Web / HP fetch from server
      const serverData = await apiGet('/api/agendas');
      if (Array.isArray(serverData)) {
        agendas = serverData;
        supabasePut('agendas', agendas);
        return;
      }
      // 4. LocalStorage
      const raw = localStorage.getItem('todolist_standalone_agendas');
      if (raw) {
        agendas = JSON.parse(raw);
        return;
      }
    } catch (err) {
      console.warn('Gagal memuat agendas:', err);
    }
    agendas = [];
  }

  async function saveAgendasData() {
    try {
      supabasePut('agendas', agendas);
      if (window.todoAPI && typeof window.todoAPI.saveAgendas === 'function') {
        await window.todoAPI.saveAgendas(agendas);
      } else {
        await apiPost('/api/agendas', agendas);
      }
      localStorage.setItem('todolist_standalone_agendas', JSON.stringify(agendas));
    } catch (err) {
      console.error('Gagal menyimpan agendas:', err);
    }
  }

  // Sync today's active daily tasks to history
  function syncTodayHistory() {
    const today = getTodayDateStr();
    const dailyTasks = todos.filter(t => t.type === 'daily');
    if (!historyData[today]) {
      historyData[today] = { date: today, tasks: [] };
    }
    historyData[today].tasks = dailyTasks.map(t => ({
      id: t.id,
      title: t.title,
      type: 'daily',
      category: t.category || 'Operasional & Markas',
      priority: t.priority || 'medium',
      completed: Boolean(t.completed),
      completedAt: t.completed ? (t.lastCompletedDate === today ? Date.now() : null) : null
    }));
    saveHistoryData();
  }

  // Daily Reset Engine
  function performDailyReset() {
    const today = getTodayDateStr();
    const yesterday = getYesterdayDateStr();
    let modified = false;

    // Snapshot yesterday's daily tasks if not already recorded in history
    if (!historyData[yesterday]) {
      const dailyTasks = todos.filter(t => t.type === 'daily');
      if (dailyTasks.length > 0) {
        historyData[yesterday] = {
          date: yesterday,
          tasks: dailyTasks.map(t => {
            const wasDoneYesterday = Boolean(t.lastCompletedDate === yesterday || (t.completed && (!t.lastCompletedDate || t.lastCompletedDate <= yesterday)));
            return {
              id: t.id,
              title: t.title,
              type: 'daily',
              category: t.category || 'Operasional & Markas',
              priority: t.priority || 'medium',
              completed: wasDoneYesterday,
              completedAt: wasDoneYesterday ? Date.now() - 86400000 : null
            };
          })
        };
        saveHistoryData();
      }
    }

    // Reset daily tasks for today
    todos.forEach(item => {
      if (!item.type) {
        item.type = item.targetNumber ? 'target' : 'general';
        modified = true;
      }
      if (!item.category) {
        item.category = 'Operasional & Markas';
        modified = true;
      }

      if (item.type === 'daily' && item.completed) {
        if (item.lastCompletedDate && item.lastCompletedDate < today) {
          item.completed = false;
          item.resetAt = Date.now();
          if (item.lastCompletedDate !== yesterday) {
            item.streak = 0;
          }
          modified = true;
        }
      }
    });

    if (modified) {
      saveTodosData();
    }

    syncTodayHistory();
  }

  // =========================================================
  // CATEGORIES ENGINE (GROUPED & COLLAPSIBLE)
  // =========================================================

  function getCategoryGroup(cat) {
    if (cat.group && cat.group.trim()) return cat.group.trim();
    const n = (cat.name || '').toLowerCase();
    if (n.includes('affiliate') || n.includes('tiktok') || n.includes('threads') || n.includes('meta') || n.includes('sosmed') || n.includes('review') || n.includes('sepatu') || n.includes('instagram') || n.includes('fb') || n.includes('youtube')) {
      return 'Akun Affiliate & TikTok';
    }
    if (n.includes('toko') || n.includes('shopee') || n.includes('shop') || n.includes('store') || n.includes('jewelry') || n.includes('bisnis') || n.includes('mp3') || n.includes('media player') || n.includes('tokopedia')) {
      return 'Toko Bisnis';
    }
    return 'Operasional & Markas';
  }

  let isCategoryFolded = localStorage.getItem('todolist_cat_folded') === '1';

  function applyCategoryFoldState() {
    const section = document.getElementById('category-section');
    const btnIcon = document.getElementById('cat-fold-btn-icon');
    const btnText = document.getElementById('cat-fold-btn-text');
    const foldArrow = document.getElementById('cat-fold-arrow');
    const activePill = document.getElementById('cat-active-pill');

    if (!section) return;
    if (isCategoryFolded) {
      section.classList.add('is-folded');
      if (btnIcon) btnIcon.textContent = '▼';
      if (btnText) btnText.textContent = 'Buka Kategori';
      if (foldArrow) foldArrow.textContent = '▶';
      if (activePill) activePill.style.display = 'inline-flex';
    } else {
      section.classList.remove('is-folded');
      if (btnIcon) btnIcon.textContent = '▲';
      if (btnText) btnText.textContent = 'Lipat Kategori';
      if (foldArrow) foldArrow.textContent = '▼';
      if (activePill) activePill.style.display = 'none';
    }
  }

  function toggleCategoryFold() {
    isCategoryFolded = !isCategoryFolded;
    localStorage.setItem('todolist_cat_folded', isCategoryFolded ? '1' : '0');
    applyCategoryFoldState();
  }

  function renderCategoryTabs() {
    // If selectedCategory is invalid, select the first available category
    if (!selectedCategory || selectedCategory === 'all' || !categories.some(c => c.name === selectedCategory)) {
      selectedCategory = categories[0] ? categories[0].name : '';
    }

    // Group categories
    const groupsMap = {};
    categories.forEach(cat => {
      const grp = getCategoryGroup(cat);
      if (!groupsMap[grp]) groupsMap[grp] = [];
      groupsMap[grp].push(cat);
    });

    const orderedGroupNames = Object.keys(groupsMap).sort((a, b) => {
      const order = { 'Toko Bisnis': 1, 'Akun Affiliate & TikTok': 2, 'Operasional & Markas': 3 };
      const oa = order[a] || 99;
      const ob = order[b] || 99;
      return oa - ob;
    });

    let groupsHtml = '<div class="cat-groups-wrapper">';
    orderedGroupNames.forEach(grpName => {
      const groupCats = groupsMap[grpName];
      const grpIcon = grpName.includes('Toko') ? '🏪' : (grpName.includes('Affiliate') || grpName.includes('TikTok')) ? '📱' : grpName.includes('Operasional') ? '🏢' : '📂';

      let tabsHtml = '';
      groupCats.forEach(cat => {
        const count = todos.filter(t => t.category === cat.name).length;
        const isSelected = selectedCategory === cat.name;
        const canDelete = categories.length > 1;

        tabsHtml += `
          <div class="cat-tab ${isSelected ? 'active' : ''}" data-cat="${esc(cat.name)}" title="Lihat tugas ${esc(cat.name)}">
            <span>${esc(cat.icon || '📁')}</span>
            <span>${esc(cat.name)}</span>
            <span class="cat-tab-badge">${count}</span>
            ${canDelete ? `<button type="button" class="btn-del-cat" data-del-cat="${esc(cat.id)}" title="Hapus kategori ${esc(cat.name)}">&times;</button>` : ''}
          </div>
        `;
      });

      groupsHtml += `
        <div class="cat-group-card">
          <div class="cat-group-header">
            <span class="cat-group-icon">${grpIcon}</span>
            <span class="cat-group-title">${esc(grpName)}</span>
            <span class="cat-group-count">${groupCats.length}</span>
          </div>
          <div class="cat-group-tabs">
            ${tabsHtml}
          </div>
        </div>
      `;
    });
    groupsHtml += '</div>';

    categoryTabs.innerHTML = groupsHtml;

    // Render Mobile Bottom Category Tabs (Khusus HP)
    const mobileCategoryTabs = document.getElementById('mobile-category-tabs');
    if (mobileCategoryTabs) {
      let mobTabsHtml = '';
      orderedGroupNames.forEach(grpName => {
        const groupCats = groupsMap[grpName];
        groupCats.forEach(cat => {
          const count = todos.filter(t => t.category === cat.name).length;
          const isSelected = selectedCategory === cat.name;

          mobTabsHtml += `
            <div class="cat-tab ${isSelected ? 'active' : ''}" data-cat="${esc(cat.name)}" title="Lihat tugas ${esc(cat.name)}">
              <span>${esc(cat.icon || '📁')}</span>
              <span>${esc(cat.name)}</span>
              <span class="cat-tab-badge">${count}</span>
            </div>
          `;
        });
      });
      mobileCategoryTabs.innerHTML = mobTabsHtml;

      // Auto scroll active category tab into view
      const activeMobTab = mobileCategoryTabs.querySelector('.cat-tab.active');
      if (activeMobTab && typeof activeMobTab.scrollIntoView === 'function') {
        activeMobTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }

      setupDraggableCategoryScroll(mobileCategoryTabs);
    }

    // Update active category pill for collapsed state
    const currentCat = categories.find(c => c.name === selectedCategory) || categories[0];
    const catActivePill = document.getElementById('cat-active-pill');
    if (catActivePill && currentCat) {
      catActivePill.innerHTML = `<span>${esc(currentCat.icon || '📁')}</span> <span>Aktif: <strong>${esc(currentCat.name)}</strong></span>`;
    }

    applyCategoryFoldState();

    // Update active category info on the Jobdesk page banner
    updateJobdeskActiveCategoryBanner();

    // Update Category Dropdowns in Forms
    updateCategorySelectOptions();

    // Update Sidebar Category Navigation if container exists
    renderSidebarCategories();
  }

  function updateJobdeskActiveCategoryBanner() {
    const iconEl = document.getElementById('jobdesk-active-cat-icon');
    const nameEl = document.getElementById('jobdesk-active-cat-name');
    const descEl = document.getElementById('jobdesk-active-cat-desc');

    const currentCat = categories.find(c => c.name === selectedCategory) || categories[0];
    if (!currentCat) return;

    const countActive = todos.filter(t => t.category === currentCat.name && !t.completed).length;
    const countTotal = todos.filter(t => t.category === currentCat.name).length;

    if (iconEl) iconEl.textContent = currentCat.icon || '📁';
    if (nameEl) nameEl.textContent = currentCat.name;
    if (descEl) descEl.textContent = `${countActive} tugas aktif (${countTotal} total terdata)`;

    // Update sticky active category bar on jobdesk page
    const stickyIcon = document.getElementById('jobdesk-sticky-cat-icon');
    const stickyName = document.getElementById('jobdesk-sticky-cat-name');
    if (stickyIcon) stickyIcon.textContent = currentCat.icon || '🏪';
    if (stickyName) stickyName.textContent = currentCat.name;

    // Update sticky top navbar title on jobdesk page
    if (activePage === 'jobdesk') {
      const topIcon = document.getElementById('top-page-icon');
      const topTitle = document.getElementById('top-page-title');
      if (topIcon) topIcon.textContent = currentCat.icon || '🏪';
      if (topTitle) topTitle.textContent = currentCat.name;
    }
  }

  function renderSidebarCategories() {
    if (!sidebarCategoriesList) return;
    sidebarCategoriesList.innerHTML = '';
  }

  function updateCategorySelectOptions() {
    const groupsMap = {};
    categories.forEach(cat => {
      const grp = getCategoryGroup(cat);
      if (!groupsMap[grp]) groupsMap[grp] = [];
      groupsMap[grp].push(cat);
    });

    const orderedGroupNames = Object.keys(groupsMap).sort((a, b) => {
      const order = { 'Toko Bisnis': 1, 'Akun Affiliate & TikTok': 2, 'Operasional & Markas': 3 };
      const oa = order[a] || 99;
      const ob = order[b] || 99;
      return oa - ob;
    });

    let groupedOptionsHtml = '';
    orderedGroupNames.forEach(grpName => {
      const grpIcon = grpName.includes('Toko') ? '🏪' : (grpName.includes('Affiliate') || grpName.includes('TikTok')) ? '📱' : '🏢';
      groupedOptionsHtml += `<optgroup label="${grpIcon} ${esc(grpName)}">`;
      groupsMap[grpName].forEach(cat => {
        const isSelected = (selectedCategory !== 'all' && selectedCategory === cat.name);
        groupedOptionsHtml += `<option value="${esc(cat.name)}" ${isSelected ? 'selected' : ''}>${esc(cat.icon || '📁')} ${esc(cat.name)}</option>`;
      });
      groupedOptionsHtml += `</optgroup>`;
    });

    selectCategory.innerHTML = groupedOptionsHtml + `<option value="__add_new__">＋ Tambah Kategori Baru...</option>`;
    editCategory.innerHTML = groupedOptionsHtml;
    if (agendaCategory) {
      agendaCategory.innerHTML = groupedOptionsHtml;
    }
  }

  function handleDeleteCategory(catId) {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;
    if (categories.length <= 1) {
      alert('Minimal harus ada 1 kategori aktif dalam aplikasi.');
      return;
    }
    const fallback = categories.find(c => c.id !== catId);
    const count = todos.filter(t => t.category === cat.name).length;
    const msg = count > 0 
      ? `Hapus kategori "${cat.name}"?\n${count} tugas dan target di dalamnya akan dipindahkan ke kategori "${fallback.name}".`
      : `Hapus kategori "${cat.name}"?`;

    if (confirm(msg)) {
      todos.forEach(t => {
        if (t.category === cat.name) t.category = fallback.name;
      });
      agendas.forEach(a => {
        if (a.category === cat.name) a.category = fallback.name;
      });
      categories = categories.filter(c => c.id !== catId);
      if (selectedCategory === cat.name) selectedCategory = fallback ? fallback.name : (categories[0]?.name || '');
      localStorage.setItem('todolist_selected_category', selectedCategory);
      saveCategoriesData();
      saveTodosData();
      saveAgendasData();
      renderAll();
      renderManageCategoriesModal();
      showToast(`🗑️ Kategori "${cat.name}" berhasil dihapus.`, 'toast-warning');
    }
  }

  function renderManageCategoriesModal() {
    if (!manageCategoriesList) return;
    manageCategoriesList.innerHTML = categories.map(cat => {
      const count = todos.filter(t => t.category === cat.name).length;
      return `
        <div class="manage-cat-item">
          <div class="manage-cat-info">
            <span class="manage-cat-icon">${esc(cat.icon || '📁')}</span>
            <div>
              <div class="manage-cat-name" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span>${esc(cat.name)}</span>
                <span class="badge-tag" style="font-size: 0.68rem; padding: 1px 7px;">${esc(getCategoryGroup(cat))}</span>
              </div>
              <div class="manage-cat-count">${count} tugas/target terdata</div>
            </div>
          </div>
          <button type="button" class="btn-cat-del-action" data-del-cat="${esc(cat.id)}" title="Hapus kategori ini">
            🗑️ Hapus
          </button>
        </div>
      `;
    }).join('');
  }

  if (btnManageCategories) {
    btnManageCategories.addEventListener('click', () => {
      renderManageCategoriesModal();
      manageCategoryModal.style.display = 'flex';
    });
  }

  if (btnCloseManageCategoryModal) {
    btnCloseManageCategoryModal.addEventListener('click', () => manageCategoryModal.style.display = 'none');
  }
  if (btnCloseManageCategoryModalBottom) {
    btnCloseManageCategoryModalBottom.addEventListener('click', () => manageCategoryModal.style.display = 'none');
  }
  if (btnManageAddNewCat) {
    btnManageAddNewCat.addEventListener('click', () => {
      manageCategoryModal.style.display = 'none';
      btnAddCategory.click();
    });
  }

  if (manageCategoriesList) {
    manageCategoriesList.addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-del-cat]');
      if (delBtn) {
        const catId = delBtn.dataset.delCat;
        handleDeleteCategory(catId);
      }
    });
  }

  // Sidebar Category Navigation Click
  if (sidebarCategoriesList) {
    sidebarCategoriesList.addEventListener('click', (e) => {
      const item = e.target.closest('.sidebar-cat-item');
      if (item && item.dataset.cat) {
        selectedCategory = item.dataset.cat;
        switchPage('jobdesk');
        renderAll();
      }
    });
  }

  if (btnSidebarAddCat) {
    btnSidebarAddCat.addEventListener('click', () => {
      btnAddCategory.click();
    });
  }

  if (btnSidebarManageCat) {
    btnSidebarManageCat.addEventListener('click', () => {
      btnManageCategories.click();
    });
  }

  if (btnQuickAddCatFromForm) {
    btnQuickAddCatFromForm.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (categoryModal) categoryModal.style.zIndex = '1100';
      btnAddCategory.click();
    });
  }

  // Category Tabs Click Delegation
  function handleCategoryTabClick(e) {
    // Handle Delete Category
    const delBtn = e.target.closest('[data-del-cat]');
    if (delBtn) {
      e.stopPropagation();
      const catId = delBtn.dataset.delCat;
      handleDeleteCategory(catId);
      return;
    }

    // Handle Switch Tab
    const tab = e.target.closest('.cat-tab');
    if (tab && tab.dataset.cat) {
      selectedCategory = tab.dataset.cat;
      localStorage.setItem('todolist_selected_category', selectedCategory);
      if (typeof activePage !== 'undefined' && activePage !== 'jobdesk' && typeof switchPage === 'function') {
        switchPage('jobdesk');
      }
      renderAll();
    }
  }

  // Draggable horizontal scroll helper for mobile/desktop category tabs
  function setupDraggableCategoryScroll(slider) {
    if (!slider || slider._dragInitialized) return;
    slider._dragInitialized = true;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasDragged = false;

    slider.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDown = true;
      slider.classList.add('is-dragging');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      hasDragged = false;
    });

    const stopDragging = () => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove('is-dragging');
      setTimeout(() => {
        hasDragged = false;
      }, 80);
    };

    slider.addEventListener('mouseleave', stopDragging);
    slider.addEventListener('mouseup', stopDragging);

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 4) {
        hasDragged = true;
        e.preventDefault();
        slider.scrollLeft = scrollLeft - walk;
      }
    });

    // Capture phase click handler to intercept click if user was dragging
    slider.addEventListener('click', (e) => {
      if (hasDragged) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);

    // Mouse wheel horizontal scroll support
    slider.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0 && e.deltaX === 0) {
        slider.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  if (categoryTabs) categoryTabs.addEventListener('click', handleCategoryTabClick);
  const mobileCategoryTabsEl = document.getElementById('mobile-category-tabs');
  if (mobileCategoryTabsEl) {
    mobileCategoryTabsEl.addEventListener('click', handleCategoryTabClick);
    setupDraggableCategoryScroll(mobileCategoryTabsEl);
  }

  // Bottom Add Category Button Listener (Mobile HP)
  const btnBottomAddCat = document.getElementById('btn-bottom-add-category');
  if (btnBottomAddCat) {
    btnBottomAddCat.addEventListener('click', () => {
      if (btnAddCategory) btnAddCategory.click();
    });
  }

  // Category Fold Toggle Listeners
  const btnToggleFoldCat = document.getElementById('btn-toggle-fold-cat');
  if (btnToggleFoldCat) {
    btnToggleFoldCat.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCategoryFold();
    });
  }
  const catCollapseToggle = document.getElementById('category-collapse-toggle');
  if (catCollapseToggle) {
    catCollapseToggle.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      toggleCategoryFold();
    });
  }

  // Quick Switch Category Button Listener
  const btnQuickSwitchCat = document.getElementById('btn-quick-switch-cat');
  if (btnQuickSwitchCat) {
    btnQuickSwitchCat.addEventListener('click', (e) => {
      e.preventDefault();
      const catSection = document.getElementById('category-section');
      if (catSection) {
        catSection.classList.remove('is-folded');
        const foldBtnText = document.getElementById('cat-fold-btn-text');
        const foldBtnIcon = document.getElementById('cat-fold-btn-icon');
        if (foldBtnText) foldBtnText.textContent = 'Lipat Kategori';
        if (foldBtnIcon) foldBtnIcon.textContent = '▲';
        catSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Modal Tambah Kategori
  const newCatGroup = document.getElementById('new-cat-group');
  const newCatCustomGroup = document.getElementById('new-cat-custom-group');
  if (newCatGroup) {
    newCatGroup.addEventListener('change', () => {
      if (newCatCustomGroup) {
        if (newCatGroup.value === '__custom__') {
          newCatCustomGroup.style.display = 'block';
          newCatCustomGroup.focus();
        } else {
          newCatCustomGroup.style.display = 'none';
        }
      }
    });
  }

  btnAddCategory.addEventListener('click', () => {
    newCatName.value = '';
    newCatIcon.value = '🏪';
    newCatColor.value = '#6366f1';
    if (newCatGroup) newCatGroup.value = 'Toko Bisnis';
    if (newCatCustomGroup) {
      newCatCustomGroup.value = '';
      newCatCustomGroup.style.display = 'none';
    }
    if (catModalError) {
      catModalError.style.display = 'none';
      catModalError.textContent = '';
    }
    document.querySelectorAll('.chip-preset').forEach(c => c.classList.remove('active'));
    categoryModal.style.display = 'flex';
    setTimeout(() => newCatName.focus(), 60);
  });

  // Preset Chips Listener
  document.querySelectorAll('.chip-preset').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip-preset').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      newCatName.value = chip.dataset.name || '';
      newCatIcon.value = chip.dataset.icon || '🏪';
      newCatColor.value = chip.dataset.color || '#6366f1';
      if (newCatGroup && chip.dataset.group) {
        newCatGroup.value = chip.dataset.group;
        if (newCatCustomGroup) newCatCustomGroup.style.display = 'none';
      }
      if (catModalError) {
        catModalError.style.display = 'none';
        catModalError.textContent = '';
      }
      newCatName.focus();
    });
  });

  if (newCatName) {
    newCatName.addEventListener('input', () => {
      if (catModalError) {
        catModalError.style.display = 'none';
        catModalError.textContent = '';
      }
    });
  }

  btnCloseCategoryModal.addEventListener('click', () => {
    categoryModal.style.display = 'none';
    categoryModal.style.zIndex = '';
  });
  btnCancelCategoryModal.addEventListener('click', () => {
    categoryModal.style.display = 'none';
    categoryModal.style.zIndex = '';
  });

  categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = newCatName.value.trim();
    if (!nameVal) {
      if (catModalError) {
        catModalError.style.display = 'flex';
        catModalError.innerHTML = '⚠️ <strong>Silakan ketik nama kategori</strong> Anda atau klik salah satu rekomendasi cepat di atas.';
      }
      newCatName.focus();
      return;
    }

    if (categories.some(c => c.name.toLowerCase() === nameVal.toLowerCase())) {
      if (catModalError) {
        catModalError.style.display = 'flex';
        catModalError.innerHTML = `⚠️ Kategori "<strong>${esc(nameVal)}</strong>" sudah terdaftar. Silakan pilih nama lain.`;
      } else {
        alert('Kategori dengan nama tersebut sudah ada.');
      }
      newCatName.focus();
      return;
    }

    let finalGroup = 'Toko Bisnis';
    if (newCatGroup) {
      if (newCatGroup.value === '__custom__' && newCatCustomGroup && newCatCustomGroup.value.trim()) {
        finalGroup = newCatCustomGroup.value.trim();
      } else if (newCatGroup.value && newCatGroup.value !== '__custom__') {
        finalGroup = newCatGroup.value;
      }
    }

    const newCat = {
      id: 'cat-' + Date.now(),
      name: nameVal,
      icon: newCatIcon.value.trim() || '📁',
      color: newCatColor.value || '#6366f1',
      group: finalGroup
    };

    categories.push(newCat);
    selectedCategory = newCat.name;
    localStorage.setItem('todolist_selected_category', selectedCategory);
    saveCategoriesData();
    categoryModal.style.display = 'none';
    categoryModal.style.zIndex = '';
    renderAll();

    // Select in todo form dropdown
    if (selectCategory) {
      updateCategorySelectOptions();
      selectCategory.value = newCat.name;
    }

    showToast(`✅ Kategori "${newCat.name}" berhasil dibuat dalam kelompok "${finalGroup}"!`, 'toast-success');
  });

  selectCategory.addEventListener('change', () => {
    if (selectCategory.value === '__add_new__') {
      btnAddCategory.click();
      selectCategory.value = categories[0]?.name || '';
    }
  });

  // =========================================================
  // QUOTE & VISION ENGINE
  // =========================================================

  function updateQuoteDisplay() {
    if (customQuote && customQuote.trim()) {
      quoteContent.textContent = `“${customQuote.trim()}”`;
      quoteAuthor.textContent = "— Kata Semangat Pilihan Bos Ricko";
      return;
    }
    const quote = DEFAULT_QUOTES[currentQuoteIndex % DEFAULT_QUOTES.length];
    quoteContent.textContent = `“${quote.text}”`;
    quoteAuthor.textContent = `— ${quote.author}`;
  }

  btnShuffleQuote.addEventListener('click', () => {
    customQuote = '';
    currentQuoteIndex = (currentQuoteIndex + 1) % DEFAULT_QUOTES.length;
    saveGoalsData();
    updateQuoteDisplay();
  });

  btnEditQuote.addEventListener('click', () => {
    const current = customQuote || DEFAULT_QUOTES[currentQuoteIndex].text;
    const input = prompt('Tulis kalimat penyemangat / motivasi untuk hari ini:', current);
    if (input !== null) {
      customQuote = input.trim();
      saveGoalsData();
      updateQuoteDisplay();
    }
  });

  function updateVisionSummary() {
    const summaryBar = document.getElementById('vision-summary-bar');
    if (!summaryBar) return;
    const total = goals.length;
    const reached = goals.filter(g => g.status === 'reached').length;
    const active = total - reached;
    summaryBar.innerHTML = `
      <div class="stat-pill" title="Total target impian mulia">
        <span class="icon">🌟</span> <span>${total}</span> Total Impian
      </div>
      <div class="stat-pill pill-warning" title="Sedang diikhtiarkan">
        <span class="icon">🔥</span> <span>${active}</span> Sedang Diikhtiarkan
      </div>
      <div class="stat-pill pill-success" title="Target yang sudah tercapai">
        <span class="icon">🏆</span> <span>${reached}</span> Sudah Tercapai
      </div>
    `;
  }

  // Render Goals Grid
  function renderGoalsGrid() {
    updateVisionSummary();
    if (!goals || goals.length === 0) {
      goalsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: var(--text-dim);">
          <p>Belum ada target impian. Klik "＋ Tambah Impian" untuk menambahkan impian muliamu!</p>
        </div>
      `;
      return;
    }

    goalsGrid.innerHTML = goals.map((goal, idx) => {
      const isReached = goal.status === 'reached';
      const icon = esc(goal.icon || '🎯');
      const category = esc(goal.category || 'Target Impian');
      const title = esc(goal.title);
      const price = esc(goal.targetPrice || '');
      const note = esc(goal.note || 'Fokus konsisten dan disiplin berikhtiar setiap hari.');
      const image = goal.image ? esc(goal.image) : '';

      return `
        <article class="goal-card ${isReached ? 'is-reached' : ''}" data-id="${esc(goal.id || String(idx))}">
          ${image ? `
            <div class="goal-cover" data-zoom-src="${image}" data-zoom-caption="${title}" title="Klik untuk memperbesar foto nyata">
              <img src="${image}" alt="${title}" class="goal-cover-img" loading="lazy" onerror="this.parentElement.style.display='none'">
              <span class="goal-photo-badge">📷 Foto Nyata</span>
              <span class="goal-zoom-hint">🔍 Perbesar</span>
            </div>
          ` : ''}

          <div class="goal-info">
            <div class="goal-category">${category}</div>
            <div class="goal-title-row">
              <span class="goal-icon">${icon}</span>
              <div class="goal-title">${title}</div>
            </div>
            ${price ? `<div class="goal-price">💰 ${price}</div>` : ''}
            <div class="goal-note">${note}</div>
          </div>

          <div class="goal-footer">
            <span class="goal-status-badge ${isReached ? 'status-reached' : 'status-progress'}">
              ${isReached ? '🎉 Tercapai!' : '🔥 Diikhtiarkan'}
            </span>
            <div class="goal-actions">
              <button type="button" class="btn btn-sm ${isReached ? 'btn-secondary' : 'btn-primary'}" data-action="toggle-goal" data-id="${esc(goal.id)}">
                ${isReached ? '↩ Batal' : '✓ Tercapai'}
              </button>
              <button type="button" class="btn-icon-sm" data-action="edit-goal" data-id="${esc(goal.id)}" title="Edit Impian">✏️</button>
              <button type="button" class="btn-icon-sm danger" data-action="delete-goal" data-id="${esc(goal.id)}" title="Hapus Impian">🗑️</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Vision Toggle
  if (btnToggleVision) {
    btnToggleVision.addEventListener('click', () => {
      const isHidden = sectionVision.style.display === 'none';
      sectionVision.style.display = isHidden ? 'block' : 'none';
      localStorage.setItem('todolist_vision_visible', isHidden ? 'true' : 'false');
      btnToggleVision.style.opacity = isHidden ? '1' : '0.6';
    });
  }

  function initVisionVisibility() {
    if (sectionVision) {
      sectionVision.style.display = 'block';
    }
  }

  // Lightbox Zoom
  document.addEventListener('click', (e) => {
    const cover = e.target.closest('.goal-cover');
    if (cover) {
      const src = cover.dataset.zoomSrc;
      const caption = cover.dataset.zoomCaption;
      if (src) {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption || 'Foto Nyata Target Impian';
        lightboxModal.style.display = 'flex';
      }
    }
  });

  btnCloseLightbox.addEventListener('click', () => {
    lightboxModal.style.display = 'none';
    lightboxImg.src = '';
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.style.display = 'none';
      lightboxImg.src = '';
    }
  });

  // Goal Actions (Toggle, Edit, Delete)
  goalsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    if (action === 'toggle-goal') {
      goal.status = goal.status === 'reached' ? 'on_progress' : 'reached';
      saveGoalsData();
      renderGoalsGrid();
    } else if (action === 'delete-goal') {
      if (confirm(`Hapus impian "${goal.title}"?`)) {
        goals = goals.filter(g => g.id !== id);
        saveGoalsData();
        renderGoalsGrid();
      }
    } else if (action === 'edit-goal') {
      openGoalModal(goal);
    }
  });

  // Add / Edit Goal Modal
  function openGoalModal(goal = null) {
    if (goal) {
      goalModalHeading.textContent = '✏️ Edit Target Impian';
      goalId.value = goal.id;
      goalTitle.value = goal.title;
      goalCategory.value = goal.category || '';
      goalIcon.value = goal.icon || '🎯';
      goalPrice.value = goal.targetPrice || '';
      goalImage.value = goal.image || '';
      goalImageSelect.value = goal.image || '';
      goalNote.value = goal.note || '';
    } else {
      goalModalHeading.textContent = '🌟 Tambah Target Impian Baru';
      goalId.value = '';
      goalTitle.value = '';
      goalCategory.value = '';
      goalIcon.value = '🎯';
      goalPrice.value = '';
      goalImage.value = '';
      goalImageSelect.value = '';
      goalNote.value = '';
    }
    goalModal.style.display = 'flex';
  }

  btnAddGoal.addEventListener('click', () => openGoalModal());
  btnCloseGoalModal.addEventListener('click', () => goalModal.style.display = 'none');
  btnCancelGoalModal.addEventListener('click', () => goalModal.style.display = 'none');

  goalImageSelect.addEventListener('change', () => {
    if (goalImageSelect.value) {
      goalImage.value = goalImageSelect.value;
    }
  });

  goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = goalId.value;
    const titleVal = goalTitle.value.trim();
    if (!titleVal) return;

    if (id) {
      const g = goals.find(item => item.id === id);
      if (g) {
        g.title = titleVal;
        g.category = goalCategory.value.trim() || 'Target Impian';
        g.icon = goalIcon.value.trim() || '🎯';
        g.targetPrice = goalPrice.value.trim();
        g.image = goalImage.value.trim();
        g.note = goalNote.value.trim();
      }
    } else {
      const newGoal = {
        id: 'goal-' + Date.now(),
        title: titleVal,
        category: goalCategory.value.trim() || 'Target Impian',
        icon: goalIcon.value.trim() || '🎯',
        targetPrice: goalPrice.value.trim(),
        image: goalImage.value.trim(),
        note: goalNote.value.trim(),
        status: 'on_progress'
      };
      goals.push(newGoal);
    }

    saveGoalsData();
    goalModal.style.display = 'none';
    renderGoalsGrid();
  });

  btnResetGoals.addEventListener('click', () => {
    if (confirm('Kembalikan daftar impian ke default (HP Tecno Camon 50 Pro, Yamaha NMAX, Umroh Bareng Istri)?')) {
      goals = JSON.parse(JSON.stringify(DEFAULT_GOALS));
      saveGoalsData();
      renderGoalsGrid();
    }
  });

  // =========================================================
  // STATS & TASKS LIST ENGINE
  // =========================================================

  function getScopeTodos() {
    if (!selectedCategory || selectedCategory === 'all' || !categories.some(c => c.name === selectedCategory)) {
      selectedCategory = categories[0] ? categories[0].name : '';
    }
    return todos.filter(t => t.category === selectedCategory);
  }

  function updateStats() {
    const scope = getScopeTodos();
    const totalTarget = scope.filter(t => t.type === 'target').length;
    const totalDaily = scope.filter(t => t.type === 'daily').length;
    const totalGeneral = scope.filter(t => t.type === 'general').length;
    const totalActive = scope.filter(t => !t.completed).length;
    const totalDone = scope.filter(t => t.completed).length;

    statTargetNum.textContent = totalTarget;
    statDailyNum.textContent = totalDaily;
    statGeneralNum.textContent = totalGeneral;
    statActiveNum.textContent = totalActive;
    statDoneNum.textContent = totalDone;

    const nonTargets = scope.filter(t => t.type !== 'target');
    if (cAll) cAll.textContent = nonTargets.length;
    if (cDaily) cDaily.textContent = totalDaily;
    if (cGeneral) cGeneral.textContent = totalGeneral;
    if (cTarget) cTarget.textContent = totalTarget;
    if (cActive) cActive.textContent = totalActive;
    if (cCompleted) cCompleted.textContent = totalDone;

    badgeTargetCount.textContent = `${totalTarget} Target`;
  }

  // Render Target Cards Grid (Work Targets / Harapan Kategori)
  function renderTargetsGrid() {
    const scope = getScopeTodos();
    const targets = scope.filter(t => t.type === 'target');
    if (targets.length === 0) {
      panelTargets.style.display = 'none';
      return;
    }

    panelTargets.style.display = 'block';
    targetsGrid.innerHTML = targets.map(item => {
      const isDone = Boolean(item.completed);
      const category = esc(item.category || 'Operasional & Markas');
      const priority = item.priority || 'medium';

      return `
        <div class="target-card hope-card ${isDone ? 'completed' : ''}" data-id="${item.id}">
          <div class="target-card-header">
            <div>
              <div class="target-card-title">${esc(item.title)}</div>
            </div>
            <div class="card-action-btns">
              <button class="btn-icon-sm btn-edit-target" title="Edit Target Harapan" data-id="${item.id}">✏️</button>
              <button class="btn-icon-sm danger btn-delete-task" title="Hapus Target" data-id="${item.id}">🗑️</button>
            </div>
          </div>

          <div class="target-hope-meta">
            <span class="target-status-badge ${isDone ? 'achieved' : 'pending'}">
              ${isDone ? '🏆 Target Tercapai!' : '🎯 Sedang Dikejar'}
            </span>
            <button type="button" class="btn-target-toggle" data-action="toggle-target" data-id="${item.id}">
              ${isDone ? '↺ Buka Kembali' : '✓ Tandai Tercapai'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Single Task Card Helper (Tampilan Bersih: Judul Jobdesk, Tombol Hapus & Ubah)
  function renderTaskCard(item) {
    const isDone = Boolean(item.completed);
    const streakHtml = item.type === 'daily' && item.streak > 0 
      ? `<span class="streak-pill" title="${item.streak} hari berturut-turut selesai!">🔥 ${item.streak} hari</span>` 
      : '';

    // Subtasks calculation for general tasks (Hanya tampil jika ada subtask atau sedang dibuka)
    let subtasksHtml = '';
    if (item.type === 'general') {
      const subtasks = Array.isArray(item.subtasks) ? item.subtasks : [];
      const totalSub = subtasks.length;
      const doneSub = subtasks.filter(s => s.completed).length;
      const pct = totalSub > 0 ? Math.round((doneSub / totalSub) * 100) : (item.completed ? 100 : 0);
      const isOpen = openSubtaskIds.has(String(item.id));

      if (totalSub > 0 || isOpen) {
        const subtaskListItems = subtasks.map(s => `
          <div class="subtask-item">
            <input 
              type="checkbox" 
              class="subtask-checkbox" 
              ${s.completed ? 'checked' : ''} 
              data-action="toggle-subtask" 
              data-task-id="${item.id}" 
              data-subtask-id="${s.id}"
            >
            <span class="subtask-title ${s.completed ? 'completed' : ''}">${esc(s.title)}</span>
            <button 
              type="button" 
              class="btn-subtask-del" 
              data-action="delete-subtask" 
              data-task-id="${item.id}" 
              data-subtask-id="${s.id}" 
              title="Hapus sub-tugas"
            >&times;</button>
          </div>
        `).join('');

        subtasksHtml = `
          <div class="subtask-section subtask-dropdown-container ${isOpen ? 'is-open' : 'is-closed'}">
            <button 
              type="button" 
              class="subtask-dropdown-toggle" 
              data-action="toggle-subtask-dropdown" 
              data-task-id="${item.id}"
              title="Klik untuk membuka / menutup sub-jobdesk"
              aria-expanded="${isOpen}"
            >
              <span class="subtask-toggle-left">
                <span class="subtask-toggle-arrow ${isOpen ? 'open' : ''}">${isOpen ? '▼' : '▶'}</span>
                <span class="subtask-toggle-label">Sub-jobdesk ${totalSub > 0 ? `(${doneSub}/${totalSub})` : ''}</span>
              </span>
              <span class="badge-progress ${pct === 100 ? 'done' : ''}">${pct}% Selesai</span>
            </button>
            <div class="subtask-dropdown-body" style="${isOpen ? 'display: block;' : 'display: none;'}">
              ${totalSub > 0 ? `
                <div class="subtask-progress-bar">
                  <div class="subtask-progress-fill ${pct === 100 ? 'done' : ''}" style="width: ${pct}%;"></div>
                </div>
                <div class="subtask-list">${subtaskListItems}</div>
              ` : `
                <div class="subtask-list subtask-empty-hint">Belum ada sub-jobdesk. Tambahkan rincian di bawah:</div>
              `}
              <div class="subtask-add-row">
                <input type="text" class="input-subtask" placeholder="＋ Tambah sub-jobdesk..." data-task-id="${item.id}" maxlength="150">
                <button type="button" class="btn btn-secondary btn-xs btn-add-subtask" data-task-id="${item.id}">Tambah</button>
              </div>
            </div>
          </div>
        `;
      }
    }

    const metaParts = [streakHtml].filter(Boolean);
    const metaHtml = metaParts.length > 0 ? `<div class="todo-meta">${metaParts.join('')}</div>` : '';

    const bodyHtml = (metaHtml || subtasksHtml) ? `
      <div class="todo-card-body">
        ${metaHtml}
        ${subtasksHtml}
      </div>
    ` : '';

    return `
      <div class="todo-item ${isDone ? 'completed' : ''}" data-id="${item.id}">
        <div class="todo-card-top">
          <div class="todo-card-title-row">
            <input 
              type="checkbox" 
              class="todo-checkbox" 
              ${isDone ? 'checked' : ''} 
              data-id="${item.id}"
              title="${isDone ? 'Tandai belum selesai' : 'Tandai sudah selesai'}"
            >
            <div class="todo-title">${esc(item.title)}</div>
          </div>
          <div class="todo-actions">
            <button class="btn-icon-sm btn-edit-task" title="Ubah Tugas" data-id="${item.id}" aria-label="Ubah">✏️</button>
            <button class="btn-icon-sm danger btn-delete-task" title="Hapus Tugas" data-id="${item.id}" aria-label="Hapus">🗑️</button>
          </div>
        </div>
        ${bodyHtml}
      </div>
    `;
  }

  // Render Task List (Jobdesk Umum di Atas, Jobdesk Harian di Bawah)
  function renderTaskList() {
    let scopeTodos = getScopeTodos().filter(t => t.type !== 'target');

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      scopeTodos = scopeTodos.filter(t => 
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    }

    const generalTodos = scopeTodos.filter(t => t.type === 'general');
    const dailyTodos = scopeTodos.filter(t => t.type === 'daily');

    let html = '';

    // 1. BAGIAN ATAS: JOBDESK UMUM
    const hasCompletedGeneral = generalTodos.some(t => t.completed);
    html += `
      <div class="jobdesk-split-section" id="section-general-jobdesk">
        <div class="jobdesk-split-header">
          <div class="split-header-left">
            <span class="split-icon">📌</span>
            <h3 class="split-title">Jobdesk Umum</h3>
            <span class="split-count-badge">${generalTodos.length} Tugas</span>
          </div>
          ${hasCompletedGeneral ? `
            <button type="button" class="btn-clear-completed-sub" id="btn-clear-completed-sub" title="Bersihkan tugas umum yang sudah selesai">
              Bersihkan Selesai
            </button>
          ` : ''}
        </div>
        <div class="jobdesk-cards-container todo-items-grid">
          ${generalTodos.length > 0 ? generalTodos.map(renderTaskCard).join('') : `
            <div class="empty-split-state">
              <span class="empty-icon">📌</span>
              <p>Belum ada jobdesk umum di kategori ini.</p>
            </div>
          `}
        </div>
      </div>
    `;

    // 2. BAGIAN BAWAH: JOBDESK HARIAN
    html += `
      <div class="jobdesk-split-section" id="section-daily-jobdesk">
        <div class="jobdesk-split-header split-daily-header">
          <div class="split-header-left">
            <span class="split-icon">🔄</span>
            <h3 class="split-title">Jobdesk Harian</h3>
            <span class="split-count-badge">${dailyTodos.length} Tugas</span>
            <span class="split-hint">• Reset otomatis tiap hari</span>
          </div>
        </div>
        <div class="jobdesk-cards-container todo-items-grid">
          ${dailyTodos.length > 0 ? dailyTodos.map(renderTaskCard).join('') : `
            <div class="empty-split-state">
              <span class="empty-icon">🔄</span>
              <p>Belum ada jobdesk harian di kategori ini.</p>
            </div>
          `}
        </div>
      </div>
    `;

    todoItemsList.innerHTML = html;
  }

  // =========================================================
  // CALENDAR & HISTORY TRACKING ENGINE
  // =========================================================

  function getTasksForDate(dateStr) {
    const today = getTodayDateStr();
    if (dateStr === today) {
      return todos.filter(t => t.type === 'daily').map(t => ({
        id: t.id,
        title: t.title,
        type: 'daily',
        category: t.category || 'Operasional & Markas',
        priority: t.priority || 'medium',
        completed: Boolean(t.completed),
        completedAt: t.completed ? (t.lastCompletedDate === today ? Date.now() : null) : null
      }));
    }
    if (historyData[dateStr] && Array.isArray(historyData[dateStr].tasks)) {
      return historyData[dateStr].tasks;
    }
    return [];
  }

  function getAgendasForDate(dateStr) {
    return agendas.filter(a => a.date === dateStr);
  }

  function renderCalendar() {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    calMonthYear.textContent = `${months[calMonth]} ${calYear}`;

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const startOffset = (firstDay + 6) % 7; // Monday-based offset
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();

    const todayStr = getTodayDateStr();

    let html = '';
    // Empty cells for offset
    for (let i = 0; i < startOffset; i++) {
      html += `<div class="cal-day-cell empty"></div>`;
    }

    // Days cells
    for (let day = 1; day <= totalDays; day++) {
      const mStr = String(calMonth + 1).padStart(2, '0');
      const dStr = String(day).padStart(2, '0');
      const dateKey = `${calYear}-${mStr}-${dStr}`;

      const isToday = dateKey === todayStr;
      const isSelected = dateKey === selectedDateStr;

      const tasks = getTasksForDate(dateKey);
      let indicatorHtml = '';

      if (tasks.length > 0) {
        const completedCount = tasks.filter(t => t.completed).length;
        if (completedCount === tasks.length) {
          indicatorHtml = `<i class="cal-indicator done" title="Semua ${tasks.length} tugas tuntas"></i>`;
        } else if (completedCount > 0) {
          indicatorHtml = `<i class="cal-indicator partial" title="${completedCount}/${tasks.length} tugas tuntas"></i>`;
        } else {
          indicatorHtml = `<i class="cal-indicator missed" title="0/${tasks.length} tugas tuntas (belum dikerjakan)"></i>`;
        }
      }

      const dayAgendas = getAgendasForDate(dateKey);
      const agendaBadgeHtml = dayAgendas.length > 0 
        ? `<span class="cal-day-agenda-badge" title="${dayAgendas.length} Agenda Terjadwal">📌 ${dayAgendas.length}</span>` 
        : '';

      html += `
        <div class="cal-day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" data-date="${dateKey}" title="${formatDateIndo(dateKey)}">
          <span>${day}</span>
          ${indicatorHtml}
          ${agendaBadgeHtml}
        </div>
      `;
    }

    calDaysGrid.innerHTML = html;
    renderCalendarDetail(selectedDateStr);
  }

  function renderCalendarDetail(dateStr) {
    const todayStr = getTodayDateStr();
    const yesterdayStr = getYesterdayDateStr();

    calDetailDate.textContent = formatDateIndo(dateStr);

    if (dateStr === todayStr) {
      calDetailRelative.textContent = '🌟 Hari Ini';
      calDetailRelative.style.background = 'var(--accent-light)';
      calDetailRelative.style.color = 'var(--accent)';
    } else if (dateStr === yesterdayStr) {
      calDetailRelative.textContent = '⏮ Kemarin';
      calDetailRelative.style.background = 'rgba(245, 158, 11, 0.18)';
      calDetailRelative.style.color = 'var(--warning)';
    } else {
      calDetailRelative.textContent = '📅 Catatan Riwayat';
      calDetailRelative.style.background = 'var(--panel-border)';
      calDetailRelative.style.color = 'var(--text-muted)';
    }

    // Render Agendas for selected date
    const dayAgendas = getAgendasForDate(dateStr);
    calCountAgendas.textContent = dayAgendas.length;
    if (dayAgendas.length === 0) {
      calListAgendas.innerHTML = `
        <div style="font-size: 0.78rem; color: var(--text-dim); padding: 4px 0;">
          Belum ada agenda di tanggal ini. Klik <strong>＋ Tambah Agenda</strong> untuk menjadwalkan kerjaan.
        </div>
      `;
    } else {
      calListAgendas.innerHTML = dayAgendas.map(a => `
        <div class="cal-agenda-item ${a.completed ? 'completed' : ''}" data-id="${a.id}">
          <input type="checkbox" class="cal-agenda-checkbox" ${a.completed ? 'checked' : ''} data-agenda-id="${a.id}">
          <div class="cal-agenda-content">
            <div class="cal-agenda-title">${esc(a.title)}</div>
            <div class="cal-agenda-meta">
              <span class="badge-tag category">🏷️ ${esc(a.category || 'Umum')}</span>
              ${a.time ? `<span class="cal-agenda-time">⏰ ${esc(a.time)}</span>` : ''}
              ${a.note ? `<span style="color:var(--text-muted);font-style:italic;">📝 ${esc(a.note)}</span>` : ''}
            </div>
          </div>
          <button type="button" class="btn-agenda-del" data-del-agenda-id="${a.id}" title="Hapus agenda">🗑️</button>
        </div>
      `).join('');
    }

    const tasks = getTasksForDate(dateStr);
    const uncompleted = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);

    const total = tasks.length;
    const done = completed.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    calDetailScore.textContent = total > 0 ? `${done} / ${total} Selesai (${pct}%)` : 'Tidak Ada Data Tugas';
    calDetailProgressFill.style.width = `${pct}%`;
    if (pct === 100) {
      calDetailProgressFill.className = 'progress-fill fill-done';
    } else {
      calDetailProgressFill.className = 'progress-fill';
    }

    calCountUncompleted.textContent = uncompleted.length;
    calCountCompleted.textContent = completed.length;

    // Render Uncompleted Tasks
    if (uncompleted.length === 0) {
      calListUncompleted.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-dim); padding: 4px 0;">
          ${total > 0 ? '✨ Luar biasa! Semua tugas harian sudah diselesaikan.' : 'Belum ada catatan tugas harian pada tanggal ini.'}
        </div>
      `;
    } else {
      calListUncompleted.innerHTML = uncompleted.map(t => {
        const isToday = dateStr === todayStr;
        const catName = t.category || 'Operasional & Markas';
        return `
          <div class="cal-task-item uncompleted">
            <div class="cal-task-content">
              <div class="cal-task-header-row">
                <div class="cal-task-title-group">
                  <span class="cal-task-icon" style="color:var(--danger);font-size:0.95rem;">❌</span>
                  <div class="cal-task-title" title="${esc(t.title)}">${esc(t.title)}</div>
                </div>
                <button 
                  type="button" 
                  class="btn-catchup" 
                  data-action="catchup-task" 
                  data-date="${dateStr}" 
                  data-id="${t.id}"
                  title="${isToday ? 'Tandai selesai sekarang' : 'Tandai diselesaikan secara susulan'}"
                >
                  ✓ ${isToday ? 'Selesaikan' : 'Susulkan'}
                </button>
              </div>
              <div class="cal-task-meta">
                <span class="badge-tag category">🏷️ ${esc(catName)}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render Completed Tasks
    if (completed.length === 0) {
      calListCompleted.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-dim); padding: 4px 0;">
          Belum ada tugas yang diselesaikan pada tanggal ini.
        </div>
      `;
    } else {
      calListCompleted.innerHTML = completed.map(t => {
        const catName = t.category || 'Operasional & Markas';
        return `
          <div class="cal-task-item completed">
            <div class="cal-task-content">
              <div class="cal-task-header-row">
                <div class="cal-task-title-group">
                  <span class="cal-task-icon" style="color:var(--success);font-size:0.95rem;">✔️</span>
                  <div class="cal-task-title" title="${esc(t.title)}">${esc(t.title)}</div>
                </div>
                <button 
                  type="button" 
                  class="btn-icon-sm" 
                  data-action="uncatchup-task" 
                  data-date="${dateStr}" 
                  data-id="${t.id}"
                  title="Batalkan tanda selesai"
                >
                  ↩
                </button>
              </div>
              <div class="cal-task-meta">
                <span class="badge-tag category">🏷️ ${esc(catName)}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Calendar Click - Select Date
  calDaysGrid.addEventListener('click', (e) => {
    const cell = e.target.closest('.cal-day-cell:not(.empty)');
    if (cell && cell.dataset.date) {
      selectedDateStr = cell.dataset.date;
      document.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('is-selected'));
      cell.classList.add('is-selected');
      renderCalendarDetail(selectedDateStr);
    }
  });

  // Calendar Month Navigation
  btnCalPrev.addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) {
      calMonth = 11;
      calYear--;
    }
    renderCalendar();
  });

  btnCalNext.addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) {
      calMonth = 0;
      calYear++;
    }
    renderCalendar();
  });

  // Quick jump: Today
  btnCalToday.addEventListener('click', () => {
    const d = new Date();
    calYear = d.getFullYear();
    calMonth = d.getMonth();
    selectedDateStr = getTodayDateStr();
    renderCalendar();
  });

  // Quick jump: Yesterday
  btnCalYesterday.addEventListener('click', () => {
    const yStr = getYesterdayDateStr();
    const parts = yStr.split('-');
    calYear = parseInt(parts[0], 10);
    calMonth = parseInt(parts[1], 10) - 1;
    selectedDateStr = yStr;
    renderCalendar();
  });

  // Action in Calendar Detail: Catch up past task or undo
  document.addEventListener('click', (e) => {
    const catchupBtn = e.target.closest('[data-action="catchup-task"]');
    if (catchupBtn) {
      const dateStr = catchupBtn.dataset.date;
      const id = catchupBtn.dataset.id;
      const today = getTodayDateStr();

      if (dateStr === today) {
        const item = todos.find(t => t.id === id);
        if (item) {
          item.completed = true;
          item.lastCompletedDate = today;
          saveTodosData();
        }
      } else {
        if (historyData[dateStr] && Array.isArray(historyData[dateStr].tasks)) {
          const t = historyData[dateStr].tasks.find(x => x.id === id);
          if (t) {
            t.completed = true;
            t.completedAt = Date.now();
            saveHistoryData();
          }
        }
      }

      syncTodayHistory();
      renderAll();
      return;
    }

    const uncatchupBtn = e.target.closest('[data-action="uncatchup-task"]');
    if (uncatchupBtn) {
      const dateStr = uncatchupBtn.dataset.date;
      const id = uncatchupBtn.dataset.id;
      const today = getTodayDateStr();

      if (dateStr === today) {
        const item = todos.find(t => t.id === id);
        if (item) {
          item.completed = false;
          saveTodosData();
        }
      } else {
        if (historyData[dateStr] && Array.isArray(historyData[dateStr].tasks)) {
          const t = historyData[dateStr].tasks.find(x => x.id === id);
          if (t) {
            t.completed = false;
            t.completedAt = null;
            saveHistoryData();
          }
        }
      }

      syncTodayHistory();
      renderAll();
      return;
    }
  });

  function renderAll() {
    renderCategoryTabs();
    renderSidebarCategories();
    updateQuoteDisplay();
    renderGoalsGrid();
    updateVisionSummary();
    updateStats();
    renderTargetsGrid();
    renderTaskList();
    renderCalendar();
    updateNavBadges();
  }

  // Modal Tambah Tugas (Pop-up Minimalis)
  function openTodoModal() {
    if (!todoModal) return;
    updateCategorySelectOptions();
    inputTitle.value = '';
    if (selectCategory) {
      if (selectedCategory && categories.some(c => c.name === selectedCategory)) {
        selectCategory.value = selectedCategory;
      } else if (categories.length > 0) {
        selectCategory.value = categories[0].name;
      }
    }
    selectType.value = 'general';
    selectPriority.value = 'medium';
    if (todoModalError) {
      todoModalError.style.display = 'none';
      todoModalError.textContent = '';
    }
    todoModal.style.display = 'flex';
    setTimeout(() => {
      if (inputTitle) inputTitle.focus();
    }, 60);
  }

  function closeTodoModal() {
    if (todoModal) todoModal.style.display = 'none';
  }

  // Tutup Modal saat Klik Area Gelap Luar (Backdrop)
  const allModalElements = [
    todoModal, 
    categoryModal, 
    manageCategoryModal, 
    agendaModal, 
    editModal, 
    goalModal, 
    mobileAccessModal
  ];

  allModalElements.forEach(m => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) {
          m.style.display = 'none';
          if (m === categoryModal) m.style.zIndex = '';
        }
      });
    }
  });

  // Tutup Modal saat Menekan Tombol ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModalElements.concat(lightboxModal).forEach(m => {
        if (m && m.style.display !== 'none') {
          m.style.display = 'none';
          if (m === categoryModal) m.style.zIndex = '';
        }
      });
    }
  });

  if (btnOpenTodoModal) {
    btnOpenTodoModal.addEventListener('click', openTodoModal);
  }
  if (btnCloseTodoModal) {
    btnCloseTodoModal.addEventListener('click', closeTodoModal);
  }
  if (btnCancelTodoModal) {
    btnCancelTodoModal.addEventListener('click', closeTodoModal);
  }

  if (inputTitle) {
    inputTitle.addEventListener('input', () => {
      if (todoModalError) {
        todoModalError.style.display = 'none';
        todoModalError.textContent = '';
      }
    });
  }

  // Form Submit Add Task (via Modal Pop-up)
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = inputTitle.value.trim();
    if (!title) {
      if (todoModalError) {
        todoModalError.style.display = 'flex';
        todoModalError.innerHTML = '⚠️ <strong>Judul pekerjaan belum diisi!</strong> Silakan ketik nama tugas.';
      }
      inputTitle.focus();
      return;
    }

    const category = selectCategory.value || selectedCategory || (categories[0] ? categories[0].name : 'Operasional & Markas');
    const type = selectType.value;
    const priority = selectPriority.value;

    const newItem = {
      id: 'todo-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title,
      category,
      type,
      priority,
      completed: false,
      createdAt: Date.now()
    };

    if (type === 'general') {
      newItem.subtasks = [];
    } else if (type === 'daily') {
      newItem.streak = 0;
      newItem.lastCompletedDate = null;
    }

    todos.unshift(newItem);
    saveTodosData();
    syncTodayHistory();

    // If new task was created in a different category, switch active tab to it
    if (category && category !== selectedCategory) {
      selectedCategory = category;
      localStorage.setItem('todolist_selected_category', selectedCategory);
    }

    closeTodoModal();
    renderAll();
    showToast(`✅ Tugas berhasil ditambahkan ke <strong>${esc(category)}</strong>!`, 'toast-success');
  });

  // Target Grid Click Actions (Harapan Kategori Toggle)
  targetsGrid.addEventListener('click', (e) => {
    const toggleTargetBtn = e.target.closest('[data-action="toggle-target"]');
    if (toggleTargetBtn) {
      const id = toggleTargetBtn.dataset.id;
      const item = todos.find(t => t.id === id);
      if (item) {
        item.completed = !item.completed;
        saveTodosData();
        renderAll();
      }
      return;
    }
  });

  // Subtask Helpers
  function addSubtask(taskId, title) {
    const cleanTitle = (title || '').trim();
    if (!cleanTitle) return;
    const item = todos.find(t => t.id === taskId);
    if (!item) return;

    if (!Array.isArray(item.subtasks)) item.subtasks = [];
    item.subtasks.push({
      id: 'st-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      title: cleanTitle,
      completed: false
    });

    if (item.subtasks.length > 0) {
      item.completed = item.subtasks.every(s => s.completed);
    }

    openSubtaskIds.add(String(taskId));
    saveTodosData();
    renderTaskList();
  }

  function toggleSubtask(taskId, subtaskId) {
    const item = todos.find(t => t.id === taskId);
    if (!item || !Array.isArray(item.subtasks)) return;

    const sub = item.subtasks.find(s => s.id === subtaskId);
    if (sub) {
      sub.completed = !sub.completed;
      if (item.subtasks.length > 0) {
        item.completed = item.subtasks.every(s => s.completed);
      }
      openSubtaskIds.add(String(taskId));
      saveTodosData();
      renderAll();
    }
  }

  function deleteSubtask(taskId, subtaskId) {
    const item = todos.find(t => t.id === taskId);
    if (!item || !Array.isArray(item.subtasks)) return;

    item.subtasks = item.subtasks.filter(s => s.id !== subtaskId);
    if (item.subtasks.length > 0) {
      item.completed = item.subtasks.every(s => s.completed);
    }
    openSubtaskIds.add(String(taskId));
    saveTodosData();
    renderAll();
  }

  // Global Click Actions (Checkboxes, Subtasks, Edit, Delete, Agenda)
  document.addEventListener('click', (e) => {
    // Toggle Subtask Dropdown (Default Tertutup, Buka saat Diklik)
    const toggleSubtaskBtn = e.target.closest('[data-action="toggle-subtask-dropdown"]');
    if (toggleSubtaskBtn) {
      const taskId = toggleSubtaskBtn.dataset.taskId;
      if (openSubtaskIds.has(String(taskId))) {
        openSubtaskIds.delete(String(taskId));
      } else {
        openSubtaskIds.add(String(taskId));
      }
      renderTaskList();
      return;
    }

    // Bersihkan Jobdesk Umum yang Selesai
    const clearCompGeneralBtn = e.target.closest('#btn-clear-completed-sub');
    if (clearCompGeneralBtn) {
      const scope = getScopeTodos().filter(t => t.type === 'general');
      const completedTasks = scope.filter(t => t.completed);
      if (completedTasks.length > 0 && confirm(`Bersihkan ${completedTasks.length} jobdesk umum yang sudah selesai?`)) {
        const completedIds = new Set(completedTasks.map(t => t.id));
        todos = todos.filter(t => !completedIds.has(t.id));
        saveTodosData();
        syncTodayHistory();
        renderAll();
      }
      return;
    }

    // Add Subtask button
    const addSubtaskBtn = e.target.closest('.btn-add-subtask');
    if (addSubtaskBtn) {
      const taskId = addSubtaskBtn.dataset.taskId;
      const row = addSubtaskBtn.closest('.subtask-add-row');
      const input = row ? row.querySelector('.input-subtask') : null;
      if (input && input.value.trim()) {
        addSubtask(taskId, input.value.trim());
        input.value = '';
      }
      return;
    }

    // Toggle Subtask
    const subtaskCb = e.target.closest('[data-action="toggle-subtask"]');
    if (subtaskCb) {
      const taskId = subtaskCb.dataset.taskId;
      const subtaskId = subtaskCb.dataset.subtaskId;
      toggleSubtask(taskId, subtaskId);
      return;
    }

    // Delete Subtask
    const delSubtaskBtn = e.target.closest('[data-action="delete-subtask"]');
    if (delSubtaskBtn) {
      const taskId = delSubtaskBtn.dataset.taskId;
      const subtaskId = delSubtaskBtn.dataset.subtaskId;
      deleteSubtask(taskId, subtaskId);
      return;
    }

    // Agenda Checkbox Toggle
    if (e.target.classList.contains('cal-agenda-checkbox')) {
      const agendaIdVal = e.target.dataset.agendaId;
      const ag = agendas.find(a => a.id === agendaIdVal);
      if (ag) {
        ag.completed = e.target.checked;
        saveAgendasData();
        renderCalendarDetail(selectedDateStr);
      }
      return;
    }

    // Agenda Delete
    const delAgendaBtn = e.target.closest('[data-del-agenda-id]');
    if (delAgendaBtn) {
      const agendaIdVal = delAgendaBtn.dataset.delAgendaId;
      const ag = agendas.find(a => a.id === agendaIdVal);
      const title = ag ? ag.title : 'agenda ini';
      if (confirm(`Hapus "${title}"?`)) {
        agendas = agendas.filter(a => a.id !== agendaIdVal);
        saveAgendasData();
        renderAll();
      }
      return;
    }

    // Main Todo Checkbox toggle
    if (e.target.classList.contains('todo-checkbox')) {
      const id = e.target.dataset.id;
      const item = todos.find(t => t.id === id);
      if (item) {
        item.completed = e.target.checked;
        const today = getTodayDateStr();
        const yesterday = getYesterdayDateStr();

        if (item.completed) {
          if (item.type === 'daily') {
            if (item.lastCompletedDate === yesterday) {
              item.streak = (item.streak || 0) + 1;
            } else if (item.lastCompletedDate !== today) {
              item.streak = 1;
            }
            item.lastCompletedDate = today;
          } else if (item.type === 'general' && Array.isArray(item.subtasks)) {
            // Check all subtasks if parent is checked
            item.subtasks.forEach(s => s.completed = true);
          }
        } else {
          if (item.type === 'daily' && item.streak > 0) {
            item.streak = Math.max(0, item.streak - 1);
            item.lastCompletedDate = null;
          } else if (item.type === 'general' && Array.isArray(item.subtasks)) {
            // Uncheck all subtasks if parent is unchecked
            item.subtasks.forEach(s => s.completed = false);
          }
        }
        saveTodosData();
        syncTodayHistory();
        renderAll();
      }
      return;
    }

    // Delete task
    const delBtn = e.target.closest('.btn-delete-task');
    if (delBtn) {
      const id = delBtn.dataset.id;
      const item = todos.find(t => t.id === id);
      const title = item ? item.title : 'tugas ini';
      if (confirm(`Hapus "${title}"?`)) {
        todos = todos.filter(t => t.id !== id);
        saveTodosData();
        syncTodayHistory();
        renderAll();
      }
      return;
    }

    // Edit task / target
    const editBtn = e.target.closest('.btn-edit-task, .btn-edit-target');
    if (editBtn) {
      const id = editBtn.dataset.id;
      openEditModal(id);
      return;
    }
  });

  // Enter key in subtask input
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('input-subtask')) {
      e.preventDefault();
      const taskId = e.target.dataset.taskId;
      if (taskId && e.target.value.trim()) {
        addSubtask(taskId, e.target.value.trim());
        e.target.value = '';
      }
    }
  });

  // =========================================================
  // AGENDA MODAL & MANAGEMENT
  // =========================================================

  function openAgendaModal(dateDefault) {
    if (!agendaModal) return;
    agendaId.value = '';
    agendaTitle.value = '';
    agendaDate.value = dateDefault || selectedDateStr || getTodayDateStr();
    agendaTime.value = '';
    if (agendaCategory) {
      agendaCategory.value = (selectedCategory !== 'all' ? selectedCategory : (categories[0]?.name || 'Operasional & Markas'));
    }
    if (agendaNote) agendaNote.value = '';
    agendaModal.style.display = 'flex';
    agendaTitle.focus();
  }

  function closeAgendaModal() {
    if (agendaModal) agendaModal.style.display = 'none';
  }

  if (btnTopAddAgenda) {
    btnTopAddAgenda.addEventListener('click', () => openAgendaModal(selectedDateStr));
  }
  if (btnQuickAddAgenda) {
    btnQuickAddAgenda.addEventListener('click', () => openAgendaModal(selectedDateStr));
  }
  if (btnCloseAgendaModal) {
    btnCloseAgendaModal.addEventListener('click', closeAgendaModal);
  }
  if (btnCancelAgendaModal) {
    btnCancelAgendaModal.addEventListener('click', closeAgendaModal);
  }

  if (agendaForm) {
    agendaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleVal = agendaTitle.value.trim();
      const dateVal = agendaDate.value;
      if (!titleVal || !dateVal) return;

      const catVal = agendaCategory ? agendaCategory.value : (categories[0]?.name || 'Operasional & Markas');
      const timeVal = agendaTime ? agendaTime.value : '';
      const noteVal = agendaNote ? agendaNote.value.trim() : '';

      if (agendaId.value) {
        const ag = agendas.find(a => a.id === agendaId.value);
        if (ag) {
          ag.title = titleVal;
          ag.date = dateVal;
          ag.time = timeVal;
          ag.category = catVal;
          ag.note = noteVal;
        }
      } else {
        const newAgenda = {
          id: 'agenda-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
          title: titleVal,
          date: dateVal,
          time: timeVal,
          category: catVal,
          note: noteVal,
          completed: false,
          createdAt: Date.now()
        };
        agendas.push(newAgenda);
      }

      saveAgendasData();
      selectedDateStr = dateVal; // select the scheduled date in calendar
      closeAgendaModal();
      renderAll();
    });
  }

  // Modal Edit Functions
  function openEditModal(id) {
    const item = todos.find(t => t.id === id);
    if (!item) return;

    editId.value = item.id;
    editTitle.value = item.title;
    editCategory.value = item.category || (categories[0] ? categories[0].name : 'Operasional & Markas');
    editType.value = item.type || 'general';
    editPriority.value = item.priority || 'medium';

    editModal.style.display = 'flex';
    editTitle.focus();
  }

  function closeEditModal() {
    editModal.style.display = 'none';
  }

  btnCloseModal.addEventListener('click', closeEditModal);
  btnCancelModal.addEventListener('click', closeEditModal);

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = editId.value;
    const item = todos.find(t => t.id === id);
    if (!item) return;

    item.title = editTitle.value.trim();
    item.category = editCategory.value || 'Operasional & Markas';
    item.type = editType.value;
    item.priority = editPriority.value;

    saveTodosData();
    syncTodayHistory();
    closeEditModal();
    renderAll();
  });

  // Filter Buttons
  document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTaskList();
    });
  });

  // Search Input
  inputSearch.addEventListener('input', () => {
    searchQuery = inputSearch.value;
    renderTaskList();
  });

  // Clear completed tasks
  btnClearCompleted.addEventListener('click', () => {
    const scope = getScopeTodos();
    const completedTasks = scope.filter(t => t.completed);
    if (completedTasks.length === 0) {
      alert('Tidak ada tugas yang berstatus selesai di kategori ini.');
      return;
    }

    if (confirm(`Bersihkan ${completedTasks.length} tugas yang sudah selesai?`)) {
      const completedIds = new Set(completedTasks.map(t => t.id));
      todos = todos.filter(t => !completedIds.has(t.id));
      saveTodosData();
      syncTodayHistory();
      renderAll();
    }
  });

  // Open Data Folder
  btnOpenData.addEventListener('click', async () => {
    if (window.todoAPI && typeof window.todoAPI.openDataFolder === 'function') {
      await window.todoAPI.openDataFolder();
    } else {
      alert('Penyimpanan lokal aktif di folder data/todos.json.');
    }
  });

  // Theme Toggle
  // =========================================================
  // PAGE SWITCHING & SIDEBAR NAVIGATION
  // =========================================================
  let activePage = 'vision'; // TARGET IMPIAN HALAMAN PERTAMA

  function updateTopNavHeader(page) {
    const topIcon = document.getElementById('top-page-icon');
    const topTitle = document.getElementById('top-page-title');
    const topSubtitle = document.getElementById('top-page-subtitle');
    const contextActions = document.getElementById('top-context-actions');

    if (page === 'vision') {
      if (topIcon) topIcon.textContent = '🌟';
      if (topTitle) topTitle.textContent = 'Harapan & Target Impian Bos Ricko';
      if (topSubtitle) topSubtitle.textContent = 'Fokus ikhtiar kita hari ini untuk mewujudkan target-target mulia ini bersama keluarga tercinta.';
      if (contextActions) {
        contextActions.innerHTML = `
          <button type="button" class="btn btn-primary btn-sm" id="btn-top-add-goal">
            ＋ Tambah Impian
          </button>
        `;
        const btn = document.getElementById('btn-top-add-goal');
        if (btn) btn.addEventListener('click', () => btnAddGoal.click());
      }
    } else if (page === 'jobdesk') {
      const currentCat = categories.find(c => c.name === selectedCategory) || categories[0];
      const catIcon = (currentCat && currentCat.icon) ? currentCat.icon : '🏪';
      const catName = (currentCat && currentCat.name) ? currentCat.name : 'Jobdesk & Target Kerja';
      if (topIcon) topIcon.textContent = catIcon;
      if (topTitle) topTitle.textContent = catName;
      if (topSubtitle) topSubtitle.textContent = 'Daftar pekerjaan & target kategori ' + catName;
      if (contextActions) {
        contextActions.innerHTML = `
          <button type="button" class="btn btn-primary btn-sm" id="btn-top-add-task">
            ＋ Tambah Tugas
          </button>
        `;
        const btn = document.getElementById('btn-top-add-task');
        if (btn) {
          btn.addEventListener('click', () => {
            openTodoModal();
          });
        }
      }
    } else if (page === 'calendar') {
      if (topIcon) topIcon.textContent = '📅';
      if (topTitle) topTitle.textContent = 'Kalender Pelacak & Agenda Kerja';
      if (topSubtitle) topSubtitle.textContent = 'Jadwalkan agenda kerja di tanggal tertentu, pantau ketercapaian tugas harian, dan cek riwayat kemarin.';
      if (contextActions) {
        contextActions.innerHTML = `
          <button type="button" class="btn btn-primary btn-sm" id="btn-top-add-agenda-header">
            ＋ Tambah Agenda
          </button>
        `;
        const btn = document.getElementById('btn-top-add-agenda-header');
        if (btn) btn.addEventListener('click', () => btnTopAddAgenda.click());
      }
    }
  }

  function switchPage(pageName) {
    activePage = pageName;

    // Update Sidebar Navigation button states
    document.querySelectorAll('.sidebar-nav-item').forEach(btn => {
      if (btn.dataset.page === pageName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Mobile Bottom Navigation button states
    document.querySelectorAll('.mobile-nav-btn[data-page]').forEach(btn => {
      if (btn.dataset.page === pageName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Close Mobile Drawer if open
    if (appSidebar) appSidebar.classList.remove('drawer-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');

    // Update Pages display
    const pageMap = {
      vision: document.getElementById('page-vision'),
      jobdesk: document.getElementById('page-jobdesk'),
      calendar: document.getElementById('page-calendar')
    };

    Object.keys(pageMap).forEach(key => {
      const pageEl = pageMap[key];
      if (pageEl) {
        if (key === pageName) {
          pageEl.style.display = 'block';
          pageEl.classList.add('active');
        } else {
          pageEl.style.display = 'none';
          pageEl.classList.remove('active');
        }
      }
    });

    updateTopNavHeader(pageName);
    updateNavBadges();
  }

  function updateNavBadges() {
    const badgeGoals = document.getElementById('nav-badge-goals');
    const badgeTodos = document.getElementById('nav-badge-todos');
    const badgeAgendas = document.getElementById('nav-badge-agendas');

    if (badgeGoals) {
      badgeGoals.textContent = (goals && goals.length) ? goals.length : 0;
    }
    const uncompletedCount = todos.filter(t => !t.completed).length;
    if (badgeTodos) {
      badgeTodos.textContent = uncompletedCount;
    }
    if (mobBadgeTodos) {
      mobBadgeTodos.textContent = uncompletedCount;
    }
    if (badgeAgendas) {
      badgeAgendas.textContent = (agendas && agendas.length) ? agendas.length : 0;
    }
  }

  // Sidebar Nav Click Listeners
  document.querySelectorAll('.sidebar-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page) {
        switchPage(page);
      }
    });
  });

  // Mobile Bottom Nav Click Listeners
  document.querySelectorAll('.mobile-nav-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page) {
        switchPage(page);
      }
    });
  });

  if (mobBtnCategories) {
    mobBtnCategories.addEventListener('click', () => {
      switchPage('jobdesk');
      if (appSidebar) appSidebar.classList.add('drawer-open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    });
  }

  // Mobile Drawer Toggle (Hamburger)
  if (btnMobileMenuToggle) {
    btnMobileMenuToggle.addEventListener('click', () => {
      if (appSidebar) appSidebar.classList.toggle('drawer-open');
      if (sidebarBackdrop) sidebarBackdrop.classList.toggle('active');
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => {
      if (appSidebar) appSidebar.classList.remove('drawer-open');
      sidebarBackdrop.classList.remove('active');
    });
  }

  // Mobile Access Modal & QR Code Handlers
  async function openMobileAccessModal() {
    let serverInfo = null;
    try {
      if (window.todoAPI && typeof window.todoAPI.getServerInfo === 'function') {
        serverInfo = await window.todoAPI.getServerInfo();
      } else {
        serverInfo = await apiGet('/api/server-info');
      }
    } catch (e) {
      console.warn('Gagal membaca server info:', e);
    }

    if (!serverInfo) {
      const host = window.location.host || 'localhost:3000';
      const url = `${window.location.protocol}//${host}`;
      serverInfo = { url, ip: window.location.hostname, port: window.location.port || 3000 };
    }

    if (mobileUrlInput) {
      mobileUrlInput.value = serverInfo.url;
    }

    if (mobileQrBox) {
      if (serverInfo.qrSvg) {
        mobileQrBox.innerHTML = serverInfo.qrSvg;
      } else if (window.QRCodeSVG && typeof window.QRCodeSVG.generateSVG === 'function') {
        mobileQrBox.innerHTML = window.QRCodeSVG.generateSVG(serverInfo.url);
      }
    }

    if (mobileAccessModal) {
      mobileAccessModal.style.display = 'flex';
    }
  }

  function closeMobileAccessModal() {
    if (mobileAccessModal) {
      mobileAccessModal.style.display = 'none';
    }
  }

  if (btnMobileAccess) btnMobileAccess.addEventListener('click', openMobileAccessModal);
  if (btnTopMobileAccess) btnTopMobileAccess.addEventListener('click', openMobileAccessModal);
  if (mobBtnServer) mobBtnServer.addEventListener('click', openMobileAccessModal);
  if (btnCloseMobileModal) btnCloseMobileModal.addEventListener('click', closeMobileAccessModal);
  if (btnCloseMobileModalBottom) btnCloseMobileModalBottom.addEventListener('click', closeMobileAccessModal);

  if (btnCopyMobileUrl) {
    btnCopyMobileUrl.addEventListener('click', () => {
      if (mobileUrlInput) {
        mobileUrlInput.select();
        navigator.clipboard.writeText(mobileUrlInput.value).then(() => {
          showToast('📋 Link HP berhasil disalin ke clipboard!', 'toast-success');
        }).catch(() => {
          document.execCommand('copy');
          showToast('📋 Link HP disalin!', 'toast-success');
        });
      }
    });
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('todolist_theme') || 'light';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      btnThemeToggle.textContent = '☀️ Mode Terang';
    } else {
      document.body.classList.remove('light-theme');
      btnThemeToggle.textContent = '🌙 Mode Gelap';
    }
  }

  btnThemeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    if (isLight) {
      localStorage.setItem('todolist_theme', 'light');
      btnThemeToggle.textContent = '☀️ Mode Terang';
    } else {
      localStorage.setItem('todolist_theme', 'dark');
      btnThemeToggle.textContent = '🌙 Mode Gelap';
    }
  });

  // Re-sync on mobile tab visibility return
  if (!window.todoAPI) {
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        await loadCategoriesData();
        await loadGoalsData();
        await loadHistoryData();
        await loadAgendasData();
        todos = await loadTodosData();

        let categoriesChanged = false;
        const catMap = new Map(categories.map(c => [c.name, c]));
        todos.forEach(t => {
          if (t.category && !catMap.has(t.category)) {
            const newCat = {
              id: 'cat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
              name: t.category,
              icon: '🏪',
              color: '#ef8e06'
            };
            categories.push(newCat);
            catMap.set(t.category, newCat);
            categoriesChanged = true;
          }
        });
        if (categoriesChanged) saveCategoriesData();

        const savedSelectedCategory = localStorage.getItem('todolist_selected_category');
        if (savedSelectedCategory && categories.some(c => c.name === savedSelectedCategory)) {
          selectedCategory = savedSelectedCategory;
        } else if (!categories.some(c => c.name === selectedCategory)) {
          selectedCategory = categories[0] ? categories[0].name : '';
        }
        renderAll();
      }
    });
  }

  // Initialize
  async function init() {
    todayDateDisplay.textContent = formatDisplayDate();
    initTheme();
    initVisionVisibility();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.warn('SW registration:', err);
      });
    }

    if (window.todoAPI && typeof window.todoAPI.getVersion === 'function') {
      try {
        const ver = await window.todoAPI.getVersion();
        if (ver) appVersionBadge.textContent = `v${ver}`;
      } catch (err) {
        console.warn('Gagal membaca versi:', err);
      }
    }

    await loadCategoriesData();
    await loadGoalsData();
    await loadHistoryData();
    await loadAgendasData();
    todos = await loadTodosData();

    // Defensive safeguard: ensure all categories in todos or agendas exist in categories array
    let categoriesChanged = false;
    const catMap = new Map(categories.map(c => [c.name, c]));
    todos.forEach(t => {
      if (t.category && !catMap.has(t.category)) {
        const newCat = {
          id: 'cat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: t.category,
          icon: '🏪',
          color: '#ef8e06'
        };
        categories.push(newCat);
        catMap.set(t.category, newCat);
        categoriesChanged = true;
      }
    });
    agendas.forEach(a => {
      if (a.category && !catMap.has(a.category)) {
        const newCat = {
          id: 'cat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: a.category,
          icon: '🏪',
          color: '#ef8e06'
        };
        categories.push(newCat);
        catMap.set(a.category, newCat);
        categoriesChanged = true;
      }
    });
    if (categoriesChanged) {
      saveCategoriesData();
    }

    const savedSelectedCategory = localStorage.getItem('todolist_selected_category');
    if (savedSelectedCategory && categories.some(c => c.name === savedSelectedCategory)) {
      selectedCategory = savedSelectedCategory;
    } else {
      selectedCategory = categories[0] ? categories[0].name : '';
    }

    performDailyReset();
    renderAll();
    switchPage('vision'); // TARGET IMPIAN HALAMAN PERTAMA!

    // Setup Supabase Realtime & Pill Click Listener
    setupSupabaseRealtime();
    const cloudPill = document.getElementById('cloud-status-pill');
    if (cloudPill) {
      cloudPill.addEventListener('click', async () => {
        showToast('🔄 Memeriksa koneksi Supabase Cloud...');
        updateCloudStatus('syncing', '☁️ Memeriksa...');
        const testRes = await supabaseGet('categories');
        if (testRes) {
          updateCloudStatus('connected', '☁️ Cloud Terhubung');
          showToast('✅ Supabase Cloud terhubung & tersinkronisasi!');
        } else {
          updateCloudStatus('offline', '☁️ Mode Lokal');
          showToast('ℹ️ Supabase offline / jalankan supabase_setup.sql di Supabase SQL Editor.');
        }
      });
    }
  }

  init();
})();
