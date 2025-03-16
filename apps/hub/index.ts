import { randomUUIDv7, type ServerWebSocket } from "bun";
import type { IncomingMessage,SignupIncomingMessage } from "common/types";
import {prisma} from "db/prisma"
import nacl_utils from "tweetnacl-util"
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl"
import { v4 as uuidv4 } from 'uuid';

// This variable contains all the validators which are avaliable for us to send a request to start ticking a website and respond with the status
const avaliableValidators: {
  validatorId: string;
  socket: ServerWebSocket<unknown>;
  publicKey: string;
}[] = [];

// This variable contains the list of all the callbacks which are still left to resolve and the are expected the response of
const callbacks: { [callbackId: string]: (data: IncomingMessage) => void } = {};

const COST_PER_VALIDATION = 100; // In Lamports

Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  port: 8081,
  websocket: {
    async message(ws: ServerWebSocket<unknown>, message: string) {
      const data: IncomingMessage = JSON.parse(message);

      if (data.type === "signup") {
        const verified = await verifyMessage(
          `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
          data.data.publicKey,
          data.data.signedMessage
        );
        if (verified) {
          await signuphandler(ws, data.data);
        }
      } else if (data.type === "validate") {
        callbacks[data.data.callbackId](data);
        delete callbacks[data.data.callbackId]
      }
    },
    async close(ws: ServerWebSocket<unknown>) {
      avaliableValidators.splice(
        avaliableValidators.findIndex((v) => v.socket === ws),
        1
      );
    },
  }, // handlers
});

async function verifyMessage(message:string,publicKey:string,signature:string):Promise<Boolean>{
    const messageBytes = nacl_utils.decodeUTF8(message);
    const result = nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),
        new PublicKey(publicKey).toBytes()
    )

    return result;
}


async function signuphandler(ws:ServerWebSocket<unknown>,{ip,publicKey,signedMessage,callbackId}:SignupIncomingMessage){
    // First check this validator is already present in the db or not
    const validatorDb = await prisma.validator.findFirst({
        where:{
            publicKey
        }
    })

    // If we found him in the DB, then use the stored one information 
    if(validatorDb){
        ws.send(JSON.stringify({
            type:'signup',
            data:{
                validatorId:validatorDb.id,
                callbackId
            }
        }))

        avaliableValidators.push({
            validatorId:validatorDb.id,
            socket:ws,
            publicKey:validatorDb.publicKey
        })
    }

    // If it was not in the DB then create a new entry in the DB
    const validator = await prisma.validator.create({
        data: {
            ip,
            publicKey,
            location: 'unknown',
        },
    });

    ws.send(JSON.stringify({
        type: 'signup',
        data: {
            validatorId: validator.id,
            callbackId,
        },
    }));

    avaliableValidators.push({
        validatorId: validator.id,
        socket: ws,
        publicKey: validator.publicKey,
    });

}


setInterval(async ()=>{
    console.log("indside")
    const websitesToMonitor = await prisma.website.findMany({
        where:{
            disabled:false
        }
    })

    console.log(websitesToMonitor)
    for (const website of websitesToMonitor){

        avaliableValidators.forEach(validator => {
            console.log("here alo")
            const callbackId = uuidv4();
            console.log(`Sending validate to ${validator.validatorId} ${website.url}`);
            validator.socket.send(JSON.stringify({
                type:'validate',
                data:{
                    url:website.url,
                    callbackId
                }
            }))


            callbacks[callbackId] = async (data:IncomingMessage) => {
                if(data.type === 'validate' ){
                    const {validatorId,status,latency,signedMessage} = data.data;
                    const verified = await verifyMessage(
                        `Replying to ${callbackId}`,
                        validator.publicKey,
                        signedMessage
                    )
                    if(!verified){
                        return 
                    }

                    await prisma.$transaction(async (tx) => {
                        await tx.websiteTick.create({
                            data:{
                                websiteId:website.id,
                                validatorId,
                                status,
                                latency,
                                createdAt:new Date()
                            }
                        })

                        await tx.validator.update({
                            where:{
                                id:validatorId
                            },
                            data:{
                                pendingPayouts: {increment:COST_PER_VALIDATION}
                            }
                        })
                    })
                }
            }
        })
    }
},30 * 1000)