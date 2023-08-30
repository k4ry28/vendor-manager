import { Router } from "express";
import { depositInAccount } from "../controllers/accounts.js";

const router = Router();


/*
  POST deposit in account.
  @param {int} account_id 
  @body {float} amount
*/
router.post("/deposit/:accountId", async (req, res) => {
    // validate body and params
    if (!req.params.accountId) {
        return res.status(400).json({ error: "Missing account_id" });
    }
    if (!req.body.amount) {        
        return res.status(400).json({ error: "Missing amount" });;
    }

    const { amount } = req.body;
    const { accountId } = req.params;

    const deposit = await depositInAccount(accountId, amount);

    if (deposit.error) {
        return res.status(400).json({ error: deposit.error });
    }

    res.status(200).json({ message: "Deposit in account successful", newBalance: deposit});

});


export default router;