const Browserstack = require('browserstack-local');

class BrowserstackLauncherService {
  onPrepare(config) {
    if (!config.browserstackLocal) {
      return;
    }
    const opts = {
      key: config.key,
      forcelocal: true,
      onlyAutomate: true,
      ...config.browserstackOpts
    };
    this.browserstackLocal = new Browserstack.Local();

    return new Promise((resolve, reject) => {
      this.browserstackLocal.start(opts, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  onComplete(exitCode, config) {
    if (!this.browserstackLocal || !this.browserstackLocal.isRunning()) {
      return;
    }
    if (config.browserstackLocalForcedStop) {
      return process.kill(this.browserstackLocal.pid);
    }
    return new Promise((resolve, reject) => {
      this.browserstackLocal.stop(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}

module.exports = BrowserstackLauncherService;
