import test from "node:test";
import assert from "node:assert/strict";
import {exposureReduction} from "../lib/exposure";
import {categorize} from "../lib/aqi";
import {routes} from "@vayurakshak/shared/data/mock-route-data";
test("route reductions use a consistent fastest-route baseline",()=>{assert.equal(exposureReduction(86,routes[1].score),43);assert.equal(exposureReduction(86,routes[2].score),28);assert.equal(exposureReduction(86,86),0);});
test("invalid exposure scores never produce misleading percentages",()=>{for(const [baseline,score] of [[0,42],[-1,40],[86,-3],[NaN,3],[86,Infinity]])assert.equal(exposureReduction(baseline,score),0);assert.equal(exposureReduction(86,100),0);});
test("demo AQI labels preserve brief boundary values",()=>{assert.equal(categorize(218).label,"Poor");assert.equal(categorize(286).label,"Very Poor");assert.equal(categorize(350).label,"Very Poor");assert.equal(categorize(351).label,"Severe");});
