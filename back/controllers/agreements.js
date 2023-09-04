import { Account } from "../models/accounts.js";
import { Agreement } from "../models/agreement.js";
import { verifyAccountUserById } from "./accounts.js";
import { Op } from "sequelize";

// Define the controller for the Agreement model

async function getAgreementsByAccount(account_id, user_id) {
    try {
        const account = await verifyAccountUserById(account_id, user_id);

        if(!account) {
            return { error: "Account not found" }
        }
        
        const agreements = await Agreement.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { SupplierId: account_id },
                            { BuyerId: account_id },
                        ],
                    },
                    { status: { [Op.in]: ["new", "in_progress"] } },
                ],
            },
            attributes: ["id", "terms", "status", "createdAt"],
            include: [
                {
                    model: Account,
                    attributes: ["id", "firstName", "lastName", "type"],
                    as: "Buyer",
                },
                {
                    model: Account,
                    attributes: ["id", "firstName", "lastName", "type"],
                    as: "Supplier",
                }
            ]
        });

        return agreements;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get agreements" };
    }
}

async function getAgreementById(account_id, id) {
    try {
        const agreement = await Agreement.findOne({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { SupplierId: account_id },
                            { BuyerId: account_id },
                        ],
                    },
                    { id: id },
                ],
            },
        });

        return agreement;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get agreement" };
    }
}

export { getAgreementsByAccount, getAgreementById };
