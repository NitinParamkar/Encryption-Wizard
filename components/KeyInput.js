import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const KeyInput = ({ cipher, keys, setKeys }) => {
  const handleIntegerInput = (e, keyName) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      if (cipher === 'keylessTransformation' && parseInt(value) > 10) {
        toast.error('Please enter number of columns <= 10');
        return;
      }
      setKeys({ ...keys, [keyName]: value });
    } else {
      toast.error('Please enter numbers only');
    }
  };

  const handleStringInput = (e, keyName) => {
    const value = e.target.value;
    if (value === '' || /^[a-zA-Z]+$/.test(value)) {
      setKeys({ ...keys, [keyName]: value });
    } else {
      toast.error('Please enter letters only');
    }
  };

  const createEmptyMatrix = (size) => {
    return Array(size).fill().map(() => Array(size).fill(''));
  };

  const handleMatrixInput = (rowIndex, colIndex, value) => {
    if (value === '' || /^[0-9]+$/.test(value)) {
      const matrix = JSON.parse(keys.key1 || '[]');
      matrix[rowIndex][colIndex] = value === '' ? '' : parseInt(value);
      setKeys({ ...keys, key1: JSON.stringify(matrix) });
    }
  };

  const inputClassName = "w-full p-3 bg-white/80 border-2 border-violet-200 \
    text-violet-900 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent \
    transition-all duration-300 text-sm sm:text-base font-medium \
    placeholder:text-violet-400 relative z-10 hover:bg-white/90";

  if (cipher === 'railfence') {
    return (
      <div className="w-full">
        <div className="text-sm text-violet-600 font-medium">
          No key required for Rail Fence cipher
        </div>
      </div>
    );
  }

  if (cipher === 'affine') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <motion.input
          whileHover={{ scale: 1.02 }}
          type="text"
          value={keys.key1}
          onChange={(e) => handleIntegerInput(e, 'key1')}
          placeholder="Enter first key (multiplicative)"
          className={inputClassName}
        />
        <motion.input
          whileHover={{ scale: 1.02 }}
          type="text"
          value={keys.key2}
          onChange={(e) => handleIntegerInput(e, 'key2')}
          placeholder="Enter second key (additive)"
          className={inputClassName}
        />
      </div>
    );
  }

  if (cipher === 'hill') {
    return (
      <div className="space-y-4 w-full">
        <div className="flex space-x-4">
          <motion.input
            whileHover={{ scale: 1.02 }}
            type="text"
            value={keys.matrixSize || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^[0-9]+$/.test(value)) {
                const size = value === '' ? '' : parseInt(value);
                if (size > 6) {
                  toast.error('Please enter matrix size less than or equal to 6');
                  return;
                }
                setKeys({
                  matrixSize: value,
                  key1: size ? JSON.stringify(createEmptyMatrix(size)) : ''
                });
              }
            }}
            placeholder="Enter matrix size (n for nxn matrix)"
            className={inputClassName}
          />
          <div className="invisible">
            <input type="text" disabled className={inputClassName} />
          </div>
        </div>
        
        {keys.matrixSize && parseInt(keys.matrixSize) > 0 && (
          <div className="w-full">
            <div className="grid gap-2 w-full overflow-x-auto">
              <label className="text-sm font-semibold text-violet-800 mb-2">
                Enter Key Matrix:
              </label>
              <div className="inline-block min-w-full">
                {Array(parseInt(keys.matrixSize)).fill().map((_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2 mb-2 justify-center">
                    {Array(parseInt(keys.matrixSize)).fill().map((_, colIndex) => (
                      <input
                        key={colIndex}
                        type="text"
                        className="w-12 h-12 p-1 bg-white/80 border-2 border-violet-200 
                          text-violet-900 rounded-lg focus:ring-2 focus:ring-violet-400 
                          focus:border-transparent transition-all duration-300 text-center
                          hover:bg-white/90"
                        value={JSON.parse(keys.key1 || '[]')[rowIndex]?.[colIndex] || ''}
                        onChange={(e) => handleMatrixInput(rowIndex, colIndex, e.target.value)}
                        placeholder="0"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.input
        whileHover={{ scale: 1.02 }}
        type="text"
        value={keys.key1}
        onChange={(e) => {
          if (['playfair', 'vigenere'].includes(cipher)) {
            handleStringInput(e, 'key1');
          } else {
            handleIntegerInput(e, 'key1');
          }
        }}
        placeholder={
          ['additive', 'multiplicative', 'autokey'].includes(cipher)
            ? "Enter integer key"
            : cipher === 'playfair' 
              ? "Enter letters only"
              : "Enter letters only"
        }
        className={inputClassName}
      />
      <div className="invisible">
        <input type="text" disabled className={inputClassName} />
      </div>
    </div>
  );
};

export default KeyInput;