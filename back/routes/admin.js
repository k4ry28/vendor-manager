import { Router } from "express";
import { getTopSupplierProfession, getTopBuyers } from "../controllers/submissions.js";

const router = Router();


/*
  GET top supplier profession.
  @query {date} start
  @query {date} end 
*/
router.get("/best-supplier-profession", async (req, res) => {
    // validate query params
    if (!req.query.start || !req.query.end) {
        return res.status(400).json({ error: "Missing query start and end params" });
    }

    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);

    const topSupplierProfession = await getTopSupplierProfession(startDate, endDate);

    if (topSupplierProfession.error) {
        return res.status(400).json({ error: topSupplierProfession.error });
    }

    res.status(200).json(topSupplierProfession);
});


/*
  GET top buyers.
  @query {date} start
  @query {date} end
  @query {int} limit (deffault 3)
*/
router.get("/best-buyers", async (req, res) => {
    // validate query params
    if (!req.query.start || !req.query.end) {
        return res.status(400).json({ error: "Missing query start and end params" });
    }

    const limit = req.query.limit;
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);

    const topBuyers = await getTopBuyers(startDate, endDate, limit);

    if (topBuyers.error) {
        return res.status(400).json({ error: topBuyers.error });
    }

    res.status(200).json(topBuyers);
});

export default router;