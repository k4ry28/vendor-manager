import { Router } from "express";
import { getAccountsByUser, getAccountInfoById, createAccount } from "../controllers/accounts.js";
import auth from "../middlewares/auth.js";
import jwt from 'jsonwebtoken';

const router = Router();

/*
  GET accounts by user_id.
  @param {int} user_id
*/
router.get("/user/:user_id", auth, async (req, res) => {
    // validate params
    if (!req.params.user_id) {
        res.status(400).json({ error: "user_id is required" });
        return;
    }
    
    const { user_id } = req.params;
    
    const accounts = await getAccountsByUser(user_id);

    if(accounts.error) {
        return res.status(400).json({error: accounts.error});
    }

    return res.status(200).json(accounts);
});

/* 
  Create new account.
  @param {int} user_id
  @body {string} type
  @body {string} firstName
  @body {string} lastName
  @body {string} profession
*/
router.post("/user/:user_id", auth, async (req, res) => {
    // validate params
    if (!req.params.user_id) {
        res.status(400).json({ error: "user_id is required" });
        return;
    }

    //validate body
    if (!req.body.type || !req.body.firstName || !req.body.lastName || !req.body.profession) {
        res.status(400).json({ error: "Missing type, firstName, lastName or profession" });
        return;
    }

    const { user_id } = req.params;
    const { type, firstName, lastName, profession } = req.body;

    const account = await createAccount(type, firstName, lastName, profession, user_id);

    if(account.error) {
        return res.status(400).json({error: account.error});
    }

    return res.status(200).json(account);

});

/*
  Get account by id.
  @param {int} account_id
*/
router.get("/id/:account_id", auth, async (req, res) => {
    // validate params
    if (!req.params.account_id) {
        res.status(400).json({ error: "account_id is required" });
        return;
    }

    const { account_id } = req.params;

    let token = req.headers.authorization?.split(' ')[1];
    let user = jwt.verify(token, process.env.JWT_SECRET);

    const account = await getAccountInfoById(account_id, user.id);

    if(account.error) {
        return res.status(400).json({error: account.error});
    }

    return res.status(200).json(account);
});

export default router;