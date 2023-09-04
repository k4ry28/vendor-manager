import { Router } from "express";
import { depositInAccount } from "../controllers/accounts.js";
import auth from "../middlewares/auth.js";
import jwt from 'jsonwebtoken';

const router = Router();


/*
  POST deposit in account.
  @param {int} account_id 
  @body {float} amount
*/
router.post("/deposit/:accountId", auth, async (req, res) => {
    // validate body and params
    if (!req.params.accountId) {
        return res.status(400).json({ error: "Missing account_id" });
    }
    if (!req.body.amount) {        
        return res.status(400).json({ error: "Missing amount" });;
    }

    const { amount } = req.body;
    const { accountId } = req.params;
    let token = req.headers.authorization?.split(' ')[1];
    let user = jwt.verify(token, process.env.JWT_SECRET);

    const deposit = await depositInAccount(accountId, Number(amount), user.id);

    if (deposit.error) {
        return res.status(400).json({ error: deposit.error });
    }

    res.status(200).json({ message: "Deposit in account successful", newBalance: deposit});

});


export default router;