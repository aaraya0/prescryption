const Migrations = artifacts.require("Migrations");
const Prescripcion = artifacts.require("Prescripcion");
module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Prescripcion);
};
