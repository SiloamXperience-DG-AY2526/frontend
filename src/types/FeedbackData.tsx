export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    title: string;
}

export interface FeedbackTag {
    id: string;
    name: string;
    feedbackId: string;
    createdAt: string;
}

export interface FeedbackData {
    id: string;
    reviewerId: string;
    revieweeId: string;
    projectId: string;
    reviewer: User;
    reviewee: User;
    score: number;
    type: string;
    strengths: string;
    improvements: string;
    tags: FeedbackTag[];
    createdAt: string;
    updatedAt: string;
}