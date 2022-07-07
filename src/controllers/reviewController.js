const ReviewModel = require("../models/reviewModel")
const BookModel = require("../models/bookModel")
const createReviews = async (req, res) => {
    try{
        const data = req.body;
        const bookId = req.params.bookId;
        let bookIdCheck = await BookModel.findById({ _id: bookId });
        if(bookIdCheck.isDeleted==true) return res.status(400).send({status: false, message: "book does not exist"})
        const savedData = await ReviewModel.create(data);
        res.status(201).send({status: true, message: 'Success', data: savedData})
    }catch(error){
        res.status(500).send({status: false, message: error.message})
    }

}

const updateReview = async(req, res) => {
    try{
        const {review, rating, reviewedBy} = req.body;
        const findData = await ReviewModel.findOne({isDeleted: false, })
    }catch(error){
        res.status(500).send({status: false, message: error.message})
    }
}

module.exports.createReviews = createReviews