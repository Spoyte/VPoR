// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IGlassVault {
    function updateVerifiedAssets(uint256 _totalAssets, string memory _assetType) external;
}

contract ChainlinkEVVMAdapter {
    IGlassVault public glassVault;
    address public owner;

    event RequestFulfilled(bytes32 indexed requestId, uint256 response, bytes err);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _glassVault) {
        glassVault = IGlassVault(_glassVault);
        owner = msg.sender;
    }

    function setGlassVault(address _glassVault) external onlyOwner {
        glassVault = IGlassVault(_glassVault);
    }

    /**
     * @notice Mock fulfillment for now. In production, this would be `fulfillRequest` from Chainlink FunctionsClient.
     * @param requestId The request ID.
     * @param response The response bytes (encoded uint256).
     * @param err The error bytes.
     */
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) external {
        // In a real implementation, this would be restricted to the Chainlink Router.
        // For the hackathon/EVVM demo, we might call this directly or via a relayer.
        
        if (err.length > 0) {
            emit RequestFulfilled(requestId, 0, err);
            return;
        }

        uint256 assetBalance = abi.decode(response, (uint256));
        
        // Call GlassVault to update assets
        // We hardcode "BTC" for this demo as per spec
        glassVault.updateVerifiedAssets(assetBalance, "BTC");
        
        emit RequestFulfilled(requestId, assetBalance, err);
    }
}
