import {describe,it,expect} from 'vitest';
import {evaluateRoute} from './evaluate';
import {makePrototypeScenario} from './road-prototype';
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
 it('reports a clean draft path as unverified instead of legal',()=>{
  const draft=makePrototypeScenario('stop');
  const path=[{x:159,y:303},{x:159,y:280},{x:159,y:165},{x:159,y:100},{x:159,y:4},{x:159,y:0}];
  const result=evaluateRoute({scenario:draft,vehicle:'car',path,actions:[{kind:'stop',at:{x:159,y:305}}]});
  expect(result.status).toBe('unverified');
  expect(result.violations.some(v=>v.kind==='unverified_scenario')).toBe(true);
 });
 it('identifies a restricted draft gate but never certifies legality',()=>{
  const draft=makePrototypeScenario('noentry');
  const path=[{x:159,y:303},{x:159,y:280},{x:159,y:150},{x:159,y:4},{x:159,y:0}];
  const result=evaluateRoute({scenario:draft,vehicle:'car',path});
  expect(result.status).toBe('unverified');
  expect(result.violations.some(v=>v.kind==='restricted_gate')).toBe(true);
 });
});
