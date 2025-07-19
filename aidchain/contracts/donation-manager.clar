;; Donation Manager Contract

;; Replace with actual deployed contract address
(define-constant aid-verifier-contract .aid-verifier)

(define-map donations { org: principal } { total: uint })

(define-public (donate (org principal))
    (begin
        ;; Verify the organization via aid-verifier contract
        (match (contract-call? aid-verifier-contract is-verified-org org)
            true
                (let (
                    (existing (default-to u0 (get total (map-get donations { org: org }))))
                    (new-total (+ existing (stx-get-transfer-amount)))
                )
                    (begin
                        (map-set donations { org: org } { total: new-total })
                        (ok true)
                    )
                )
            false (err u100) ;; Organization not verified
        )
    )
)

(define-public (withdraw (amount uint))
    (let (
        (entry (map-get donations { org: tx-sender }))
    )
        (match entry donation
            (let (
                (current-total (get total donation))
            )
                (if (>= current-total amount)
                    (begin
                        (map-set donations { org: tx-sender } { total: (- current-total amount) })
                        (stx-transfer? amount tx-sender tx-sender)
                    )
                    (err u101) ;; Not enough funds
                )
            )
            (err u102) ;; No record found
        )
    )
)

(define-read-only (get-donations (org principal))
    (match (map-get donations { org: org })
        donation (ok (get total donation))
        (err u103)
    )
)
