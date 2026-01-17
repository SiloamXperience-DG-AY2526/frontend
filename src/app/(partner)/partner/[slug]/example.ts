import { PartnerInfoResponse } from '@/types/PartnerInfo';

// Vibecoded sample data for the partner info
// You can display this data by entering a random non-valid id like /partner/1234
// TODO: Replace with loading screen in the future????

export const examplePartnerInfoResponse: PartnerInfoResponse = {
  personalParticulars: {
    fullName: 'Alex Tan',
    prefixTitle: 'Mr',
    birthday: '12/03/1998',
    gender: 'male',
    occupation: 'Marketing Executive',
    nationality: 'Singaporean',
    phoneNumber: '+6591234567',
    preferredCommunicationMethod: 'email',
  },
  projects: [
    {
      projectId: 'uuid-1',
      projectTitle: 'Food Distribution Drive',
      sessions: [
        {
          sessionName: 'Session 1',
          date: '2025-06-15T00:00:00.000Z',
          startTime: '2025-06-15T09:00:00.000Z',
          endTime: '2025-06-15T17:00:00.000Z',
          attendance: 'Attended',
          hoursCompleted: 8,
        },
      ],
      totalHours: 8,
    },
    {
      projectId: 'uuid-2',
      projectTitle: 'Community Children\'s Program',
      sessions: [
        {
          sessionName: 'Session 1',
          date: '2025-07-10T00:00:00.000Z',
          startTime: '2025-07-10T09:00:00.000Z',
          endTime: '2025-07-10T17:00:00.000Z',
          attendance: 'Did not attend',
          hoursCompleted: 0,
        },
        {
          sessionName: 'Session 2',
          date: '2025-07-10T00:00:00.000Z',
          startTime: '2025-07-10T15:00:00.000Z',
          endTime: '2025-07-10T18:00:00.000Z',
          attendance: 'Attended',
          hoursCompleted: 0,
        },
      ],
      totalHours: 0,
    },
  ],
  partnershipInterests: [
    { interest: 'Organizing fundraising events', interested: true },
    { interest: 'Planning trips for your organization/group', interested: true },
    { interest: 'Short-term mission trips (up to 14 days)', interested: true },
    { interest: 'Long-term commitments (6 months or more)', interested: false },
    { interest: 'Behind-the-scenes administration', interested: true },
    { interest: 'Marketing & social media magic', interested: true },
    { interest: 'Teaching & mentoring', interested: false },
    { interest: 'Training & program development', interested: false },
    { interest: 'Agriculture projects', interested: true },
    { interest: 'Building & facilities work', interested: true },
    { interest: 'Other', interested: false },
  ],
  performance: [
    {
      reviewerName: 'Jamie Lee',
      timestamp: '2025-08-10T15:15:00.000Z',
      score: 4.5,
      strengths: 'Reliable, Proactive, Time management',
      areasOfImprovement: 'Could improve communication',
      projectTitle: 'Food Distribution Drive',
      feedbackType: 'peer',
      tags: ['reliable', 'proactive'],
    },
    {
      reviewerName: 'Daniel Wong',
      timestamp: '2025-08-22T11:40:00.000Z',
      score: 4,
      strengths: 'Clear Communication, Documentation',
      areasOfImprovement: 'Time management',
      projectTitle: 'Community Children\'s Program',
      feedbackType: 'supervisor',
      tags: ['communication'],
    },
  ],
  profile: {
    firstName: 'Alex',
    lastName: 'Tan',
    email: 'alex@example.com',
    title: 'Mr',
    dob: '1998-03-12T00:00:00.000Z',
    countryCode: '+65',
    contactNumber: '91234567',
    nationality: 'Singaporean',
    occupation: 'Marketing Executive',
    gender: 'male',
    skills: ['marketing', 'communication'],
    languages: ['English', 'Mandarin'],
    contactModes: ['email'],
    interests: [
      'fundraise',
      'planTrips',
      'missionTrips',
      'admin',
      'publicity',
      'agriculture',
      'building',
    ],
  },
};


