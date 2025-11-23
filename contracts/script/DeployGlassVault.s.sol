// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/GlassVaultEVVM.sol";

contract DeployGlassVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        GlassVaultEVVM glassVault = new GlassVaultEVVM();
        console.log("GlassVaultEVVM deployed at:", address(glassVault));

        vm.stopBroadcast();
    }
}
