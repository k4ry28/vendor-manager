import { Submission } from "../models/submissions.js";
import { Agreement } from "../models/agreement.js"; 
import { Account } from "../models/accounts.js";
import { Op } from 'sequelize';
import { db } from "../lib/orm.js";

/*
* Get all unpaid submissions for an account with active agreement (in_progress). 
*/
async function getUnpaidSubmissions(account_id) {
    try {
        const submissions = await Submission.findAll({
            where: {
                paid: false,
            },
            attributes: ["id", "description", "price", "paid"],
            include: [{
                model: Agreement,
                attributes: ["id", "terms", "status", "createdAt"],
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
                }
            }]
        });

        return submissions;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get submissions" };
    }
}


async function paySubmissionById(id) {
    const submission = await Submission.findOne({
        where: { id: id },
        attributes: ["id", "description", "price", "paid"],
        include: [{
            model: Agreement,
            attributes: ["id", "status"],
            include: [
                {
                    model: Account,
                    as: "Buyer",
                    attributes: ["id", "firstName", "lastName", "balance"]
                },
                {
                    model: Account,
                    as: "Supplier",
                    attributes: ["id", "firstName", "lastName", "balance"]
                },
            ]
        }]
    });
    

    if(submission.Agreement.Buyer.balance < submission.price) {
        return { error: "Insufficient balance" };
    } 

    let transaction;

    try {
        transaction = await db.transaction();

        await Submission.update({ paid: true, paymentDate: new Date() }, {
            where: { id: submission.id },
            transaction: transaction
        });

        await Account.update({ balance: submission.Agreement.Buyer.balance - submission.price }, {
            where: { id: submission.Agreement.Buyer.id },
            transaction: transaction
        });

        await Account.update({ balance: submission.Agreement.Supplier.balance + submission.price }, {
            where: { id: submission.Agreement.Supplier.id },
            transaction: transaction
        });

        await transaction.commit();

        return { message: "Submission paid" };
    }
     catch (error) {
        console.error(error);
        await transaction.rollback();
        return { error: "Failed to get submission" };
    }
}

export { getUnpaidSubmissions, paySubmissionById };