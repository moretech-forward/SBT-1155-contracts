import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

const zeroAddr = "0x0000000000000000000000000000000000000000";

describe("SBT-1155", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const SBT = await hre.ethers.getContractFactory("Soulbound");
    const sbt = await SBT.deploy("test", "test");

    return { sbt, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Right name and symbol", async function () {
      const { sbt } = await loadFixture(deployFixture);

      expect(await sbt.name()).to.equal("test");
      expect(await sbt.symbol()).to.equal("test");
    });

    it("Right owner", async function () {
      const { sbt, owner } = await loadFixture(deployFixture);
      expect(await sbt.owner()).to.equal(owner.address);
    });
  });

  describe("Mint cases", function () {
    it("Mint owner", async function () {
      const { sbt, owner } = await loadFixture(deployFixture);

      await sbt.setURI(0, "123");

      await expect(sbt.mint(owner, "0", "1")).to.emit(sbt, "TransferSingle");
      await expect(sbt.mint(owner, "1", "200")).to.emit(sbt, "TransferSingle");

      expect(await sbt.balanceOf(owner, 0)).to.be.equal(1);
      expect(await sbt.balanceOf(owner, 1)).to.be.equal(200);

      expect(await sbt.uri(0)).to.be.equal("123");
    });

    it("batchMint owner", async function () {
      const { sbt, owner } = await loadFixture(deployFixture);

      await sbt.setURI(0, "123");

      await expect(
        sbt.connect(owner).batchMint(owner, [0, 1], [1, 200])
      ).to.emit(sbt, "TransferBatch");

      expect(await sbt.balanceOf(owner, 0)).to.be.equal(1);
      expect(await sbt.balanceOf(owner, 1)).to.be.equal(200);

      expect(await sbt.uri(0)).to.be.equal("123");
    });

    it("Mint otherAccount", async function () {
      const { sbt, otherAccount } = await loadFixture(deployFixture);

      await expect(
        sbt.connect(otherAccount).mint(otherAccount, "0", "1")
      ).to.be.revertedWith("UNAUTHORIZED");
    });

    it("batchMint otherAccount", async function () {
      const { sbt, otherAccount } = await loadFixture(deployFixture);

      await expect(
        sbt.connect(otherAccount).batchMint(otherAccount, [0, 1], [1, 100])
      ).to.be.revertedWith("UNAUTHORIZED");
    });

    it("Mint owner to zero address", async function () {
      const { sbt, owner } = await loadFixture(deployFixture);

      await expect(sbt.mint(zeroAddr, "0", "1")).to.be.revertedWith(
        "UNSAFE_RECIPIENT"
      );
    });

    it("Mint owner amount == 0", async function () {
      const { sbt, owner } = await loadFixture(deployFixture);

      await sbt.setURI(0, "123");

      await expect(sbt.mint(owner, "0", "0")).to.be.revertedWith("ZERO_AMOUNT");
    });

    it("batchMint owner amount == 0", async function () {
      const { sbt, owner } = await loadFixture(deployFixture);

      await sbt.setURI(0, "123");

      await expect(
        sbt.connect(owner).batchMint(owner, [0, 1], [1, 0])
      ).to.be.revertedWith("ZERO_AMOUNT");
    });

    it("batchMint owner length mismatch", async function () {
      const { sbt, owner } = await loadFixture(deployFixture);

      await sbt.setURI(0, "123");

      await expect(
        sbt.connect(owner).batchMint(owner, [0, 1], [1, 200, 10])
      ).to.be.revertedWith("LENGTH_MISMATCH");
    });
  });

  describe("Burn cases", function () {
    it("Burn owner", async function () {
      const { sbt, owner, otherAccount } = await loadFixture(deployFixture);

      await expect(sbt.mint(otherAccount, "0", "1")).to.emit(
        sbt,
        "TransferSingle"
      );
      await expect(sbt.mint(otherAccount, "1", "200")).to.emit(
        sbt,
        "TransferSingle"
      );

      expect(await sbt.balanceOf(otherAccount, 0)).to.be.equal(1);
      expect(await sbt.balanceOf(otherAccount, 1)).to.be.equal(200);

      await expect(sbt.connect(owner).burn(otherAccount, 0, 1)).to.emit(
        sbt,
        "TransferSingle"
      );
      expect(await sbt.balanceOf(otherAccount, 0)).to.be.equal(0);
    });

    it("batchBurn owner", async function () {
      const { sbt, owner, otherAccount } = await loadFixture(deployFixture);

      await expect(
        sbt.connect(owner).batchMint(otherAccount, [0, 1], [1, 200])
      ).to.emit(sbt, "TransferBatch");

      expect(await sbt.balanceOf(otherAccount, 0)).to.be.equal(1);
      expect(await sbt.balanceOf(otherAccount, 1)).to.be.equal(200);

      await expect(
        sbt.connect(owner).batchBurn(otherAccount, [0, 1], [1, 100])
      ).to.emit(sbt, "TransferBatch");

      expect(await sbt.balanceOf(otherAccount, 0)).to.be.equal(0);
      expect(await sbt.balanceOf(otherAccount, 1)).to.be.equal(100);
    });

    it("Burn otherAccount", async function () {
      const { sbt, otherAccount, owner } = await loadFixture(deployFixture);

      await expect(sbt.mint(otherAccount, "1", "200")).to.emit(
        sbt,
        "TransferSingle"
      );

      await expect(
        sbt.connect(otherAccount).burn(otherAccount, "0", "1")
      ).to.be.revertedWith("UNAUTHORIZED");
    });

    it("batchBurn otherAccount", async function () {
      const { sbt, owner, otherAccount } = await loadFixture(deployFixture);

      await expect(
        sbt.connect(owner).batchMint(otherAccount, [0, 1], [1, 100])
      ).to.emit(sbt, "TransferBatch");

      await expect(
        sbt.connect(otherAccount).batchBurn(otherAccount, [0, 1], [1, 100])
      ).to.be.revertedWith("UNAUTHORIZED");
    });

    it("Burn zero balance", async function () {
      const { sbt, otherAccount, owner } = await loadFixture(deployFixture);

      await expect(
        sbt.connect(owner).burn(otherAccount, "0", "1")
      ).to.be.revertedWithPanic();
    });
  });
});
