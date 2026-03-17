import { useState } from 'react'
import GpaCalculator from './components/GpaCalculator';
import TargetPlanner from './components/TargetPlanner';
import './App.scss';

/**
 * The main application component for the GPA Calculator.
 * Manages the dynamic list of courses, handles user input, and communicates
 * with the .NET backend API to calculate the final GPA.
 */
function App() {
  const [currentGpa, setCurrentGpa] = useState<number | ''>('');
  const [pastCreditHours, setPastCredits] = useState<number | ''>('');

  const [showCurrentGpaInformation, setShowCurrentGpaInformation] = useState<boolean>(false);
  const [showTargetPlanner, setShowTargetPlanner] = useState<boolean>(false);

  const activeCurrentGpa = showCurrentGpaInformation ? currentGpa : '';
  const activePastCredits = showCurrentGpaInformation ? pastCreditHours : '';

  return (
    <div className="container">
      <h1>GPA Calculator</h1>

      <div>
        <button 
          onClick={() => setShowCurrentGpaInformation(!showCurrentGpaInformation)}
          className="btn-toggle"
        >
          {showCurrentGpaInformation ? '- Do not include Current GPA' : '+ Include Current GPA'}
        </button>

        {showCurrentGpaInformation && (
        <div className="cumulative-inputs">
          <div className="input-group">
            <label>Current GPA</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="e.g. 3.5"
              value={currentGpa}
              onChange={(e) => setCurrentGpa(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>Past Credits</label>
            <input 
              type="number" 
              placeholder="e.g. 60"
              value={pastCreditHours}
              onChange={(e) => setPastCredits(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        </div>
        )}

        <button 
          onClick={() => setShowTargetPlanner(!showTargetPlanner)}
          className="btn-toggle"
        >
          {showTargetPlanner ? '- Remove target/desired GPA' : '+ Add target/desired GPA'}
        </button>

        {showTargetPlanner && (
        <>
          <TargetPlanner currentGpa={activeCurrentGpa} pastCreditHours={activePastCredits} />
        </>
        )}
     </div>

      <hr/>
      <GpaCalculator currentGpa={activeCurrentGpa} pastCreditHours={activePastCredits} />

    </div>
  )
}

export default App
