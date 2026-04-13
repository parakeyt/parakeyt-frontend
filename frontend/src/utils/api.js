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

export const generateConfiguration = (mcu, split, tilt, keys) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  keys.forEach(key => {
    const x = sanitizeNumber(key.x);
    const y = sanitizeNumber(key.y);
    const size = sanitizeNumber(key.size);
    const halfW = size / 2;
    const halfH = 0.5;

    minX = Math.min(minX, x - halfW);
    maxX = Math.max(maxX, x + halfW);
    minY = Math.min(minY, y - halfH);
    maxY = Math.max(maxY, y + halfH);
  });

  const width = keys.length && Number.isFinite(minX) ? maxX - minX : 0;
  const height = keys.length && Number.isFinite(minY) ? maxY - minY : 0;

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
