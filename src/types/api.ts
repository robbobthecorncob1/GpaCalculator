export interface Course {
    courseName: string;
    creditHours: number;
    grade: string;
}

export interface GpaCalculationRequest {
    courses: Course[];
}

export interface GpaCalculationResponse {
    calculatedGpa: number;
    message: string;
}