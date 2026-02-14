
import React, { useState, useEffect, useCallback } from 'react';

interface CalculatorProps {
  onCalculate: (expression: string, result: string) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onCalculate }) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [shouldReset, setShouldReset] = useState(false);

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? 0 : a / b;
      default: return b;
    }
  };

  const handleDigit = useCallback((digit: string) => {
    if (shouldReset) {
      setDisplay(digit);
      setShouldReset(false);
    } else {
      setDisplay(prev => prev === '0' ? digit : prev + digit);
    }
  }, [shouldReset]);

  const handleOperator = useCallback((op: string) => {
    const current = parseFloat(display);
    if (prevValue === null) {
      setPrevValue(display);
    } else if (operator) {
      const result = calculate(parseFloat(prevValue), current, operator);
      const formattedResult = Number(result.toFixed(8)).toString();
      setDisplay(formattedResult);
      setPrevValue(formattedResult);
    }
    setOperator(op);
    setShouldReset(true);
  }, [display, prevValue, operator]);

  const handleEquals = useCallback(() => {
    if (prevValue === null || operator === null) return;
    const current = parseFloat(display);
    const result = calculate(parseFloat(prevValue), current, operator);
    const formattedResult = Number(result.toFixed(8)).toString();
    
    onCalculate(`${prevValue} ${operator} ${display}`, formattedResult);
    
    setDisplay(formattedResult);
    setPrevValue(null);
    setOperator(null);
    setShouldReset(true);
  }, [display, prevValue, operator, onCalculate]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setShouldReset(false);
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay(prev => {
      if (prev.length === 1) return '0';
      return prev.slice(0, -1);
    });
  }, []);

  const handlePlusMinus = useCallback(() => {
    setDisplay(prev => {
      if (prev === '0') return '0';
      return (parseFloat(prev) * -1).toString();
    });
  }, []);

  const handlePercent = useCallback(() => {
    setDisplay(prev => (parseFloat(prev) / 100).toString());
  }, []);

  const handleDecimal = useCallback(() => {
    if (shouldReset) {
      setDisplay('0.');
      setShouldReset(false);
    } else if (!display.includes('.')) {
      setDisplay(prev => prev + '.');
    }
  }, [display, shouldReset]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      if (e.key === '.') handleDecimal();
      if (e.key === 'Enter' || e.key === '=') handleEquals();
      if (e.key === 'Backspace') handleBackspace();
      if (e.key === 'Escape') handleClear();
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('×');
      if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDecimal, handleEquals, handleBackspace, handleClear, handleOperator]);

  const Button = ({ 
    label, 
    onClick, 
    type = 'digit', 
    icon 
  }: { 
    label?: string; 
    onClick: () => void; 
    type?: 'digit' | 'secondary' | 'operator' | 'equals';
    icon?: React.ReactNode;
  }) => {
    const baseStyles = "flex items-center justify-center rounded-2xl md:rounded-3xl h-14 md:h-20 text-xl md:text-3xl font-medium transition-all active:scale-95";
    const typeStyles = {
      digit: "bg-zinc-800 text-white hover:bg-zinc-700",
      secondary: "bg-zinc-600 text-white hover:bg-zinc-500",
      operator: "bg-orange-500 text-white hover:bg-orange-400",
      equals: "bg-orange-500 text-white hover:bg-orange-400"
    };

    return (
      <button 
        onClick={onClick}
        className={`${baseStyles} ${typeStyles[type]}`}
      >
        {icon || label}
      </button>
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-end p-6 md:p-12 max-w-4xl mx-auto w-full">
      {/* Result Display */}
      <div className="text-right mb-8 overflow-hidden">
        <div className="text-zinc-500 text-xl md:text-2xl h-8 mb-2 font-light">
          {prevValue} {operator}
        </div>
        <div className="text-white text-7xl md:text-9xl font-light tracking-tight truncate">
          {display}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-3 md:gap-4">
        {/* Row 1 */}
        <Button label="7" onClick={() => handleDigit('7')} />
        <Button label="8" onClick={() => handleDigit('8')} />
        <Button label="9" onClick={() => handleDigit('9')} />
        <Button 
          type="secondary" 
          onClick={handleBackspace} 
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
            </svg>
          )} 
        />
        <Button label="÷" type="operator" onClick={() => handleOperator('÷')} />

        {/* Row 2 */}
        <Button label="4" onClick={() => handleDigit('4')} />
        <Button label="5" onClick={() => handleDigit('5')} />
        <Button label="6" onClick={() => handleDigit('6')} />
        <Button label="+/-" type="secondary" onClick={handlePlusMinus} />
        <Button label="×" type="operator" onClick={() => handleOperator('×')} />

        {/* Row 3 */}
        <Button label="1" onClick={() => handleDigit('1')} />
        <Button label="2" onClick={() => handleDigit('2')} />
        <Button label="3" onClick={() => handleDigit('3')} />
        <Button label="%" type="secondary" onClick={handlePercent} />
        <Button label="-" type="operator" onClick={() => handleOperator('-')} />

        {/* Row 4 */}
        <Button 
          type="digit" 
          onClick={handleClear} 
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-3-3V18m-3-3V18m3-15v1.5m-6.75 3h13.5m-12.75 0h12M6.75 21h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
          )} 
        />
        <Button label="0" onClick={() => handleDigit('0')} />
        <Button label="." onClick={handleDecimal} />
        <Button label="=" type="equals" onClick={handleEquals} />
        <Button label="+" type="operator" onClick={() => handleOperator('+')} />
      </div>
    </div>
  );
};

export default Calculator;
