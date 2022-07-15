const ReviewModel = require("../models/reviewModel.js");
const BookModel = require("../models/bookModel.js");
const mongoose = require('mongoose');

const { isValidObjectId, objectValue, forBody, nameRegex } = require('../validators/validation.js');

//===================================================[API:FOR CREATING REVIEW DB]===========================================================

const createReviews = async (req, res) => {
    try {
        const data = req.body;
        const bookId = req.params.bookId;

        if (!mongoose.isValidObjectId(bookId))
        return res.status(400).send({ status: false, message: "BookId is not valid" });
        const bookIdCheck = await BookModel.findById({ _id: bookId, isDeleted: false });
        if (bookIdCheck.isDeleted == true)
            return res.status(404).send({ status: false, message: "Book does not exist" });

        if (!forBody(data))
            return res.status(400).send({ status: false, message: "body should not remain empty" });

       
            if(!data.reviewedBy)
            {data.reviewedBy="Guest"}
        if (!objectValue(data.reviewedBy))
       

        if (!nameRegex(data.reviewedBy))
            return res.status(400).send({ status: false, message: "Please provide valid reviewedBy, it should not contains any special characters and numbers" });

        if (!objectValue(data.rating))
            return res.status(400).send({ status: false, message: "Rating must be present and value should not be zero" });

        if (typeof data.rating != "number")
            return res.status(400).send({ status: false, message: "Please enter a number" });

        if (!(data.rating <= 5&&data.rating >= 1))
            return res.status(400).send({ status: false, message: "It should be in the range of 1 - 5 only" });

        data.reviewedAt = Date.now();
        data.bookId = bookId;

        const savedData = await ReviewModel.create(data);
        const update = await BookModel.findOneAndUpdate({ _id: bookIdCheck._id }, { $inc: { "reviews": 1 } },{new:true});
        let finalData = {
            _id: bookIdCheck._id,
            title: bookIdCheck.title,
            excerpt: bookIdCheck.excerpt,
            userId: bookIdCheck.userId,
            category: bookIdCheck.category,
            isDeleted: bookIdCheck.isDeleted,
            reviews: bookIdCheck.reviews,
            releasedAt: bookIdCheck.releasedAt,
            createdAt: bookIdCheck.createdAt,
            updatedAt: bookIdCheck.updatedAt,
            reviewsData: [savedData]
        };

        res.status(201).send({ status: true, message: 'Success', data: finalData });
        

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

//===================================================[API:FOR UPDATE REVIEW]===========================================================

const updateReviews = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        const reviewId = req.params.reviewId;



        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "BookId is not in correct format" });
        if (!isValidObjectId(reviewId))
            return res.status(400).send({ status: false, message: "ReviewId is not in correct format" });
            let bookIdCheck = await BookModel.findOne({ _id: bookId, isDeleted: false });
            if (!bookIdCheck)
                return res.status(400).send({ status: false, message: "book data is deleted" });


        let reviewIdCheck = await ReviewModel.findOne({ _id: reviewId });
        if (!reviewIdCheck)
        return res.status(400).send({ status: false, message: "reviewID is not VALID" });
  if(bookIdCheck.isDeleted==false && reviewIdCheck.isDeleted==false){
       

        let data = req.body;

        if (!forBody(data))
            return res.status(400).send({ status: false, message: "Body should not remain empty" });

        if (!objectValue(data.reviewedBy))
            return res.status(400).send({ status: false, message: "ReviewedBy name must be present" });

        if (!nameRegex(data.reviewedBy))
            return res.status(400).send({ status: false, message: "Please provide valid reviewer's name, it should not contains any special characters and numbers" });

        if (!objectValue(data.review))
            return res.status(400).send({ status: false, message: "Review must be present" });

        if (!nameRegex(data.review))
            return res.status(400).send({ status: false, message: "Please provide valid review, it should not contains any special characters and numbers" });

        if (!objectValue(data.rating))
            return res.status(400).send({ status: false, message: "Rating must be present" });

        if (typeof data.rating != "number")
            return res.status(400).send({ status: false, message: "Please enter a number only" });

            if (!(data.rating <= 5&&data.rating >= 1))
            return res.status(400).send({ status: false, message: "It should be in the range of 1 - 5 only" });
        let update = await ReviewModel.findOneAndUpdate({ _id: reviewId }, data, { new: true });
        const finalData = await ReviewModel.findById(update).select({ __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0 });

        let getData = {
            _id: bookIdCheck._id,
            title: bookIdCheck.title,
            excerpt: bookIdCheck.excerpt,
            userId: bookIdCheck.userId,
            category: bookIdCheck.category,
            isDeleted: bookIdCheck.isDeleted,
            reviews: bookIdCheck.reviews,
            releasedAt: bookIdCheck.releasedAt,
            createdAt: bookIdCheck.createdAt,
            updatedAt: bookIdCheck.updatedAt,
            reviewsData: [finalData]
        };

        return res.status(200).send({ status: true, message: "Success", data: getData });
    }
    else
    res.status(404).send({ status: false, message:"Review data is not found"});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}

//===================================================[API:FOR DELETE REVIEW]===========================================================


const deleteReview = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        const reviewId = req.params.reviewId;
        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "BookId is not in correct format" });
        if (!isValidObjectId(reviewId))
            return res.status(400).send({ status: false, message: "ReviewId is not in correct format" });
        let bookIdCheck = await BookModel.findById({ _id: bookId });
        if (!bookIdCheck) return res.status(404).send({ status: false, message: "BookId does not exist" });

        let reviewIdCheck = await ReviewModel.findById({ _id: reviewId });

        if (!reviewIdCheck) return res.status(400).send({ status: false, message: "reviewId does not exist" })
        if (bookIdCheck.isDeleted == true || reviewIdCheck.isDeleted == true) return res.status(404).send({ status: false, message: "book or bookreview does not exist" })

        if (reviewIdCheck.isDeleted == false) {
            let update = await ReviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true })
            let deleteReviewCount = await BookModel.findOneAndUpdate({ _id: bookIdCheck._id }, { $inc: { "reviews": -1 } },{new:true})

            console.log(deleteReviewCount)
            
        let finalData = {
            _id: bookIdCheck._id,
            title: bookIdCheck.title,
            excerpt: bookIdCheck.excerpt,
            userId: bookIdCheck.userId,
            category: bookIdCheck.category,
            isDeleted: bookIdCheck.isDeleted,
            reviews: bookIdCheck.reviews,
            releasedAt: bookIdCheck.releasedAt,
            createdAt: bookIdCheck.createdAt,
            updatedAt: bookIdCheck.updatedAt,
            reviewsData: [update]
        };
            return res.status(200).send({ status: true, message: "Success", data: finalData })
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}
module.exports.createReviews = createReviews
module.exports.updateReviews = updateReviews
module.exports.deleteReview = deleteReview