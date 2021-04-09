# 3301-hash-alarm

[Get the add-on for Firefox 🦊 & Tor 🧅 !](https://addons.mozilla.org/en-US/firefox/addon/3301-hash-alarm/)

On page 56 of Liber Primus, 3301's book, a message was deciphered :

> Within the deep web, there exists a page that hashes to :
> ```
> 36367763ab73783c7af284446c
> 59466b4cd653239a311cb7116
> d4618dee09a8425893dc7500b
> 464fdaf1672d7bef5e891c6e227
> 4568926a49fb4f45132c2a8b4
> ```
> It is the duty of every pilgrim to seek out this page

This Firefox add-on allows you to help finding that page. It hashes with as little impact on performance as possible every page you load, while preserving anonymity and security. If you ever come across said page, you will be notified.

[Join the solving effort !](https://discord.gg/MW2dXhG)

## Supported algorithms

Currently, the following hashing algorithms are supported :
* SHA-512
* BLAKE2b
* Streebog
* SHA-3
* FNV-0/FNV-1/FNV-1a
* Grøstl
* MD6
* JH
* BLAKE-512
* LSH
* Skein
* Keccak3
* CubeHash
* Whirlpool-0/Whirlpool-T/Whirlpool

## Installation

You can easily install this add-on for Firefox or Tor Browser [here](https://addons.mozilla.org/en-US/firefox/addon/3301-hash-alarm/).

*__Note :__ Installing unofficial extensions in Tor Browser is not recommended. Even though this add-on was designed with anonymity and security in mind, you should proceed with caution.*

Chrome is partially supported : while URLs are hashed, content of pages isn't. Thus, the **Firefox version is recommended**. To install the add-on on chrome, unzip [the latest version](https://github.com/tweqx/3301-hash-alarm/archive/refs/heads/master.zip) in a new folder. Then, go to `chrome://extensions`, click "Load unpacked" and select the folder.

For development purposes, the unpacked extension should be loaded on [about:debugging](about:debugging).

## License
[GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)
