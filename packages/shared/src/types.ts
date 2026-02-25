export type QuestionType = "TEXT" | "MULTIPLE_CHOICE" | "CHECKBOX" | "DATE";

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    options?: string[];
}

export interface Form {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
}

export interface Answer {
    questionId: string;
    value?: string | string[];
    values?: string[];
}

export interface Response {
    id: string;
    formId: string;
    answers: Answer[];
}
