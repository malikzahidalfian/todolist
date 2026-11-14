const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const server = require('../server.js');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TODOS_FILE = path.join(DATA_DIR, 'todos.json');
const GOALS_FILE = path.join(DATA_DIR, 'goals.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const AGENDAS_FILE = path.join(DATA_DIR, 'agendas.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(AGENDAS_FILE)) {
    const defaultAgendas = [
      {
        id: 'agenda-init-1',
        title: 'Buat 10 video konten Shopee MP3 Player',
        date: '2026-11-14',
        category: 'Toko Shopee MP3 Player',
        time: '14:00',
        note: 'Siapkan sample barang dan rekam footage studio',
        completed: false,
        createdAt: Date.now()
      }
    ];
    fs.writeFileSync(AGENDAS_FILE, JSON.stringify(defaultAgendas, null, 2), 'utf8');
  }

  if (!fs.existsSync(CATEGORIES_FILE)) {
    const defaultCategories = [
      { id: 'cat-ricko-shopee', name: "Ricko's Media Player - Shopee", icon: '🏪', color: '#ef8e06' },
      { id: 'cat-shopee-mp3', name: 'Toko Shopee MP3 Player', icon: '🏪', color: '#f97316' },
      { id: 'cat-zyra-jewelry', name: 'Toko Zyra Jewelry', icon: '💎', color: '#ec4899' },
      { id: 'cat-affiliate-sepatu', name: 'Akun Affiliate @reviewsepatucowok', icon: '👟', color: '#3b82f6' },
      { id: 'cat-umum', name: 'Operasional & Markas', icon: '🏢', color: '#6366f1' }
    ];
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(defaultCategories, null, 2), 'utf8');
  }

  if (!fs.existsSync(TODOS_FILE)) {
    const defaultData = [
      {
        id: 'todo-target-1',
        title: 'Buat akun Threads 20 akun',
        type: 'target',
        category: 'Operasional & Markas',
        targetNumber: 20,
        currentProgress: 0,
        unit: 'akun',
        pic: 'Tara',
        priority: 'high',
        completed: false,
        createdAt: Date.now()
      },
      {
        id: 'todo-daily-1',
        title: 'Posting 3 video konten media sosial harian',
        type: 'daily',
        category: 'Akun Affiliate @reviewsepatucowok',
        pic: 'Kael',
        priority: 'high',
        completed: false,
        streak: 0,
        lastCompletedDate: null,
        createdAt: Date.now()
      },
      {
        id: 'todo-daily-2',
        title: 'Cek laporan pesanan toko dan transaksi hari ini',
        type: 'daily',
        category: 'Toko Shopee MP3 Player',
        pic: 'Naila',
        priority: 'medium',
        completed: false,
        streak: 0,
        lastCompletedDate: null,
        createdAt: Date.now()
      },
      {
        id: 'todo-daily-zyra',
        title: 'Update stok katalog cincin & balas chat customer',
        type: 'daily',
        category: 'Toko Zyra Jewelry',
        pic: 'Naila',
        priority: 'medium',
        completed: false,
        streak: 0,
        lastCompletedDate: null,
        createdAt: Date.now()
      },
      {
        id: 'todo-daily-3',
        title: 'Evaluasi progres kerja harian & briefing tim',
        type: 'daily',
        category: 'Operasional & Markas',
        pic: 'Bos Ricko',
        priority: 'medium',
        completed: false,
        streak: 0,
        lastCompletedDate: null,
        createdAt: Date.now()
      },
      {
        id: 'todo-general-1',
        title: 'Riset variasi produk baru dan siapkan materi promosi',
        type: 'general',
        category: 'Akun Affiliate @reviewsepatucowok',
        pic: 'Afi',
        priority: 'medium',
        completed: false,
        createdAt: Date.now()
      }
    ];
    fs.writeFileSync(TODOS_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }

  if (!fs.existsSync(GOALS_FILE)) {
    const defaultGoals = {
      customQuote: "",
      currentQuoteIndex: 0,
      goals: [
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
      ]
    };
    fs.writeFileSync(GOALS_FILE, JSON.stringify(defaultGoals, null, 2), 'utf8');
  }

  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify({}, null, 2), 'utf8');
  }
}

function readTodos() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(TODOS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Gagal membaca todos.json:', err);
    return [];
  }
}

function writeTodos(todos) {
  try {
    ensureDataFile();
    const tempFile = TODOS_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(todos, null, 2), 'utf8');
    fs.renameSync(tempFile, TODOS_FILE);
    return { success: true };
  } catch (err) {
    console.error('Gagal menyimpan todos.json:', err);
    return { success: false, error: err.message };
  }
}

function readCategories() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(CATEGORIES_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Gagal membaca categories.json:', err);
    return [];
  }
}

function writeCategories(categories) {
  try {
    ensureDataFile();
    const tempFile = CATEGORIES_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(categories, null, 2), 'utf8');
    fs.renameSync(tempFile, CATEGORIES_FILE);
    return { success: true };
  } catch (err) {
    console.error('Gagal menyimpan categories.json:', err);
    return { success: false, error: err.message };
  }
}

function readGoals() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(GOALS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Gagal membaca goals.json:', err);
    return { goals: [], customQuote: '', currentQuoteIndex: 0 };
  }
}

function writeGoals(goalsData) {
  try {
    ensureDataFile();
    const tempFile = GOALS_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(goalsData, null, 2), 'utf8');
    fs.renameSync(tempFile, GOALS_FILE);
    return { success: true };
  } catch (err) {
    console.error('Gagal menyimpan goals.json:', err);
    return { success: false, error: err.message };
  }
}

function readHistory() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Gagal membaca history.json:', err);
    return {};
  }
}

function writeHistory(historyData) {
  try {
    ensureDataFile();
    const tempFile = HISTORY_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(historyData, null, 2), 'utf8');
    fs.renameSync(tempFile, HISTORY_FILE);
    return { success: true };
  } catch (err) {
    console.error('Gagal menyimpan history.json:', err);
    return { success: false, error: err.message };
  }
}

function readAgendas() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(AGENDAS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Gagal membaca agendas.json:', err);
    return [];
  }
}

function writeAgendas(agendasData) {
  try {
    ensureDataFile();
    const tempFile = AGENDAS_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(agendasData, null, 2), 'utf8');
    fs.renameSync(tempFile, AGENDAS_FILE);
    return { success: true };
  } catch (err) {
    console.error('Gagal menyimpan agendas.json:', err);
    return { success: false, error: err.message };
  }
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 840,
    minWidth: 800,
    minHeight: 600,
    title: 'To Do List & Target Kerja',
    backgroundColor: '#0f172a',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets', 'app-icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('todos:load', async () => {
  return readTodos();
});

ipcMain.handle('todos:save', async (_event, todos) => {
  return writeTodos(todos);
});

ipcMain.handle('categories:load', async () => {
  return readCategories();
});

ipcMain.handle('categories:save', async (_event, categories) => {
  return writeCategories(categories);
});

ipcMain.handle('goals:load', async () => {
  return readGoals();
});

ipcMain.handle('goals:save', async (_event, goalsData) => {
  return writeGoals(goalsData);
});

ipcMain.handle('history:load', async () => {
  return readHistory();
});

ipcMain.handle('history:save', async (_event, historyData) => {
  return writeHistory(historyData);
});

ipcMain.handle('agendas:load', async () => {
  return readAgendas();
});

ipcMain.handle('agendas:save', async (_event, agendasData) => {
  return writeAgendas(agendasData);
});

ipcMain.handle('todos:open-data-folder', async () => {
  ensureDataFile();
  shell.showItemInFolder(TODOS_FILE);
  return true;
});

ipcMain.handle('app:get-version', () => {
  return app.getVersion();
});

ipcMain.handle('server:get-info', () => {
  return server.getServerInfo();
});

app.whenReady().then(async () => {
  ensureDataFile();
  try {
    await server.startServer(3000);
  } catch (err) {
    console.warn('Gagal menjalankan server HP lokal:', err.message);
  }
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  server.stopServer();
});
