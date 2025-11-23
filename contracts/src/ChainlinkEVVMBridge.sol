// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

interface IGlassVaultEVVM {
    function updateVerifiedAssets(uint256 _totalAssets, string memory _assetType) external;
}

/**
 * @title ChainlinkEVVMBridge
 * @notice Bridges Chainlink Functions data to the GlassVaultEVVM contract.
 * @dev This contract is deployed on the Host Chain (Sepolia).
 */
contract ChainlinkEVVMBridge is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // --- State Variables ---

    IGlassVaultEVVM public glassVault;
    bytes32 public latestRequestId;
    bytes public latestResponse;
    bytes public latestError;

    // Chainlink Functions Router address
    address public router;
    
    // Subscription ID for Chainlink Functions
    uint64 public subscriptionId;
    
    // Gas limit for the callback
    uint32 public callbackGasLimit = 300000;
    
    // DON ID (Sepolia)
    bytes32 public donId;

    // --- Events ---

    event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
    event GlassVaultUpdated(address indexed vault);

    // --- Constructor ---

    constructor(address _router, bytes32 _donId, address _glassVault) FunctionsClient(_router) ConfirmedOwner(msg.sender) {
        router = _router;
        donId = _donId;
        glassVault = IGlassVaultEVVM(_glassVault);
    }

    // --- Configuration ---

    function setGlassVault(address _glassVault) external onlyOwner {
        glassVault = IGlassVaultEVVM(_glassVault);
        emit GlassVaultUpdated(_glassVault);
    }

    function setSubscriptionId(uint64 _subscriptionId) external onlyOwner {
        subscriptionId = _subscriptionId;
    }

    function setCallbackGasLimit(uint32 _limit) external onlyOwner {
        callbackGasLimit = _limit;
    }

    // --- Chainlink Functions ---

    /**
     * @notice Sends a request to the Chainlink DON to fetch asset data.
     * @param source The JavaScript source code to execute.
     * @param encryptedSecretsUrls Encrypted secrets URLs (optional).
     * @param donHostedSecretsSlotID Slot ID for DON-hosted secrets (optional).
     * @param donHostedSecretsVersion Version for DON-hosted secrets (optional).
     * @param args Arguments for the JavaScript source code.
     * @param bytesArgs Bytes arguments for the JavaScript source code.
     * @param subscriptionId The subscription ID to use for payment.
     */
    function sendRequest(
        string calldata source,
        bytes calldata encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] calldata args,
        bytes[] calldata bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (encryptedSecretsUrls.length > 0)
            req.addSecretsReference(encryptedSecretsUrls);
        else if (donHostedSecretsVersion > 0) {
            req.addDONHostedSecrets(
                donHostedSecretsSlotID,
                donHostedSecretsVersion
            );
        }
        if (args.length > 0) req.setArgs(args);
        if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);

        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        latestRequestId = requestId;
        return requestId;
    }

    /**
     * @notice Callback function called by the Chainlink DON.
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        latestResponse = response;
        latestError = err;
        
        emit OCRResponse(requestId, response, err);

        if (err.length == 0) {
            uint256 assetBalance = abi.decode(response, (uint256));
            // Bridge the data to GlassVault
            // Note: If GlassVault is on EVVM, this call needs to be handled carefully.
            // If EVVM is just a contract on Sepolia (which it is in this architecture), 
            // we can call it directly.
            glassVault.updateVerifiedAssets(assetBalance, "BTC");
        }
    }
}
