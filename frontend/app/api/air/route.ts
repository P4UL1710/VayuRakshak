import {proxyRead} from "@/lib/server/backend";
export async function GET(){return proxyRead("air");}
