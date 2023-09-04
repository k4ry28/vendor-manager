import { Account } from "../models/accounts.js";
import { Submission } from "../models/submissions.js";
import { Agreement } from "../models/agreement.js";
import { getUnpaidSubmissions } from "./submissions.js";
import { Op } from "sequelize";


async function getAccountsByUser(user_id) {
    try {
        const accounts = await Account.findAll({
            where: {
                UserId: user_id
            },
            attributes: ["id", "firstName", "lastName", "balance", "type"]        
        });

        return accounts;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get accounts" }
    }
}

async function verifyAccountUserById(account_id, user_id) {
    try {
        const account = await Account.findOne({
            where: {                
                [Op.and]: [
                    { UserId: user_id },
                    { id: account_id },
                ],
            },
            attributes: ["id", "firstName", "lastName", "balance", "type"]
        });

        return account;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getAccountInfoById(account_id, user_id) {
    try {
        const account = await verifyAccountUserById(account_id, user_id);

        if(!account) {
            return { error: "Account not found" }
        }
        
        const unpaid_submissions = await getUnpaidSubmissions(account_id, user_id);

        if(unpaid_submissions.error) {
            return { error: "Account not found" }
        }

        let unpaid = 0
        unpaid_submissions.forEach(submission => {
            let price = submission.dataValues.price;
            unpaid += price;
        });

        return { account, unpaid_submissions: unpaid };
    } catch (error) {
        console.error(error);
        return { error: "Failed to get account" }
    }
}


async function depositInAccount(account_id, amount, user_id) {
    try {        
        const unpaidSubmissions = await getUnpaidSubmissions(account_id, user_id);

        if(unpaidSubmissions.error) {
            return { error: "Account not found" }
        }

        let amountToPay = 0;

        unpaidSubmissions.forEach(submission => {
            amountToPay += submission.price;
        });

        if(amount > Number(amountToPay * 1.10)) {
            return { error: "You can't deposit more than 10% of the unpaid submissions" }
        }

        const account = await Account.findByPk(account_id);

        account.balance += amount;

        await account.save();

        return account.balance;
    } catch (error) {
        console.error(error);
        return { error: "Failed to deposit" }
    }
}

export { getAccountsByUser, getAccountInfoById, depositInAccount, verifyAccountUserById };