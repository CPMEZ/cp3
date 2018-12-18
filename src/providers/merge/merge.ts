import { Injectable } from '@angular/core';

@Injectable()
export class MergeProvider {

    constructor() {
        console.log('Constructor MergeProvider Provider');
    }

    mergePlans(targetPlan: any, sourcePlan: any): any {
        if (targetPlan["problems"]) {
        sourcePlan["problems"].forEach(p => {
            let found = false;
            for (var i = 0; i < targetPlan.problems.length; i++) {
                // is a problem from the newly-added content already in the plan?
                if (targetPlan.problems[i].text === p["text"]) {
                    found = true;
                    // these lines will cause problem to which we've added to be expanded
                    p["icon"] = "arrow-dropdown";
                    p["expanded"] = true;
                    // add all the goals and interventions to the existing problem
                    // console.log("goals");
                    this.addUndupItems(p["goals"], "text", targetPlan.problems[i].goals);
                    // console.log("interventions");
                    this.addUndupItems(p["interventions"], "text", targetPlan.problems[i].interventions);
                    break;  // no need to look further
                }
            }
            if (!found) {  // never found it, add the whole problem
                // console.log('not found, whole problem');
                p["icon"] = "arrow-dropdown";
                p["expanded"] = true;
                var t = deepCopy(p);
                // console.log(t);
                targetPlan.problems.push(t);
            }
        })
        } else {  // no problems in the target, add 'em
            sourcePlan["problems"].forEach(p => {
                p["icon"] = "arrow-dropdown";
                p["expanded"] = true;
            });
            targetPlan["problems"] = deepCopy(sourcePlan["problems"]);
            console.log('after merge', targetPlan["problems"]);
        }
    }

    addUndupItems(source: Array<object>, element: string, target: Array<object>) {
        // console.log('addUndupItems');
        // only insert items not already found
        var work = source;
        var found;
        for (var i = 0; i < target.length; i++) {
            found = undefined;
            for (var j = 0; j < work.length; j++) {
                if (work[j][element] == target[i][element]) {
                    found = j;
                }
            }
            if (found < work.length) {
                // remove from working array
                work.splice(found, 1);
            }
        };
        // now add the remaining, those not duplicate/removed
        if (work.length > 0) {
            for (var k = 0; k < work.length; k++) {
                target.push(deepCopy(work[k]));
            }
        }
    }

}

// helper
function deepCopy(obj) {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}