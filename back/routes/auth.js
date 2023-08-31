import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.js";

const router = Router();

/*
  POST Login
  
  @body {string} username
  @body {string} password
 */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }

    let token = await signIn(username, password);

    if (token.error) {
        return res.status(401).json({ error: token.error });
    }

    res.status(200).json({token: token});
});

/*
  POST Register a new user
  
  @body {string} username
  @body {string} password
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
