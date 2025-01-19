const crypto = require("crypto");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
// const read
const normalizeKey = (key) => {
    return crypto.createHash("sha256").update(key).digest();
};

const encryptEnvFile = (filePath, secretKey) => {
    try {
        const resolvedPath = path.resolve(filePath);

        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`File not found at path: ${resolvedPath}`);
        }

        const envContent = fs.readFileSync(resolvedPath, "utf-8");

        const key = normalizeKey(secretKey);

        const iv = crypto.randomBytes(16);

        // create cipher
        const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

        // encrypt content
        let encrypted = cipher.update(envContent, "utf8", "hex");
        encrypted += cipher.final("hex");

        // hash secretkey backup
        const keyHash = crypto.createHash("sha256").update(secretKey).digest("hex");

        // iv + encrypted content + hash key
        const encryptedData = `${iv.toString("hex")}:${encrypted}:${keyHash}`;

        // save 
        const encryptedFilePath = resolvedPath + ".enc";
        fs.writeFileSync(encryptedFilePath, encryptedData);

        console.log(`Encrypted file saved as: ${encryptedFilePath}`);
    } catch (error) {
        console.error("Error:", error.message);
    }
};

module.exports = encryptEnvFile;