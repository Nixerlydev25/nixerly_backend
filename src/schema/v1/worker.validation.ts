import { z } from "zod";

export const getWorkerDetailsSchema =  z.string().uuid({ message: "Invalid worker ID format" })