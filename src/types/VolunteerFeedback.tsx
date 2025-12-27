export type FeedbackPayload = {
  ratings: {
    overall: number;
    management: number;
    planning: number;
    facilities: number;
  };
  feedback: {
    experience: string;
    improvement: string;
    comments: string;
  };
  submittedAt: string; 
};
