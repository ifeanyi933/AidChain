import { describe, it, expect, beforeEach } from "vitest";

type Principal = string;

interface Result {
  value?: boolean;
  error?: number;
}

const mockContract = {
  admin: "ST1ADMIN000000000000000000000000000000000",
  verifiedOrganizations: new Map<Principal, boolean>(),

  isAdmin(caller: Principal): boolean {
    return caller === this.admin;
  },

  addOrganization(caller: Principal, org: Principal): Result {
    if (!this.isAdmin(caller)) return { error: 100 };
    if (this.verifiedOrganizations.has(org)) return { error: 101 };

    this.verifiedOrganizations.set(org, true);
    return { value: true };
  },

  removeOrganization(caller: Principal, org: Principal): Result {
    if (!this.isAdmin(caller)) return { error: 100 };
    if (!this.verifiedOrganizations.has(org)) return { error: 102 };

    this.verifiedOrganizations.delete(org);
    return { value: true };
  },

  isVerified(org: Principal): boolean {
    return this.verifiedOrganizations.has(org);
  },

  transferAdmin(caller: Principal, newAdmin: Principal): Result {
    if (!this.isAdmin(caller)) return { error: 100 };

    this.admin = newAdmin;
    return { value: true };
  },
};

describe("AidChain Verifier Contract", () => {
  const ADMIN = "ST1ADMIN000000000000000000000000000000000";
  const ORG1 = "ST2ORG10000000000000000000000000000000000";
  const ORG2 = "ST3ORG20000000000000000000000000000000000";

  beforeEach(() => {
    mockContract.admin = ADMIN;
    mockContract.verifiedOrganizations = new Map();
  });

  it("should add an organization as admin", () => {
    const result = mockContract.addOrganization(ADMIN, ORG1);
    expect(result).toEqual({ value: true });
    expect(mockContract.isVerified(ORG1)).toBe(true);
  });

  it("should not add organization if caller is not admin", () => {
    const result = mockContract.addOrganization(ORG1, ORG2);
    expect(result).toEqual({ error: 100 });
    expect(mockContract.isVerified(ORG2)).toBe(false);
  });

  it("should not add already verified organization", () => {
    mockContract.addOrganization(ADMIN, ORG1);
    const result = mockContract.addOrganization(ADMIN, ORG1);
    expect(result).toEqual({ error: 101 });
  });

  it("should remove a verified organization", () => {
    mockContract.addOrganization(ADMIN, ORG1);
    const result = mockContract.removeOrganization(ADMIN, ORG1);
    expect(result).toEqual({ value: true });
    expect(mockContract.isVerified(ORG1)).toBe(false);
  });

  it("should not remove unverified organization", () => {
    const result = mockContract.removeOrganization(ADMIN, ORG1);
    expect(result).toEqual({ error: 102 });
  });

  it("should transfer admin rights", () => {
    const result = mockContract.transferAdmin(ADMIN, ORG1);
    expect(result).toEqual({ value: true });
    expect(mockContract.admin).toBe(ORG1);

    const addResult = mockContract.addOrganization(ORG1, ORG2);
    expect(addResult).toEqual({ value: true });
  });

  it("should not allow non-admin to transfer admin", () => {
    const result = mockContract.transferAdmin(ORG1, ORG2);
    expect(result).toEqual({ error: 100 });
    expect(mockContract.admin).toBe(ADMIN);
  });
});
