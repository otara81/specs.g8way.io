import Stamps from "@permaweb/stampjs";
//import { WarpFactory } from "warp-contracts/web";
import { WarpFactory } from 'https://unpkg.com/warp-contracts@1.4.1/bundles/web.bundle.min.js'
import { prop } from "ramda";

const stamps = Stamps.init({ warp: WarpFactory.forMainnet() });

export const stampCounts = (txs) => stamps.counts(txs);

export const stamp = (tx, addr) =>
  stamps
    .hasStamped(addr, tx)
    .then((s) => (!s
      ? stamps.stamp(tx).then(_ => stamps.count(tx).then(prop("vouched")))
      : Promise.reject("Already Stamped!")));

export const stampCount = (tx) => stamps.count(tx).then(prop("vouched"));
