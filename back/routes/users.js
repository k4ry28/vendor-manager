import { Router } from "express";
import { updatePass } from "../controllers/users.js";

const router = Router();

/*
 * Get all users
 *
 * GET /users
 * 
 */
router.get("/", function (req, res, next) {
    
});

/*
 * Get a user
 *
 * GET /users/:id
 * 
 * @param id: int
 */
router.get("/:id", function (req, res, next) {
    
});

export default router;
