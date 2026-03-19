import { useState, useRef, useEffect } from 'react'
import TargetPlanner from './TargetPlanner';
import type { Course, CourseBlock, GpaCalculationResponse, TargetGpaResponse } from '../api/ApiTypes';
import CourseList from './CourseList';
import { callApi } from '../api/ApiConfig';
import styles from './GpaDashboard.module.scss';

/**
 * The main component for the GPA Calculator.
 * Manages the dynamic list of course blocks, courses, handles user input,
 * and communicates with the .NET backend API to calculate the final GPA.
 * @returns {JSX.Element} The rendered GPA Dashboard interface.
 */
export default function GpaDashboard() {

  const [targetGpa, setTargetGpa] = useState<number | ''>('');
  const [futureCredits, setFutureCredits] = useState<number | ''>('');
  const [targetResult, setTargetResult] = useState<TargetGpaResponse | null>(null);

  const [currentGpa, setCurrentGpa] = useState<number | ''>('');
  const [pastCreditHours, setPastCredits] = useState<number | ''>('');
  
  const [showCurrentGpa, setshowCurrentGpa] = useState<boolean>(false);
  const [showTargetPlanner, setShowTargetPlanner] = useState<boolean>(false);

  const [result, setResult] = useState<GpaCalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCourses, setShowCourses] = useState<boolean>(true);

  const [courseBlocks, setCourseBlocks] = useState<CourseBlock[]>([
  {
    id: crypto.randomUUID(),
    blockName: 'Semester 1',
    courses: [{ courseName: 'Math 1111: Sample Class', creditHours: 3, grade: 'A' }]
  }
  ]);

  const isCourseListEmpty = !showCurrentGpa && !showTargetPlanner && showCourses && courseBlocks.flatMap(b => b.courses).length === 0;
  const areAllSectionsHidden = !showCurrentGpa && !showTargetPlanner && !showCourses;

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultsRef.current) resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [result]);

  /**
   * Adds a new course block.
   */
  const handleAddCourseBlock = () => {
    const newBlock: CourseBlock = {
      id: crypto.randomUUID(), 
      blockName: `Semester ${courseBlocks.length + 1}`,
      courses: [{ courseName: '', creditHours: 0, grade: 'A' }]
    };
    
    setCourseBlocks([...courseBlocks, newBlock]);
  }

  /**
   * Removes a specific course block from a given index.
   * @param courseBlockIndex - the index of the course block to remove.
   */
  const handleRemoveCourseBlock = (courseBlockIndex: number) => {
    setCourseBlocks(courseBlocks.filter((_, index) => index !== courseBlockIndex));
  }

  /**
   * Handles the changing of a specific course block's name based on an index.
   * @param courseBlockIndex - The index of the course block.
   * @param newName - The new name of the course block.
   */
  const handleCourseBlockNameChange = (courseBlockIndex: number, newName: string) => {
    const updatedBlocks = [...courseBlocks];
    updatedBlocks[courseBlockIndex].blockName = newName;
    setCourseBlocks(updatedBlocks);
  }
  
  /**
   * Adds a new, default course to the bottom of a specific course block.
   * @param courseBlockIndex 
   */
  const handleAddCourse = (courseBlockIndex: number) => {
    const updatedBlocks = [...courseBlocks];
    updatedBlocks[courseBlockIndex].courses.push({ courseName: '', creditHours: 0, grade: 'A' });
    setCourseBlocks(updatedBlocks);
  };

  /**
   * Removes a specific course from a specific block based on its position.
   * @param courseBlockIndex - The index of the courseBlock that contains the course to remove.
   * @param courseIndex - The index of the course to remove.
   */
  const handleRemoveCourse = (courseBlockIndex: number, courseIndex: number) => {
    const updatedBlocks = [...courseBlocks];
    updatedBlocks[courseBlockIndex].courses = updatedBlocks[courseBlockIndex].courses.filter((_, index) => index !== courseIndex);
    setCourseBlocks(updatedBlocks);
  };

  /**
   * Updates a specific field (name, credits, or grade) for a single course.
   * @param courseBlockIndex - The index of the course block that contains the course to be edited.
   * @param courseIndex - The index of the course being edited.
   * @param field - The specific property of the Course object to update.
   * @param value - The new value entered/selected by the user.
   */
  const handleCourseChange = (courseBlockIndex: number, courseIndex: number, field: keyof Course, value: string | number) => {
    const updatedBlocks = [...courseBlocks];
    // @ts-expect-error - Dynamic assignment requires a bit of TS wrangling, this is safe here
    updatedBlocks[courseBlockIndex].courses[courseIndex][field] = value;
    setCourseBlocks(updatedBlocks);
  };

  /**
   * Submits the current list of courses to the .NET backend to calculate the GPA.
   * Toggles the loading state and updates the UI with the final result.
   */
  const handleCalculate = async () => {
    setLoading(true);

    const allCourses = showCourses ? courseBlocks.flatMap(block => block.courses) : [];
    
    const payload = { 
      courses: showCourses ? allCourses : [],
      currentGpa: (showCurrentGpa && currentGpa !== '') ? currentGpa : undefined,
      pastCreditHours: (showCurrentGpa && pastCreditHours !== '') ? pastCreditHours : undefined
    };

    try {
      const data = await callApi<GpaCalculationResponse>("/calculate-gpa", payload);
      setResult(data);
      if (showTargetPlanner) {
        const targetPayload = {
            currentGpa: data.calculatedGpa,
            pastCreditHours: data.totalCreditHours,
            targetGpa: targetGpa === '' ? 0 : targetGpa,
            newCreditHours: futureCredits
        }
        const targetData = await callApi<TargetGpaResponse>("/calculate-target", targetPayload);
        setTargetResult(targetData);
      } else {
        setTargetResult(null);
      }
    } catch (error) {
        console.error("Connection failed:", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>GPA Calculator</h1>
      <p className={styles.shortDesc}>Plan your semesters, set your goals, and track your progress.</p>

      <div>
        <button 
          onClick={() => setshowCurrentGpa(!showCurrentGpa)}
          className={styles.btnToggle}
        >
          {showCurrentGpa ? '- Do not include Current GPA' : '+ Include Current GPA'}
        </button>

        {showCurrentGpa && (
        <div className={styles.cumulativeInputs}>
          <div className={styles.inputGroup}>
            <label>Current GPA</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="e.g. 3.5"
              value={currentGpa}
              onChange={(e) => setCurrentGpa(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>

          <div className={styles.inputGroup}>
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
          className={styles.btnToggle}
        >
          {showTargetPlanner ? '- Remove target/desired GPA' : '+ Add target/desired GPA'}
        </button>

        {showTargetPlanner && (
          <TargetPlanner 
                targetGpa={targetGpa}
                setTargetGpa={setTargetGpa}
                futureCreditHours={futureCredits}
                setFutureCreditHours={setFutureCredits}
          />
        )}
     </div>

      <hr/>
      <div>
        <button 
            onClick={() => setShowCourses(!showCourses)} 
            className={styles.btnToggle}
        >
        {showCourses ? '- Do not include course list' : '+ Add Course List'}
        </button>
      </div>

        {showCourses && (
        <div className={styles.courseBlocksContainer}>
          {courseBlocks.map((block, index) => (
            <CourseList 
              key={block.id}
              blockIndex={index}
              blockName={block.blockName}
              courses={block.courses}
              handleAddCourse={handleAddCourse}
              handleRemoveCourse={handleRemoveCourse}
              handleCourseChange={handleCourseChange}
              handleRemoveCourseBlock={handleRemoveCourseBlock}
              handleCourseBlockNameChange={handleCourseBlockNameChange}
            />
          ))}
          
          <div className={styles.buttonGroup} >
            <button onClick={handleAddCourseBlock} className={styles.btnAdd}>
              + Add Another Semester
            </button>
          </div>
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button 
          onClick={handleCalculate} 
          disabled={loading || isCourseListEmpty || areAllSectionsHidden}
          className={styles.btnCalculate}
        >
          {loading ? "Calculating..." : "Calculate GPA"}
        </button>
      </div>

      {result && (
        <div className={styles.resultsBox}>
          <h2>Your GPA: {result.calculatedGpa}</h2>
          {result.message && <p>{result.message}</p>}

          {targetResult && (
            <div className={styles.targetResultsBox} >
              <h2>Required GPA: {targetResult.requiredGpa}</h2>
              {targetResult.message && <p>{targetResult.message}</p>}
            </div>
          )}
        </div>
      )}
      <div ref={resultsRef}>
      </div>

      <footer className={styles.footer}>
        <p>
          Built with React & .NET. {' '}
          <a href="https://github.com/robbobthecorncob1/GpaCalculator" target="_blank" rel="noopener noreferrer">
            View Source Code
          </a>
        </p>
      </footer>

    </div>
  )
}