const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const sanitizeNumber = (value) => {
  if (value === '' || value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const uploadConfiguration = async (config, onStreamData) => {
  try {
    console.log('Attempting to upload to:', `${API_BASE_URL}/upload-config`);
    console.log('Configuration data:', config);
    
    const response = await fetch(`${API_BASE_URL}/upload-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error text:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullOutput = '';
    
    console.log('--- Stream Output ---');
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const text = decoder.decode(value, { stream: true });
      console.log(text);
      fullOutput += text;
      if (onStreamData) onStreamData(text);
    }
    console.log('--- End Stream ---');

    return { success: true, output: fullOutput };
  } catch (error) {
    console.error('Detailed error uploading configuration:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Make sure the backend is running.`);
    }
    
    throw error;
  }
};

export const parseImportedConfiguration = (data) => {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Configuration must be a JSON object.');
  }

  const mcu = data.mcu;
  if (!mcu || typeof mcu !== 'object' || Array.isArray(mcu)) {
    throw new Error('Missing or invalid "mcu" object.');
  }

  const pos = mcu.pos;
  if (!pos || typeof pos !== 'object' || Array.isArray(pos)) {
    throw new Error('Missing or invalid "mcu.pos".');
  }

  const split = Boolean(data.split);
  const tilt = sanitizeNumber(data.tilt);

  const keysRaw = data.keys;
  if (!Array.isArray(keysRaw) || keysRaw.length === 0) {
    throw new Error('Configuration must include a non-empty "keys" array.');
  }

  const keys = keysRaw.map((key, i) => {
    if (!key || typeof key !== 'object' || Array.isArray(key)) {
      throw new Error(`Invalid key at index ${i}.`);
    }
    return {
      x: sanitizeNumber(key.x),
      y: sanitizeNumber(key.y),
      z: sanitizeNumber(key.z),
      size: sanitizeNumber(key.size),
      rotation: sanitizeNumber(key.rotation),
      label: typeof key.label === 'string' ? key.label : String(key.label ?? ''),
    };
  });

  return {
    mcu: {
      pos: {
        x: sanitizeNumber(pos.x),
        y: sanitizeNumber(pos.y),
        z: sanitizeNumber(pos.z),
      },
      size: sanitizeNumber(mcu.size),
    },
    split,
    tilt,
    keys,
  };
};

export const readConfigurationFromFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? '');
        const data = JSON.parse(text);
        resolve(parseImportedConfiguration(data));
      } catch (err) {
        reject(
          err instanceof SyntaxError
            ? new Error('Invalid JSON file.')
            : err instanceof Error
              ? err
              : new Error(String(err))
        );
      }
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });

export const generateConfiguration = (mcu, split, tilt, keys) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const expandBounds = (xLo, xHi, yLo, yHi) => {
    minX = Math.min(minX, xLo);
    maxX = Math.max(maxX, xHi);
    minY = Math.min(minY, yLo);
    maxY = Math.max(maxY, yHi);
  };

  keys.forEach(key => {
    const x = sanitizeNumber(key.x);
    const y = sanitizeNumber(key.y);
    const size = sanitizeNumber(key.size);
    const halfW = size / 2;
    const halfH = 0.5;

    expandBounds(x - halfW, x + halfW, y - halfH, y + halfH);
  });

  // MCU uses the same grid as keys; preview draws it square with side mcu.size in key units (center at pos).
  const mx = sanitizeNumber(mcu.pos.x);
  const my = sanitizeNumber(mcu.pos.y);
  const ms = sanitizeNumber(mcu.size);
  const mcuHalf = ms / 2;
  expandBounds(mx - mcuHalf, mx + mcuHalf, my - mcuHalf, my + mcuHalf);

  const hasBounds =
    Number.isFinite(minX) &&
    Number.isFinite(maxX) &&
    Number.isFinite(minY) &&
    Number.isFinite(maxY);
  const width = hasBounds ? maxX - minX : 0;
  const height = hasBounds ? maxY - minY : 0;

  return {
    width,
    height,
    mcu: {
      pos: {
        x: sanitizeNumber(mcu.pos.x),
        y: sanitizeNumber(mcu.pos.y),
        z: sanitizeNumber(mcu.pos.z)
      },
      size: sanitizeNumber(mcu.size)
    },
    split,
    tilt: sanitizeNumber(tilt),
    keys: keys.map(key => ({
      x: sanitizeNumber(key.x),
      y: sanitizeNumber(key.y),
      z: sanitizeNumber(key.z),
      size: sanitizeNumber(key.size),
      rotation: sanitizeNumber(key.rotation),
      label: key.label
    }))
  };
};

export const downloadConfigAsFile = (config, filename = 'config.json') => {
  const jsonString = JSON.stringify(config, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
