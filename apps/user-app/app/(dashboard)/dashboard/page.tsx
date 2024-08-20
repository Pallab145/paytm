import { getServerSession } from "next-auth";
import { FindUserName } from "../../../components/FindUserName";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getUserName() {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findFirst({
        where: {
            id: Number(session?.user?.id),
        },
    });
    return user?.firstname;
}

export default async function Page() {  
    const userName = await getUserName(); 
    return (
        <div>
            <FindUserName currUser={`Hello ${userName}`} />
        </div>
    );
}
