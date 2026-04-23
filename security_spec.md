# Security Specification - CertiChain

## 1. Data Invariants
- A certificate must have a valid ID matching the document ID.
- The `institutionId` in a certificate must match the `uid` of the authenticated institution that issued it.
- `stellarTxHash` must be a valid transaction hash string.
- `issueDate` must be the server time of creation.
- Once issued, a certificate's `id`, `institutionId`, and `stellarTxHash` are immutable.

## 2. The Dirty Dozen Payloads
1. **Unauthenticated Write**: Attempt to create a certificate without logging in. (DENIED)
2. **Identity Spoofing**: Attempt to issue a certificate with someone else's `institutionId`. (DENIED)
3. **ID Poisoning**: Attempt to use a 1MB string as a certificate ID. (DENIED)
4. **PII Leak**: Attempt to read institution private data as an unauthenticated user. (DENIED)
5. **State Shortcutting**: Attempt to change a certificate status to 'revoked' by a non-owner. (DENIED)
6. **Immutable field update**: Attempt to change the `stellarTxHash` of an existing certificate. (DENIED)
7. **Bypassing validation**: Attempt to create a certificate with missing fields. (DENIED)
8. **Malicious type injection**: Sending a boolean where a string is expected. (DENIED)
9. **Creation time spoofing**: Providing a manual `issueDate` instead of server timestamp. (DENIED)
10. **Query scraping**: Attempting to list all certificates without any filtering (if listing is enabled). (DENIED)
11. **Admin privilege escalation**: Attempting to set `isAdmin` or similar role field. (DENIED)
12. **Foreign key orphan**: Creating a certificate for a non-existent institution. (DENIED)
