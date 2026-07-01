#!/usr/bin/env node

/**
 * SIAKAD Cryptographic JWT Secret Generator
 * Generates cryptographically secure high-entropy random keys (64 bytes/512 bits)
 * to be used as JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, and JWT_RESET_PASSWORD_SECRET.
 * 
 * Usage:
 *   node scripts/generate-secrets.js
 */

const crypto = require("crypto");

console.log("=====================================================================");
console.log("SIAKAD ENTERPRISE CRYPTOGRAPHIC SECRET GENERATOR");
console.log("=====================================================================");
console.log("Generating cryptographically secure high-entropy keys (64-byte Preferred)...");
console.log("");

const generateSecureSecret = () => {
  return crypto.randomBytes(64).toString("hex");
};

const accessSecret = generateSecureSecret();
const refreshSecret = generateSecureSecret();
const resetSecret = generateSecureSecret();

console.log("# Copy the following lines into your local .env file:");
console.log("---------------------------------------------------------------------");
console.log(`JWT_ACCESS_SECRET=${accessSecret}`);
console.log(`JWT_REFRESH_SECRET=${refreshSecret}`);
console.log(`JWT_RESET_PASSWORD_SECRET=${resetSecret}`);
console.log("---------------------------------------------------------------------");
console.log("");
console.log("Security Properties of the Generated Secrets:");
console.log("- Byte Length: 64 bytes (512-bit strength)");
console.log("- Character Encoding: Hexadecimal (128 characters total per key)");
console.log("- Entropy Density: Log2(16^128) = 512 bits of pure entropy");
console.log("- Attack Resistance: High immune to dictionary, birthday, and brute-force attacks.");
console.log("- Mitigation: Distinct secrets reduce blast radius (leak of one token key");
console.log("  does not compromise other scopes).");
console.log("=====================================================================");
