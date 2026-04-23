import { 
  Networks, 
  TransactionBuilder, 
  Keypair, 
  Operation, 
  Asset, 
  Memo,
  Horizon
} from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

/**
 * For a production app, we would use a browser wallet like Freighter.
 * For this demo, we'll demonstrate the concept.
 */

export async function verifyOnStellar(txHash: string) {
  try {
    const tx = await server.transactions().transaction(txHash).call();
    return {
      valid: true,
      data: tx,
      memo: tx.memo
    };
  } catch (error) {
    console.error("Stellar verification failed", error);
    return { valid: false, error };
  }
}

/**
 * In a real app, this would be handled by the user's wallet.
 * Here we provide a mock hash for the "issuance" demonstration if no wallet is connected.
 */
export function generateCertificateId() {
  return 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export async function issueCertificateOnStellar(certificateData: any) {
  // Mocking the issuance transaction hash for demonstration if real keys aren't provided
  // In a real environment, you'd use Freighter to sign this.
  console.log("Issuing certificate on Stellar with data:", certificateData);
  
  // Real implementation would look like:
  /*
  const sourceKeypair = Keypair.fromSecret(INSTITUTION_SECRET);
  const account = await server.loadAccount(sourceKeypair.publicKey());
  const transaction = new TransactionBuilder(account, { fee: '100', networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.payment({
      destination: sourceKeypair.publicKey(), // Send to self
      asset: Asset.native(),
      amount: '0.00001'
    }))
    .addMemo(Memo.text(certificateData.id))
    .setTimeout(30)
    .build();
  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
  */
  
  // Returning a stable demo hash
  return 'e81a3d3c7b6f2b6e8a4d5c9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
}
