import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("SBT Solmate", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const SBT = await hre.ethers.getContractFactory("Soulbound");
    const sbt = await SBT.deploy("test", "test");

    return { sbt, owner, otherAccount };
  }

  it("Right name and symbol", async function () {
    const { sbt } = await loadFixture(deployFixture);

    expect(await sbt.name()).to.equal("test");
    expect(await sbt.symbol()).to.equal("test");
  });

  it("Right owner", async function () {
    const { sbt, owner } = await loadFixture(deployFixture);
    expect(await sbt.owner()).to.equal(owner.address);
  });

  it("Mint", async function () {
    const { sbt, owner } = await loadFixture(deployFixture);

    await sbt.setURI(0, "123");

    await sbt.mint(owner, "0", "1");
    await sbt.mint(owner, "1", "200");

    expect(await sbt.balanceOf(owner, 0)).to.be.equal(1);
    expect(await sbt.balanceOf(owner, 1)).to.be.equal(200);

    expect(await sbt.uri(0)).to.be.equal("123");
  });
});
