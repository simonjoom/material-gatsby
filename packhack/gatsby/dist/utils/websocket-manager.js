"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

const path = require(`path`);

const _require = require(`../redux`),
      store = _require.store;

const fs = require(`fs`);

/**
 * Get cached query result for given data path.
 * @param {string} dataFileName Cached query result filename.
 * @param {string} directory Root directory of current project.
 */
const readCachedResults = (dataFileName, directory) => {
  const filePath = path.join(directory, `public`, `static`, `d`, `${dataFileName}.json`);
  return JSON.parse(fs.readFileSync(filePath, `utf-8`));
};
/**
 * Get cached page query result for given page path.
 * @param {string} pagePath Path to a page.
 * @param {string} directory Root directory of current project.
 */


const getCachedPageData = (pagePath, directory) => {
  const _store$getState = store.getState(),
        jsonDataPaths = _store$getState.jsonDataPaths,
        pages = _store$getState.pages;

  const page = pages.get(pagePath);

  if (!page) {
    return null;
  }

  const dataPath = jsonDataPaths[page.jsonName];

  if (typeof dataPath === `undefined`) {
    console.log(`Error loading a result for the page query in "${pagePath}". Query was not run and no cached result was found.`);
    return undefined;
  }

  return {
    result: readCachedResults(dataPath, directory),
    id: pagePath
  };
};
/**
 * Get cached StaticQuery results for components that Gatsby didn't run query yet.
 * @param {QueryResultsMap} resultsMap Already stored results for queries that don't need to be read from files.
 * @param {string} directory Root directory of current project.
 */


const getCachedStaticQueryResults = (resultsMap, directory) => {
  const cachedStaticQueryResults = new Map();

  const _store$getState2 = store.getState(),
        staticQueryComponents = _store$getState2.staticQueryComponents,
        jsonDataPaths = _store$getState2.jsonDataPaths;

  staticQueryComponents.forEach(staticQueryComponent => {
    // Don't read from file if results were already passed from query runner
    if (resultsMap.has(staticQueryComponent.hash)) return;
    const dataPath = jsonDataPaths[staticQueryComponent.jsonName];

    if (typeof dataPath === `undefined`) {
      console.log(`Error loading a result for the StaticQuery in "${staticQueryComponent.componentPath}". Query was not run and no cached result was found.`);
      return;
    }

    cachedStaticQueryResults.set(staticQueryComponent.hash, {
      result: readCachedResults(dataPath, directory),
      id: staticQueryComponent.hash
    });
  });
  return cachedStaticQueryResults;
};

const getRoomNameFromPath = path => `path-${path}`;

class WebsocketManager {
  constructor() {
    (0, _defineProperty2.default)(this, "pageResults", void 0);
    (0, _defineProperty2.default)(this, "staticQueryResults", void 0);
    (0, _defineProperty2.default)(this, "isInitialised", void 0);
    (0, _defineProperty2.default)(this, "activePaths", void 0);
    (0, _defineProperty2.default)(this, "programDir", void 0);
    this.isInitialised = false;
    this.activePaths = new Set();
    this.pageResults = new Map();
    this.staticQueryResults = new Map();
    this.websocket;
    this.programDir;
    this.init = this.init.bind(this);
    this.getSocket = this.getSocket.bind(this);
    this.emitPageData = this.emitPageData.bind(this);
    this.emitStaticQueryData = this.emitStaticQueryData.bind(this);
  }

  init({
    server,
    directory
  }) {
    this.programDir = directory;
    const cachedStaticQueryResults = getCachedStaticQueryResults(this.staticQueryResults, this.programDir);
    this.staticQueryResults = new Map([...this.staticQueryResults, ...cachedStaticQueryResults]);
    this.websocket = require(`socket.io`)(server);
    this.websocket.on(`connection`, s => {
      let activePath = null; // Send already existing static query results

      this.staticQueryResults.forEach(result => {
        this.websocket.send({
          type: `staticQueryResult`,
          payload: result
        });
      });

      const leaveRoom = path => {
        s.leave(getRoomNameFromPath(path));
        const leftRoom = this.websocket.sockets.adapter.rooms[getRoomNameFromPath(path)];

        if (!leftRoom || leftRoom.length === 0) {
          this.activePaths.delete(path);
        }
      };

      const getDataForPath = path => {
        if (!this.pageResults.has(path)) {
          const result = getCachedPageData(path, this.programDir);

          if (result) {
            this.pageResults.set(path, result);
          } else {
            console.log(`Page not found`, path);
            return;
          }
        }

        this.websocket.send({
          type: `pageQueryResult`,
          why: `getDataForPath`,
          payload: this.pageResults.get(path)
        });
      };

      s.on(`getDataForPath`, getDataForPath);
      s.on(`registerPath`, path => {
        s.join(getRoomNameFromPath(path));
        activePath = path;
        this.activePaths.add(path);
      });
      s.on(`disconnect`, s => {
        leaveRoom(activePath);
      });
      s.on(`unregisterPath`, path => {
        leaveRoom(path);
      });
    });
    this.isInitialised = true;
  }

  getSocket() {
    return this.isInitialised && this.websocket;
  }

  emitStaticQueryData(data) {
    this.staticQueryResults.set(data.id, data);

    if (this.isInitialised) {
      this.websocket.send({
        type: `staticQueryResult`,
        payload: data
      });
    }
  }

  emitPageData(data) {
    if (this.isInitialised) {
      this.websocket.send({
        type: `pageQueryResult`,
        payload: data
      });
    }

    this.pageResults.set(data.id, data);
  }

}

const manager = new WebsocketManager();
module.exports = manager;
//# sourceMappingURL=websocket-manager.js.map