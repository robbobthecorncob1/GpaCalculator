import styles from './TargetPlanner.module.scss';

/**
 * Properties required for the TargetGpaCalculator component.
 */
interface TargetGpaPlannerProps {
    targetGpa: number | '';
    setTargetGpa: (val: number | '') => void;
    futureCreditHours: number | '';
    setFutureCreditHours: (val: number | '') => void;
}

/**
 * Renders a planner to calculate the minimum GPA required in future courses 
 * to achieve a specific target cumulative GPA.
 * @param targetGpa - The desired cumulative GPA the user wants to achieve.
 * @param setTargetGpa - State setter for the target GPA.
 * @param futureCreditHours - The number of credit hours the user plans to take.
 * @param setFutureCreditHours - State setter for future credit hours.
 */
export default function TargetGpaCalculator({ 
    targetGpa, 
    setTargetGpa, 
    futureCreditHours, 
    setFutureCreditHours,
    }: TargetGpaPlannerProps) {
    
    return (
        <div className={styles.plannerContainer}>
            <div className={styles.inputGroup}>
                <label htmlFor="targetGpa">Desired Target GPA</label>
                <input 
                    id="targetGpa"
                    type="number" 
                    step="0.01" 
                    value={targetGpa} 
                    onChange={(e) => setTargetGpa(e.target.value === '' ? '' : parseFloat(e.target.value))}
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="futureCreditHours">Future Credit Hours</label>
                <input 
                    id="futureCreditHours"
                    type="number" 
                    step="0.5" 
                    value={futureCreditHours} 
                    onChange={(e) => setFutureCreditHours(e.target.value === '' ? '' : parseFloat(e.target.value))}
                />
            </div>
        </div>
    );
}