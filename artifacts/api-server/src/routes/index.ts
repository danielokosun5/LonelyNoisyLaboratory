import { Router, type IRouter } from "express";
import healthRouter from "./health";
import infrastructureRouter from "./infrastructure";

const router: IRouter = Router();

router.use(healthRouter);
router.use(infrastructureRouter);

export default router;
