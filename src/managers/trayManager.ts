import { Menu, Tray, app, shell } from "electron";
import { join } from "path";
import { trayManager } from "..";
import { checkForUpdate, update, updateProcess } from "../util/updateChecker";
import { connected } from "./socketManager";

let trayIcon = join(__dirname, "../assets/tray/Icon@2x.png");
export class TrayManager {
	tray: Tray;

	constructor() {
		this.tray = new Tray(trayIcon);
		this.tray.setToolTip(app.name);

		this.tray.on("right-click", () => this.update());
	}

	update() {
		this.tray.setContextMenu(
			Menu.buildFromTemplate([
				{
					icon: join(__dirname, "../assets/tray/Icon.png"),
					label: `${app.name} v${app.getVersion()}`,
					enabled: false
				},
				{
					id: "connectInfo",
					label: `Extension - ${connected ? "Connected" : "Not connected"}`,
					enabled: false
				},
				{
					type: "separator"
				},
				{
					label: "Presence Store",
					click: () => shell.openExternal("https://premid.app/store")
				},
				{
					type: "separator"
				},
				{
					label: "Check for Updates",
					click: () => checkForUpdate(),
					visible: !updateProcess || (updateProcess && updateProcess == "standby")
        },
				{
          label: `Update ${app.name}`,
          click: () => update(),
					visible: (updateProcess && updateProcess == "available")
        },
				{
          label: `Updating...`,
          enabled: false,
					visible: (updateProcess && updateProcess == "installing")
				},
				{
					label: "Acknowledgments",
					click: () => shell.openExternal("https://premid.app/contributors")
				},
				{
					type: "separator"
				},
				{
					label: `Quit ${app.name}`,
					role: "quit"
				}
			])
		);
	}
}

app.once("quit", () => trayManager.tray.destroy());