import {describe,it,expect} from 'vitest';
import {evaluateRoute} from './evaluate';
import type {RoadScenario} from './types';
const scene:RoadScenario={id:'test-straight',reviewStatus:'verified',sourceIds:['fixture'],roads:[{id:'road',polygon:[{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100}]}],boundaries:[{id:'barrier',from:{x:50,y:25},to:{x:50,y:75},crossing:'forbidden',ruleId:'fixture-crossing'}],gates:[{id:'entry',kind:'entry',from:{x:0,y:40},to:{x:0,y:60}},{id:'exit',kind:'exit',from:{x:100,y:40},to:{x:100,y:60},permittedVehicles:['car'],ruleId:'fixture-vehicles'}],requirements:[]};
const path=[{x:-1,y:50},{x:20,y:50},{x:80,y:50},{x:101,y:50}];
describe('route evaluator',()=>{
 it('rejects draft legal claims',()=>expect(evaluateRoute({scenario:{...scene,reviewStatus:'draft'},vehicle:'car',path}).status).toBe('unverified'));
 it('detects forbidden crossing',()=>expect(evaluateRoute({scenario:scene,vehicle:'car',path}).violations.some(v=>v.kind==='forbidden_crossing')).toBe(true));
 it('rejects restricted vehicle',()=>expect(evaluateRoute({scenario:scene,vehicle:'bicycle',path}).violations.some(v=>v.kind==='restricted_gate')).toBe(true));
 it('requires an exit',()=>expect(evaluateRoute({scenario:scene,vehicle:'car',path:[{x:-1,y:50},{x:25,y:50}]}).status).toBe('incomplete'));
 it('rejects non-finite coordinate',()=>expect(evaluateRoute({scenario:scene,vehicle:'car',path:[{x:NaN,y:0},{x:10,y:10}]}).status).toBe('incomplete'));
 it('checks required stop action',()=>{const s={...scene,boundaries:[],requirements:[{id:'stop',type:'stop' as const,ruleId:'fixture-stop'}]};expect(evaluateRoute({scenario:s,vehicle:'car',path}).violations.some(v=>v.kind==='missing_action')).toBe(true)});
});
