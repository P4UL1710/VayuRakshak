import RoutePlanner from "@/components/routes/RoutePlanner";
export default async function RoutesPage({searchParams}:{searchParams:Promise<{plan?:string}>}){
 const {plan}=await searchParams;
 return <RoutePlanner initialPlan={plan==="delayed"} balancedPlan={plan==="balanced"}/>;
}
