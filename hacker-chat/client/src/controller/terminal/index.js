import { constants } from "../../constants/index.js";
import ComponentsBuilder from "../../components/builder/index.js";

export default class TerminalController {
    #userCollors = new Map();

    constructor() {}

    #pickCollor() {
        return `#${(((1 << 24) * Math.random()) | 0).toString(16)}-fg`;
    }

    #getUserCollor(userName) {
        if (this.#userCollors.has(userName)) {
            return this.#userCollors.get(userName);
        }

        const collor = this.#pickCollor();
        this.#userCollors.set(userName, collor);

        return collor;
    }

    #onInputReceived(eventEmitter) {
        return function () {
            const message = this.getValue();
            console.log(message);
            this.clearValue();
        };
    }

    #onMessageReceived({ screen, chat }) {
        return (msg) => {
            const { userName, message } = msg;
            const collor = this.#getUserCollor(userName);
            chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`);
            screen.render();
        };
    }

    #onMessageSent({ screen, chat }) {
        return (msg) => {
            const { userName, message } = msg;
            const collor = this.#getUserCollor(userName);
            chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`);
            screen.render();
        };
    }

    #onStatusChanged({ screen, status }) {
        return (users) => {
            const { content } = status.items.shift();

            status.clearItems();
            status.addItem(content);
            users.forEach((userName) => {
                const collor = this.#getUserCollor(userName);
                status.addItem(`{${collor}}{bold}${userName}{/}`);
            });
            screen.render();
        };
    }

    #onActivityLogChanged({ screen, activityLog }) {
        return (msg) => {
            const [userName, activity] = msg.split(/\s/);
            const collor = this.#getUserCollor(userName);
            activityLog.addItem(`{${collor}}{bold}${userName} ${activity}{/}`);
            screen.render();
        };
    }

    #registerEvents(eventEmitter, components) {
        eventEmitter.on(
            constants.events.app.MESSAGE_RECEIVED,
            this.#onMessageReceived(components)
        );
        eventEmitter.on(
            constants.events.app.MESSAGE_SENT,
            this.#onMessageSent(components)
        );
        eventEmitter.on(
            constants.events.app.STATUS_UPDATED,
            this.#onStatusChanged(components)
        );
        eventEmitter.on(
            constants.events.app.ACTIVITYLOG_UPDATED,
            this.#onActivityLogChanged(components)
        );
    }

    async initializeTable(eventEmitter) {
        const components = new ComponentsBuilder()
            .setScreen({
                tittle: "HackerChat - Gustavo Borges",
            })
            .setLayoutComponent()
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent()
            .setStatusComponent()
            .setActivityLogComponent()
            .buid();

        this.#registerEvents(eventEmitter, components);
        components.input.focus();
        components.screen.render();

        // setInterval(() => {
        // const users = ["gustavobc"];

        // eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
        // users.push("fulano");
        // eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
        // users.push("beltrano", "ciclano");
        // eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
        // users.push("terciano", "quadriano");
        // }, 2000);
    }
}
