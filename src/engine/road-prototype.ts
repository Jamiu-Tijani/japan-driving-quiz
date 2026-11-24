import type {RoadScenario, Point} from './types';

/**
 * Schematic coordinate system of the legacy 360×360 intersection.
 * Intentionally DRAFT: illustrates geometric crossings only.
 * It does not establish the legal validity of real Japanese road manoeuvres.
 */
const rect=(x1:number,y1:number,x2:number,y2:number):Point[]=>[{x:x1,y:y1},{x:x2,y:y1},{x:x2,y:y2},{x:x1,y:y2}];
const gate=(id:string,kind:'entry'|'exit',from:Point,to:Point,ruleId?:string,permittedVehicles?:readonly ('car'|'motorcycle'|'moped'|'bicycle'|'large_truck')[])=>({id,kind,from,to,ruleId,permittedVehicles});
export function makePrototypeScenario(kind:'noentry'|'stop'|'oneway'):RoadScenario {
 const north=gate('north','exit',{x:140,y:4},{x:180,y:4},kind==='noentry'?'prototype-no-entry':undefined,kind==='noentry'?[]:undefined);
 return {
 id:'prototype-'+kind,reviewStatus:'draft',sourceIds:[],
 roads:[{id:'vertical',polygon:rect(126,0,234,360)},{id:'horizontal',polygon:rect(0,112,360,224)}],
 boundaries:[],
 gates:[
  gate('approach','entry',{x:140,y:299},{x:178,y:299}),
  gate('left','exit',{x:2,y:146},{x:2,y:188}),
  gate('right','exit',{x:358,y:146},{x:358,y:188}),
  north
 ],
 requirements:kind==='stop'?[{id:'required-stop',type:'stop',ruleId:'prototype-stop'}]:[]
 };
}
