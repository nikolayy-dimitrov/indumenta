import { User } from "firebase/auth";

declare module "firebase/auth" {
    interface User {
        subscriptionStatus?: string;
    }
}