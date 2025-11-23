// source.js

// Arguments can be provided when a request is initated on-chain and used in the request source code as args.
const address = args[0];

// make HTTP request
const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`;
console.log(`Sending HTTP request to ${url}...`);

const cryptoCompareRequest = Functions.makeHttpRequest({
    url: url,
    method: "GET",
});

// Execute the API request (Promise)
const cryptoCompareResponse = await cryptoCompareRequest;

if (cryptoCompareResponse.error) {
    console.error(cryptoCompareResponse.error);
    throw Error("Request failed");
}

const data = cryptoCompareResponse.data;

if (data.balance === undefined) {
    throw Error(`Invalid response format: ${JSON.stringify(data)}`);
}

console.log(`BTC Balance: ${data.balance}`);

// return the balance as uint256 encoded
return Functions.encodeUint256(data.balance);
