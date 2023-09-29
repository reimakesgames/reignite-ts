"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ourself = {
    Matrix: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0],
    ],
};
function Get2x2Determinant(a, b, c, d) {
    return a * d - b * c;
}
function Get3x3Determinant(matrix) {
    var _a = matrix[0], a = _a[0], b = _a[1], c = _a[2];
    var _b = matrix[1], d = _b[0], e = _b[1], f = _b[2];
    var _c = matrix[2], g = _c[0], h = _c[1], i = _c[2];
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}
function FirstMethod(matrix) {
    var detM = [
        [
            Get2x2Determinant(matrix[1][1], matrix[1][2], matrix[2][1], matrix[2][2]),
            Get2x2Determinant(matrix[1][0], matrix[1][2], matrix[2][0], matrix[2][2]),
            Get2x2Determinant(matrix[1][0], matrix[1][1], matrix[2][0], matrix[2][1]),
        ],
        [
            Get2x2Determinant(matrix[0][1], matrix[0][2], matrix[2][1], matrix[2][2]),
            Get2x2Determinant(matrix[0][0], matrix[0][2], matrix[2][0], matrix[2][2]),
            Get2x2Determinant(matrix[0][0], matrix[0][1], matrix[2][0], matrix[2][1]),
        ],
        [
            Get2x2Determinant(matrix[0][1], matrix[0][2], matrix[1][1], matrix[1][2]),
            Get2x2Determinant(matrix[0][0], matrix[0][2], matrix[1][0], matrix[1][2]),
            Get2x2Determinant(matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1]),
        ],
    ];
    var multAndTransp = [
        [detM[0][0], detM[1][0] * -1, detM[2][0]],
        [detM[0][1] * -1, detM[1][1], detM[2][1] * -1],
        [detM[0][2], detM[1][2] * -1, detM[2][2]],
    ];
    var det = Get3x3Determinant(matrix);
    for (var i = 0; i < multAndTransp.length; i++) {
        for (var j = 0; j < multAndTransp[i].length; j++) {
            multAndTransp[i][j] *= 1 / det;
        }
    }
    return multAndTransp;
}
function SecondMethod(matrix) {
    var _a = matrix[0], a = _a[0], b = _a[1], c = _a[2];
    var _b = matrix[1], d = _b[0], e = _b[1], f = _b[2];
    var _c = matrix[2], g = _c[0], h = _c[1], i = _c[2];
    var det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    return [
        [(e * i - f * h) / det, -(b * i - c * h) / det, (b * f - c * e) / det],
        [-(d * i - f * g) / det, (a * i - c * g) / det, -(a * f - c * d) / det],
        [(d * h - e * g) / det, -(a * h - b * g) / det, (a * e - b * d) / det],
    ];
}
var iterations = 1000000;
var firstTimes = [];
var secondTimes = [];
for (var i = 0; i < 30; i++) {
    var start = performance.now();
    for (var j = 0; j < iterations; j++) {
        FirstMethod(ourself.Matrix);
    }
    var end = performance.now();
    firstTimes.push(end - start);
    start = performance.now();
    for (var j = 0; j < iterations; j++) {
        SecondMethod(ourself.Matrix);
    }
    end = performance.now();
    secondTimes.push(end - start);
}
var firstAvg = firstTimes.reduce(function (a, b) { return a + b; }) / firstTimes.length;
var secondAvg = secondTimes.reduce(function (a, b) { return a + b; }) / secondTimes.length;
console.log("First method: ".concat(firstAvg));
console.log("Second method: ".concat(secondAvg));
