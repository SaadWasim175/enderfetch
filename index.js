import os from "os";
import chalk from "chalk";
import si from "systeminformation";
import { execSync } from "child_process";

function getNowPlaying() {
  try {
    const artist = execSync('playerctl metadata artist', { encoding: 'utf8' }).trim();
    const title = execSync('playerctl metadata title', { encoding: 'utf8' }).trim();
    if (artist && title) {
      return `${artist} - ${title}`;
    }
    return "No music playing";
  } catch {
    return "No music player detected";
  }
}

const icon = `
        _ _ _        "kkkkkkkk.
    ,kkkkkkkk.,    'kkkkkkkkk,
    ,kkkkkkkkkkkk., 'kkkkkkkkk.
    ,kkkkkkkkkkkkkkkk,'kkkkkkkk,
    ,kkkkkkkkkkkkkkkkkkk'kkkkkkk.
    "''"''',;::,,"''kkk''kkkkk;   __
        ,kkkkkkkkkk, "k''kkkkk' ,kkkk
        ,kkkkkkk' ., ' .: 'kkkk',kkkkkk
    ,kkkkkkkk'.k'   ,  ,kkkk;kkkkkkkkk
    ,kkkkkkkk';kk 'k  "'k',kkkkkkkkkkkk
    .kkkkkkkkk.kkkk.'kkkkkkkkkkkkkkkkkk'
    ;kkkkkkkk''kkkkkk;'kkkkkkkkkkkkk''
    'kkkkkkk; 'kkkkkkkk.,""''"''""
    ''kkkk;  'kkkkkkkkkk.,
        ';'    'kkkkkkkkkkkk.,
                ';kkkkkkkkkk'
                ';kkkkkk'
                    "''"
`;

const formatUptime = (sec) => {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
};

const getInfo = async () => {
  const hostname = os.hostname();
  const username = os.userInfo().username;
  const platform = os.platform();
  const arch = os.arch();
  const release = os.release();
  const uptime = formatUptime(os.uptime());
  const cpu = os.cpus()[0].model;
  const memTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1) + " GB";
  const memFree = (os.freemem() / 1024 / 1024 / 1024).toFixed(1) + " GB";

  const [gpuInfo, distroInfo, shellInfo, systemInfo] = await Promise.all([
    si.graphics(),
    si.osInfo(),
    si.shell(),
    si.system(),
  ]);

  const gpu = gpuInfo.controllers?.[0]?.model ?? "Unknown GPU";
  const distro = distroInfo.distro ?? "Unknown Distro";
  const wm = process.env.XDG_CURRENT_DESKTOP || process.env.DESKTOP_SESSION || "Unknown WM/DE";
  const shell = shellInfo || process.env.SHELL || "Unknown Shell";
  const system = systemInfo.model || "Unknown System";
  const nowPlaying = getNowPlaying()

  return [
    ``,
    ``,
    ``,
    ``,
    ``,
    `${chalk.bold.blue("User:      ")} ${username}@${hostname}`,
    `${chalk.bold.red("System:    ")} ${system}`,
    `${chalk.bold.green("OS:        ")} ${distro} (${platform} ${arch})`,
    `${chalk.bold.gray("Kernel:    ")} ${release}`,
    `${chalk.bold.magenta("Uptime:    ")} ${uptime}`,
    `${chalk.bold.cyan("CPU:       ")} ${cpu}`,
    `${chalk.bold.yellow("GPU:       ")} ${gpu}`,
    `${chalk.bold.blueBright("Memory:    ")} ${memFree} / ${memTotal}`,
    `${chalk.bold.white("Shell:     ")} ${shell}`,
    `${chalk.bold.cyanBright("WM/DE:     ")} ${wm}`,
    `${chalk.bold.whiteBright("Now Playing:")} ${nowPlaying}`,
  ];
};


const showFetch = async () => {
  const iconLines = icon
    .split("\n")
    .map((line, i) => {
      const colors = [chalk.magenta, chalk.cyan, chalk.blue];
      return colors[i % colors.length](line.padEnd(40));
    });

  const infoLines = await getInfo();

  const maxLines = Math.max(iconLines.length, infoLines.length);
  while (iconLines.length < maxLines) iconLines.push("".padEnd(40));
  while (infoLines.length < maxLines) infoLines.push("");

  for (let i = 0; i < maxLines; i++) {
    console.log(`${iconLines[i]}  ${infoLines[i]}`);
  }
};

showFetch();
