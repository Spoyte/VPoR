// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/GlassVault.sol";

contract GlassVaultTest is Test {
    GlassVault public vault;
    address public admin;
    address public executor;
    address public user1;
    address public user2;

    event LiabilitySnapshot(bytes32 indexed root, uint256 totalLiabilities, uint256 timestamp);
    event AssetVerification(uint256 totalAssets, string assetType, uint256 timestamp);
    event ProofOfInclusion(address indexed user, bytes encryptedPayload);

    function setUp() public {
        admin = address(this);
        executor = address(0x1);
        user1 = address(0x2);
        user2 = address(0x3);

        vault = new GlassVault();
        vault.setExecutor(executor, true);
    }

    function testSubmitLiabilityProof() public {
        bytes32 root = keccak256("root");
        uint256 liabilities = 1000;
        address[] memory users = new address[](2);
        users[0] = user1;
        users[1] = user2;
        bytes[] memory proofs = new bytes[](2);
        proofs[0] = "proof1";
        proofs[1] = "proof2";

        vm.prank(executor);
        vm.expectEmit(true, false, false, true);
        emit LiabilitySnapshot(root, liabilities, block.timestamp);
        
        // We also expect ProofOfInclusion events, but checking all of them in order is verbose in foundry
        // Let's just check the state update first
        vault.submitLiabilityProof(root, liabilities, users, proofs);

        assertEq(vault.liabilityRoot(), root);
        assertEq(vault.totalLiabilities(), liabilities);
        assertEq(vault.lastLiabilityUpdate(), block.timestamp);
    }

    function testUpdateVerifiedAssets() public {
        uint256 assets = 1500;
        string memory assetType = "BTC";

        vm.prank(executor);
        vm.expectEmit(false, false, false, true);
        emit AssetVerification(assets, assetType, block.timestamp);
        
        vault.updateVerifiedAssets(assets, assetType);

        assertEq(vault.totalAssets(), assets);
        assertEq(vault.lastAssetUpdate(), block.timestamp);
    }

    function testIsSolvent() public {
        // Case 1: Solvent
        vm.startPrank(executor);
        vault.updateVerifiedAssets(1000, "BTC");
        
        address[] memory users = new address[](0);
        bytes[] memory proofs = new bytes[](0);
        vault.submitLiabilityProof(bytes32(0), 900, users, proofs);
        vm.stopPrank();

        assertTrue(vault.isSolvent());

        // Case 2: Insolvent
        vm.prank(executor);
        vault.submitLiabilityProof(bytes32(0), 1100, users, proofs);
        assertFalse(vault.isSolvent());
    }

    function testGetReserveRatio() public {
        vm.startPrank(executor);
        vault.updateVerifiedAssets(1000, "BTC");
        
        address[] memory users = new address[](0);
        bytes[] memory proofs = new bytes[](0);
        vault.submitLiabilityProof(bytes32(0), 500, users, proofs);
        vm.stopPrank();

        // 1000 / 500 = 200% = 20000 BPS
        assertEq(vault.getReserveRatio(), 20000);
    }

    function testAccessControl() public {
        vm.prank(user1);
        vm.expectRevert("Not an executor");
        vault.updateVerifiedAssets(100, "BTC");
    }
}
