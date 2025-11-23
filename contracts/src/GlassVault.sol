// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GlassVault {
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

    // Whitelisted executors
    mapping(address => bool) public isExecutor;

    // Admin address (can manage executors)
    address public admin;

    // --- Events ---

    event LiabilitySnapshot(bytes32 indexed root, uint256 totalLiabilities, uint256 timestamp);
    event AssetVerification(uint256 totalAssets, string assetType, uint256 timestamp);
    event ProofOfInclusion(address indexed user, bytes encryptedPayload);
    event ExecutorUpdated(address indexed executor, bool status);

    // --- Modifiers ---

    modifier onlyExecutor() {
        require(isExecutor[msg.sender], "Not an executor");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    // --- Constructor ---

    constructor() {
        admin = msg.sender;
        isExecutor[msg.sender] = true; // Admin is also an executor by default for testing
    }

    // --- Admin Functions ---

    function setExecutor(address _executor, bool _status) external onlyAdmin {
        isExecutor[_executor] = _status;
        emit ExecutorUpdated(_executor, _status);
    }

    // --- Core Logic ---

    /**
     * @notice Submits a new liability Merkle Root and total liabilities.
     * @param _root The new Merkle Root.
     * @param _totalLiabilities The total sum of liabilities.
     * @param _encryptedProofs List of encrypted proofs for users (optional, can be empty if handled off-chain/separately).
     *                         Format: [address user, bytes payload, ...] - strictly speaking, passing arrays of structs is better.
     *                         For simplicity here, we'll assume the caller passes parallel arrays or just emits events.
     *                         Let's stick to the spec: "Iterates through _encryptedProofs".
     *                         We'll take two arrays: users and payloads.
     */
    function submitLiabilityProof(
        bytes32 _root,
        uint256 _totalLiabilities,
        address[] calldata _users,
        bytes[] calldata _encryptedProofs
    ) external onlyExecutor {
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
     * @param _totalAssets The new total assets verified by Chainlink.
     * @param _assetType The type of asset (e.g., "BTC").
     */
    function updateVerifiedAssets(uint256 _totalAssets, string memory _assetType) external onlyExecutor {
        totalAssets = _totalAssets;
        lastAssetUpdate = block.timestamp;

        emit AssetVerification(_totalAssets, _assetType, block.timestamp);
    }

    // --- View Functions ---

    /**
     * @notice Checks if the vault is solvent.
     * @return True if totalAssets >= totalLiabilities.
     */
    function isSolvent() external view returns (bool) {
        return totalAssets >= totalLiabilities;
    }

    /**
     * @notice Returns the reserve ratio in Basis Points (BPS).
     * @return Ratio (e.g., 10000 = 100%).
     */
    function getReserveRatio() external view returns (uint256) {
        if (totalLiabilities == 0) return type(uint256).max; // Infinite solvency if no liabilities
        return (totalAssets * 10000) / totalLiabilities;
    }
}
