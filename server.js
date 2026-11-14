// To Do List & Target Kerja - Web & Mobile Local Server
// Memberikan akses penuh dari HP (Smartphone) via Wi-Fi lokal / Hotspot
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const qr = require('./src/qr.js');

const DATA_DIR = path.join(__dirname, 'data');
const SRC_DIR = path.join(__dirname, 'src');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  let candidate = '127.0.0.1';

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // Prioritas interface Wi-Fi atau IP lokal standar
        if (/wi-fi|wlan|wireless/i.test(name)) {
          return iface.address;
        }
        if (iface.address.startsWith('192.168.') || iface.address.startsWith('10.') || iface.address.startsWith('172.')) {
          candidate = iface.address;
        }
      }
    }
  }
  return candidate;
}

function ensureDataFile(fileName, defaultContent) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2), 'utf8');
  }
  return filePath;
}

function readJsonFile(fileName, defaultVal) {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) return defaultVal;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Gagal membaca ${fileName}:`, err.message);
    return defaultVal;
  }
}

function writeJsonFile(fileName, data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const filePath = path.join(DATA_DIR, fileName);
    const tempPath = filePath + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, filePath);
    return { success: true };
  } catch (err) {
    console.error(`Gagal menulis ${fileName}:`, err.message);
    return { success: false, error: err.message };
  }
}

function sendCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, data) {
  sendCors(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function handleApiRequest(req, res, urlPath, query) {
  const method = req.method.toUpperCase();

  if (method === 'OPTIONS') {
    sendCors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // Server Info & QR Code
  if (urlPath === '/api/server-info' && method === 'GET') {
    const isCloud = Boolean(process.env.PORT || process.env.RENDER || process.env.VERCEL || process.env.RAILWAY_STATIC_URL);
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const proto = req.headers['x-forwarded-proto'] || (req.socket.encrypted ? 'https' : 'http');
    const ip = getLocalIpAddress();
    const port = serverInstance ? serverInstance.address().port : 3000;
    const fullUrl = isCloud ? `${proto}://${host}` : `http://${ip}:${port}`;
    const svg = qr.generateSVG(fullUrl);
    return sendJson(res, 200, {
      ip,
      port,
      url: fullUrl,
      qrSvg: svg,
      active: true,
      online: isCloud
    });
  }

  // Routes map for JSON database files
  const fileRoutes = {
    '/api/todos': 'todos.json',
    '/api/categories': 'categories.json',
    '/api/goals': 'goals.json',
    '/api/agendas': 'agendas.json',
    '/api/history': 'history.json'
  };

  const targetFile = fileRoutes[urlPath];
  if (targetFile) {
    if (method === 'GET') {
      const defaultVal = (targetFile === 'goals.json') ? { goals: [], customQuote: '', currentQuoteIndex: 0 } :
                         (targetFile === 'history.json') ? {} : [];
      const data = readJsonFile(targetFile, defaultVal);
      return sendJson(res, 200, data);
    }

    if (method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const result = writeJsonFile(targetFile, parsed);
          return sendJson(res, result.success ? 200 : 500, result);
        } catch (err) {
          return sendJson(res, 400, { success: false, error: 'Invalid JSON payload' });
        }
      });
      return;
    }
  }

  sendJson(res, 404, { error: 'Endpoint API tidak ditemukan' });
}

function handleStaticRequest(req, res, urlPath) {
  let relativePath = urlPath === '/' ? '/index.html' : urlPath;
  // Decode URL percent-encoding
  try {
    relativePath = decodeURIComponent(relativePath);
  } catch (e) {}

  let filePath = path.join(SRC_DIR, relativePath);

  // Security check: cegah path traversal keluar dari SRC_DIR
  if (!filePath.startsWith(SRC_DIR)) {
    res.writeHead(403);
    res.end('Akses ditolak');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback ke index.html untuk Single Page Application routing jika diperlukan
      if (path.extname(filePath) === '') {
        const fallback = path.join(SRC_DIR, 'index.html');
        if (fs.existsSync(fallback)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(fallback).pipe(res);
          return;
        }
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('File tidak ditemukan: ' + urlPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    sendCors(res);
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

let serverInstance = null;
let currentPort = 3000;

function createServer() {
  return http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    if (pathname.startsWith('/api/')) {
      handleApiRequest(req, res, pathname, parsedUrl.searchParams);
    } else {
      handleStaticRequest(req, res, pathname);
    }
  });
}

function startServer(preferredPort = 3000) {
  return new Promise((resolve, reject) => {
    if (serverInstance && serverInstance.listening) {
      const ip = getLocalIpAddress();
      const port = serverInstance.address().port;
      resolve({ server: serverInstance, port, ip, url: `http://${ip}:${port}` });
      return;
    }

    const srv = createServer();
    let port = process.env.PORT ? parseInt(process.env.PORT, 10) : preferredPort;

    srv.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`[Server HP] Port ${port} sedang digunakan, mencoba port ${port + 1}...`);
        port++;
        srv.listen(port, '0.0.0.0');
      } else {
        reject(err);
      }
    });

    srv.listen(port, '0.0.0.0', () => {
      serverInstance = srv;
      currentPort = srv.address().port;
      const ip = getLocalIpAddress();
      const url = `http://${ip}:${currentPort}`;
      console.log('=====================================================');
      console.log('📱 TO DO LIST - SERVER AKSES HP & WEB DIAKTIFKAN');
      console.log(`🌐 Alamat di HP   : ${url}`);
      console.log(`💻 Alamat di Laptop: http://localhost:${currentPort}`);
      console.log('=====================================================');
      resolve({ server: srv, port: currentPort, ip, url });
    });
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (serverInstance) {
      if (typeof serverInstance.closeAllConnections === 'function') {
        serverInstance.closeAllConnections();
      }
      serverInstance.close(() => {
        serverInstance = null;
        resolve();
      });
      serverInstance.unref();
    } else {
      resolve();
    }
  });
}

function getServerInfo() {
  const ip = getLocalIpAddress();
  const port = (serverInstance && serverInstance.listening) ? serverInstance.address().port : currentPort;
  const url = `http://${ip}:${port}`;
  const qrSvg = qr.generateSVG(url);
  return {
    ip,
    port,
    url,
    qrSvg,
    running: !!(serverInstance && serverInstance.listening)
  };
}

module.exports = {
  startServer,
  stopServer,
  getServerInfo,
  getLocalIpAddress
};

// Jika dijalankan langsung via node server.js
if (require.main === module) {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  startServer(port).catch(err => {
    console.error('Gagal menjalankan server:', err);
    process.exit(1);
  });
}
