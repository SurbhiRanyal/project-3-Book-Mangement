const mongoose = require("mongoose");

const bookModel = require("../model/bookModel");
const reviewModel = require("../model/reviewModel");

const deletById = async (req, res) => {
  try {
    let data = req.params.bookId;

    // bookId  validation
    let idCheck = mongoose.isValidObjectId(data);

    if (!idCheck)
      return res
        .status(400)
        .send({ status: false, msg: "bookId is not a type of objectId" });

    let status = await bookModel.findById(data);
    if (!status)
      return res
        .status(404)
        .send({ status: false, msg: "this book is not present" });

    // authorization
    let token = req["authorId"];
    if (status.authorId != token) {
      return res
        .status(403)
        .send({
          status: false,
          msg: "You are not authorized to access this data",
        });
    }

    if (status.isDeleted === true) {
      return res
        .status(404)
        .send({ status: false, msg: "this book is already deleted" });
    }

    let deltebook = await bookModel.findByIdAndUpdate(
      data,
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, msg: "this Book is deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: "error", error: err.message });
  }
};

const reviewdelet = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;

    // bookid Validation and reviwId validation
    let idCheck = mongoose.isValidObjectId(bookId);

    if (!idCheck)
      return res
        .status(400)
        .send({ status: false, msg: "bookId is not a type of objectId" });

    let idCheckk = mongoose.isValidObjectId(reviewId);

    if (!idCheckk)
      return res
        .status(400)
        .send({ status: false, msg: "reviewId is not a type of objectId" });

    // book present or not
    let status = await bookModel.findOne({ _id: bookId });
    if (!status)
      return res.status(404).send({ msg: "this book is not present" });
    // review present or not
    let statuss = await reviewModel.findOne({ _id: reviewId });
    if (!statuss)
      return res.status(404).send({ msg: "this reviewer is not present" });

    if (statuss.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, msg: "this reviewr is already deleted" });

    const updatereview = await reviewModel
      .findOneAndUpdate(
        { _id: reviewId, bookId: bookId },
        {
          $set: { isDeleted: true },
        },
        { new: true }
      )
      .select({
        _id: 1,
        bookId: 1,
        reviewedBy: 1,
        reviewedAt: 1,
        rating: 1,
        review: 1,
        isDeleted: 1,
      });

    const rev = await reviewModel
      .find({ bookId: bookId, isDeleted: false })
      .count();

    const updatebooks = await bookModel.findOneAndUpdate(
      { _id: bookId },
      {
        $set: { reviews: rev },
      },
      { new: true }
    );
    let Doc = {
      Book: updatebooks,
      reviewerData: updatereview,
    };

    return res
      .status(200)
      .send({ status: true, msg: "updated review with book", data: Doc });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "error", error: err.message });
  }
};

module.exports.deletById = deletById;

module.exports.reviewdelet = reviewdelet;
