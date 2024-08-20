import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import prisma from "@repo/db/client";
import { P2pTransaction } from "../../../components/p2pTransaction";


async function getP2pTranfer(){
    const session = await getServerSession(authOptions);
    const transaction = await prisma.p2pTransfer.findMany({
        where:{
            fromUserId:Number(session?.user?.id)
        }
    });
    return transaction.map((t) => ({
        amount: t.amount,
        timestamp: t.timestamp,
      })); 
}


export default async function() {
    const transactions = await getP2pTranfer();
    return <div>
        <div>
            <P2pTransaction transactions={transactions} />
        </div>
    </div>
}