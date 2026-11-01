/** A road scene is an explicit, reviewable model; it is not inferred from artwork. */
export type VehicleType = 'car'|'motorcycle'|'moped'|'bicycle'|'large_truck';
export type Point = Readonly<{x:number;y:number}>;
export type Polyline = readonly Point[];
export type RoadSegment = Readonly<{id:string;polygon:readonly Point[];permittedVehicles?:readonly VehicleType[]}>;
export type Boundary = Readonly<{id:string;from:Point;to:Point;crossing:'allowed'|'forbidden';ruleId:string}>;
export type Gate = Readonly<{id:string;from:Point;to:Point;kind:'entry'|'exit';permittedVehicles?:readonly VehicleType[];ruleId?:string}>;
export type Requirement = Readonly<{id:string;type:'stop'|'yield'|'signal';ruleId:string}>;
export type RoadScenario = Readonly<{id:string;reviewStatus:'verified'|'draft';sourceIds:readonly string[];roads:readonly RoadSegment[];boundaries:readonly Boundary[];gates:readonly Gate[];requirements:readonly Requirement[]}>;
export type DrivingAction = Readonly<{kind:'stop'|'yield'|'signal';at:Point}>;
export type EvaluationInput = Readonly<{scenario:RoadScenario;vehicle:VehicleType;path:Polyline;actions?:readonly DrivingAction[]}>;
export type Violation = Readonly<{kind:'invalid_path'|'off_road'|'forbidden_crossing'|'restricted_gate'|'missing_action'|'unverified_scenario';message:string;ruleId?:string;at?:Point}>;
export type EvaluationResult = Readonly<{status:'valid'|'invalid'|'incomplete'|'unverified';violations:readonly Violation[];entryGateId?:string;exitGateId?:string}>;
