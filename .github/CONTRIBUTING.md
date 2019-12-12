# Contributing to Minecraft Box

Thanks for showing interest in this project. We really need help to make this a great Minecraft launcher.

## Seting up your environment
Visual Studio Code is recommended for developping Minecraft Box.
You can also use www.gitpod.io, which is browser based and free for contributing with similar features:

[![Gitpod badge](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/lukechu10/Minecraft-Box-Launcher)

If for whatever reason non of these two options are availible, you can always use your favorite IDE.
All the commands are specified in `package.json` if you don't mind working with the command line.

## Submitting changes
Please send a GitHub Pull Request to Minecraft-Box-Launcher with a clear list of what you've done (read more about pull requests). Please follow our coding conventions (below) and make sure all of your commits are atomic (one feature per commit).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

```
$ git commit -m "A brief summary of the commit
> 
> A paragraph describing what changed and its impact."
```

## Coding Conventions

There are few constraints for contributing. Just run `npm run eslint:fix` to normalize styles with the rest of the repository.
Please be aware of the following:
+ All views should be written with [PugJS](https://pugjs.org/api/getting-started.html). The templates are loaded to JS via `pug-loader` and `webpack`.
+ Typescript should be used as much as possible.
+ Use JavaDocs (JavaScriptDocs) if the name of a method or member is not obvious.
+ We use `webpack` to package all renderer code.
+ To ensure a consistent coding style across the projet, please run `npm run eslint` or `npm run eslint:fix` before pushing the commits.

Thanks, Luke Chu
