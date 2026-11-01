const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PricePad Smart Contract", function () {
  let pricePad;
  let owner;
  let customer;
  let otherAccount;

  beforeEach(async function () {
    [owner, customer, otherAccount] = await ethers.getSigners();
    const PricePadFactory = await ethers.getContractFactory("PricePad");
    pricePad = await PricePadFactory.deploy();
    await pricePad.waitForDeployment();
  });

  describe("Record Creation", function () {
    it("should create a record successfully and emit RecordCreated event", async function () {
      const name = "Logo Design";
      const description = "Vector logo package with 3 revisions";
      const price = ethers.parseEther("0.25");

      const tx = await pricePad.createRecord(name, description, price);
      const receipt = await tx.wait();

      const total = await pricePad.getTotalRecords();
      expect(total).to.equal(1n);

      // Verify event
      await expect(tx)
        .to.emit(pricePad, "RecordCreated")
        .withArgs(1n, owner.address, name, price, (val) => val > 0);

      const record = await pricePad.getRecord(1n);
      expect(record.id).to.equal(1n);
      expect(record.creator).to.equal(owner.address);
      expect(record.name).to.equal(name);
      expect(record.description).to.equal(description);
      expect(record.price).to.equal(price);
      expect(record.status).to.equal(0n); // Status.Available
      expect(record.createdAt).to.be.gt(0);
    });

    it("should generate sequential unique IDs", async function () {
      await pricePad.createRecord("Service 1", "Desc 1", 100);
      await pricePad.createRecord("Service 2", "Desc 2", 200);
      await pricePad.connect(customer).createRecord("Service 3", "Desc 3", 300);

      expect(await pricePad.getTotalRecords()).to.equal(3n);

      const record1 = await pricePad.getRecord(1n);
      const record2 = await pricePad.getRecord(2n);
      const record3 = await pricePad.getRecord(3n);

      expect(record1.id).to.equal(1n);
      expect(record2.id).to.equal(2n);
      expect(record3.id).to.equal(3n);
      expect(record3.creator).to.equal(customer.address);
    });

    it("should reject creation with empty name", async function () {
      await expect(
        pricePad.createRecord("", "Valid description", 100)
      ).to.be.revertedWithCustomError(pricePad, "EmptyName");
    });

    it("should reject creation with zero price", async function () {
      await expect(
        pricePad.createRecord("Valid Name", "Valid description", 0)
      ).to.be.revertedWithCustomError(pricePad, "InvalidPrice");
    });
  });

  describe("Record Retrieval", function () {
    beforeEach(async function () {
      await pricePad.connect(owner).createRecord("Web Audit", "Frontend security & SEO audit", 500);
      await pricePad.connect(owner).createRecord("UI Redesign", "Figma redesign", 1500);
      await pricePad.connect(customer).createRecord("Copywriting", "10 blog posts", 800);
    });

    it("should retrieve a record by its unique ID", async function () {
      const record = await pricePad.getRecord(1n);
      expect(record.name).to.equal("Web Audit");
      expect(record.price).to.equal(500n);
      expect(record.creator).to.equal(owner.address);
    });

    it("should revert when querying a non-existent record", async function () {
      await expect(pricePad.getRecord(0)).to.be.revertedWithCustomError(
        pricePad,
        "RecordNotFound"
      );
      await expect(pricePad.getRecord(999)).to.be.revertedWithCustomError(
        pricePad,
        "RecordNotFound"
      );
    });

    it("should return all records created by the connected wallet (getMyRecords)", async function () {
      const ownerRecords = await pricePad.connect(owner).getMyRecords();
      expect(ownerRecords.length).to.equal(2);
      expect(ownerRecords[0].name).to.equal("Web Audit");
      expect(ownerRecords[1].name).to.equal("UI Redesign");

      const customerRecords = await pricePad.connect(customer).getMyRecords();
      expect(customerRecords.length).to.equal(1);
      expect(customerRecords[0].name).to.equal("Copywriting");

      const otherRecords = await pricePad.connect(otherAccount).getMyRecords();
      expect(otherRecords.length).to.equal(0);
    });
  });

  describe("Status Updates & Access Control", function () {
    beforeEach(async function () {
      await pricePad.connect(owner).createRecord("Smart Contract", "Solidity audit", 2000);
    });

    it("should allow creator to update status to Accepted and emit StatusUpdated event", async function () {
      const tx = await pricePad.connect(owner).updateStatus(1n, 1); // 1 = Accepted
      await expect(tx)
        .to.emit(pricePad, "StatusUpdated")
        .withArgs(1n, 1, owner.address);

      const record = await pricePad.getRecord(1n);
      expect(record.status).to.equal(1n); // Accepted
    });

    it("should allow creator to update status to Rejected", async function () {
      await pricePad.connect(owner).updateStatus(1n, 2); // 2 = Rejected
      const record = await pricePad.getRecord(1n);
      expect(record.status).to.equal(2n); // Rejected
    });

    it("should prevent non-creators from updating record status", async function () {
      await expect(
        pricePad.connect(customer).updateStatus(1n, 1)
      ).to.be.revertedWithCustomError(pricePad, "NotCreator");

      await expect(
        pricePad.connect(otherAccount).updateStatus(1n, 2)
      ).to.be.revertedWithCustomError(pricePad, "NotCreator");
    });

    it("should reject setting status to Available (0)", async function () {
      await expect(
        pricePad.connect(owner).updateStatus(1n, 0)
      ).to.be.revertedWithCustomError(pricePad, "InvalidStatusChange");
    });

    it("should prevent updating an already finalized record", async function () {
      // First update to Accepted
      await pricePad.connect(owner).updateStatus(1n, 1);

      // Attempting to change to Rejected should revert
      await expect(
        pricePad.connect(owner).updateStatus(1n, 2)
      ).to.be.revertedWithCustomError(pricePad, "InvalidStatusChange");
    });

    it("should revert if updating non-existent record", async function () {
      await expect(
        pricePad.connect(owner).updateStatus(99, 1)
      ).to.be.revertedWithCustomError(pricePad, "RecordNotFound");
    });
  });
});

