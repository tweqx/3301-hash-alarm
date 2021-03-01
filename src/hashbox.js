
// https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const hashes = {
  "fnv512-0": {
    init: () => fnv512.init(512,fnv512.variants.FNV_VARIANT_0),
    update: fnv512.update.bind(fnv512),
    final: fnv512.final.bind(fnv512),
    cleanup: fnv512.cleanup.bind(fnv512),

    digest: data => toHexString(fnv512.digest(data, 512, fnv512.variants.FNV_VARIANT_0))
  },
  "fnv512-1": {
    init: () => fnv512.init(512,fnv512.variants.FNV_VARIANT_1),
    update: fnv512.update.bind(fnv512),
    final: fnv512.final.bind(fnv512),
    cleanup: fnv512.cleanup.bind(fnv512),

    digest: data => toHexString(fnv512.digest(data, 512, fnv512.variants.FNV_VARIANT_1))
  },
  "fnv512-1a": {
    init: () => fnv512.init(512,fnv512.variants.FNV_VARIANT_1A),
    update: fnv512.update.bind(fnv512),
    final: fnv512.final.bind(fnv512),
    cleanup: fnv512.cleanup.bind(fnv512),

    digest: data => toHexString(fnv512.digest(data, 512, fnv512.variants.FNV_VARIANT_1A))
  },
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
  },
  "shash": {
    init: () => shash.init(512),
    update: shash.update,
    final: shash.final,
    cleanup: shash.cleanup,

    digest: shash.digestHex
  }
}

// Test hash (http://example.com/favicon.ico, blake2b)
const LP_hash = "ff80f1e7b77312a37cee1e78cbb183ef0c5334e1d3c7404e3cfa8f1de5eac99a97f6082cef820fb2e15780bda9d09b3ae10f4c3ec892463c8e61a92e6666d21e";
// Test hash (http://example.com/ page, sha512)
//const LP_hash = "d06b93c883f8126a04589937a884032df031b05518eed9d433efb6447834df2596aebd500d69b8283e5702d988ed49655ae654c1683c7a4ae58bfa6b92f2b73a";
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
