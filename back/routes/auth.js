import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.js";

const router = Router();

/*
 * Login
 *
 * POST /auth/signin
 * 
 * @body username: string
 * @body password: string
 */
router.post("/signin", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }

    let user = signIn(username, password);

    if (user.error) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    res.status(200).json({ message: "User logged successfully" });
});

/*
 * Register a new user
 *
 * POST /auth/signup
 * 
 * @body username: string
 * @body password: string
 */
router.post("/signup", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }

    let user = signUp(username, password);

    if (user.error) {
        return res.status(400).json({ error: user.error });
    }

    res.status(201).json({ message: "User created successfully" });

});

export default router;
