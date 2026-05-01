import { useState } from "react";
import "./styles/App.css";
import ConfigurationForm from "./components/ConfigurationForm";
import KeyboardVisualization from "./components/KeyboardVisualization";
import { useKeyboardState } from "./hooks/useKeyboardState";
import {
  generateConfiguration,
  readConfigurationFromFile,
  uploadConfiguration,
} from "./utils/api";

function App() {
  const [streamOutput, setStreamOutput] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loadFeedback, setLoadFeedback] = useState(null);

  const {
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
  } = useKeyboardState();

  const bom = (() => {
    const layout = generateConfiguration(mcu, split, tilt, keys);
    const keyCount = keys.length;
    const area = layout.width * layout.height;

    // Initial placeholder costs; easy to tune later.
    const fixedKeyboardCost = 25;
    const costPerKey = 0.45;
    const costPerAreaUnit = 0.12;

    const keysCost = keyCount * costPerKey;
    const areaCost = area * costPerAreaUnit;
    const totalCost = fixedKeyboardCost + keysCost + areaCost;

    return {
      keyCount,
      area,
      fixedKeyboardCost,
      costPerKey,
      costPerAreaUnit,
      keysCost,
      areaCost,
      totalCost,
    };
  })();

  const handleGenerateJSON = async () => {
    const config = generateConfiguration(mcu, split, tilt, keys);
    setStreamOutput("");
    setShowPopup(true);
    
    try {
      const response = await uploadConfiguration(config, (chunk) => {
        setStreamOutput(prev => prev + chunk);
      });
      
      if (response.success) {
        const fileResponse = await fetch("http://localhost:3001/download/backend/output.zip");
        const blob = await fileResponse.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'output.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error saving to backend:", error);
      setStreamOutput("Error: " + error.message);
    }
  };

  const handleConfigFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      loadConfiguration(await readConfigurationFromFile(file));
      setLoadFeedback({ error: false, message: "Configuration loaded." });
      window.setTimeout(() => setLoadFeedback(null), 4000);
    } catch (err) {
      setLoadFeedback({ error: true, message: err.message });
    }
  };

  return (
    <>
      <div className="title-bar">ParaKeyt</div>
      <div className="container">
        <ConfigurationForm
          mcu={mcu}
          split={split}
          tilt={tilt}
          keys={keys}
          expandedKeys={expandedKeys}
          onUpdateMcuPos={updateMcuPos}
          onSetSplit={setSplit}
          onSetTilt={setTilt}
          onAddKey={addKey}
          onRemoveKey={removeKey}
          onUpdateKey={updateKey}
          onToggleKeyExpansion={toggleKeyExpansion}
        />
        
        <div className="main">
          <KeyboardVisualization
            mcu={mcu}
            keys={keys}
            split={split}
            tilt={tilt}
            onUpdateKey={updateKey}
            onUpdateMcuPos={updateMcuPos}
            onRemoveKey={removeKey}
          />
          
          <div className="main-actions">
            <div className="main-buttons">
              <button type="button" onClick={addKey} className="add-key-button-main">
                + Add Key
              </button>
              <button type="button" onClick={clearKeys} className="clear-keys-button">
                Clear Keys
              </button>
              <label className="add-key-button-main load-config-label">
                Load configuration
                <input
                  type="file"
                  accept=".json,application/json"
                  className="file-input-hidden"
                  onChange={handleConfigFileChange}
                />
              </label>
              <button type="button" onClick={handleGenerateJSON} className="generate-button">
                Generate Configuration
              </button>
            </div>
            {loadFeedback && (
              <p
                className={`load-feedback load-feedback--${loadFeedback.error ? "error" : "ok"}`}
                role={loadFeedback.error ? "alert" : "status"}
              >
                {loadFeedback.message}
              </p>
            )}
          </div>

          <div className="bom-card section-card">
            <h3 className="section-title">Bill of Materials</h3>
            <table className="bom-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Rate</th>
                  <th>Quantity</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fixed keyboard cost</td>
                  <td>${bom.fixedKeyboardCost.toFixed(2)}</td>
                  <td>1</td>
                  <td>${bom.fixedKeyboardCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Cost per key</td>
                  <td>${bom.costPerKey.toFixed(2)}</td>
                  <td>{bom.keyCount}</td>
                  <td>${bom.keysCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Cost for area</td>
                  <td>${bom.costPerAreaUnit.toFixed(2)} / unit²</td>
                  <td>{bom.area.toFixed(2)}</td>
                  <td>${bom.areaCost.toFixed(2)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">Total</td>
                  <td>${bom.totalCost.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Output</span>
              <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
            </div>
            <pre className="popup-content">{streamOutput || ""}</pre>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
