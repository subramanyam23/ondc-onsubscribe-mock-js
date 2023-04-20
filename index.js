const express = require("express");
const ejs = require("ejs");
const axios = require("axios");
const { generateKeys } = require("./utils");

let {
  cryptoURL,
  registryUrl,
  requestId,
  signingKeyPair,
  encryptionKeyPair,
  callbackURL
} = require("./config");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/ondc-site-verification.html", async (req, res) => {
  let signGenerationURL = cryptoURL + "/signature/generate/onboarding";
  let payload = { requestData: requestId, clientPrivateKey: signingKeyPair.privateKey };

  let { data: signature } = await axios.post(signGenerationURL, payload);

  res.render("ondc-site-verification", { signature });
});

let onSubscribeUrl = callbackURL + "/on_subscribe";

app.post(onSubscribeUrl, async (req, res) => {
  let { challenge } = req.body;

  let decryptUrl = registryUrl + "/challenge/decrypt/text";
  let payload = { challenge, client_private_key: encryptionKeyPair.privateKey };
  let decryptedResponse = await axios.post(decryptUrl, payload);

  res.send(decryptedResponse.data);
});

app.get("/config", (_, res) => {
  res.send({
    signingPublicKey: signingKeyPair.publicKey,
    encryptionPublicKey: encryptionKeyPair.publicKey,
    requestId,
    callbackURL,
    cryptoURL,
    registryUrl
  });
});

app.post("/generate/keys", async (_, res) => {
  let generatedKeys = await generateKeys();

  signingKeyPair = generatedKeys.signingKeyPair;
  encryptionKeyPair = generatedKeys.encryptionKeyPair;

  res.send("OK");
})

app.listen("3000", async () => {
  console.log("Server starting on PORT 3000");

  let generatedKeys = await generateKeys();

  signingKeyPair = generatedKeys.signingKeyPair;
  encryptionKeyPair = generatedKeys.encryptionKeyPair;

  console.log("Signing Key Pair: ", signingKeyPair);
  console.log("Encryption Key Pair: ", encryptionKeyPair);

  console.log("Generated New keys");
});
