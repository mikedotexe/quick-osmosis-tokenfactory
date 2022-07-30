// @flow
import {
  getWalletFromMnemonic,
  getSigningOsmosisClient
} from '@cosmology/core';
import util from "util";
import { osmosis } from 'osmojs';
import { signAndBroadcast } from '@cosmology/core';
import {coins} from "@cosmjs/amino";

const alohaMnemonic = 'siren garbage suggest drama note tenant desk mad siege business mistake brown limit latin raise dune snack hedgehog maze pear grief soap obscure problem'
const honuaMnemonic = 'secret forest reason select sketch satisfy foil member injury omit hub north tired polar draft cushion check lens sail west beef slush seat insect'

const start = async () => {
  const alohaWallet = await getWalletFromMnemonic({
    mnemonic: alohaMnemonic,
    token: 'OSMO'
  });
  const alohaAccounts = await alohaWallet.getAccounts();
  const alohaAddress = alohaAccounts[0].address
  console.log('alohaAddress', alohaAddress)
  const client = await getSigningOsmosisClient({
   rpcEndpoint: 'https://testnet-rpc.osmosis.zone',
    signer: alohaWallet
  });

  // We'll just have one Message: MsgCreateDenom
  const {
    createDenom
  } = osmosis.tokenfactory.v1beta1.MessageComposer.withTypeUrl;
  const msgs = [
    createDenom({
      subdenom: 'aloha',
      sender: alohaAddress
    })
    // {
    //   typeUrl: "/osmosis.tokenfactory.v1beta1.MsgCreateDenom",
    //   value: osmosis.tokenfactory.v1beta1.MsgCreateDenom.fromPartial({
    //     subdenom: 'aloha'
    //   })
    // }

    ];
  const fee = {
    amount: [
      {
        amount: '0',
        denom: 'uosmo'
      }
    ],
    gas: "250000",
  };
  console.log('again bro', alohaAddress)
  const result = await signAndBroadcast({
    client,
    chainId: 'osmo-test-4',
    address: alohaAddress,
    msg: msgs[0],
    fee,
    memo: 'aloha, brah'
  });

  console.log(util.inspect(result, false, null, true))
}

start().then(() => console.log('Fin'))
