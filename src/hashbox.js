
// https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const hashes = {
  "streebog512": {
    init: () => streebog.init(512),
    update: streebog.update.bind(streebog),
    final: streebog.final.bind(streebog),
    cleanup: streebog.cleanup.bind(streebog),

    digest: data => toHexString(streebog.digest(data, 512))
  },
  "blake2b": {
    init: () => blake2bInit(64), // 512 bits
    update: blake2bUpdate,
    final: blake2bFinal,
    cleanup: () => {},

    digest: data => toHexString(blake2b(data))
  },
  "sha3-512": {
    init: () => sha3.init(512),
    update: sha3.update.bind(sha3),
    final: sha3.final.bind(sha3),
    cleanup: sha3.cleanup.bind(sha3),

    digest: data => toHexString(sha3.digest(data, 512))
  },
  "sha512": {
    init: sha512.create,
    update: (ctx, data) => ctx.update(data),
    final: ctx => ctx.digest(),
    cleanup: () => {},

    digest: sha512
  }
}

// Test hash (http://example.com/favicon.ico, blake2b)
const LP_hash = "ff80f1e7b77312a37cee1e78cbb183ef0c5334e1d3c7404e3cfa8f1de5eac99a97f6082cef820fb2e15780bda9d09b3ae10f4c3ec892463c8e61a92e6666d21e";
//const LP_hash = "36367763ab73783c7af284446c59466b4cd653239a311cb7116d4618dee09a8425893dc7500b464fdaf1672d7bef5e891c6e2274568926a49fb4f45132c2a8b4";

// Implements an 'hashing box' : you feed it chunks of data, and when you're done, ask the box if the LP hash has been found
class HashingBox {
  // All-in-one method - return whether or not data hashes to the LP hash
  static hash(data) {
    for (let algorithm in hashes) {
      let alg = hashes[algorithm];

      if (alg.digest(data) == LP_hash)
        return true;
    }

    return false;
  }


  constructor() {
    this.contexts = {};

    // Initializes the context for every hashing algorithm
    for (let algorithm in hashes)
      this.contexts[algorithm] = hashes[algorithm].init();
  }

  update(data) {
    for (let algorithm in hashes) {
      let alg = hashes[algorithm];
      let ctx = this.contexts[algorithm];

      alg.update(ctx, new Uint8Array(data));
    }
  }

  verify() {
    for (let algorithm in hashes) {
      let alg = hashes[algorithm];
      let ctx = this.contexts[algorithm];

      let digest = alg.final(ctx);

      if (toHexString(digest) == LP_hash)
        return true;
    }

    return false;
  }

  cleanup() {
    for (let algorithm in hashes) {
      let alg = hashes[algorithm];
      let ctx = this.contexts[algorithm];

      alg.cleanup(ctx);
    }
  }
}
