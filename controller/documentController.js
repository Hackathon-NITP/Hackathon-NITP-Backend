const Document = require("../models/documentModel");
const User = require("../models/userModel");

const uploadDoc = async (req, res, next) => {
  try {
    const documentDetails = new Document({
      name: req.headers.name,
      link: `${req.protocol}://${req.get(
        "host"
      )}/documents/${req.file.filename.replace(/ /g, "_")}`,
      type: req.headers.type,
    });
    const document = await documentDetails.save();

    const user = await User.findById(req.user.id);
    user.documents.push(document);
    const userDocsUpdate = await user.save();

    if (document && userDocsUpdate) {
      res.status(200).json({
        message: "Document upload successful for the user",
      });
    } else {
      res.status(400).json({
        message: "Document upload failed",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      msg: error.message,
    });
  }
};

const getAll = async (req, res, next) => {
  try {
    const id = req.user.id;
    console.log("ujjwal id", id);
    const user = await User.findById(id).populate("documents");
    console.log("joshi ", user);
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

const getDoc = async (req, res, next) => {
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

const deleteDoc = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await Document.findByIdAndDelete(id);

    if (!doc) throw new Error("Couldn't find the document");

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      msg: error.message,
    });
  }
};

const updateDoc = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await Document.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) throw new Error("Couldn't find the document");

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      msg: error.message,
    });
  }
};

module.exports = {
  uploadDoc,
  getAll,
  getDoc,
  deleteDoc,
  updateDoc,
};
