import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import eventRoutes from "../modules/event/event.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);

export default router;
