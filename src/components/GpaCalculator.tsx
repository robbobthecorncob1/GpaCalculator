import { useState } from 'react'
import type { Course, GpaCalculationResponse } from '../types/api'

/**
 * Properties required for the GpaCalculator component.
 */
interface GpaCalculatorProps {
  currentGpa: number | '';
  pastCreditHours: number | '';
}

/**
 * Renders a dynamic form for adding/removing classes and communicates with 
 * the backend to calculate the semester or cumulative GPA.
 * @param currentGpa - The user's existing cumulative GPA (if provided).
 * @param pastCreditHours - The total credits earned prior to the current courses (if provided).
 */
export default function GpaCalculator({ currentGpa, pastCreditHours }: GpaCalculatorProps) {  
    const [result, setResult] = useState<GpaCalculationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [showCourses, setShowCourses] = useState<boolean>(true);

    const [courses, setCourses] = useState<Course[]>([
        { courseName: 'Math 1111: Sample Class', creditHours: 3, grade: 'A' }
    ]);

  /**
   * Adds a new, default course to the bottom of the course list.
   */
  const handleAddCourse = () => {
    setCourses([...courses, { courseName: '', creditHours: 0, grade: 'A' }]);
  };

  /**
   * Removes a specific course from the list based on its position.
   * @param indexToRemove - The index of the course to remove.
   */
  const handleRemoveCourse = (indexToRemove: number) => {
    setCourses(courses.filter((_, index) => index !== indexToRemove));
  };

  /**
   * Updates a specific field (name, credits, or grade) for a single course.
   * @param index - The index of the course being edited.
   * @param field - The specific property of the Course object to update.
   * @param value - The new value entered/selected by the user.
   */
  const handleCourseChange = (index: number, field: keyof Course, value: string | number) => {
    const updatedCourses = [...courses];
    // @ts-expect-error - Dynamic assignment requires a bit of TS wrangling, this is safe here
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  /**
   * Submits the current list of courses to the .NET backend to calculate the GPA.
   * Toggles the loading state and updates the UI with the final result.
   */
  const handleCalculate = async () => {
    setLoading(true);
    
    const payload = { 
      courses: showCourses ? courses : [],
      currentGpa: currentGpa === '' ? undefined : currentGpa,
      pastCreditHours: pastCreditHours === '' ? undefined : pastCreditHours
    };

    try {
      const response = await fetch("http://localhost:5126/api/gpa/calculate-gpa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data: GpaCalculationResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <div>
            <button 
                onClick={() => setShowCourses(!showCourses)} 
                className="btn-toggle"
            >
            {showCourses ? '- Do not include course list' : '+ Add Course List'}
            </button>
        </div>

        {showCourses && (
            <div>
                {courses.map((course, index) => (
                    <div key={index} className="course-row">
                    <input 
                        type="text" 
                        placeholder="Class Name (e.g. Math)" 
                        value={course.courseName}
                        onChange={(e) => handleCourseChange(index, 'courseName', e.target.value)}
                        className="input-text"
                    />

                    <input 
                        type="number" 
                        min="0"
                        value={course.creditHours}
                        onChange={(e) => handleCourseChange(index, 'creditHours', Number(e.target.value))}
                        className="input-number"
                    />

                    <select 
                        value={course.grade} 
                        onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
                        className="select-grade"
                    >
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="C-">C+</option>
                        <option value="D+">D+</option>
                        <option value="D">D</option>
                        <option value="D-">D-</option>
                        <option value="F">F</option>
                    </select>

                    {courses.length > 1 && (
                        <button onClick={() => handleRemoveCourse(index)} className="btn-remove">X</button>
                    )}
                    </div>
                ))}

                <div className="button-group">
                    <button onClick={handleAddCourse} className="btn-add">+ Add Another Class</button>
                </div>

            </div>
        )}

        <div className="button-group">
            <button 
                onClick={handleCalculate} 
                disabled={loading || courses.length === 0}
                className="btn-calculate"
            >
            {loading ? "Calculating..." : "Calculate GPA"}
            </button>
        </div>

      {result && (
        <div className="results-box">
          <h2>Your GPA: {result.calculatedGpa}</h2>
          {result.message && <p>{result.message}</p>}
        </div>
      )}
    </>
  )
}