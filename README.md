# The Minecraft Box
<!-- Badges -->
![Dependencies status](https://david-dm.org/lukechu10/Minecraft-Box-Launcher.svg)
![ESLint status](https://github.com/lukechu10/Minecraft-Box-Launcher/workflows/ESLint%20(Typescript)/badge.svg)
![Build status](https://github.com/lukechu10/Minecraft-Box-Launcher/workflows/Build%20binaries%20and%20package/badge.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0dd47431ce3746c6a95ff909f68e67f7)](https://www.codacy.com/manual/lukechu10/Minecraft-Box-Launcher?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=lukechu10/Minecraft-Box-Launcher&amp;utm_campaign=Badge_Grade)
![GitHub All Releases](https://img.shields.io/github/downloads/lukechu10/Minecraft-Box-Launcher/total)
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/lukechu10/Minecraft-Box-Launcher?label=latest%20pre-release)
![GitHub Language](https://img.shields.io/github/languages/top/lukechu10/Minecraft-Box-Launcher?color=rgb%288%2C144%2C166%29)

The **Minecraft Box** is a modern Minecraft launcher, designed to provide integrations with multiple Minecraft services, configurations and thirs party software. The launcher is made with web technologies including electronJS.

## Features
Symbol	| Meaning
-------	| -----------
✔		| Availible in latest release / pre-release
🔨		| Work in Progress
🦄		| Planned
- Core
	- Create new game instances ✔
	- Instances are isolated from each other and do not share saves, settings or mods ✔
	- Official news feed from www.minecraft.net 🔨
- Authentication
	- Official Yggsdrasil Mojang Authentication ✔
	- Offline Mojang Authentication 🔨
	- Change skin inside launcher 🔨
- Install
	- Install vanilla releases, snapshots and historical versions ✔
	- Reinstall corrupted versions ✔
	- Install forge directly from launcher 🦄
	- Install optifine directly from launcher 🦄
- Launch
	- Launch vanilla releases and snapshots ✔
	- Launch historical versions 🦄
	- Launch with forge 🦄
	- Launch with optifine 🦄
	- Custom jar 🔨
	- Launch offline 🔨
	- View log output 🔨
- Java configuration
	- Custom java executable ✔
	- Custom java max and min memory ✔
	- Custom java arguments 🔨
- Instance configuration and management
	- Per-instance settings (seperate from global settings) 🔨
	- World saves manager (view and install maps) 🔨
	- Mods manager (quickly view and install forge mods) 🦄
	- Install mod packs 🦄
	- Minecraft settings viewer 🦄
- Installed versions viewer (view which versions are installed and can be played) 🔨

## Contributing
See [CONTRIBUTING.md](https://github.com/lukechu10/Minecraft-Box-Launcher/blob/master/.github/CONTRIBUTING.md) for more details

Thanks for showing interest in this project. We really need help to make this a great Minecraft launcher.

### Seting up your environment
Visual Studio Code is recommended for developping Minecraft Box.
You can also use www.gitpod.io, which is browser based and free for contributing with similar features:

[![Gitpod badge](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/lukechu10/Minecraft-Box-Launcher)

If for whatever reason non of these two options are availible, you can always use your favorite IDE.
All the commands are specified in `package.json` if you don't mind working with the command line.

### Submitting changes
Please send a GitHub Pull Request to Minecraft-Box-Launcher with a clear list of what you've done (read more about pull requests). Please follow our coding conventions (below) and make sure all of your commits are atomic (one feature per commit).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

```cmd
$ git commit -m "A brief summary of the commit
> 
> A paragraph describing what changed and its impact."
```

Check out [CONTRIBUTING.md](https://github.com/lukechu10/Minecraft-Box-Launcher/blob/master/.github/CONTRIBUTING.md) for more specific details on how to contribute to this project.
