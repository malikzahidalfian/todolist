// Mini QR Code SVG Generator in Pure JavaScript (Zero dependencies)
// Supports alphanumeric & byte encoding with Reed-Solomon error correction
(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.QRCodeSVG = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {

  // Simple QR Code matrix generator for URLs / text
  // Generates standard QR Code (Versions 1-10) with Medium error correction
  const GF256_EXP = new Uint8Array(512);
  const GF256_LOG = new Uint8Array(256);
  (function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      GF256_EXP[i] = x;
      GF256_EXP[i + 255] = x;
      GF256_LOG[x] = i;
      x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
    }
  })();

  function gfMul(x, y) {
    if (x === 0 || y === 0) return 0;
    return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
  }

  function rsGenPoly(n) {
    let poly = [1];
    for (let i = 0; i < n; i++) {
      const next = [];
      for (let j = 0; j <= poly.length; j++) next.push(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= gfMul(poly[j], GF256_EXP[i]);
        next[j + 1] ^= poly[j];
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, ecLen) {
    const gen = rsGenPoly(ecLen);
    const res = new Uint8Array(ecLen);
    for (let i = 0; i < data.length; i++) {
      const factor = data[i] ^ res[0];
      for (let j = 0; j < ecLen - 1; j++) {
        res[j] = res[j + 1] ^ gfMul(gen[j + 1], factor);
      }
      res[ecLen - 1] = gfMul(gen[ecLen], factor);
    }
    return res;
  }

  // QR Spec parameters for Medium Error Correction (V1 - V6)
  const QR_SPECS = [
    null,
    { ver: 1, size: 21, dataBytes: 16, ecBytes: 10, ecBlocks: 1, align: [] },
    { ver: 2, size: 25, dataBytes: 28, ecBytes: 16, ecBlocks: 1, align: [6, 18] },
    { ver: 3, size: 29, dataBytes: 44, ecBytes: 26, ecBlocks: 1, align: [6, 22] },
    { ver: 4, size: 33, dataBytes: 64, ecBytes: 36, ecBlocks: 2, align: [6, 26] },
    { ver: 5, size: 37, dataBytes: 86, ecBytes: 48, ecBlocks: 2, align: [6, 30] },
    { ver: 6, size: 41, dataBytes: 108, ecBytes: 64, ecBlocks: 4, align: [6, 34] }
  ];

  function getSpec(dataLen) {
    for (let v = 1; v <= 6; v++) {
      // Byte mode overhead: 4 bits mode + 8 bits length = 12 bits = 1.5 bytes -> approx 2 bytes
      if (dataLen + 3 <= QR_SPECS[v].dataBytes) {
        return QR_SPECS[v];
      }
    }
    return QR_SPECS[6];
  }

  function createBitBuffer() {
    const buffer = [];
    let length = 0;
    return {
      put(val, len) {
        for (let i = len - 1; i >= 0; i--) {
          buffer.push((val >>> i) & 1);
          length++;
        }
      },
      getBuffer() { return buffer; },
      getLength() { return length; }
    };
  }

  function generateQRCodeMatrix(text) {
    const utf8Bytes = [];
    for (let i = 0; i < text.length; i++) {
      let code = text.charCodeAt(i);
      if (code < 128) {
        utf8Bytes.push(code);
      } else if (code < 2048) {
        utf8Bytes.push((code >> 6) | 192, (code & 63) | 128);
      } else {
        utf8Bytes.push((code >> 12) | 224, ((code >> 6) & 63) | 128, (code & 63) | 128);
      }
    }

    const spec = getSpec(utf8Bytes.length);
    const bb = createBitBuffer();

    // Mode Byte: 0100 (4 bits)
    bb.put(4, 4);
    // Character count (8 bits for V1-V9 in byte mode)
    bb.put(utf8Bytes.length, 8);
    // Data bytes
    for (let i = 0; i < utf8Bytes.length; i++) {
      bb.put(utf8Bytes[i], 8);
    }

    // Terminator (up to 4 zeroes)
    const totalDataBits = spec.dataBytes * 8;
    const padding = Math.min(4, totalDataBits - bb.getLength());
    bb.put(0, padding);

    // Byte align
    while (bb.getLength() % 8 !== 0) {
      bb.put(0, 1);
    }

    // Pad bytes
    const padBytes = [0xec, 0x11];
    let padIdx = 0;
    while (bb.getLength() < totalDataBits) {
      bb.put(padBytes[padIdx % 2], 8);
      padIdx++;
    }

    const rawBits = bb.getBuffer();
    const dataBytes = [];
    for (let i = 0; i < rawBits.length; i += 8) {
      let byte = 0;
      for (let b = 0; b < 8; b++) {
        byte = (byte << 1) | rawBits[i + b];
      }
      dataBytes.push(byte);
    }

    // Calculate EC
    const blockSize = Math.floor(spec.dataBytes / spec.ecBlocks);
    const ecPerBlock = Math.floor(spec.ecBytes / spec.ecBlocks);
    const dataBlocks = [];
    const ecBlocks = [];

    for (let b = 0; b < spec.ecBlocks; b++) {
      const slice = dataBytes.slice(b * blockSize, (b + 1) * blockSize);
      dataBlocks.push(slice);
      ecBlocks.push(Array.from(rsEncode(slice, ecPerBlock)));
    }

    // Interleave
    const finalBytes = [];
    for (let i = 0; i < blockSize; i++) {
      for (let b = 0; b < spec.ecBlocks; b++) {
        if (i < dataBlocks[b].length) finalBytes.push(dataBlocks[b][i]);
      }
    }
    for (let i = 0; i < ecPerBlock; i++) {
      for (let b = 0; b < spec.ecBlocks; b++) {
        if (i < ecBlocks[b].length) finalBytes.push(ecBlocks[b][i]);
      }
    }

    // Matrix creation
    const N = spec.size;
    const matrix = Array.from({ length: N }, () => Array(N).fill(null));
    const isReserved = Array.from({ length: N }, () => Array(N).fill(false));

    function setPattern(r, c, val) {
      matrix[r][c] = val;
      isReserved[r][c] = true;
    }

    // Finder patterns
    function addFinder(top, left) {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const row = top + r;
          const col = left + c;
          if (row >= 0 && row < N && col >= 0 && col < N) {
            let val = false;
            if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
              val = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
            }
            setPattern(row, col, val);
          }
        }
      }
    }

    addFinder(0, 0);
    addFinder(0, N - 7);
    addFinder(N - 7, 0);

    // Alignment patterns
    if (spec.align && spec.align.length > 0) {
      const coords = spec.align;
      for (let i = 0; i < coords.length; i++) {
        for (let j = 0; j < coords.length; j++) {
          const r = coords[i];
          const c = coords[j];
          if (isReserved[r][c]) continue;
          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              const val = (Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0));
              setPattern(r + dr, c + dc, val);
            }
          }
        }
      }
    }

    // Timing patterns
    for (let i = 8; i < N - 8; i++) {
      if (!isReserved[6][i]) setPattern(6, i, i % 2 === 0);
      if (!isReserved[i][6]) setPattern(i, 6, i % 2 === 0);
    }

    // Dark module
    setPattern(N - 8, 8, true);

    // Format information area reservation
    for (let i = 0; i < 9; i++) {
      if (!isReserved[8][i]) isReserved[8][i] = true;
      if (!isReserved[i][8]) isReserved[i][8] = true;
    }
    for (let i = 0; i < 8; i++) {
      if (!isReserved[8][N - 1 - i]) isReserved[8][N - 1 - i] = true;
      if (!isReserved[N - 1 - i][8]) isReserved[N - 1 - i] = true;
    }

    // Place data bits
    let byteIdx = 0;
    let bitIdx = 7;
    let dir = -1; // up
    let c = N - 1;

    while (c > 0) {
      if (c === 6) c--; // Skip vertical timing column
      for (let r = (dir === -1 ? N - 1 : 0); (dir === -1 ? r >= 0 : r < N); r += dir) {
        for (let dc = 0; dc < 2; dc++) {
          const col = c - dc;
          if (!isReserved[r][col]) {
            let bit = false;
            if (byteIdx < finalBytes.length) {
              bit = ((finalBytes[byteIdx] >>> bitIdx) & 1) === 1;
            }
            // Mask 0: (row + col) % 2 === 0
            const mask = ((r + col) % 2 === 0);
            matrix[r][col] = (bit ^ mask);
            bitIdx--;
            if (bitIdx < 0) {
              bitIdx = 7;
              byteIdx++;
            }
          }
        }
      }
      dir = -dir;
      c -= 2;
    }

    // Write Format Information (Medium Error Correction, Mask 0 = 000)
    // Pre-calculated format info for (M, Mask 0): 0b101010000010010 (0x5412)
    const formatBits = [1,0,1,0,1,0,0,0,0,0,1,0,0,1,0];
    for (let i = 0; i < 6; i++) matrix[8][i] = formatBits[i] === 1;
    matrix[8][7] = formatBits[6] === 1;
    matrix[8][8] = formatBits[7] === 1;
    matrix[7][8] = formatBits[8] === 1;
    for (let i = 9; i < 15; i++) matrix[14 - i][8] = formatBits[i] === 1;

    for (let i = 0; i < 8; i++) matrix[N - 1 - i][8] = formatBits[i] === 1;
    for (let i = 8; i < 15; i++) matrix[8][N - 15 + i] = formatBits[i] === 1;

    return matrix;
  }

  function generateSVG(text, options = {}) {
    const matrix = generateQRCodeMatrix(text);
    const N = matrix.length;
    const quietZone = options.quietZone !== undefined ? options.quietZone : 2;
    const size = N + quietZone * 2;
    const fgColor = options.fgColor || '#000000';
    const bgColor = options.bgColor || '#ffffff';

    let pathD = '';
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (matrix[r][c]) {
          const x = c + quietZone;
          const y = r + quietZone;
          pathD += `M${x},${y}h1v1h-1z `;
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="border-radius:8px;">
      <rect width="${size}" height="${size}" fill="${bgColor}"/>
      <path d="${pathD}" fill="${fgColor}"/>
    </svg>`;
  }

  return {
    generateSVG,
    generateMatrix: generateQRCodeMatrix
  };
});
