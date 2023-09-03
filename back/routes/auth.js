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

    let tokenData = await signIn(username, password);

    if (tokenData.error) {
        return res.status(401).json({ error: tokenData.error });
    }
    res.cookie('auth_service', tokenData.token)
    res.status(200).json(tokenData.user);
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
