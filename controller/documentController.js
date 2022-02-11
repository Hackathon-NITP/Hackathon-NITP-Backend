const User = require("../models/userModel");
const Document = require("../models/documentModel");

exports.uploadDoc = async (req, res, next) => {
  try {
    // yet to implement
  } catch (error) {
    res.status(400).json({
      status: "fail",
      msg: error.message,
    });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).populate("documents");
    const docs = user.documents;

    res.status(200).json({
      status: "success",
      docs,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      msg: error.message,
    });
  }
};

exports.getDoc = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await Document.findById(id);

    if (!doc) throw new Error("Couldn't find the document");

    res.status(200).json({
      status: "success",
      doc,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      msg: error.message,
    });
  }
};

exports.deleteDoc = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await Document.findByIdAndDelete(id);

    if (!doc) throw new Error("Couldn't find the document");

    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      msg: error.message,
    });
  }
};

exports.updateDoc = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await Document.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) throw new Error("Couldn't find the document");

    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      msg: error.message,
    });
  }
};
