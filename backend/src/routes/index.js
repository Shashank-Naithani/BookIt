import { Router } from "express";
import sendSuccessResponse from "../shared/utils/sendSuccessResponse.js";

const router = Router();

router.get("/health", (req, res) => {
    return sendSuccessResponse(
        res,
        200,
        "SERVER_HEALTHY",
        "Server is running"
    );
});

export default router;