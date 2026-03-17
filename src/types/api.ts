/**
 * A course entry used for GPA calculations
 */
export interface Course {
    courseName: string;
    creditHours: number;
    grade: string;
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
}

export interface TargetGpaRequest {
  currentGpa: number;
  pastCreditHours: number;
  targetGpa: number;
  newCreditHours: number;
}

export interface TargetGpaResponse {
  requiredGpa: number;
  message: string;
}