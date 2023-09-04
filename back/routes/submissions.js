import { Router } from "express";
import { getUnpaidSubmissions, paySubmissionById } from "../controllers/submissions.js";
import auth from "../middlewares/auth.js";
import jwt from 'jsonwebtoken';

const router = Router();

/*
   Get all unpaid submissions with active agreement by account.
   @query {int} account_id 
*/
router.get("/unpaid", auth, async (req, res) => {
    // validate query params
    if (!req.query.account_id) {
        res.status(400).json({ error: "Missing account_id" });
        return;
    }

    const { account_id } = req.query;
    let token = req.headers.authorization?.split(' ')[1];
    let user = jwt.verify(token, process.env.JWT_SECRET);

    const submissions = await getUnpaidSubmissions(account_id, user.id);
    
    if (submissions.error) {
        return res.status(400).json({ error: submissions.error });
    }

    res.status(200).json(submissions);
});


/*
   Pay a submission by id.
   @param {int} submission_id
*/
router.post("/:submission_id/pay", auth, async (req, res) => {
    // validate params
    if (!req.params.submission_id) {
        res.status(400).json({ error: "Missing submission_id" });
        return;
    }

    const { submission_id } = req.params;
    let token = req.headers.authorization?.split(' ')[1];
    let user = jwt.verify(token, process.env.JWT_SECRET);

    const submission = await paySubmissionById(submission_id, user.id);

    if (submission.error) {
        return res.status(400).json({ error: submission.error });
    }

    res.status(200).json(submission);

});

export default router;