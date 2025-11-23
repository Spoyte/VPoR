// sim.js
const { simulateScript, decodeResult } = require("@chainlink/functions-toolkit");
const fs = require("fs");
const path = require("path");

async function main() {
    const source = fs.readFileSync(path.join(__dirname, "source.js")).toString();

    // Dummy BTC address (Binance Cold Wallet)
    const args = ["34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo"];

    console.log("Simulating Chainlink Function...");

    const { responseBytesHexString, errorString, capturedTerminalOutput } = await simulateScript({
        source: source,
        args: args,
        bytesArgs: [], // no bytesArgs
        secrets: {}, // no secrets
    });

    console.log("Output:", capturedTerminalOutput);

    if (responseBytesHexString) {
        console.log(
            `Response (Decoded): ${decodeResult(responseBytesHexString, "uint256")}`
        );
    } else if (errorString) {
        console.error(`Error: ${errorString}`);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
