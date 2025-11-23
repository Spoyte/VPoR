// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Evvm} from "@evvm/testnet-contracts/contracts/evvm/Evvm.sol";
import {EvvmStructs} from "@evvm/testnet-contracts/contracts/evvm/lib/EvvmStructs.sol";

contract GlassVaultEVVM is Evvm {
    // --- State Variables ---

    // The Merkle Root of the current liability set
    bytes32 public liabilityRoot;

    // The total sum of liabilities (from the Merkle Sum Tree)
    uint256 public totalLiabilities;

    // The total assets verified by Chainlink
    uint256 public totalAssets;

    // Timestamp of the last liability update
    uint256 public lastLiabilityUpdate;

    // Timestamp of the last asset update
    uint256 public lastAssetUpdate;

    // Whitelisted executors (inherited from Evvm admin/executor logic or separate?)
    // Evvm has its own executor logic. We can reuse it or add our own.
    // For simplicity, we'll use a separate mapping for Liability Publishers.
    mapping(address => bool) public isLiabilityPublisher;

    // The Bridge address on Sepolia (for asset updates)
    // In a real EVVM, this would be authenticated via the Fisher Bridge.
    // For this hackathon, we might trust a specific address or use the Admin.
    address public chainlinkBridge;

    // --- Events ---

    event LiabilitySnapshot(bytes32 indexed root, uint256 totalLiabilities, uint256 timestamp);
    event AssetVerification(uint256 totalAssets, string assetType, uint256 timestamp);
    event ProofOfInclusion(address indexed user, bytes encryptedPayload);
    event LiabilityPublisherUpdated(address indexed publisher, bool status);

    // --- Modifiers ---

    modifier onlyLiabilityPublisher() {
        require(isLiabilityPublisher[msg.sender], "Not a liability publisher");
        _;
    }

    modifier onlyBridge() {
        require(msg.sender == chainlinkBridge, "Not the bridge");
        _;
    }

    // --- Constructor ---

    constructor() Evvm(
        msg.sender, // Initial Owner
        address(0), // Staking Contract (Mock)
        EvvmStructs.EvvmMetadata({
            EvvmName: "VPoR Chain",
            EvvmID: 1337,
            principalTokenName: "VPoR Token",
            principalTokenSymbol: "VPOR",
            principalTokenAddress: address(0),
            totalSupply: 1000000 ether,
            eraTokens: 1000 ether,
            reward: 10 ether
        })
    ) {
        isLiabilityPublisher[msg.sender] = true;
    }

    // --- Admin Functions ---

    function setLiabilityPublisher(address _publisher, bool _status) external {
        // Use Evvm's admin check
        require(msg.sender == getCurrentAdmin(), "Not admin");
        isLiabilityPublisher[_publisher] = _status;
        emit LiabilityPublisherUpdated(_publisher, _status);
    }

    function setChainlinkBridge(address _bridge) external {
        require(msg.sender == getCurrentAdmin(), "Not admin");
        chainlinkBridge = _bridge;
    }

    // --- Core Logic ---

    /**
     * @notice Submits a new liability Merkle Root and total liabilities.
     * @dev Uses Async Nonces implicitly if called via `pay` or `dispersePay` logic, 
     *      but here we are defining a direct function call.
     *      To leverage Async Nonces, the Exchange Backend should call this function 
     *      wrapped in an EVVM transaction payload executed by a Fisher.
     */
    function submitLiabilityProof(
        bytes32 _root,
        uint256 _totalLiabilities,
        address[] calldata _users,
        bytes[] calldata _encryptedProofs
    ) external onlyLiabilityPublisher {
        require(_users.length == _encryptedProofs.length, "Array mismatch");

        liabilityRoot = _root;
        totalLiabilities = _totalLiabilities;
        lastLiabilityUpdate = block.timestamp;

        emit LiabilitySnapshot(_root, _totalLiabilities, block.timestamp);

        for (uint256 i = 0; i < _users.length; i++) {
            emit ProofOfInclusion(_users[i], _encryptedProofs[i]);
        }
    }

    /**
     * @notice Updates the verified asset total.
     * @dev Callable only by the trusted Bridge address.
     */
    function updateVerifiedAssets(uint256 _totalAssets, string memory _assetType) external onlyBridge {
        totalAssets = _totalAssets;
        lastAssetUpdate = block.timestamp;

        emit AssetVerification(_totalAssets, _assetType, block.timestamp);
    }

    // --- View Functions ---

    function isSolvent() external view returns (bool) {
        return totalAssets >= totalLiabilities;
    }

    function getReserveRatio() external view returns (uint256) {
        if (totalLiabilities == 0) return type(uint256).max;
        return (totalAssets * 10000) / totalLiabilities;
    }
}
