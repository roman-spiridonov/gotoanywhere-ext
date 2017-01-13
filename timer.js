function Timer() {
    this._timer = 0;
}

Timer.prototype.start = function () {
    this._timer = performance.now();
};

Timer.prototype.stop = function () {
    this._timer = performance.now() - this._timer;
};

Timer.prototype.reset = function () {
    this._timer = 0;
};

Timer.prototype.milliseconds = function () {
    return this._timer.toFixed(3);
};