export interface PrebuiltTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  schema_json: any;
}

export const prebuiltTemplates: PrebuiltTemplate[] = [
  {
    id: 'intake-form',
    name: 'Client Intake Form',
    description: 'Standard intake form for new clients including contact information, emergency contacts, and basic health information.',
    category: 'intake',
    schema_json: {
      title: 'Client Intake Form',
      pages: [
        {
          name: 'personalInfo',
          title: 'Personal Information',
          elements: [
            {
              type: 'text',
              name: 'firstName',
              title: 'First Name',
              isRequired: true
            },
            {
              type: 'text',
              name: 'lastName',
              title: 'Last Name',
              isRequired: true
            },
            {
              type: 'text',
              name: 'dateOfBirth',
              title: 'Date of Birth',
              inputType: 'date',
              isRequired: true
            },
            {
              type: 'dropdown',
              name: 'gender',
              title: 'Gender',
              choices: [
                'Male',
                'Female',
                'Non-binary',
                'Prefer not to say'
              ]
            },
            {
              type: 'text',
              name: 'phone',
              title: 'Phone Number',
              inputType: 'tel',
              isRequired: true
            },
            {
              type: 'text',
              name: 'email',
              title: 'Email',
              inputType: 'email',
              isRequired: true
            },
            {
              type: 'text',
              name: 'address',
              title: 'Address',
              isRequired: true
            }
          ]
        },
        {
          name: 'emergencyContact',
          title: 'Emergency Contact',
          elements: [
            {
              type: 'text',
              name: 'emergencyName',
              title: 'Emergency Contact Name',
              isRequired: true
            },
            {
              type: 'text',
              name: 'emergencyPhone',
              title: 'Emergency Contact Phone',
              inputType: 'tel',
              isRequired: true
            },
            {
              type: 'text',
              name: 'emergencyRelationship',
              title: 'Relationship to Client',
              isRequired: true
            }
          ]
        }
      ]
    }
  },
  {
    id: 'assessment-form',
    name: 'Mental Health Assessment',
    description: 'Comprehensive mental health assessment including mood, anxiety, and general wellness questions.',
    category: 'assessment',
    schema_json: {
      title: 'Mental Health Assessment',
      pages: [
        {
          name: 'moodAssessment',
          title: 'Mood Assessment',
          elements: [
            {
              type: 'rating',
              name: 'overallMood',
              title: 'How would you rate your overall mood in the past week?',
              rateMax: 10,
              rateMin: 1,
              rateStep: 1,
              isRequired: true
            },
            {
              type: 'checkbox',
              name: 'moodSymptoms',
              title: 'Which of the following symptoms have you experienced in the past two weeks?',
              choices: [
                'Persistent sadness',
                'Loss of interest in activities',
                'Difficulty sleeping',
                'Changes in appetite',
                'Fatigue or low energy',
                'Difficulty concentrating',
                'Feelings of worthlessness'
              ]
            }
          ]
        },
        {
          name: 'anxietyAssessment',
          title: 'Anxiety Assessment',
          elements: [
            {
              type: 'rating',
              name: 'anxietyLevel',
              title: 'How would you rate your anxiety level in the past week?',
              rateMax: 10,
              rateMin: 1,
              rateStep: 1,
              isRequired: true
            },
            {
              type: 'comment',
              name: 'anxietyTriggers',
              title: 'What situations or thoughts tend to trigger your anxiety?'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'session-feedback',
    name: 'Session Feedback Form',
    description: 'Post-session feedback form to gather client thoughts and progress.',
    category: 'feedback',
    schema_json: {
      title: 'Session Feedback',
      elements: [
        {
          type: 'rating',
          name: 'sessionRating',
          title: 'How would you rate today\'s session?',
          rateMax: 5,
          rateMin: 1,
          rateStep: 1,
          isRequired: true
        },
        {
          type: 'comment',
          name: 'sessionHighlights',
          title: 'What were the most helpful parts of today\'s session?'
        },
        {
          type: 'comment',
          name: 'sessionConcerns',
          title: 'Is there anything you\'d like to discuss further in our next session?'
        },
        {
          type: 'rating',
          name: 'progressRating',
          title: 'How do you feel about your overall progress?',
          rateMax: 10,
          rateMin: 1,
          rateStep: 1
        }
      ]
    }
  },
  {
    id: 'consent-form',
    name: 'Consent to Treatment',
    description: 'Standard consent form for therapy services including privacy policies and treatment agreements.',
    category: 'legal',
    schema_json: {
      title: 'Consent to Treatment',
      elements: [
        {
          type: 'html',
          name: 'consentText',
          html: '<h3>Consent to Treatment</h3><p>By signing below, you acknowledge that you have read and understood the treatment policies and agree to the terms of service.</p>'
        },
        {
          type: 'boolean',
          name: 'consentToTreatment',
          title: 'I consent to receive mental health treatment services',
          isRequired: true
        },
        {
          type: 'boolean',
          name: 'privacyAcknowledgment',
          title: 'I acknowledge that I have received and reviewed the Privacy Notice (HIPAA)',
          isRequired: true
        },
        {
          type: 'boolean',
          name: 'emergencyContact',
          title: 'I understand the emergency contact procedures',
          isRequired: true
        },
        {
          type: 'signaturepad',
          name: 'clientSignature',
          title: 'Client Signature',
          isRequired: true
        },
        {
          type: 'text',
          name: 'signatureDate',
          title: 'Date',
          inputType: 'date',
          defaultValueExpression: 'today()',
          isRequired: true
        }
      ]
    }
  }
];

export const templateCategories = [
  { id: 'intake', name: 'Intake Forms', description: 'Forms for new client onboarding' },
  { id: 'assessment', name: 'Assessments', description: 'Mental health and progress assessments' },
  { id: 'feedback', name: 'Feedback', description: 'Session and treatment feedback forms' },
  { id: 'legal', name: 'Legal', description: 'Consent forms and legal documentation' },
  { id: 'custom', name: 'Custom', description: 'Custom forms created by users' }
];