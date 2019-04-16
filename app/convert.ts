
import * as side from '/Users/roessler/Documents/startup/workspace/side2java/app/example.json';

console.log("Suite: " + camelize(side.name, true));
for (var testCount in side.tests) {
  console.log("Test: " + camelize(side.tests[testCount].name));
  for (var commandCount in side.tests[testCount].commands) {
    console.log("Command: " + toCommandString(side, testCount, commandCount));
  }
}

function camelize(name: string, firstUpperCase: boolean = false) {
  return name.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word: String, index: number) {
    if (firstUpperCase) {
      return word.toUpperCase();
    }
    return index == 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/[^a-z ]/ig, '');
}

interface By {
    selector: string;
    identifier: string;
}

function toCommandString(side: any, testCount: string, commandCount: string) {
  switch (side.tests[testCount].commands[commandCount].command) {
  case "open":
    return "driver.get( \"" + side.url + "\" );";
  case "click": {
      let by: By = getBy(side.tests[testCount].commands[commandCount].target);
      return "driver.findElement( By." + by.selector + "(\"" + by.identifier + "\" ) ).click();";
    }
  case "type": {
      let by: By = getBy(side.tests[testCount].commands[commandCount].target);
      return "driver.findElement( By." + by.selector + "(\"" + by.identifier + "\" ) ).sendKeys( \"" + side.tests[testCount].commands[commandCount].value + "\" );";
    }
  }
  return side.tests[testCount].commands[commandCount].command;
}

function getBy(target: string){
  if (target.startsWith("css=")) {
    return {selector: "cssSelector", identifier: target.replace("css=", "")};
  }
  if (target.startsWith("id=")) {
    return {selector: "id", identifier: target.replace("id=", "")};
  }
  throw new Error("getBy not implemented for " + target);
}
