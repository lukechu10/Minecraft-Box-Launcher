# Contributing to Minecraft Box

Thanks for showing interest in this project. We really need help to make this a great Minecraft launcher.

## Seting up your environment
[Visual Studio Code](https://code.visualstudio.com/) is recommended for developing Minecraft Box.
You can also use www.gitpod.io, which is browser based and free for contributing with similar features:

[![Gitpod badge](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/lukechu10/Minecraft-Box-Launcher)

If for whatever reason non of these two options are availible, you can always use your favorite IDE.
All the commands are specified in `package.json` if you don't mind working with the command line.

### NPM Scripts
- `start`: start app in production mode
- `start:gitpod`: start app in production mode (run without sandboxing to be able to run on gitpod)
- `dev`: start app in developer mode (enables dev tools)
- `dev:gitpod`: start app in developer mode on gitpod
- `build`: run all build commands (production build by default)
- `build-watch`: run all watch commands (watches files for changes and build automatically) (development build by default)
- `eslint`: lint the project
- `eslint:fix`: lint the project and attempt to fix problems
- `pack`: package the app using `electron-builder`
- `dist`: package the app using `electron-builder` and create an installer to distribute

When developing the app, use `npm run build-watch` to watch for file changes.

## Testing out the app
If you are using Visual Studio Code, just use the keybinding **F5** or **Ctrl+F5** without debugging to launch the app. If you are using Gitpod or any other IDE, just use the command: `npm dev`. (**Note:** There is an issue with `npm dev` on gitpod so use the command `npm run dev:gitpod` instead). Starting the app this way also enables developer tools so use **Ctrl+Shift+I** or the context menu to open dev tools. 

If you wish to see how the application would look like in production, use the command `npm start` instead (use `npm run start:gitpod` if using Gitpod)

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
+ Some style conventions:
  + Lines should be ended with a semi colon, except for function definitions, `interface` / `class` / `namespace` and `import` / `export` statements. In general, in case of doubt, just run `npm run eslint:fix`
  + Brackets shoul always be on the same line:
  ```ts
  if (foo === "bar") { // correct
    alert("hello world!");
  }
  else
  { // incorect, bracket is not on same line as else
    // ...
  }
  ```
  + Use ES6 `import`s and `export`s over commonJS `require()`.
  + All code is in *Strict Mode*.
  + To see more style conventions, check out the eslint config file [here](https://github.com/lukechu10/Minecraft-Box-Launcher/blob/master/.eslintrc.json)
+ Always prefer readability over performance.
Thanks, Luke Chu
