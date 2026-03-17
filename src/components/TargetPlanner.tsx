import { useState } from 'react';
import type { TargetGpaResponse } from '../types/api';

/**
 * Properties required for the TargetGpaCalculator component.
 */
interface TargetGpaPlannerProps {
    currentGpa: number | '';
    pastCreditHours: number | '';
}

/**
 * Renders a planner to calculate the minimum GPA required in future courses 
 * to achieve a specific target cumulative GPA.
 * @param currentGpa - The user's existing cumulative GPA (if provided).
 * @param pastCreditHours - The total credits earned prior to future courses (if provided).
 */
export default function TargetGpaCalculator({ currentGpa, pastCreditHours }: TargetGpaPlannerProps) {
    const [targetGpa, setTargetGpa] = useState<number>(0);
    const [newCreditHours, setNewCreditHours] = useState<number>(0);
    const [targetResponse, setTargetResponse] = useState<TargetGpaResponse | null>(null);
    const [targetLoading, setTargetLoading] = useState<boolean>(false);

    /**
     * Submits the current GPA, target GPA, past credit hours, and future credit hours to the .NET backend to calculate the minimum required GPA.
     * Toggles the loading state and updates the UI with the final result.
     */
    const handleCalculateTarget = async () => {
        if (newCreditHours <= 0) {
            alert("Please enter at least 1 future credit hour.");
            return;
        }

        setTargetLoading(true);

        try {
        const response = await fetch('http://localhost:5126/api/gpa/calculate-target', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            currentGpa: currentGpa,
            pastCreditHours: pastCreditHours,
            targetGpa: targetGpa,
            newCreditHours: newCreditHours
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setTargetResponse(data);
        } else {
            console.error("Failed to calculate target GPA");
        }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setTargetLoading(false);
        }
    };

    return (
    <>
        <div>
            <label>Desired Target GPA</label>
            <input 
                type="number" 
                step="0.01" 
                value={targetGpa} 
                onChange={(e) => setTargetGpa(parseFloat(e.target.value) || 0)} 
            />
        </div>

        <div>
            <label>Future Credit Hours</label>
            <input 
                type="number" 
                step="0.5" 
                value={newCreditHours} 
                onChange={(e) => setNewCreditHours(parseFloat(e.target.value) || 0)} 
            />
        </div>

        <button onClick={handleCalculateTarget} disabled={targetLoading}>
            {targetLoading ? 'Calculating...' : 'Calculate Target'}
        </button>

        {targetResponse && (
            <div>
                <h3>Required GPA: {targetResponse.requiredGpa}</h3>
                <p>{targetResponse.message}</p>
            </div>
        )}
    </>
    );
}