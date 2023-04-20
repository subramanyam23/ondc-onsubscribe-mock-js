const { cryptoURL } = require("./config");
const axios = require("axios");

async function generateKeys() {
    let signingKeypairGenerationUrl = cryptoURL + "/signature/key";
    let encryptionKeypairGenerationUrl = cryptoURL + "/encrypt/decrypt/key";
  
    let { data: signingKeyPair } = await axios.post(signingKeypairGenerationUrl);
    
    let { data: encryptionKeyPair } = await axios.post(encryptionKeypairGenerationUrl);

    return { signingKeyPair, encryptionKeyPair }
}

module.exports = { generateKeys }