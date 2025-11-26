import { DsqlSigner } from "@aws-sdk/dsql-signer";

export async function generateToken() {
  const signer = new DsqlSigner({
    hostname: process.env.DB_HOST!,
    expiresIn: 604800,
  });
  try {
    // Use `getDbConnectAuthToken` if you are _not_ logging in as the `admin` user
    const token = await signer.getDbConnectAdminAuthToken();
    console.log(token);
    return token;
  } catch (error) {
    console.error("Failed to generate token: ", error);
    throw error;
  }
}
