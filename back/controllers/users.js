import { User } from "../models/users.js"; 


// Define the controller for the User model
async function updatePass(password, user_id) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await User.update(
            {
                password: passwordHash
            },
            {
                where: {
                    id: user_id
                }
            }
        );

        return;
    } catch (error) {
        console.error(error);
        return { error: "Failed to update password" };
    }
}


export { updatePass };