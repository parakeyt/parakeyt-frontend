import { useState } from 'react';

export const useKeyboardState = () => {
  const [mcu, setMcu] = useState({
    pos: { x: 16.75, y: 0.5, z: 0 },
  });
  const [split, setSplit] = useState(false);
  const [tilt, setTilt] = useState(0);
  
  const defaultKeys = [
    { x: 0.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "Esc" },
    { x: 1.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "1" },
    { x: 2.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "2" },
    { x: 3.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "3" },
    { x: 4.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "4" },
    { x: 5.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "5" },
    { x: 6.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "6" },
    { x: 7.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "7" },
    { x: 8.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "8" },
    { x: 9.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "9" },
    { x: 10.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "0" },
    { x: 11.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "-" },
    { x: 12.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "=" },
    { x: 14, y: 0.5, z: 0, size: 2, rotation: 0, label: "Bksp" },
    { x: 0.75, y: 1.5, z: 0, size: 1.5, rotation: 0, label: "Tab" },
    { x: 2, y: 1.5, z: 0, size: 1, rotation: 0, label: "Q" },
    { x: 3, y: 1.5, z: 0, size: 1, rotation: 0, label: "W" },
    { x: 4, y: 1.5, z: 0, size: 1, rotation: 0, label: "E" },
    { x: 5, y: 1.5, z: 0, size: 1, rotation: 0, label: "R" },
    { x: 6, y: 1.5, z: 0, size: 1, rotation: 0, label: "T" },
    { x: 7, y: 1.5, z: 0, size: 1, rotation: 0, label: "Y" },
    { x: 8, y: 1.5, z: 0, size: 1, rotation: 0, label: "U" },
    { x: 9, y: 1.5, z: 0, size: 1, rotation: 0, label: "I" },
    { x: 10, y: 1.5, z: 0, size: 1, rotation: 0, label: "O" },
    { x: 11, y: 1.5, z: 0, size: 1, rotation: 0, label: "P" },
    { x: 12, y: 1.5, z: 0, size: 1, rotation: 0, label: "[" },
    { x: 13, y: 1.5, z: 0, size: 1, rotation: 0, label: "]" },
    { x: 14.25, y: 1.5, z: 0, size: 1.5, rotation: 0, label: "\\" },
    { x: 0.875, y: 2.5, z: 0, size: 1.75, rotation: 0, label: "Caps" },
    { x: 2.25, y: 2.5, z: 0, size: 1, rotation: 0, label: "A" },
    { x: 3.25, y: 2.5, z: 0, size: 1, rotation: 0, label: "S" },
    { x: 4.25, y: 2.5, z: 0, size: 1, rotation: 0, label: "D" },
    { x: 5.25, y: 2.5, z: 0, size: 1, rotation: 0, label: "F" },
    { x: 6.25, y: 2.5, z: 0, size: 1, rotation: 0, label: "G" },
    { x: 7.25, y: 2.5, z: 0, size: 1, rotation: 0, label: "H" },
    { x: 8.25, y: 2.5, z: 0, size: 1, rotation: 0, label: "J" },
    { x: 9.25, y: 2.5, z: 0, size: 1, rotation: 0, label: "K" },
    { x: 10.25, y: 2.5, z: 0, size: 1, rotation: 0, label: "L" },
    { x: 11.25, y: 2.5, z: 0, size: 1, rotation: 0, label: ";" },
    { x: 12.25, y: 2.5, z: 0, size: 1, rotation: 0, label: "'" },
    { x: 13.875, y: 2.5, z: 0, size: 2.25, rotation: 0, label: "Enter" },
    { x: 1.125, y: 3.5, z: 0, size: 2.25, rotation: 0, label: "Shift" },
    { x: 2.75, y: 3.5, z: 0, size: 1, rotation: 0, label: "Z" },
    { x: 3.75, y: 3.5, z: 0, size: 1, rotation: 0, label: "X" },
    { x: 4.75, y: 3.5, z: 0, size: 1, rotation: 0, label: "C" },
    { x: 5.75, y: 3.5, z: 0, size: 1, rotation: 0, label: "V" },
    { x: 6.75, y: 3.5, z: 0, size: 1, rotation: 0, label: "B" },
    { x: 7.75, y: 3.5, z: 0, size: 1, rotation: 0, label: "N" },
    { x: 8.75, y: 3.5, z: 0, size: 1, rotation: 0, label: "M" },
    { x: 9.75, y: 3.5, z: 0, size: 1, rotation: 0, label: "," },
    { x: 10.75, y: 3.5, z: 0, size: 1, rotation: 0, label: "." },
    { x: 11.75, y: 3.5, z: 0, size: 1, rotation: 0, label: "/" },
    { x: 13.125, y: 3.5, z: 0, size: 1.75, rotation: 0, label: "RShift" },
    { x: 0.625, y: 4.5, z: 0, size: 1.25, rotation: 0, label: "Ctrl" },
    { x: 1.875, y: 4.5, z: 0, size: 1.25, rotation: 0, label: "Win" },
    { x: 3.125, y: 4.5, z: 0, size: 1.25, rotation: 0, label: "Alt" },
    { x: 6.875, y: 4.5, z: 0, size: 6.25, rotation: 0, label: "Space" },
    { x: 10.5, y: 4.5, z: 0, size: 1, rotation: 0, label: "RAlt" },
    { x: 11.5, y: 4.5, z: 0, size: 1, rotation: 0, label: "Fn1" },
    { x: 12.5, y: 4.5, z: 0, size: 1, rotation: 0, label: "Fn2" },
    { x: 14.5, y: 3.5, z: 0, size: 1, rotation: 0, label: "Up" },
    { x: 13.5, y: 4.5, z: 0, size: 1, rotation: 0, label: "Left" },
    { x: 14.5, y: 4.5, z: 0, size: 1, rotation: 0, label: "Down" },
    { x: 15.5, y: 4.5, z: 0, size: 1, rotation: 0, label: "Right" },
    { x: 15.5, y: 2.5, z: 0, size: 1, rotation: 0, label: "PgUp" },
    { x: 15.5, y: 3.5, z: 0, size: 1, rotation: 0, label: "PgDn" },
    { x: 15.5, y: 0.5, z: 0, size: 1, rotation: 0, label: "Home" },
    { x: 15.5, y: 1.5, z: 0, size: 1, rotation: 0, label: "End" },
  ];
  
  const [keys, setKeys] = useState(defaultKeys);
  const [expandedKeys, setExpandedKeys] = useState(new Set());

  const updateMcuPos = (axis, value) => {
    setMcu(prev => ({
      ...prev,
      pos: { ...prev.pos, [axis]: value }
    }));
  };

  const addKey = () => {
    let maxY = 0;
    keys.forEach(key => {
      const y = key.y === '' ? 0 : Number(key.y);
      if (y > maxY) maxY = y;
    });
    
    const newRowY = maxY + 1;
    const keysOnNewRow = keys.filter(k => Number(k.y) === newRowY).length;
    
    const newKey = { 
      x: keysOnNewRow + 0.5, 
      y: newRowY + 0.5, 
      z: 0, 
      size: 1, 
      rotation: 0,
      label: "" 
    };
    setKeys(prev => [...prev, newKey]);
    
    const newIndex = keys.length;
    setExpandedKeys(prev => new Set([...prev, newIndex]));
  };

  const removeKey = (index) => {
    setKeys(prev => prev.filter((_, i) => i !== index));
    
    setExpandedKeys(prev => {
      const newSet = new Set();
      prev.forEach(i => {
        if (i < index) {
          newSet.add(i);
        } else if (i > index) {
          newSet.add(i - 1);
        }
      });
      return newSet;
    });
  };

  const clearKeys = () => {
    setKeys([]);
    setExpandedKeys(new Set());
  };

  const updateKey = (index, field, value) => {
    setKeys(prev => prev.map((key, i) => 
      i === index ? { ...key, [field]: value } : key
    ));
  };

  const toggleKeyExpansion = (index) => {
    setExpandedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const loadConfiguration = ({ mcu: nextMcu, split: nextSplit, tilt: nextTilt, keys: nextKeys }) => {
    setMcu(nextMcu);
    setSplit(nextSplit);
    setTilt(nextTilt);
    setKeys(nextKeys);
    setExpandedKeys(new Set());
  };

  return {
    mcu,
    split,
    tilt,
    keys,
    expandedKeys,
    
    updateMcuPos,
    setSplit,
    setTilt,
    addKey,
    removeKey,
    clearKeys,
    updateKey,
    toggleKeyExpansion,
    loadConfiguration
  };
};
