import { trayManager } from "..";
import { autoUpdater } from "electron-updater";

export let updateProcess: string = "standby";
autoUpdater.autoDownload = false;

export async function checkForUpdate(auto = false) {
  autoUpdater.setFeedURL({
    provider: "github",
    owner: "PreMiD",
    repo: "Linux"
  });
  autoUpdater.autoDownload = auto;
  updateTray("checking");
  try {
    autoUpdater.checkForUpdates();
  } catch (error) {
    errHandler(error);
  }
}

autoUpdater.on("checking-for-update", () => {
  updateTray("checking");
});

autoUpdater.on("update-available", () => {
  if (!autoUpdater.autoDownload) {
    update();
  }
});

autoUpdater.on("update-not-available", () => {
  updateTray("standby");
});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});

export async function update() {
  updateTray("installing");
  try {
    autoUpdater.downloadUpdate();
  } catch (error) {
    errHandler(error);
  }
}

autoUpdater.on("error", error => {
  errHandler(error);
});

function updateTray(reason: string) {
  console.log(
    (autoUpdater.autoDownload ? "[A/" : "[M/") +
      "UPDATER] - " +
      reason.toUpperCase()
  );
  updateProcess = reason;
  trayManager.update();
}

// Temporarily
function errHandler(error: any) {
  console.log(
    "An error occured while updating " +
      (autoUpdater.autoDownload ? "[AUTO] :" : "[MANUAL] :"),
    error ? (error.stack || error).toString() : "unknown"
  );
  updateTray("standby");
}
