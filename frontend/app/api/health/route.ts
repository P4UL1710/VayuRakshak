import {NextResponse} from "next/server";
// Frontend liveness is independent of backend availability.
export async function GET(){return NextResponse.json({status:"ok",service:"vayurakshak-frontend"},{headers:{"Cache-Control":"no-store"}});}
