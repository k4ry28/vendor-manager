import { Router } from "express";
import { updatePass } from "../controllers/users.js";
import auth from "../middlewares/auth.js";

const router = Router();

/*
  Change user Password
   
  @query {int} userId
  @body {string} newPassword
*/
router.get("/change-password", auth, async (req, res, next) => {
    // validate params
    if (!req.query.userId || !req.body.newPassword) {
        return res.status(400).json({
            message: "Password and user id are required",
        });
    } 

    const { userId } = req.query;
    const { newPassword } = req.body;

    const update = await updatePass(userId, newPassword);

    if(update.error) {
        return res.status(400).json({
            message: update.error,
        });
    }
    return res.status(200).json({
        message: "Password updated successfully",
    });
});


export default router;
