;; AidChain Verifier Contract
;; Role-based verification system for aid organizations

(define-data-var admin principal tx-sender)

;; Verified organizations map
(define-map verified-organizations principal bool)

;; Error Constants
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-VERIFIED u101)
(define-constant ERR-NOT-FOUND u102)
(define-constant ERR-INVALID-ADDRESS u103)
(define-constant ERR-SAME-AS_CURRENT u104)

;; Ensure tx-sender is admin
(define-private (only-admin)
  (is-eq tx-sender (var-get admin)))

;; Add an organization to the verified list
(define-public (add-organization (org principal))
  (begin
    (asserts! (only-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-none (map-get? verified-organizations org)) (err ERR-ALREADY-VERIFIED))
    (asserts! (not (is-eq org 'SP000000000000000000002Q6VF78)) (err ERR-INVALID-ADDRESS))
    (map-set verified-organizations org true)
    (ok true)
  )
)

;; Remove an organization from the verified list
(define-public (remove-organization (org principal))
  (begin
    (asserts! (only-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-some (map-get? verified-organizations org)) (err ERR-NOT-FOUND))
    (map-delete verified-organizations org)
    (ok true)
  )
)

;; Read-only check: is the given principal verified?
(define-read-only (is-verified (org principal))
  (default-to false (map-get? verified-organizations org)))

;; Transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (only-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (not (is-eq new-admin 'SP000000000000000000002Q6VF78)) (err ERR-INVALID-ADDRESS))
    (asserts! (not (is-eq new-admin (var-get admin))) (err ERR-SAME-AS_CURRENT))
    (var-set admin new-admin)
    (ok true)
  )
)
