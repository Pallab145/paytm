import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    try {
        await db.$transaction( async (tx) => {
            //first find the user is present in the balance data base
            let balance = await tx.balance.findFirst({
                where:{
                    userId:Number(paymentInformation.userId)
                }
            });

            if(!balance){
                balance = await tx.balance.create({
                    data:{
                        userId:Number(paymentInformation.userId),
                        amount:0,
                        locked:0
                    }
                });
            }

            await tx.balance.update({
                where:{
                    userId:Number(paymentInformation.userId)
                },
                data:{
                    amount:{
                        increment:Number(paymentInformation.amount)
                    }
                }
            });

            await tx.onRampTransaction.updateMany({
                where:{
                    token:paymentInformation.token
                },
                data:{
                    status:"Success"
                }
            });
            return{
                msg:"captured"
            }
        });


    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        });
    }

})

app.listen(3003);