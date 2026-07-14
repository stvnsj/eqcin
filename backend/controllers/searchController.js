const asyncHandler = require("../utils/asyncHandler");
const executeSearch = require("../searchService/executeSearch")

function makeAppError(message, statusCode = 500) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.status = "error";
  return err;
}

exports.test = asyncHandler(async (req, res) => {
    const jsonTestReponse = {message : "This is a test reponse from the EQC API"}
    return res.status(200).send(jsonTestReponse);
});

exports.search = asyncHandler(async (req, res) => {
  const search = req.body;
  const rows = await executeSearch(search);

  return res.status(200).json({
    data: rows,
  });
});
