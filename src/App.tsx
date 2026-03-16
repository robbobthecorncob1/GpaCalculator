import { useState } from 'react'
import type { Course, GpaCalculationResponse } from './types/api'
import './App.scss';

/**
 * The main application component for the GPA Calculator.
 * Manages the dynamic list of courses, handles user input, and communicates
 * with the .NET backend API to calculate the final GPA.
 */
function App() {

  const [currentGpa, setCurrentGpa] = useState<number | ''>('');
  const [pastCreditHours, setPastCredits] = useState<number | ''>('');

  const [courses, setCourses] = useState<Course[]>([
    { courseName: 'Math 1111: Sample Class', creditHours: 3, grade: 'A' }
  ]);
  
  const [result, setResult] = useState<GpaCalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);

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
      courses: courses,
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
    <div className="container">
      <h1>GPA Calculator</h1>
      
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

<hr />

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
    </div>
  )
}

export default App
