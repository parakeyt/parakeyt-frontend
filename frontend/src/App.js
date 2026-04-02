import "./styles/App.css";
import ConfigurationForm from "./components/ConfigurationForm";
import KeyboardVisualization from "./components/KeyboardVisualization";
import { useKeyboardState } from "./hooks/useKeyboardState";
import { generateConfiguration, uploadConfiguration } from "./utils/api";

function App() {
  const {
    mcu,
    split,
    tilt,
    keys,
    expandedKeys,
    updateMcuPos,
    updateMcu,
    setSplit,
    setTilt,
    addKey,
    removeKey,
    updateKey,
    toggleKeyExpansion
  } = useKeyboardState();

  const handleGenerateJSON = async () => {
    const config = generateConfiguration(mcu, split, tilt, keys);
    console.log("Generated JSON:", config);
    
    try {
      const response = await uploadConfiguration(config);
      console.log("Server response:", response);
      
      if (response.success) {
        const fileResponse = await fetch("http://localhost:3001/download/config.json");
        const blob = await fileResponse.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'config.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error saving to backend:", error);
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
          onUpdateMcu={updateMcu}
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
          
          <div className="main-buttons">
            <button onClick={addKey} className="add-key-button-main">
              + Add Key
            </button>
            <button onClick={handleGenerateJSON} className="generate-button">
              Generate Configuration
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
