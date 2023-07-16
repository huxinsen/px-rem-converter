import { useState } from 'react';

import './App.css';

const DEFAULT_ROOT_FONT_SIZE = 16;

enum ConvertMode {
  PxToRem,
  RemToPx,
}

const TITLE_MAP = {
  [ConvertMode.PxToRem]: 'PX to REM converter',
  [ConvertMode.RemToPx]: 'REM to PX converter',
};

const INPUT_UNIT_MAP = {
  [ConvertMode.PxToRem]: 'px',
  [ConvertMode.RemToPx]: 'rem',
};

const OUTPUT_UNIT_MAP = {
  [ConvertMode.PxToRem]: 'rem',
  [ConvertMode.RemToPx]: 'px',
};

function calculate(
  inputValue: number,
  rootFontSize: number,
  convertMode = ConvertMode.PxToRem
) {
  if (convertMode === ConvertMode.PxToRem) {
    return (inputValue / rootFontSize).toPrecision(4);
  } else {
    return (inputValue * rootFontSize).toPrecision(4);
  }
}

interface OutPutProps {
  value?: number | number[][];
  convertMode: ConvertMode;
}

function OutPut(props: OutPutProps) {
  const { value, convertMode } = props;
  if (!value) {
    return null;
  }

  if (typeof value === 'number') {
    return (
      <div className="output-value">
        <span className="output-single-value">{value}</span>
        <span>{OUTPUT_UNIT_MAP[convertMode]}</span>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="output-value">
        <table className="styled-table">
          <thead>
            <tr>
              <th>{INPUT_UNIT_MAP[convertMode]}</th>
              <th>{OUTPUT_UNIT_MAP[convertMode]}</th>
            </tr>
          </thead>
          <tbody>
            {value.map((entry, index) => (
              <tr key={index}>
                <td>{entry[0]}</td>
                <td>{entry[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

function App() {
  const [convertMode, setConvertMode] = useState(ConvertMode.PxToRem);
  const [rootFontSizeInput, setRootFontSizeInput] = useState<string | number>(
    DEFAULT_ROOT_FONT_SIZE
  );
  const [rootFontSize, setRootFontSize] = useState(DEFAULT_ROOT_FONT_SIZE);
  const [inputValue, setInputValue] = useState<string>('');
  const [parsedInputValue, setParsedInputValue] = useState<number[]>();
  const [showErrorTip, setShowErrorTip] = useState(false);

  const getOutPutValue = () => {
    if (!parsedInputValue) {
      return;
    }

    if (parsedInputValue.length === 1) {
      return Number(calculate(parsedInputValue[0], rootFontSize, convertMode));
    } else {
      return parsedInputValue.map((num) => [
        num,
        Number(calculate(num, rootFontSize, convertMode)),
      ]);
    }
  };

  const outputValue = getOutPutValue();

  const handleBaseChange = () => {
    const value = Number(rootFontSizeInput);
    const rootFontSize = isNaN(value)
      ? DEFAULT_ROOT_FONT_SIZE
      : value > 0
      ? value
      : DEFAULT_ROOT_FONT_SIZE;
    setRootFontSize(rootFontSize);
    setRootFontSizeInput(rootFontSize);
  };

  const handleClickSwitchMode = () => {
    setConvertMode(
      convertMode === ConvertMode.PxToRem
        ? ConvertMode.RemToPx
        : ConvertMode.PxToRem
    );
  };

  const handleSubmitInput = () => {
    if (!inputValue) {
      setParsedInputValue(undefined);
      setShowErrorTip(false);
      return;
    }

    const numArray = inputValue
      .split(/[,;，；]/)
      .filter((item) => item !== '')
      .map(Number);
    if (numArray.some(isNaN)) {
      setParsedInputValue(undefined);
      setShowErrorTip(true);
      return;
    } else {
      setShowErrorTip(false);
    }

    setParsedInputValue(numArray);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="name section">{TITLE_MAP[convertMode]}</div>

        <button
          className="section switch-button"
          type="button"
          onClick={handleClickSwitchMode}
        >
          Switch Mode
        </button>

        <div className="section base">
          <span>Calculation based on a root font-size of </span>
          <input
            type="text"
            name="base-input"
            id="base-input"
            value={rootFontSizeInput}
            onChange={(e) => setRootFontSizeInput(e.target.value)}
            onBlur={handleBaseChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleBaseChange();
              }
            }}
          />
          <span> pixel.</span>
        </div>

        <div className="section input-value">
          <input
            type="text"
            name="input"
            id="input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleSubmitInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmitInput();
              }
            }}
          />
          <span> {INPUT_UNIT_MAP[convertMode]}</span>
        </div>
        {showErrorTip && (
          <div className="section error-tip">Please check your input</div>
        )}

        <OutPut value={outputValue} convertMode={convertMode} />
      </div>
    </div>
  );
}

export default App;
