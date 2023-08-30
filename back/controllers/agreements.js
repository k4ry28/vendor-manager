import { Agreement } from "../models/agreement.js";
import { Op } from "sequelize";

// Define the controller for the Agreement model

async function getAgreementsByAccount(account_id) {
    try {
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
