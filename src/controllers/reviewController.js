const ReviewModel = require("../models/reviewModel.js");
const BookModel = require("../models/bookModel.js");
const mongoose = require('mongoose');

const { isValidObjectId, objectValue, forBody, nameRegex } = require('../validators/validation.js');
const createReviews = async (req, res) => {
    try {
        const data = req.body;
        const bookId = req.params.bookId;
        const bookIdCheck = await BookModel.findById({ _id: bookId, isDeleted: false });
        if (bookIdCheck.isDeleted == true)
            return res.status(404).send({ status: false, message: "Book does not exist" });

        if (!forBody(data))
            return res.status(400).send({ status: false, message: "body should not remain empty" });


        if (!mongoose.isValidObjectId(data.bookId))
            return res.status(400).send({ status: false, message: "BookId is not valid" });

        if (!objectValue(data.bookId))
            return res.status(400).send({ status: false, message: "bookId must be present" });

        if (!objectValue(data.reviewedBy))
            return res.status(400).send({ status: false, message: "reviewedBy must be present" });

        if (!nameRegex(data.reviewedBy))
            return res.status(400).send({ status: false, message: "Please provide valid reviewedBy, it should not contains any special characters and numbers" });
        //code me dena hai reviewedAt, formate check nhi karna
        if (!objectValue(data.reviewedAt))
            return res.status(400).send({ status: false, message: "reviewedAt must be present" });
        // rating ka type number hi ho --- ho gaya
        if (!objectValue(data.rating))
            return res.status(400).send({ status: false, message: "rating must be present and value should not be zero" });

        if (typeof (data.rating) != "number" && !(data.rating <= 5))
            return res.status(400).send({ status: false, message: "Please enter a number & it should be in the range of 1 - 5 only " });

        if (!objectValue(data.review)) // require nhi hai magar mai daal diya hmm nhi hoga to delete kr denge
            return res.status(400).send({ status: false, message: "review must be present" });
        //if(!(rating <= 5))

        const savedData = await ReviewModel.create(data);

        const finalData = await ReviewModel.findById(savedData._id).select({ __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0 }); //by rohit

        res.status(201).send({ status: true, message: 'Success', data: finalData });
        const update = await BookModel.findOneAndUpdate({ _id: bookIdCheck._id }, { $inc: { "reviews": 1 } });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

const updateReviews = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        const reviewId = req.params.reviewId;
        // console.log(bookId)
        if (!isValidObjectId(reviewId))
            return res.status(400).send({ status: false, message: "ReviewId is not in correct format" });

        if (!reviewId)   // ye kaam nhi kar raha hai waise v 
            return res.status(400).send({ status: false, message: "ReviewId does not exist" });

        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "BookId is not in correct format" });

        let bookIdCheck = await BookModel.findOne({ _id: bookId, isDeleted: false });
        if (!bookIdCheck)
            return res.status(400).send({ status: false, message: "bookId does not exist" });

        let reviewIdCheck = await ReviewModel.findById({ _id: reviewId });
        if (!reviewId)
            return res.status(400).send({ status: false, message: "reviewId does not exist" });

        const data = req.body;
        console.log(data)
        if (!forBody(data))
            return res.status(400).send({ status: false, message: "body should not remain empty" });

        if (!objectValue(data.reviewedBy))
            return res.status(400).send({ status: false, message: "reviewedBy must be present" });

        if (!nameRegex(data.reviewedBy))
            return res.status(400).send({ status: false, message: "Please provide valid reviewedBy, it should not contains any special characters and numbers" });

        if (!objectValue(data.review))
            return res.status(400).send({ status: false, message: "review must be present" });

        if (!nameRegex(data.review))
            return res.status(400).send({ status: false, message: "Please provide valid review, it should not contains any special characters and numbers" });
        //yaha v number me ho 

        if (!objectValue(data.rating))
            return res.status(400).send({ status: false, message: "rating must be present" });

        if (typeof data.rating != "number" && !(data.rating <= 5))
            return res.status(400).send({ status: false, message: "Please enter a number & it should be in the range of 1 - 5 only " });

        // filter = {
        //     booId: databookId,
        //     reviewedBy: data.reviewedBy,
        //     reviewedAt,
        //     rating: data.rating,
        //     review: data.review

        // };

        let update = await ReviewModel.findOneAndUpdate({ _id: reviewId }, data, { new: true });//.select({__v:0,});
        console.log(update)
        let getData = {
            _id: bookIdCheck._id,
            title: bookIdCheck.title,
            excerpt: bookIdCheck.excerpt,
            userId: bookIdCheck.userId,
            category: bookIdCheck.category,
            isDeleted: bookIdCheck.isDeleted,
            reviews: bookIdCheck.reviews,
            releasedAt: bookIdCheck.releasedAt,
            reviewsData: [update]
        }
        return res.status(200).send({ status: true, message: "Success", data: getData });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}
const deleteReview = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        const reviewId = req.params.reviewId;
        let bookIdCheck = await BookModel.findById({ _id: bookId });
        if (!bookId) return res.status(400).send({ status: false, message: "bookId does not exist" });


        let reviewIdCheck = await ReviewModel.findById({ _id: reviewId });
        if (!reviewId) return res.status(400).send({ status: false, message: "reviewId does not exist" })
        if (bookIdCheck.isDeleted == true || reviewIdCheck.isDeleted == true) return res.status(400).send({ status: false, message: "book or bookreview does not exist" })

        if (reviewIdCheck.isDeleted == false) {
            let update = await ReviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true })
            let deleteReviewCount = await BookModel.findOneAndUpdate({ _id: bookIdCheck._id }, { $inc: { "reviews": -1 } })
            console.log(deleteReviewCount)
            return res.status(200).send({ status: true, data: update })
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}
module.exports.createReviews = createReviews
module.exports.updateReviews = updateReviews
module.exports.deleteReview = deleteReview