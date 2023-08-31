import { Router } from "express";
import { updatePass } from "../controllers/users.js";
import auth from "../middlewares/auth.js";

const router = Router();

/*
 * Get all users
 *
 * GET /users
 * 
 */
router.get("/", auth, function (req, res, next) {
    
});

/*
 * Get a user
 *
 * GET /users/:id
 * 
 * @param id: int
 */
router.get("/:id", auth, function (req, res, next) {
    
});

export default router;
