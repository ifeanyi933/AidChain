import { describe, it, expect, beforeEach } from "vitest";

type Principal = string;

interface Donation {
  donor: Principal;
  hospital: string;
  date: string;
}

interface Result {
  value?: boolean;
  error?: number;
}

const mockVerifierContract = {
  verifiedOrganizations: new Set<Principal>(),

  isVerified(caller: Principal): boolean {
    return this.verifiedOrganizations.has(caller);
  },

  verifyOrganization(org: Principal) {
    this.verifiedOrganizations.add(org);
  },

  reset() {
    this.verifiedOrganizations.clear();
  }
};

const mockDonationManager = {
  donations: new Map<Principal, Donation[]>(),

  addDonation(caller: Principal, donor: Principal, hospital: string, date: string): Result {
    if (!mockVerifierContract.isVerified(caller)) return { error: 100 }; // Not verified org

    const record: Donation = { donor, hospital, date };
    if (!this.donations.has(caller)) {
      this.donations.set(caller, []);
    }
    this.donations.get(caller)!.push(record);
    return { value: true };
  },

  getDonationsByOrg(org: Principal): Donation[] {
    return this.donations.get(org) || [];
  },

  reset() {
    this.donations.clear();
  }
};

describe("Donation Manager Contract", () => {
  const ORG1 = "ST1ORG00000000000000000000000000000000000";
  const ORG2 = "ST2ORG00000000000000000000000000000000000";
  const DONOR1 = "ST1DONOR000000000000000000000000000000000";
  const DONOR2 = "ST2DONOR000000000000000000000000000000000";

  beforeEach(() => {
    mockVerifierContract.reset();
    mockDonationManager.reset();
  });

  it("should allow verified organization to add a donation", () => {
    mockVerifierContract.verifyOrganization(ORG1);
    const result = mockDonationManager.addDonation(ORG1, DONOR1, "General Hospital", "2025-07-18");

    expect(result).toEqual({ value: true });

    const donations = mockDonationManager.getDonationsByOrg(ORG1);
    expect(donations.length).toBe(1);
    expect(donations[0]).toEqual({
      donor: DONOR1,
      hospital: "General Hospital",
      date: "2025-07-18"
    });
  });

  it("should not allow unverified organization to add a donation", () => {
    const result = mockDonationManager.addDonation(ORG2, DONOR2, "Saint Mary", "2025-07-18");

    expect(result).toEqual({ error: 100 });
    const donations = mockDonationManager.getDonationsByOrg(ORG2);
    expect(donations.length).toBe(0);
  });

  it("should track multiple donations for an organization", () => {
    mockVerifierContract.verifyOrganization(ORG1);
    mockDonationManager.addDonation(ORG1, DONOR1, "General Hospital", "2025-07-18");
    mockDonationManager.addDonation(ORG1, DONOR2, "Mercy Hospital", "2025-07-19");

    const donations = mockDonationManager.getDonationsByOrg(ORG1);
    expect(donations.length).toBe(2);
    expect(donations[1].hospital).toBe("Mercy Hospital");
  });

  it("should isolate donations by organization", () => {
    mockVerifierContract.verifyOrganization(ORG1);
    mockVerifierContract.verifyOrganization(ORG2);

    mockDonationManager.addDonation(ORG1, DONOR1, "Hospital A", "2025-07-18");
    mockDonationManager.addDonation(ORG2, DONOR2, "Hospital B", "2025-07-19");

    const org1Donations = mockDonationManager.getDonationsByOrg(ORG1);
    const org2Donations = mockDonationManager.getDonationsByOrg(ORG2);

    expect(org1Donations.length).toBe(1);
    expect(org2Donations.length).toBe(1);
    expect(org1Donations[0].hospital).toBe("Hospital A");
    expect(org2Donations[0].hospital).toBe("Hospital B");
  });
});
