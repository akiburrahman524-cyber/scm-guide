/* Tool registry: each tool file registers itself. */
'use strict';
const TOOLS = [];
const registerTool = (def) => TOOLS.push(def);
const getTool = (id) => TOOLS.find((x) => x.id === id);
