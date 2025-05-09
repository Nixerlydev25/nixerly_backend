import { z } from "zod";

export const AddSkillToWorkerSchema = z.object({
  workerId: z.string().uuid(),
  skillId: z.string().uuid(),
});

export const DeleteSkillFromWorkerSchema = AddSkillToWorkerSchema;

export const CreateCategorySchema = z.object({
  name: z.string().min(2),
});

export const DeleteCategorySchema = z.object({
  categoryId: z.string().uuid(),
});

export const UpdateCategorySkillsSchema = z.object({
  categoryId: z.string().uuid(),
  skillIds: z.array(z.string().uuid()),
});