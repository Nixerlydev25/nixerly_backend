import { z } from "zod";
import { Role } from "@prisma/client";

export const updateUserRoleSchema = z.object({
  id: z.string().uuid(),
  role: z.nativeEnum(Role),
});
