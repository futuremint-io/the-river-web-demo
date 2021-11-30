const fs = require("fs");
const Arweave = require("arweave");
const smartweave = require("smartweave");
const eol = require('eol')
var koii = require('@_koi/sdk/common');
require("dotenv").config();
var koi = new koii.Common(process.env.WALLET_LOCATION)
var contractSrc = process.env.CONTRACT;

// Initialize the arweave connection
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false
});

// Call the function to mint the NFT and deploy it
mintNFT(__dirname + '/pkg/index.html');


//--------------------------------------------------------------------------------------------------
async function mintNFT(path) {
    console.log("mintNFT");

    console.log('wallet:', process.env.WALLET_LOCATION)
    await koi.loadWallet(process.env.WALLET_LOCATION);
    let readStream = fs.createReadStream(path);
    let fileBuffer;
    let chunks = [];

    readStream.once('error', (err) => {
        console.error(err); 
    });

    readStream.once('end', () => {
        fileBuffer = Buffer.concat(chunks);
        handleData(fileBuffer)
    });
    
    readStream.on('data', (chunk) => {
        chunks.push(chunk); 
    });
}

//--------------------------------------------------------------------------------------------------
async function handleData (nftData) {
    console.log("handleData");

    console.log('data type', nftData.contentType)
    var lastBlock = await koi.getBlockHeight();

    const metadata = {
        "owner": "fhK92v8-ViM05T-m2EDC492oXm9AJbNVQoOehe9FTOU",
        "title": "The River 0.0.1",
        "name": "The River",
        "ticker" : "EQS"
    }

    const initialState = {
        "owner": "fhK92v8-ViM05T-m2EDC492oXm9AJbNVQoOehe9FTOU",
        "name": "Gendered Environments",
        "description":"Karen Bell proposes environmental justice research, teaching, policy and practice should be made more gender aware.",
        "tags": ["Gender", "Environment", "Farming", "Food", "Equality"],
        "ticker": "EQS",
        "copies":{
            "purchased":0,
            "available":100,
            "contributors":[]
        },  
        "balances": {},
          "contentType": "text/html",
          "createdAt": "1624057295",
          "decay":{ 
            "minted": "731128",
            "lastLock": "731128",
            "lockState" : "65",
            "lastMax" : "0"
          },
        "ethOwnerAddress": "0x2f60cfc6c157a1a2f47e4dcad90377393b57159a"
    }
    let tx = await arweave.createTransaction({
            // eslint-disable-next-line no-undef
            data: Buffer.from(nftData)
        }, koi.wallet);
        tx.addTag('Content-Type', 'text/html')
        tx.addTag('Exchange', 'Verto')
        tx.addTag('Action', 'marketplace/Create')
        tx.addTag('App-Name', 'SmartWeaveContract')
        tx.addTag('App-Version', '0.3.0')
        tx.addTag('Contract-Src', contractSrc)
        tx.addTag('Init-State', JSON.stringify(initialState))

    await arweave.transactions.sign(tx, koi.wallet);
    
    const result = {};
          result.id = tx.id;

    console.log("tx");
    console.log(tx);

    console.log("tx.id");
    console.log(tx.id);

    let uploader = await arweave.transactions.getUploader(tx)
    while (!uploader.isComplete) {
        await uploader.uploadChunk()
        console.log(
            uploader.pctComplete + '% complete',
            uploader.uploadedChunks + '/' + uploader.totalChunks
        )
    }

    // var burnAmount = 5; // the amount of koi to burn on registration (burn more to earn more!)
    // var registration = await koi.registerData(tx.id, initialState.owner)

    const status = await arweave.transactions.getStatus(tx.id)
    console.log(`Transaction ${tx.id} status code is ${status.status}`)
    // console.log('registered to koii under ', registration)

    return result;
}