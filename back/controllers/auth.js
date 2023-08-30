import { User } from "../models/users.js";
import bcrypt from "bcrypt";


async function signUp(username, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username: username,
            password: passwordHash,
        });

        return newUser;
    } catch (error) {
        console.error(error);
        return { error: "Failed to create user" };
    }
} 


async function signIn(username, password) {
    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            return { error: "User not found" };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { error: "Invalid password" };
        }

        return user;        
    }
     catch (error) {
        console.error(error);
        return { error: "Failed to verify user" };
    }
}

export { signUp, signIn };
