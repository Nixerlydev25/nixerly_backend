import { z } from "zod";
import { Roles } from "@prisma/client";

export const updateUserRoleSchema = z.object({
  id: z.string().uuid(),
  role: z.nativeEnum(Roles),
});
