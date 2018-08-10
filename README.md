# grpc-electron-test

A `grpc-node` message roundtrip is slow when running on a renderer process of Electron on Windows. This repo is a demonstration of that.

To run:

```bash
yarn install
# in one terminal
node example/greeter_server.js
# in another terminal
yarn start
```

It runs the same gRPC test in the main process and in the renderer process and then shows the results in the renderer BrowserWindow. It computes the average roundtrip time for a simple gRPC message (200 messages, sent at an interval of 10 ms. The problem persists even if the interval is much greater).

On Windows I get a result like:

```
Average gRPC roundtrip (running in main): 0.62ms
Average gRPC roundtrip (running in renderer): 145.94ms
```

While on macOS I get a result like:

```
Average roundtrip (running in main): 1.29ms
Average roundtrip (running in renderer): 1.33ms
```

I'm guessing that this is somehow related to the different way that Windows and Mac/Linux implement the node.js runtime binding in the renderer process, i.e., https://github.com/electron/electron/blob/master/atom/common/node_bindings_win.cc vs. https://github.com/electron/electron/blob/master/atom/common/node_bindings_mac.cc

------

# electron-quick-start (original readme)

**Clone and run for a quick way to see Electron in action.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start) within the Electron documentation.

**Use this app along with the [Electron API Demos](https://electronjs.org/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/electron/electron-quick-start
# Go into the repository
cd electron-quick-start
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Resources for Learning Electron

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
- [electronjs.org/community#boilerplates](https://electronjs.org/community#boilerplates) - sample starter apps created by the community
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - a very basic starter Electron app
- [electron/simple-samples](https://github.com/electron/simple-samples) - small applications with ideas for taking them further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - an Electron app that teaches you how to use Electron
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - small demo apps for the various Electron APIs

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
