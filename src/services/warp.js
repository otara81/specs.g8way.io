import { prop, path } from "ramda";
import {
  DeployPlugin,
  InjectedArweaveSigner,
} from "warp-contracts-plugin-deploy";
// @ts-ignore
import { WarpFactory, LoggerFactory } from "warp-contracts";

LoggerFactory.INST.logLevel("fatal");
const warp = WarpFactory.forMainnet().use(new DeployPlugin());

const AGG = "https://contracts.warp.cc";
const DRE = "https://cache-2.permaweb.tools/contract";

const options = {
  allowBigInt: true,
  internalWrites: true,
  unsafeClient: "skip",
  remoteStateSyncEnabled: true
};
export const contractsByWallet = (addr) =>
  fetch(`${AGG}/balances?walletAddress=${addr}`)
    .then((res) => res.json())
    .then(prop("balances"));

export const readState = (tx) =>
  warp
    .contract(tx)
    .setEvaluationOptions(options)
    .readState()
    .catch(e => warp.contract(tx).setEvaluationOptions({ ...options, remoteStateSyncSource: 'https://dre-5.warp.cc/contract' }).readState())
    .then(path(["cachedValue", "state"]));

export const deploy = async (contract) => {
  console.log("contract", contract);

  const userSigner = new InjectedArweaveSigner(window.arweaveWallet);
  await userSigner.setPublicKey();
  console.log("deploy");
  return await warp
    .deployFromSourceTx({
      wallet: userSigner,
      initState: JSON.stringify(contract.initState),
      srcTxId: contract.contractSrc,
      tags: contract.tags,
    })
    .then((x) => (console.log("result", x), x))
    .catch((x) => console.log(x));
  //disable bundling
};
