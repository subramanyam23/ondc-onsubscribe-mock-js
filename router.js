const express = require("express");
const axios = require("axios");

const router = express.Router();

let {
    cryptoURL,
    clientPrivateKey,
    signature,
    callbackURL,
    proteanPublicKey
  } = require("./config");

router.get("/", (req, res) => {
    res.send("OK");
});
  
router.get("/ondc-site-verification.html", async (req, res) => {
    res.render("ondc-site-verification", { signature });
});

let onSubscribeUrl = callbackURL + "/on_subscribe";

router.post(onSubscribeUrl, async (req, res) => {
    let { challenge } = req.body;
  
    let decryptUrl = cryptoURL + "/decrypt/text";
    let payload = { value: challenge, proteanPrivateKey: clientPrivateKey, clientPublicKey: proteanPublicKey };
    let decryptedResponse = await axios.post(decryptUrl, payload);
  
    res.send({ answer: decryptedResponse.data });
  });
  
router.get("/config", (_, res) => {
    res.send({
        clientPrivateKey,
        proteanPublicKey,
        callbackURL,
        cryptoURL,
        proteanPublicKey,
        signature
    });
});
  
router.post("/set_keys", (req, res) => {
    let reqBody = req.body;

    if (!reqBody.clientPrivateKey || !reqBody.proteanPublicKey) {
        res.status(400);
        res.send({
            message: "Bad Request"
        })
        return;
    }

    clientPrivateKey = reqBody.clientPrivateKey;
    proteanPublicKey = reqBody.proteanPublicKey;
    res.send("OK");
});

router.post("/set_signature", (req, res) => {
    let reqBody = req.body;

    if (!reqBody.signature) {
        res.status(400);
        res.send({
            message: "Bad Request"
        })
        return;
    }

    signature = reqBody.signature;
    res.send("OK");
})

module.exports = router;