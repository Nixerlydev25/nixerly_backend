import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";

export const createCertificate = async (userId: string, data: any) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    return await prisma.certificate.create({
      data: {
        ...data,
        workerId: workerProfile.id,
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getWorkerCertificates = async (workerId: string) => {
  try {
    return await prisma.certificate.findMany({
      where: { workerId },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const updateCertificate = async (userId: string, data: any) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    const certificate = await prisma.certificate.findUnique({
      where: { id: data.id },
    });
    if (!certificate || certificate.workerId !== workerProfile.id)
      throw new DatabaseError("Certificate not found");

    return await prisma.certificate.update({
      where: { id: data.id },
      data: { ...data },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const deleteCertificate = async (userId: string, id: string) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    const certificate = await prisma.certificate.findUnique({
      where: { id },
    });
    if (!certificate || certificate.workerId !== workerProfile.id)
      throw new DatabaseError("Certificate not found");

    return await prisma.certificate.delete({
      where: { id },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
