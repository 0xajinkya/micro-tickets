import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

export class Password {
	static async toHash(password: string) {
		const scryptAsync = promisify(scrypt);

		const salt = randomBytes(8).toString("hex");
		const buf = (await scryptAsync(password, salt, 64)) as Buffer;
		return `${buf.toString("hex")}.${salt}`;
	}

	static async compare(storedPassword: string, suppliedPassword: string) {
		const scryptAsync = promisify(scrypt);

		console.log(storedPassword.split(".").length);
		const [hashedPassword, salt] = storedPassword.split(".");
		const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

		return buf.toString("hex") === hashedPassword;
	}
}
