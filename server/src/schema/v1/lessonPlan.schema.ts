// topic: string;
// additionalInstructions: string;
// standards: string;
// outputLanguage: string;

import { z } from "zod";

export const LessonPlanSchema = z.object({
  topic: z.string({ required_error: "Topic is required" }),
  additionalInstructions: z.string({
    required_error: "Additional instructions are required",
  }),
  standards: z.string({ required_error: "Standards are required" }),
  outputLanguage: z.string().default("english"),
});

export const addFavoriteSchema = z.string({ required_error: "Lesson plan id is required" });

export const generateLessonPlanSchema = z.object({
  lessonOverview: z.object({
    title: z.string().describe("Name of the lesson"),
    subject: z.string().describe("Curriculum area and specific topic"),
    gradeLevel: z.string().describe("Target audience grade level or age group"),
    duration: z.string().describe("Estimated time for completion"),
    instructor: z.string().describe("Name of the lesson facilitator"),
  }),

  learningObjectives: z.array(
    z.object({
      objective: z.string().describe("The learning objective"),
      bloomsTaxonomyLevel: z.string().describe("Associated Bloom's Taxonomy level"),
      assessmentMethod: z.string().describe("How this objective will be assessed"),
    })
  ).describe("Clear, measurable goals using Bloom's Taxonomy verbs"),

  curriculumAlignment: z.object({
    standards: z.array(
      z.object({
        code: z.string().describe("Standard reference code"),
        description: z.string().describe("Full text of the standard"),
        category: z.string().describe("Category or domain of the standard"),
      })
    ).describe("Referenced educational standards").optional(),
    competencies: z.array(
      z.object({
        area: z.string().describe("Competency area"),
        description: z.string().describe("Detailed description of the competency"),
        indicators: z.array(z.string()).describe("Observable indicators of competency"),
      })
    ).describe("Specific curriculum competencies addressed").optional(),
  }).optional(),

  materialsAndResources: z.array(
    z.object({
      type: z.string().describe("Type of resource (textbook, handout, technology, etc)"),
      name: z.string().describe("Name/description of the resource"),
      quantity: z.string().describe("Amount needed if applicable").optional(),
      preparation: z.string().describe("Required preparation steps").optional(),
      alternativeOptions: z.array(z.string()).describe("Alternative resources that could be used").optional(),
      links: z.array(
        z.object({
          url: z.string(),
          description: z.string(),
        })
      ).describe("Related online resources").optional(),
    })
  ).optional(),

  prerequisiteKnowledge: z.object({
    concepts: z.array(
      z.object({
        topic: z.string().describe("Main prerequisite topic"),
        details: z.array(z.string()).describe("Specific knowledge points within the topic").optional(),
        importance: z.string().describe("Why this prerequisite is important").optional(),
        reviewStrategy: z.string().describe("How to quickly review this prerequisite").optional(),
      })
    ).optional(),
    skills: z.array(
      z.object({
        skill: z.string().describe("Required skill"),
        proficiencyLevel: z.string().describe("Expected level of proficiency").optional(),
        practiceActivities: z.array(z.string()).describe("Quick practice activities").optional(),
      })
    ).optional(),
    priorLessons: z.array(
      z.object({
        lessonTitle: z.string().describe("Title of related prior lesson"),
        keyPoints: z.array(z.string()).describe("Important points to remember").optional(),
      })
    ).optional(),
  }).describe("Detailed breakdown of required prior knowledge and skills").optional(),

  lessonStructure: z.object({
    introduction: z.object({
      hook: z.object({
        activity: z.string().describe("Attention-grabbing opening activity"),
        duration: z.string().describe("Time allocated for hook").optional(),
        materials: z.array(z.string()).describe("Materials needed for hook").optional(),
      }),
      priorKnowledgeConnection: z.object({
        connections: z.array(z.string()).describe("Specific connections to previous learning").optional(),
        activationStrategy: z.string().describe("How to activate prior knowledge").optional(),
      }).optional(),
    }),

    instruction: z.object({
      teachingMethods: z.array(
        z.object({
          method: z.string().describe("Teaching method name"),
          description: z.string().describe("How to implement this method"),
          duration: z.string().describe("Time allocated for this method").optional(),
        })
      ).optional(),
      keyPoints: z.array(
        z.object({
          concept: z.string().describe("Main concept"),
          details: z.array(z.string()).describe("Supporting details").optional(),
          examples: z.array(z.string()).describe("Illustrative examples").optional(),
        })
      ),
    }),

    guidedPractice: z.array(
      z.object({
        activity: z.string().describe("Collaborative learning activity"),
        duration: z.string().describe("Time allocated for this activity").optional(),
        grouping: z.string().describe("How students should be grouped").optional(),
        instructions: z.array(z.string()).describe("Step-by-step instructions").optional(),
        materials: z.array(z.string()).describe("Required materials").optional(),
        checkpoints: z.array(z.string()).describe("Points to check understanding").optional(),
      })
    ).optional(),

    independentPractice: z.array(
      z.object({
        activity: z.string().describe("Individual student activity"),
        instructions: z.array(z.string()).describe("Detailed step-by-step instructions").optional(),
        duration: z.string().describe("Expected time for completion").optional(),
        deliverables: z.array(z.string()).describe("Expected outputs").optional(),
        successCriteria: z.array(z.string()).describe("What success looks like").optional(),
      })
    ).optional(),

    assessment: z.object({
      formative: z.array(
        z.object({
          method: z.string().describe("Assessment method"),
          timing: z.string().describe("When to implement").optional(),
          questions: z.array(z.string()).describe("Specific check questions").optional(),
        })
      ).optional(),
      summative: z.array(
        z.object({
          method: z.string().describe("Assessment method"),
          description: z.string().describe("Detailed description").optional(),
          criteria: z.array(z.string()).describe("Success criteria").optional(),
        })
      ).optional(),
    }).optional(),

    closure: z.object({
      summary: z.object({
        keyPoints: z.array(z.string()).describe("Main points to recap"),
        method: z.string().describe("How to conduct the summary").optional(),
      }),
      reflection: z.array(
        z.object({
          question: z.string().describe("Reflection question"),
          purpose: z.string().describe("Why this question is important").optional(),
          followUp: z.array(z.string()).describe("Follow-up questions").optional(),
        })
      ).optional(),
    }).optional(),
  }),

  differentiation: z.object({
    advancedLearners: z.array(
      z.object({
        strategy: z.string().describe("Extension strategy"),
        activities: z.array(z.string()).describe("Specific activities").optional(),
        resources: z.array(z.string()).describe("Additional resources needed").optional(),
      })
    ).optional(),
    strugglingLearners: z.array(
      z.object({
        support: z.string().describe("Support strategy"),
        scaffolding: z.array(z.string()).describe("Scaffolding techniques").optional(),
        resources: z.array(z.string()).describe("Support resources").optional(),
      })
    ).optional(),
    accommodations: z.array(
      z.object({
        type: z.string().describe("Type of accommodation"),
        description: z.string().describe("Detailed description").optional(),
        implementation: z.array(z.string()).describe("How to implement").optional(),
      })
    ).optional(),
  }).optional(),

  assessment: z.object({
    criteria: z.array(
      z.object({
        criterion: z.string().describe("Assessment criterion"),
        weight: z.number().describe("Relative importance").optional(),
        indicators: z.array(z.string()).describe("Success indicators").optional(),
      })
    ).optional(),
    rubric: z.array(
      z.object({
        criterion: z.string(),
        levels: z.array(
          z.object({
            score: z.number(),
            description: z.string(),
            examples: z.array(z.string()).describe("Examples of this level").optional(),
          })
        ).optional(),
      })
    ).optional(),
    feedbackMethod: z.object({
      type: z.string().describe("Type of feedback"),
      timing: z.string().describe("When feedback will be provided").optional(),
      format: z.string().describe("How feedback will be delivered").optional(),
      followUp: z.string().describe("Follow-up actions").optional(),
    }).optional(),
  }).optional(),

  reflection: z.object({
    strengths: z.array(
      z.object({
        aspect: z.string().describe("What worked well"),
        evidence: z.array(z.string()).describe("Evidence of success").optional(),
        replication: z.string().describe("How to replicate this success").optional(),
      })
    ).optional(),
    improvements: z.array(
      z.object({
        area: z.string().describe("Area for improvement"),
        strategy: z.string().describe("How to improve").optional(),
        resources: z.array(z.string()).describe("Resources needed for improvement").optional(),
      })
    ).optional(),
    notes: z.string().describe("Additional teaching notes").optional(),
  }).optional(),

  homework: z.object({
    assignment: z.object({
      task: z.string().describe("Homework task"),
      purpose: z.string().describe("Learning purpose").optional(),
      instructions: z.array(z.string()).describe("Detailed instructions").optional(),
    }),
    dueDate: z.string().describe("When the assignment is due").optional(),
    resources: z.array(
      z.object({
        name: z.string().describe("Resource name"),
        type: z.string().describe("Type of resource").optional(),
        access: z.string().describe("How to access the resource").optional(),
      })
    ).optional(),
  }).optional(),
});