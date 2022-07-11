const BookModel = require('../models/bookModel.js');
const ReviewModel = require("../models/reviewModel.js")
const UserModel = require("../models/userModel.js");

const { isValidObjectId, objectValue, forBody, isbnIsValid, nameRegex, titleRegex, dateFormate } = require('../validators/validation.js');

const createBooks = async (req, res) => {
    try {
        const filedAllowed = ["title", "excerpt", "userId", "ISBN", "category", "subcategory", "releasedAt"];

        if (!forBody(req.body))
            return res.status(400).send({ status: false, message: "body should not remain empty" });

        const keyOf = Object.keys(req.body);
        const receivedKey = filedAllowed.filter((x) => !keyOf.includes(x));
        if (receivedKey.length) {
            return res.status(400).send({ status: false, msg: `${receivedKey} field is missing` });
        }

        const { title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted, releasedAt } = req.body;

        const check_title = await BookModel.findOne({ title: req.body.title });

        if (check_title)
            return res.status(400).send({ status: false, message: "title is already taken please provide different title" });

        if (!objectValue(title))
            return res.status(400).send({ status: false, message: "title must be present" });

        if (!titleRegex(title))
            return res.status(400).send({ status: false, message: "Please provide valid title, it should not contains any special characters and numbers" });

        if (!objectValue(excerpt))
            return res.status(400).send({ status: false, message: "excerpt cannot remains empty" });

        if (!nameRegex(excerpt))
            return res.status(400).send({ status: false, message: "Please provide valid excerpt, it should not contains any special characters and numbers" });

        if (!isValidObjectId(userId))
            return res.status(404).send({ status: false, message: "Please provide valid userId" });

        const findUserId = await UserModel.findOne({ _id: userId });
        if (!findUserId)
            return res.status(404).send({ status: false, message: "No userId is found" });

        if (!objectValue(userId))
            return res.status(400).send({ status: false, message: "UserId must be present it cannot remain empty" });

        if (!objectValue(category))
            return res.status(400).send({ status: false, message: "category cannot remains empty" });

        if (!objectValue(subcategory))
            return res.status(400).send({ status: false, message: "subcategory cannot remains empty" });

        const check_isbn = await BookModel.findOne({ ISBN: req.body.ISBN });

        if (check_isbn)
            return res.status(400).send({ status: false, message: "ISBN is already taken please provide different ISBN number" });

        if (!isbnIsValid(ISBN))
            return res.status(400).send({ status: false, message: "Invalid ISBN" });

        if (!objectValue(releasedAt))
            return res.status(400).send({ status: false, message: "releasedAt cannot remains empty" });

        if (isDeleted === " ") {
            if (!objectValue(isDeleted))
                return res.status(400).send({ status: false, message: "isDeleted must be present" });
        }
        if (isDeleted && typeof isDeleted !== Boolean)
            return res.status(400).send({ status: false, message: "isDeleted should be either true or false!" });

        // let token = req.bookIdNew;
        // if (token != userId)
        //     return res.status(403).send({ status: false, mesage: "Please provide your user" });

        const savedData = await BookModel.create(req.body);

        const finalData = await BookModel.findById(savedData._id).select({ __v: 0, createdAt: 0, updatedAt: 0 });
        res.status(201).send({ status: true, message: 'Success', data: finalData });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
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
                { subcategory: req.query.subcategory },
            ];

            // if (!isValidObjectId(userId))
            //     return res.status(404).send({ status: false, message: "Please provide valid userId" });


            const findData = await BookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 });

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

const getBooksById = async function (req, res) {  //If the book has no reviews then the response body should include book detail as shown here and an empty array for reviewsData.
    try {
        const bookId = req.params.bookId;

        if (!isValidObjectId(bookId))
            return res.status(404).send({ status: false, message: "Please provide valid bookId" });

        let bookIdCheck = await BookModel.findById({ _id: bookId });

        if (!bookIdCheck) return res.status(400).send({ status: false, message: "no book present from this BOOKID" });

        let { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, releasedAt, createdAt, updatedAt } = bookIdCheck;

        let Reviews = await ReviewModel.find({ bookId: bookIdCheck._id, isDeleted: false }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 }) //, 

        let getData = { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, releasedAt, createdAt, updatedAt, reviewsData: Reviews }


        //console.log(bookIdCheck)

        //console.log(Reviews)
        //  let getData = {
        // _id: bookIdCheck._id,
        // title: bookIdCheck.title,
        // excerpt: bookIdCheck.excerpt,
        // userId: bookIdCheck.userId,
        // category: bookIdCheck.category,
        // subcategory: bookIdCheck.subcategory,
        // isDeleted: bookIdCheck.isDeleted,
        // reviews: bookIdCheck.reviews,
        // releasedAt: bookIdCheck.releasedAt,
        // createdAt: bookIdCheck.createdAt,
        // updatedAt: bookIdCheck.updatedAt,
        //     bookIdCheck,
        //     reviewsData: Reviews
        // };

        return res.status(200).send({ status: true, message: "Books list", data: getData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}


const updateBook = async (req, res) => {
    try {
        const { title, excerpt, releaseAt, ISBN } = req.body;
        const bookId = req.params.bookId
        let filter = { _id: bookId, isDeleted: false }
        if (Object.keys(req.body).length != 0) {
            const findBook = await BookModel.findOne(filter);
            if (!findBook)
                return res.status(400).send({ status: false, message: "No book data is found" });


            const check_title = await BookModel.findOne({ title: title })
            if (check_title)
                return res.status(400).send({ status: false, message: "Title is already in use please give a different title to update" });

            if (!objectValue(title))
                return res.status(400).send({ status: false, message: "title must be present" });

            if (!nameRegex(title))
                return res.status(400).send({ status: false, message: "Please provide valid title, it should not contains any special characters and numbers" });

            if (!objectValue(excerpt))
                return res.status(400).send({ status: false, message: "excerpt must be present" });

            if (!nameRegex(excerpt))
                return res.status(400).send({ status: false, message: "Please provide valid excerpt, it should not contains any special characters and numbers" });

            if (!dateFormate(releaseAt))
                return res.status(400).send({ status: false, message: "releaseAt is not in a proper format" });

            if (!objectValue(releaseAt))
                return res.status(400).send({ status: false, message: "releaseAt must be present" });

                
            const check_isbn = await BookModel.findOne({ ISBN: req.body.ISBN });
            if (check_isbn)
                return res.status(400).send({ status: false, message: "ISBN is already taken please provide different ISBN number to update" });

            if (!isbnIsValid(ISBN))
                return res.status(400).send({ status: false, message: "Invalid ISBN" });

            // let token = req.bookIdNew;
            // if (token != findBook.userId.toString())
            //     return res.status(403).send({ status: false, mesage: "Please provide your user" });


            const updated = await BookModel.findOneAndUpdate({ _id: bookId }, req.body, { new: true });

            res.status(200).send({ status: true, message: 'Success', data: updated })
        } else {
            return res.status(400).send({ status: false, message: "request body cannot remain empty" });
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


const deleteById = async (req, res) => {
    try {

        const bookId = req.params.bookId
        let filter = { _id: bookId, isDeleted: false }

        const findBook = await BookModel.findOne(filter)
        if (!findBook)
            return res.status(400).send({ status: false, message: "This book is not found or deleted." });

        findBook.isDeleted = true;
        findBook.deletedAt = Date();

        // let token = req.bookIdNew;
        // if (token != findBook.userId.toString())
        //     return res.status(403).send({ status: false, mesage: "Please provide your user" });

        const deletedBooKs = await BookModel.findByIdAndUpdate({ _id: bookId }, findBook, { new: true });
        res.status(200).send({ status: true, message: 'Success', data: deletedBooKs });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}



module.exports.createBooks = createBooks;
module.exports.getBookDetails = getBookDetails;
module.exports.getBooksById = getBooksById;
module.exports.updateBook = updateBook;
module.exports.deleteById = deleteById;