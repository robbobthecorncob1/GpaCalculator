/**
 * A course entry used for GPA calculations
 */
export interface Course {
    courseName: string;
    creditHours: number;
    grade: string;
}

/**
 * Represents a grouped block of courses for a specific semester or term.
 * Used to calculate GPA in distinct chronological chunks.
 */
export interface CourseBlock {
  /** 
   * A unique identifier generated via crypto.randomUUID(). 
   * Crucial for stable React array keys when reordering or deleting blocks.
   */
  id: string; 

  /** 
   * The user-facing display name of the block.
   * @example "Fall 2024" or "Semester 1"
   */
  blockName: string; 

  /**
   * The list of individual courses taken during this specific term.
   */
  courses: Course[];
}

/**
 * The data structure sent to the API to request a GPA calculation.
 */
export interface GpaCalculationRequest {
    courses: Course[];
    currentGpa?: number;
    pastCredits?: number;
}

/**
 * The data structure received from the API after a GPA calculation is completed.
 */
export interface GpaCalculationResponse {
    calculatedGpa: number;
    message: string;
    totalCreditHours: number;
}

/**
 * The request sent to the API to request a target GPA calculation.
 */
export interface TargetGpaRequest {
  currentGpa: number;
  pastCreditHours: number;
  targetGpa: number;
  newCreditHours: number;
}

/**
 * The data structure received from the API after a target GPA calculation is completed.
 */
export interface TargetGpaResponse {
  requiredGpa: number;
  message: string;
}