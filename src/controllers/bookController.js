const BookModel = require('../models/bookModel.js');
const ReviewModel = require("../models/reviewModel.js")
const UserModel = require("../models/userModel.js");


const { objectValue, keyValue, isbnIsValid, nameRegex } = require('../validators/validation.js')

const createBooks = async (req, res) => {
    try {
        const filedAllowed = ["title", "excerpt", "userId", "ISBN", "category", "subcategory", "reviews"]
        const data = req.body;

        if (!keyValue(req.body))
            return res.status(400).send({ status: false, message: "body should not remain empty" })

        const keyOf = Object.keys(data);
        const receivedKey = filedAllowed.filter((x) => !keyOf.includes(x));
        if (receivedKey.length) {
            return res.status(400).send({ status: false, msg: `${receivedKey} field is missing` });
        }

        const { title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted } = req.body;

        let findUserId = await UserModel.findOne({ _id: userId })
        if (!findUserId)
            return res.status(404).send({ status: false, message: "No userId is found" })

        if (!objectValue(title))
            return res.status(400).send({ status: false, message: "title must be present" })

        if (!nameRegex(title))
            return res.status(400).send({ status: false, message: "Please provide valid title, it should not contains any special characters and numbers" })

        if (!objectValue(excerpt))
            return res.status(400).send({ status: false, message: "excerpt cannot remains empty" })

        if (!nameRegex(excerpt))
            return res.status(400).send({ status: false, message: "Please provide valid excerpt, it should not contains any special characters and numbers" })

        if (!objectValue(category))
            return res.status(400).send({ status: false, message: "category cannot remains empty" })

        if (!objectValue(subcategory))
            return res.status(400).send({ status: false, message: "subcategory cannot remains empty" })

        if (!objectValue(reviews))
            return res.status(400).send({ status: false, message: "review cannot remains empty" })

        // if (!/^[0-9]*\.?[0-9]*$/.test(reviews))
        //     return res.status(400).send({ status: false, message: "it only contaions numbers" })

        if (!isbnIsValid(ISBN))
            return res.status(400).send({ status: false, message: "Invalid ISBN" })



        if (isDeleted === " ") {
            if (!objectValue(isDeleted))
                return res.status(400).send({ status: false, message: "isDeleted must be present" })
        }
        if (isDeleted && typeof isDeleted !== Boolean)
            return res.status(400).send({ status: false, message: "isDeleted should be either true or false!" })

        const savedData = await BookModel.create(req.body);
        res.status(201).send({ status: true, message: 'Success', data: savedData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

const getBookDetails = async (req, res) => {
    try {
        const { userId, category, subcategory } = req.query;
        const filter = { isdeleted: false }
        if (Object.keys(req.query).length !== 0) {

            if (req.query.subcategory) {
                req.query.subcategory = { $in: req.query.subcategory.split(",") }
            }
            filter['$or'] = [
                { userId: req.query.userId },
                { category: req.query.category },
                { subcategory: req.query.subcaetgory },
            ];

            const findData = await BookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })

            //.select( {ISBN:0,subcategory: 0, isDeleted:0, createdAt:0, updatedAt:0, __v:0 })


            //console.log(findData)
            // filter ['$and'] = [
            //     {_id: findData._id},
            //     {title: findData.title},
            //     {excerpt: findData.excerpt},
            //     {userId: findData.userId},
            //     {category: findData.category},
            //     {reviews: findData.reviews},
            //     {releasedAt: findData.releasedAt},           
            // ];

            if (!findData.length) {
                return res.status(404).send({ status: false, message: "no data found for books" })
            }

            res.status(200).send({ status: true, message: 'Book list', data: findData })
        } else {
            return res.status(400).send({ status: false, message: "request query cannot remain empty" })
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

const getBooksById = async function (req, res) {
    const bookId = req.params.bookId;
    let bookIdCheck = await BookModel.findById({ _id: bookId });
    console.log(bookIdCheck)
    if (!bookIdCheck) return res.status(400).send({ status: false, message: "no book present from this BOOKID" })

    let Reviews = await ReviewModel.find({ bookId: bookIdCheck._id }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
    console.log(Reviews)
    let getData = {
        _id: bookIdCheck._id, title: bookIdCheck.title, excerpt: bookIdCheck.excerpt,
        userId: bookIdCheck.userId, category: bookIdCheck.category, isDeleted: bookIdCheck.isDeleted, reviews: bookIdCheck.reviews, releasedAt: bookIdCheck.releasedAt, reviewsData: Reviews
    }

    return res.status(200).send({ status: true, data: getData })
}


const updateBook = async (req,res) => {
    try {
        const {title, excerpt, releaseAt, ISBN} = req.body;
        filter = {isDeleted: false}
        
        
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });     
    }
}


module.exports.createBooks = createBooks;
module.exports.getBookDetails = getBookDetails;
module.exports.getBooksById = getBooksById