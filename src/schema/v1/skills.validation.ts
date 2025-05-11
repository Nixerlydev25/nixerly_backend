import { z } from "zod";
import { SkillName } from "@prisma/client";

export const createSkillsSchema = z.object({
  skills: z.array(z.nativeEnum(SkillName)).min(1),
});

export const updateSkillsSchema = z.object({
  skills: z.array(z.nativeEnum(SkillName)).min(1),
});

export const deleteSkillsSchema = z.object({
  skills: z.array(z.nativeEnum(SkillName)).min(1),
});