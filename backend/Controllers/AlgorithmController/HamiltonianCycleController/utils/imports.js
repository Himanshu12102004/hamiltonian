/**
 * @module backend/Controllers/AlgorithmController/HamiltonianCycleController/utils/imports
 * @requires ../../../../Algorithms/HamiltonianCycleGenerator
 * @requires ../../../../utils/CustomError
 * @requires ../../../Middlewares/errorHandler
 * @requires ./info
 * @requires ./getCycleInfo
 * @requires ./handlePathRequest
 *
 * @description This module imports the required modules for Hamiltonian Cycle Controller and re-exports them to remove clutter in main file.
 */

const {
  HamiltonianCycleGenerator,
} = require("../../../../Algorithms/HamiltonianCycleGenerator");
const { CustomError } = require("../../../../utils/CustomError");
const catchAsync = require("../../../Middlewares/errorHandler");

const { validTypes } = require("./info");
const { getCycleInfo } = require("./getCycleInfo");
const { handlePathRequest } = require("./handlePathRequest");
const { handleHelpRequest } = require("./handleHelpRequest");
const { globalSocket } = require("../../../../WebSockets/socket");

module.exports = {
  HamiltonianCycleGenerator,
  CustomError,
  catchAsync,
  validTypes,
  getCycleInfo,
  handlePathRequest,
  handleHelpRequest,
  Socket: globalSocket,
};
