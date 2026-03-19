import type { Course } from '../api/ApiTypes';
import styles from './CourseList.module.scss'

/**
 * Properties required for the CourseList component.
 */
interface CourseListProps {
blockIndex: number;
  blockName: string;
  courses: Course[];
  handleAddCourse: (blockIndex: number) => void;
  handleRemoveCourse: (blockIndex: number, courseIndex: number) => void;
  handleCourseChange: (blockIndex: number, courseIndex: number, field: keyof Course, value: string | number) => void;
  handleRemoveCourseBlock: (blockIndex: number) => void;
  handleCourseBlockNameChange: (blockIndex: number, newName: string) => void;
}

/**
 * Renders a list of courses where the user can add, remove, and change elements
 * of invidual courses within a specific block.
 * @param blockIndex - The index of the course block.
 * @param blockName - Name of the course block.
 * @param courses - The list of courses.
 * @param handleAddCourse - Callback triggered to append a new, empty course row to this block.
 * @param handleRemoveCourse - Callback triggered to delete a specific course row from this block.
 * @param handleCourseChange - Callback triggered to update a specific field (name, credits, or grade) of a course in this block.
 * @param handleRemoveCourseBlock - Callback triggered to delete this entire course block from the dashboard.
 * @param handleCourseBlockNameChange - Callback triggered when the user types a new name for this course block.
 * @returns {JSX.Element} The rendered course list block.
 */
export default function CourseList({
    blockIndex,
    blockName,
    courses,
    handleAddCourse,
    handleRemoveCourse,
    handleCourseChange,
    handleRemoveCourseBlock,
    handleCourseBlockNameChange
}: CourseListProps) {
  return (
     <div className={styles.courseBlock} >
      <div className={styles.blockHeader} >
        <input 
          type="text" 
          value={blockName} 
          onChange={(e) => handleCourseBlockNameChange(blockIndex, e.target.value)}
          placeholder="Semester Name (e.g. Fall 2024)"
          className={styles.inputText}
        />
        <button 
          onClick={() => handleRemoveCourseBlock(blockIndex)} 
          className={styles.btnRemove}
        >
          Remove Semester
        </button>
      </div>

      {courses.map((course, index) => (
        <div key={index} className={styles.courseRow}>
          <input 
            type="text" 
            placeholder="Class Name (e.g. Math)" 
            value={course.courseName}
            onChange={(e) => handleCourseChange(blockIndex, index, 'courseName', e.target.value)}
            className={styles.inputText}
          />

          <input 
            type="number" 
            min="0"
            value={course.creditHours}
            onChange={(e) => handleCourseChange(blockIndex, index, 'creditHours', Number(e.target.value))}
            className={styles.inputNumber}
          />

          <select 
            value={course.grade} 
            onChange={(e) => handleCourseChange(blockIndex, index, 'grade', e.target.value)}
            className={styles.selectGrade}
          >
            <option value="A">A</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="B-">B-</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="C-">C-</option>
            <option value="D+">D+</option>
            <option value="D">D</option>
            <option value="D-">D-</option>
            <option value="F">F</option>
          </select>

          {courses.length > 1 && (
            <button onClick={() => handleRemoveCourse(blockIndex, index)} className={styles.btnRemove}>X</button>
          )}
        </div>
      ))}

      <div className="button-group">
        <button onClick={() => handleAddCourse(blockIndex)} className={styles.btnAdd}>
          + Add Another Class
        </button>
      </div>

    </div>
  );
}