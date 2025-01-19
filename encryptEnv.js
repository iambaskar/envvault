const crypto = require("crypto");
const fs = require("fs");
const readline = require("readline");

const promptForKey = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Enter a 16-character secret key: ", (key) => {
      rl.close();
      resolve(key);
    });
  });
};

const encryptEnvFile = async (filePath) => {
  try {
    const secretKey = await promptForKey();

    if (secretKey.length !== 16) {
      throw new Error("The secret key must be exactly 16 characters long.");
    }

    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(secretKey), iv);

    const envContent = fs.readFileSync(filePath, "utf-8");

    let encrypted = cipher.update(envContent, "utf-8", "hex");
    encrypted += cipher.final("hex");

    const outputPath = `${filePath}.enc`;
    const encryptedData = `${iv.toString("hex")}:${encrypted}`;
    fs.writeFileSync(outputPath, encryptedData);

    console.log(`Encrypted file created at: ${outputPath}`);
  } catch (error) {
    console.error("Error encrypting the file:", error.message);
  }
};

module.exports = encryptEnvFile;
