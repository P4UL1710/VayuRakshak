import {categorize} from "@/lib/aqi";
export function AirPulseOrb({aqi}:{aqi:number}){const {color}=categorize(aqi);return <div aria-hidden="true" className="air-pulse" style={{background:"radial-gradient(circle at 35% 28%, #FFEACB, "+color+"95 45%, #614A3C 100%)"}}><div className="orb-specks"/></div>;}
