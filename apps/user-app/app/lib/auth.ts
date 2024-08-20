import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "0123456789", required: true },
            password: { label: "Password", type: "password", required: true },
            firstname:{ label: "Firstname", type: "text",placeholder: "John", required : true },
            lastname:{ label: "Lastname", type: "text",placeholder: "Smith", required : true }
          },
          async authorize(credentials: any) {
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        firstname: existingUser.firstname,
                        lastname: existingUser.lastname,
                        email: existingUser.number
                    }
                }
                return null;
            }

            try {
                const user = await db.user.create({
                    data: {
                        number: credentials.phone,
                        password: hashedPassword,
                        firstname: credentials.firstname,
                        lastname: credentials.lastname,
                        Balance: {
                            create: {
                                amount: 0, // Initialize balance with 0 or any starting amount
                                locked: 0
                            }
                        }
                    }
                });

                return {
                    id: user.id.toString(),
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.number
                }
            } catch(e) {
                console.error(e);
            }

            return null;
          },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        // TODO: can u fix the type here? Using any is bad
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session
        }
    }
  }
  