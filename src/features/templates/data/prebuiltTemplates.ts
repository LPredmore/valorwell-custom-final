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
  },
  {
    id: 'treatment-plan',
    name: 'Treatment Plan',
    description: 'Comprehensive treatment plan template with goals, objectives, diagnoses, and risk assessment.',
    category: 'treatment',
    schema_json: {
      "title": "Treatment Plan Template",
      "description": "Complete all required sections. Fields marked with * are mandatory.",
      "logoPosition": "right",
      "showProgressBar": "top",
      "progressBarType": "pages",
      "widthMode": "responsive",
      "completedHtml": "<h3>Thank you. The Treatment Plan has been submitted.</h3>",
      "pages": [
        {
          "name": "clientInfo",
          "title": "1 · Client & Provider Information",
          "elements": [
            {
              "type": "panel",
              "name": "clientPanel",
              "title": "Client Details",
              "elements": [
                { "type": "text", "name": "clientFullName", "title": "Full Name *", "isRequired": true },
                { "type": "text", "name": "clientDOB", "title": "Date of Birth *", "inputType": "date", "isRequired": true },
                { "type": "dropdown", "name": "clientGender", "title": "Gender Identity", "choices": ["Female", "Male", "Non-binary", "Other", "Prefer not to say"] }
              ]
            },
            {
              "type": "panel",
              "name": "providerPanel",
              "title": "Provider Details",
              "elements": [
                { "type": "text", "name": "therapistName", "title": "Treating Clinician *", "isRequired": true },
                { "type": "text", "name": "therapistCredentials", "title": "Credentials / License #" },
                { "type": "text", "name": "planDate", "title": "Plan Creation Date *", "inputType": "date", "isRequired": true }
              ]
            }
          ]
        },
        {
          "name": "diagnosis",
          "title": "2 · Presenting Problems & Diagnoses",
          "elements": [
            {
              "type": "matrixdynamic",
              "name": "diagnosisTable",
              "title": "Primary & Secondary Diagnoses (add rows as needed)",
              "addRowText": "Add Diagnosis",
              "removeRowText": "Remove",
              "minRowCount": 1,
              "columns": [
                { "name": "icd10", "title": "ICD-10 Code *", "cellType": "text", "isRequired": true },
                { "name": "description", "title": "Description *", "cellType": "text", "isRequired": true },
                { "name": "dxType", "title": "Type", "cellType": "dropdown", "choices": ["Primary", "Secondary", "Rule-Out"], "isRequired": true }
              ]
            },
            {
              "type": "matrixdynamic",
              "name": "problemList",
              "title": "Target Problems / Symptoms",
              "addRowText": "Add Problem",
              "removeRowText": "Remove",
              "minRowCount": 1,
              "columns": [
                { "name": "problem", "title": "Problem / Symptom *", "cellType": "text", "isRequired": true },
                { "name": "severity", "title": "Severity *", "cellType": "dropdown", "choices": ["Mild", "Moderate", "Severe"], "isRequired": true },
                { "name": "functionalImpairment", "title": "Functional Impairment?", "cellType": "checkbox", "choices": ["Work", "School", "Social", "Family"] }
              ]
            }
          ]
        },
        {
          "name": "goals",
          "title": "3 · Goals, Objectives & Interventions",
          "elements": [
            {
              "type": "paneldynamic",
              "name": "goalPanel",
              "title": "Treatment Goals",
              "templateTitle": "Goal #{panelIndex}",
              "panelAddText": "Add Another Goal",
              "panelRemoveText": "Remove Goal",
              "minPanelCount": 1,
              "templateElements": [
                { "type": "text", "name": "goalStatement", "title": "Goal Statement *", "isRequired": true, "placeholder": "e.g., Reduce depressive symptoms" },
                { "type": "comment", "name": "goalRationale", "title": "Clinical Rationale", "placeholder": "Explain why this goal is clinically indicated" },
                {
                  "type": "paneldynamic",
                  "name": "objectivePanel",
                  "title": "Objectives",
                  "templateTitle": "Objective #{panelIndex}",
                  "panelAddText": "Add Objective",
                  "templateElements": [
                    { "type": "text", "name": "objectiveStatement", "title": "Objective *", "isRequired": true, "placeholder": "e.g., Client will identify three coping skills..." },
                    { "type": "dropdown", "name": "targetDate", "title": "Expected Completion (Months)", "choices": [{ "value": 1, "text": "1 mo" }, { "value": 3, "text": "3 mo" }, { "value": 6, "text": "6 mo" }, { "value": 12, "text": "12 mo" }] },
                    { "type": "checkbox", "name": "objectiveProgress", "title": "Progress Indicators (check all that apply)", "choices": ["Initiated", "In Progress", "Completed", "No Progress"], "showOtherItem": true },
                    {
                      "type": "matrixdynamic",
                      "name": "interventionTable",
                      "title": "Planned Interventions",
                      "addRowText": "Add Intervention",
                      "minRowCount": 1,
                      "columns": [
                        { "name": "interventionType", "title": "Modality *", "cellType": "dropdown", "isRequired": true, "choices": ["CBT", "DBT", "EMDR", "Psychoeducation", "Medication", "Family Therapy", "Other"] },
                        { "name": "frequency", "title": "Frequency", "cellType": "dropdown", "choices": ["Weekly", "Biweekly", "Monthly", "PRN"] },
                        { "name": "provider", "title": "Assigned Provider", "cellType": "text" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "riskPrognosis",
          "title": "4 · Risk, Prognosis & Discharge",
          "elements": [
            { "type": "radiogroup", "name": "suicideRisk", "title": "Current Suicide / Self-Harm Risk *", "isRequired": true, "choices": ["None", "Low", "Moderate", "High"] },
            { "type": "comment", "name": "riskMitigation", "title": "Risk Mitigation Plan", "visibleIf": "{suicideRisk} = 'Moderate' or {suicideRisk} = 'High'", "placeholder": "Detail safety plan, monitoring procedures, crisis contacts" },
            { "type": "rating", "name": "prognosis", "title": "Overall Prognosis", "rateMin": 1, "rateMax": 5, "minRateDescription": "Poor", "maxRateDescription": "Excellent" },
            { "type": "text", "name": "projectedDischarge", "title": "Projected Discharge Date", "inputType": "date" }
          ]
        },
        {
          "name": "reviewSchedule",
          "title": "5 · Review Schedule",
          "elements": [
            { "type": "radiogroup", "name": "reviewInterval", "title": "Plan Review Frequency *", "isRequired": true, "choices": ["30 days", "60 days", "90 days", "Other"] },
            { "type": "text", "name": "reviewIntervalOther", "title": "Specify Other Review Interval", "visibleIf": "{reviewInterval} = 'Other'" }
          ]
        },
        {
          "name": "signatures",
          "title": "6 · Signatures & Consent",
          "elements": [
            { "type": "signaturepad", "name": "clientSignature", "title": "Client / Guardian Signature" },
            { "type": "signaturepad", "name": "therapistSignature", "title": "Treating Clinician Signature *", "isRequired": true },
            { "type": "text", "name": "signatureDate", "title": "Date Signed *", "inputType": "date", "isRequired": true }
          ]
        }
      ],
      "triggers": [{ "type": "complete", "expression": "{goalPanel.length} < 1" }],
      "showQuestionNumbers": "off",
      "requiredText": "*",
      "showPreviewBeforeComplete": "showAnsweredQuestions"
    }
  }
];

export const templateCategories = [
  { id: 'intake', name: 'Intake Forms', description: 'Forms for new client onboarding' },
  { id: 'assessment', name: 'Assessments', description: 'Mental health and progress assessments' },
  { id: 'feedback', name: 'Feedback', description: 'Session and treatment feedback forms' },
  { id: 'legal', name: 'Legal', description: 'Consent forms and legal documentation' },
  { id: 'treatment', name: 'Treatment Plans', description: 'Comprehensive treatment planning forms' },
  { id: 'custom', name: 'Custom', description: 'Custom forms created by users' }
];