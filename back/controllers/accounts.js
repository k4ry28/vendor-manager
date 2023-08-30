import { Account } from "../models/accounts.js";
import { getUnpaidSubmissions } from "./submissions.js";


async function getAccountsByUser(user_id) {
    try {
        const accounts = await Account.findAll({
            where: {
                UserId: user_id
            }
        });

        return accounts;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get accounts" }
    }
}


async function getAccountById(account_id) {
    try {
        const account = await Account.findByPk(account_id);

        return account;
    } catch (error) {
        console.error(error);
        return { error: "Failed to get account" }
    }
}


async function depositInAccount(account_id, amount) {
    try {
        const unpaidSubmissions = await getUnpaidSubmissions(account_id);
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

export { getAccountsByUser, getAccountById, depositInAccount };