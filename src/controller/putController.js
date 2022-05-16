const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const bookModel = require("../model/bookModel");
const reviewModel = require("../model/reviewModel");

const updatebooks = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    let data = req.body;

    let { title, excerpt, ISBN, releasedAt } = data; // destructuring

    // bookid Validation
    let idCheck = mongoose.isValidObjectId(bookId);

    if (!idCheck)
      return res
        .status(400)
        .send({ status: false, msg: "bookId is not a type of objectId" });

    let status = await bookModel.findById(bookId);
    if (!status)
      return res.status(404).send({ msg: "this book is not present" });

    // authorization
    let token = req["userId"];

    if (status.userId != token) {
      return res
        .status(403)
        .send({
          status: false,
          msg: "You are not authorized to access this data",
        });
    }
    if (status.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, msg: "this book is already deleted" });

    if (!(title || excerpt || ISBN || releasedAt)) {
      return res
        .status(404)
        .send({ status: false, msg: "Plz enter valid keys for updation " });
    }

    if (title) {
      if (typeof title !== "string" || title.trim().length === 0)
        return res
          .status(400)
          .send({ status: false, msg: "please enter valid title" });
      const titleCheck = await bookModel.findOne({ title: title.trim() }); //.collation({ locale: 'en', strength: 2 })
      if (titleCheck) {
        return res
          .status(400)
          .send({ status: false, message: " this title already exist " });
      }
    }
    if (excerpt) {
      if (typeof excerpt !== "string" || excerpt.trim().length === 0)
        return res
          .status(400)
          .send({ status: false, msg: "please enter valid excerpt" });
    }
    if (ISBN) {
      if (typeof ISBN !== "string")
        return res
          .status(400)
          .send({ status: false, msg: "ISBN should have string datatype" });
      if (!/^\d{3}-?\d{10}/.test(ISBN.trim())) {
        return res
          .status(400)
          .send({ status: false, message: "  please enter valid ISBN " });
      }
      const ISBNCheck = await bookModel.findOne({ ISBN: ISBN.trim() });
      if (ISBNCheck) {
        return res
          .status(400)
          .send({ status: false, message: " this ISBN already exist " });
      }
    }

    if (releasedAt) {
      if (typeof releasedAt !== "string" || releasedAt.trim().length === 0)
        return res
          .status(400)
          .send({
            status: false,
            msg: "please enter valid releasedAt and Should be in String",
          });

      let releasedAtt =
        /^^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(
          releasedAt.trim()
        );
      if (!releasedAtt) {
        return res
          .status(400)
          .send({
            status: false,
            msg: " releasedAt YYYY/MM/DD Format or Enter A valied Date ",
          });
      }
    }

    const updatebooks = await bookModel.findOneAndUpdate(
      { _id: bookId },
      {
        // $addToSet: { tags: tags, subcategory: subcategory },
        $set: {
          title: title?.trim(),
          excerpt: excerpt?.trim(),
          ISBN: ISBN?.trim(),
          releasedAt: releasedAt?.trim(),
        },
      },
      { new: true }
    );

    return res.status(200).send({ status: true, data: updatebooks });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "error", error: err.message });
  }
};

const updatereview = async function (req, res) {
  try {
    if (req.params.bookId == undefined)
      return res
        .status(400)
        .send({ status: false, message: "bookId is required." });
    if (req.params.reviewId == undefined)
      return res
        .status(400)
        .send({ status: false, message: "reviewId is required." });
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;

    let data = req.body;

    let { review, rating, reviewedBy } = data; // destructuring

    if (!data || Object.keys(data).length === 0)
      return res
        .status(400)
        .send({ status: false, msg: "plz enter some data" });

    if (!(review || rating || reviewedBy)) {
      return res
        .status(404)
        .send({ status: false, msg: "Plz enter valid keys for updation " });
    }

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
    let status = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!status)
      return res
        .status(404)
        .send({ msg: "this book is not present or Already Deleted" });
    // review present or not
    let statuss = await reviewModel.findOne({
      _id: reviewId,
      isDeleted: false,
    });
    if (!statuss)
      return res
        .status(404)
        .send({ msg: "this reviewer is not present or Already Deleted" });

    if (status.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, msg: "this book is already deleted" });

    if (statuss.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, msg: "this reviewr is already deleted" });

    if (reviewedBy) {
      if (!reviewedBy || reviewedBy === undefined) {
        return res
          .status(400)
          .send({ status: false, msg: "reviewedBy is not given" });
      }
      if (typeof reviewedBy !== "string" || reviewedBy.trim().length === 0)
        return res
          .status(400)
          .send({ status: false, msg: "please enter valid reviwer Name" });
      reviewedBy = reviewedBy.trim();
    }
    if (rating) {
      let rat = /^[0-5\.]{1,5}$/;
      if (!rat.test(rating)) {
        return res
          .status(400)
          .send({
            status: false,
            msg: " review number should  digits only and should be 1 to 5",
          });
      }
    }
    if (review) {
      if (typeof review !== "string" || review.trim().length === 0)
        return res
          .status(400)
          .send({ status: false, msg: "please enter valid review" });

      data.review = data.review.trim();
    }

    const updatereview = await reviewModel
      .findOneAndUpdate(
        { _id: reviewId?.trim(), bookId: bookId?.trim() },
        {
          $set: { review: review, rating: rating, reviewedBy: reviewedBy },
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
      });
    let Doc = {
      Book: status,
      reviewerData: updatereview,
    };

    return res
      .status(200)
      .send({ status: true, msg: "updated review with book", data: Doc });
  } catch (err) {
    // console.log(err.message)
    return res.status(500).send({ status: "error", error: err.message });
  }
};

module.exports.updatebooks = updatebooks;
module.exports.updatereview = updatereview;
