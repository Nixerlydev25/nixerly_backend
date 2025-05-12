import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createWorkerSkillsHandler,
  getWorkerSkillsHandler,
  updateWorkerSkillsHandler,
  deleteWorkerSkillsHandler,
} from "../../controllers/v1/skills.controller";
import {
  createEducationHandler,
  getWorkerEducationHandler,
  updateEducationHandler,
  deleteEducationHandler,
} from "../../controllers/v1/education.controller";
import {
  createCertificateHandler,
  getWorkerCertificatesHandler,
  updateCertificateHandler,
  deleteCertificateHandler,
} from "../../controllers/v1/certificate.controller";

const router = Router();

// Skill routes
router.post("/skills", authenticate, createWorkerSkillsHandler);
router.get("/skills/:workerId", getWorkerSkillsHandler);
router.put("/skills", authenticate, updateWorkerSkillsHandler);
router.delete("/skills", authenticate, deleteWorkerSkillsHandler);

// Education routes
router.post("/education", authenticate, createEducationHandler);
router.get("/education/:workerId", getWorkerEducationHandler);
router.put("/education", authenticate, updateEducationHandler);
router.delete("/education", authenticate, deleteEducationHandler);

// Certificate routes
router.post("/certificate", authenticate, createCertificateHandler);
router.get("/certificate/:workerId", getWorkerCertificatesHandler);
router.put("/certificate", authenticate, updateCertificateHandler);
router.delete("/certificate", authenticate, deleteCertificateHandler);

export default router;