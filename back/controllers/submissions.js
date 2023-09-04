import { Submission } from "../models/submissions.js";
import { Agreement } from "../models/agreement.js";
import { Account } from "../models/accounts.js";
import { verifyAccountUserById } from "./accounts.js";
import { Op, fn, col, literal } from "sequelize";
import { db } from "../lib/orm.js";

/*
 * Get all unpaid submissions for an account with active agreement (in_progress).
 */
async function getUnpaidSubmissions(account_id, user_id) {
    try {
        const account = await verifyAccountUserById(account_id, user_id);

        if(!account) {
            return { error: "Account not found" }
        }
        
        const submissions = await Submission.findAll({
            where: {
                paid: false,
            },
            attributes: ["id", "description", "createdAt", "price", "paid"],
            include: [
                {
                    model: Agreement,
                    attributes: ["id", "terms", "status"],
                    where: {
                        [Op.and]: [
                            {
                                [Op.or]: [
                                    { SupplierId: account_id },
                                    { BuyerId: account_id },
                                ],
                            },
                            { status: "in_progress" },
                        ],
                    },
                    include: [
                        {
                            model: Account,
                            as: "Buyer",
                            attributes: ["id", "firstName", "lastName"],
                        },
                        {
                            model: Account,
                            as: "Supplier",
                            attributes: ["id", "firstName", "lastName"],
                        }
                    ]
                },                
            ],
        });

        return submissions;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get submissions" };
    }
}

/*
 * Pay a submission by id
 */
async function paySubmissionById(id, user_id) {
    const submission = await Submission.findOne({
        where: { id: id },
        attributes: ["id", "description", "price", "paid"],
        include: [
            {
                model: Agreement,
                attributes: ["id", "status"],
                include: [
                    {
                        model: Account,
                        as: "Buyer",
                        attributes: ["id", "firstName", "lastName", "balance"],
                    },
                    {
                        model: Account,
                        as: "Supplier",
                        attributes: ["id", "firstName", "lastName", "balance"],
                    },
                ],
            },
        ],
    });

    if (!submission) {
        return { error: "Submission not found" };
    }

    if (submission.Agreement.Buyer.id !== user_id) {
        return { error: "Unauthorized" };
    }

    if (submission.Agreement.Buyer.balance < submission.price) {
        return { error: "Insufficient balance" };
    }

    let transaction;

    try {
        transaction = await db.transaction();

        await Submission.update(
            { paid: true, paymentDate: new Date() },
            {
                where: { id: submission.id },
                transaction: transaction,
            }
        );

        await Account.update(
            { balance: submission.Agreement.Buyer.balance - submission.price },
            {
                where: { id: submission.Agreement.Buyer.id },
                transaction: transaction,
            }
        );

        await Account.update(
            {
                balance:
                    submission.Agreement.Supplier.balance + submission.price,
            },
            {
                where: { id: submission.Agreement.Supplier.id },
                transaction: transaction,
            }
        );

        await transaction.commit();

        return { message: "Submission paid" };
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return { error: "Failed to get submission" };
    }
}

async function getTopSupplierProfession(startDate, endDate) {
    try {
        const supplier = await Submission.findAll({
            include: [
                {
                    model: Agreement,
                    attributes: [],
                    include: [
                        {
                            model: Account,
                            as: "Supplier",
                            attributes: ["profession"],
                        },
                    ],
                },
            ],
            where: {
                paid: true,
                paymentDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                },
            },
            attributes: [
                [fn("SUM", col("price")), "totalEarnings"],
                [col("Agreement.Supplier.profession"), "supplierProfession"],
            ],
            group: [col("Agreement.Supplier.profession")],
            order: [[fn("SUM", col("price")), "DESC"]],
            limit: 1,
        });

        return supplier;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get top supplier profession" };
    }
}

async function getTopBuyers(startDate, endDate, limit = 3) {
    try {
        const buyers = await Submission.findAll({
            include: [
                {
                    model: Agreement,
                    attributes: [],
                    include: [
                        {
                            model: Account,
                            as: "Buyer",
                            attributes: [
                                "id",
                                "firstName",
                                "lastName",
                                "profession",
                            ],
                        },
                    ],
                },
            ],
            where: {
                paid: true,
                paymentDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                },
            },
            attributes: [
                [fn("SUM", col("price")), "totalPaid"],
                [col("Agreement.Buyer.id"), "buyerId"],
                [col("Agreement.Buyer.firstName"), "buyerFirstName"],
                [col("Agreement.Buyer.lastName"), "buyerLastName"],
                [col("Agreement.Buyer.profession"), "buyerProfession"],
            ],
            group: [col("Agreement.Buyer.id")],
            order: [[fn("SUM", col("price")), "DESC"]],
            limit: limit,
        });

        return buyers;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get top buyers" };
    }
}

/*
query top supplier profession: 
    SELECT SUM(s.price) AS 'totalEarnings', a2.profession 
    FROM Submissions s 
    INNER JOIN Agreements a ON s.AgreementId = a.id 
    INNER JOIN Accounts a2 ON a.SupplierId = a2.id 
    WHERE 
        s.paid = TRUE 
        AND s.paymentDate BETWEEN DATE(<startDate>) AND DATE(<endDate>)
    GROUP BY a2.profession
    ORDER BY totalEarnings DESC; 
*/

export {
    getUnpaidSubmissions,
    paySubmissionById,
    getTopSupplierProfession,
    getTopBuyers,
};
