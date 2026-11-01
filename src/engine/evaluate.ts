import type {Point, Polyline, RoadScenario, EvaluationInput, EvaluationResult, Violation, Gate} from './types';

const EPS=1e-8;
const cross=(a:Point,b:Point,c:Point)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
const onSegment=(a:Point,b:Point,p:Point)=>Math.abs(cross(a,b,p))<EPS&&p.x>=Math.min(a.x,b.x)-EPS&&p.x<=Math.max(a.x,b.x)+EPS&&p.y>=Math.min(a.y,b.y)-EPS&&p.y<=Math.max(a.y,b.y)+EPS;
const intersect=(a:Point,b:Point,c:Point,d:Point)=>{const x=cross(a,b,c),y=cross(a,b,d),z=cross(c,d,a),w=cross(c,d,b);return ((x>EPS&&y< -EPS)||(x< -EPS&&y>EPS))&&((z>EPS&&w< -EPS)||(z< -EPS&&w>EPS))||Math.abs(x)<EPS&&onSegment(a,b,c)||Math.abs(y)<EPS&&onSegment(a,b,d)||Math.abs(z)<EPS&&onSegment(c,d,a)||Math.abs(w)<EPS&&onSegment(c,d,b)};
const same=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y)<EPS;
const inside=(p:Point,polygon:readonly Point[]):boolean=>{let yes=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[j],b=polygon[i];if(onSegment(a,b,p))return true;if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)yes=!yes}return yes};
const finite=(p:Point)=>Number.isFinite(p.x)&&Number.isFinite(p.y);
const hits=(path:Polyline,a:Point,b:Point)=>path.slice(1).some((p,i)=>intersect(path[i],p,a,b));
const touchedGates=(path:Polyline,gates:readonly Gate[])=>gates.filter(g=>hits(path,g.from,g.to));
const midpoint=(a:Point,b:Point):Point=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
/** Samples route at <= step distances, conservative when scene geometry is authored precisely. */
function staysOnRoad(path:Polyline,s:RoadScenario,step=2):boolean{
 if(!s.roads.length)return false;
 for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],len=Math.hypot(a.x-b.x,a.y-b.y);for(let j=0;j<=Math.max(1,Math.ceil(len/step));j++){const t=j/Math.max(1,Math.ceil(len/step));const p={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};if(!s.roads.some(r=>inside(p,r.polygon)))return false}}
 return true;
}
export function evaluateRoute({scenario:s,vehicle,path,actions=[]}:EvaluationInput):EvaluationResult{
 const violations:Violation[]=[];
 if(s.reviewStatus!=='verified')return {status:'unverified',violations:[{kind:'unverified_scenario',message:'Scenario rules have not been independently verified.'}]};
 if(path.length<2||path.some(p=>!finite(p))||path.slice(1).every((p,i)=>same(p,path[i])))return {status:'incomplete',violations:[{kind:'invalid_path',message:'Draw a non-empty route with valid coordinates.'}]};
 if(!staysOnRoad(path,s))violations.push({kind:'off_road',message:'Path leaves the drivable scene.'});
 for(const b of s.boundaries.filter(b=>b.crossing==='forbidden'))if(hits(path,b.from,b.to))violations.push({kind:'forbidden_crossing',message:'Route crosses a prohibited boundary.',ruleId:b.ruleId,at:midpoint(b.from,b.to)});
 const entrances=touchedGates(path,s.gates.filter(g=>g.kind==='entry'));
 const exits=touchedGates(path,s.gates.filter(g=>g.kind==='exit'));
 const entry=entrances[0],exit=exits[exits.length-1];
 if(!entry||!exit)return {status:'incomplete',violations:[...violations,{kind:'invalid_path',message:'Route must cross a defined entry and exit gate.'}]};
 for(const g of [entry,exit])if(g.permittedVehicles&&!g.permittedVehicles.includes(vehicle))violations.push({kind:'restricted_gate',message:'This vehicle type is not permitted through gate '+g.id,ruleId:g.ruleId});
 for(const requirement of s.requirements)if(!actions.some(a=>a.kind===requirement.type))violations.push({kind:'missing_action',message:'Required action is missing: '+requirement.type,ruleId:requirement.ruleId});
 return {status:violations.length?'invalid':'valid',violations,entryGateId:entry.id,exitGateId:exit.id};
}
