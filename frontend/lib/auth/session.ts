import "server-only";
import {cookies} from "next/headers";
import {findSession} from "./store";
export const SESSION_COOKIE="vayu_session";
export async function getSessionUser(){return findSession((await cookies()).get(SESSION_COOKIE)?.value);}
