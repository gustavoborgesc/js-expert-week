import Blessed from "blessed";

export default class ComponentsBuilder {
    #screen;
    #layout;
    #input;
    #chat;
    #status;
    #activityLog;

    constructor() {}

    #baseComponent() {
        return {
            border: "line",
            mouse: true,
            keys: true,
            top: 0,
            scrollboar: {
                ch: "",
                inverse: true,
            },
            // habilita colocar cores e tags no texto
            tags: true,
        };
    }

    setScreen({ tittle }) {
        this.#screen = Blessed.screen({
            smartCSR: true,
            tittle,
        });

        this.#screen.key(["escape", "q", "C-c"], () => process.exit(0));

        return this;
    }

    setLayoutComponent() {
        this.#layout = Blessed.layout({
            parent: this.#screen,
            width: "100%",
            height: "100%",
        });

        return this;
    }

    setInputComponent(onEnterPressed) {
        const input = Blessed.textarea({
            parent: this.#screen,
            bottom: 0,
            height: "10%",
            inputOnFocus: true,
            padding: {
                top: 1,
                left: 2,
            },
            style: {
                fg: "#f6f6f6",
                bg: "#353535",
            },
        });

        input.key("enter", onEnterPressed);

        this.#input = input;

        return this;
    }

    setChatComponent() {
        this.#chat = Blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            align: "left",
            width: "50%",
            height: "90%",
            items: ["{bold}Messenger{/}"],
        });

        return this;
    }

    setStatusComponent() {
        this.#status = Blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: "25%",
            height: "90%",
            items: ["{bold}Users on Room{/}"],
        });

        return this;
    }

    setActivityLogComponent() {
        this.#activityLog = Blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: "25%",
            height: "90%",
            style: {
                fg: "yellow",
            },
            items: ["{bold}Activity Log{/}"],
        });

        return this;
    }

    buid() {
        const components = {
            screen: this.#screen,
            input: this.#input,
            chat: this.#chat,
            status: this.#status,
            activityLog: this.#activityLog,
        };

        return components;
    }
}
