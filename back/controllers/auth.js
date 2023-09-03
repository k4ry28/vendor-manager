import { User } from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

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
        const user = await User.findOne({ 
            where: { username: username },
        });

        const isPasswordValid = user === null? false : await bcrypt.compare(password, user.password);

        if (!user || !isPasswordValid) {
            return { error: "Invalid user or password" };
        }

        const userFortoken = {
            id: user.id,
            username: user.username,
            role: user.role
        }
        
        const token = jwt.sign(userFortoken, process.env.JWT_SECRET, { expiresIn: "12h" });

        return {user: userFortoken, token};        
    }
     catch (error) {
        console.error(error);
        return { error: "Failed to verify user" };
    }
}

export { signUp, signIn };
