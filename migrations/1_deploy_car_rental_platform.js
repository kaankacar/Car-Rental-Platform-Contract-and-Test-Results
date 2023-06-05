const CarRentalPlatform = artifacts.require("CarRentalPlatform");
const fs = require("fs");

module.exports = async function (deployer) {
  await deployer.deploy(CarRentalPlatform);
  const instance = await CarRentalPlatform.deployed();
  let carRentalPlatformAddress = await instance.address;

  let config = "export const carRentalPlatformAddress = " + carRentalPlatformAddress;

  console.log("export const carRentalPlatformAddress =  + carRentalPlatformAddress")

  let data = JSON.stringify(config);

  fs.writeFileSync("config.js", JSON.parse(data));
};
