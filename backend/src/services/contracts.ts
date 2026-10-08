import type {Conditions,DataEnvelope,ForecastPoint} from "@vayurakshak/shared/types/air";
import type {TravelMode,RouteOption} from "@vayurakshak/shared/types/route";
import type {Profile,Service} from "@vayurakshak/shared/types/user";
import type {ApprovalRecord} from "@vayurakshak/shared/types/automation";
export interface AirQualityAdapter { getConditions(location:string):Promise<DataEnvelope<Conditions>> }
export interface WeatherAdapter {getWeather(location:string):Promise<DataEnvelope<{windKmh:number;windDir:string;humidity:number}>>}
export interface ForecastAdapter {getForecast(location:string,hours:24|48|72):Promise<DataEnvelope<ForecastPoint[]>>}
export interface FireAdapter {getSignals():Promise<DataEnvelope<{detections:number;cluster:string;confidence:string}>>}
export interface RouteAdapter {compare(origin:string,destination:string,mode:TravelMode):Promise<DataEnvelope<RouteOption[]>>}
export interface CalendarAdapter {getEvents():Promise<DataEnvelope<{id:string;name:string;when:string}[]>>;addSuggestion(suggestion:string,approval:ApprovalRecord):Promise<{simulated:boolean}>}
export interface MessagingAdapter {sendDraft(channel:Service,text:string,approval:ApprovalRecord):Promise<{simulated:boolean}>}
export interface DeviceAdapter {schedule(deviceId:string,time:string,approval:ApprovalRecord):Promise<{simulated:boolean}>}
export interface WearableAdapter {getTrends():Promise<DataEnvelope<{sleepScore:number;restingHrDelta:number;hrvDelta:number}>>}
export interface AssistantAdapter {recommend(question:string,profile:Profile):Promise<{text:string;source:"demo"|"live"}>}
