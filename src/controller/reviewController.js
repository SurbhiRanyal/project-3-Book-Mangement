const mongoose = require("mongoose");
//const userModel = require("../model/userModel")
const bookModel = require("../model/bookModel");

const reviewModel = require("../model/reviewModel");

const reviewsData = async function (req, res) {
  try {
    if (req.params.bookId == undefined)
      return res
        .status(400)
        .send({ status: false, message: "bookId is required." });
    let bookId = req.params.bookId;
    console.log(bookId);
    let data1 = req.body;

    let { reviewedBy, rating, review } = data1;

    if (!Object.keys(data1).length) {
      return res.status(400).send({ status: false, msg: "enter some data" });
    }

    if (bookId) {
      if (!mongoose.isValidObjectId(bookId)) {
        return res
          .status(400)
          .send({ status: false, msg: "bookId is not a type of objectId" });
      }
    }
    let check = await bookModel
      .findOne({ _id: bookId, isDeleted: false })
      .select();
    if (!check) {
      return res
        .status(404)
        .send({
          status: false,
          msg: "bookId is not present or Already deleted",
        });
    }

    data1.bookId = check._id;
    // console.log(check)

    if (reviewedBy) {
      if (typeof reviewedBy !== "string" || reviewedBy.trim().length === 0)
        return res
          .status(400)
          .send({ status: false, msg: "please enter valid reviwer Name" });
      reviewedBy = reviewedBy.trim();
    }
    if (review) {
      if (typeof review !== "string" || review.trim().length === 0)
        return res
          .status(400)
          .send({ status: false, msg: "please enter valid review" });
      data1.review = data1.review.trim();
    }
    let rat = /^[0-5\.]{1,5}$/;
    if (!rat.test(rating)) {
      return res
        .status(400)
        .send({
          status: false,
          msg: " review number should  digits only and should be 1 to 5",
        });
    }
    // rating = rating
    let rev = await reviewModel.create(data1);

    let Id = rev._id;

    let dataa = await reviewModel
      .find({ _id: Id, bookId: bookId, isDeleted: false })
      .select({
        _id: 1,
        bookId: 1,
        reviewedBy: 1,
        reviewedAt: 1,
        rating: 1,
        review: 1,
      });
    // console.log(dataa)
    let dataaa = await reviewModel
      .find({ bookId: bookId, isDeleted: false })
      .count();
    let reviews = dataaa;
    const updatebooks = await bookModel
      .findOneAndUpdate(
        { _id: bookId },
        {
          $set: { reviews: reviews },
        },
        { new: true }
      )
      .select();
    console.log(updatebooks);

    let doc = {
      data: updatebooks,
      reviewsData: dataa,
    };

    return res
      .status(200)
      .send({ status: true, message: "Books List", data: doc });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: "error", error: err.message });
  }
};

module.exports.reviewsData = reviewsData;
