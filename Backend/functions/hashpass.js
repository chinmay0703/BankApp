import bcrypt from 'bcrypt';
const workFactor = 10;
export const hashPassword = async (password) => {
    console.log(password);
    try {
        const salt = await bcrypt.genSalt(workFactor);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw new Error("Hashing failed");
    }
};

