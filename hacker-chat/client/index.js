import Events from "events";
import TerminalController from "./src/controller/terminal/index.js";

const componentEmitter = new Events();
const controller = new TerminalController();

await controller.initializeTable(componentEmitter);
