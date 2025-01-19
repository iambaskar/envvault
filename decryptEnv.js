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

const decryptEnvFile = async (encryptedFilePath) => {
    try {
      const secretKey = await promptForKey();
  
      if (secretKey.length !== 16) {
        throw new Error("The secret key must be exactly 16 characters long.");
      }
  
      const encryptedData = fs.readFileSync(encryptedFilePath, "utf-8");
  
      const [ivHex, encrypted] = encryptedData.split(":");
      const iv = Buffer.from(ivHex, "hex");
  
      const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(secretKey), iv);
  
      let decrypted = decipher.update(encrypted, "hex", "utf-8");
      decrypted += decipher.final("utf-8");
  
      const outputPath = ".env";
      fs.writeFileSync(outputPath, decrypted);
  
      console.log(`Decrypted file created at: ${outputPath}`);
    } catch (error) {
      console.error("Error decrypting the file:", error.message);
    }
  };
  

  
module.exports = decryptEnvFile;