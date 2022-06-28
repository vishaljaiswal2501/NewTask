const BlogModel = require("../models/blogModel")
const AuthorModel = require("../models/authorModel")
const isValidBody = function (y) {
  return Object.keys(y).length > 0
}
const isValid = function (x) {
  if (typeof x === "undefined" || x === null) return false
  if (x.authorId && x.authorId.length === 24) return false
  return true

}
const createblog = async function (req, res) {
  try {
    let body = req.body
    let authorId = body.authorId
    let title = body.title
    let strRegex = /^\w[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/
    if (!isValidBody(body)) return res.status(400).send({ status: false, msg: "Please enter details." })
    if (authorId.length != 24) return res.status(400).send({ status: false, msg: 'Please enter valid ID' })
    if (!body.title || !strRegex.test(body.title)) return res.status(400).send({ status: false, msg: "title is must in the valid formate" })
    if (!body.body) return res.status(400).send({ status: false, msg: "body is must in the valid formate" })
    if (!body.authorId || body.authorId.length != 24 || ! await AuthorModel.findById({ _id: body.authorId })) { return res.status(404).send({ status: false, msg: " authorId is must in the valid formate" }) }
    if (!body.category || typeof (body.category) != 'string') return res.status(400).send({ status: false, msg: "category is must in the valid formate" })
    let blogCreated = await BlogModel.create(body)
    return res.status(201).send({ status: true, data: blogCreated })

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }



}
const deleteBlogItem = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    console.log(blogId)


    let blogIdCheck = await BlogModel.findById({ _id: blogId });
    console.log(blogIdCheck)
    if (!blogIdCheck) {
      return res.status(404).send("No such blog exists");
    }
    if (blogIdCheck.isDeleted == true) {
      return res.status(400).send({ status: false, msg: "User is not Present / it's a deleted User" })
    }
    if (blogIdCheck && blogIdCheck.isDeleted == false) {
      let deletedBlogItem = await BlogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true })

      res.status(200).send({ data: deletedBlogItem })
    }

  }
  catch (error) {
    console.log("This is the Error", error.message)
    res.status(500).send({ msg: "Error", error: error.message })
  }

}
const deleteByQuery = async function (req, res) {
  try {
    let queryParam = req.query
    // if (req.query.authorId.length != 24) {
    // return res.send({ status: false, msg: "id is not in valid Format" })
    // }
    if (!isValidBody(queryParam)) {
      return res.status(400).send({
        status: false,
        msg: "Please enter details."
      })
    }
    if (isValid(queryParam))
      return res.status(400).send({
        status: false,
        msg: "Details not found"
      })
    let data = await BlogModel.updateMany({ $and: [queryParam, { isDeleted: false }] }, { $set: { isDeleted: true } }, { new: true })
    if (data.modifiedCount == 0) {
      return res.status(400).send({ status: "false", msg: "Blog Not Found" })
    }

    return res.status(200).send({ data: data })

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}



const filterBlogs = async function (req, res) {

  try {
    let query = req.query

    if (!query) {
      let allBlog = await BlogModel.find({ isDeleted: false, isPublished: true })
      if (allBlog.length == 0) return res.status(400).send({ status: "false", msg: "Blog Not Found" })
      return res.status(200).send({ status: true, msg: allBlog })
    }
    let getAllBlog = await BlogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }], $or: [query] })
    if (getAllBlog.length == 0) return res.status(400).send({ status: "false", msg: "Blog Not Found" })

    return res.status(200).send({ status: true, data: getAllBlog })

  } catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}
const updateBlog = async function (req, res) {
  try {
    let data = req.body
    let id = req.params.blogId


    if (!isValidBody(data)) return res.status(400).send({ status: false, msg: "please Enter data" })

    let blogId = await BlogModel.findById(id)
    if (!blogId) return res.status(400).send({ status: false, msg: "No such User Exits" })

    if (blogId.isDeleted == true) {
      return res.status(401).send({ status: false, msg: "User is not Present / it's a deleted User" })
    }
    let strRegex = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
    if (!data.title || !strRegex.test(data.title)) return res.status(400).send({ status: false, msg: "title is must in the valid format" })
    if (!data.body) return res.status(400).send({ status: false, msg: "body is must in the valid format" })

    let user = await BlogModel.findById({ _id: id }).select({ tags: 1, subCategory: 1, isDeleted: 1, _id: 0 });
    if (user.isDeleted === true) return res.status(400).send({ status: false, err: "user is not present" })
    if (data.tags) data.tags.push(...user.tags)
    if (data.subCategory) data.subCategory.push(...user.subCategory)
    data[`isPublished`] = true
    data[`publishedAt`] = new Date();
    console.log(data)
    let updateData = await BlogModel.findOneAndUpdate({ _id: blogId }, data, { new: true })
    res.status(200).send({ status: true, data: updateData })
  }
  catch (error) {
    // console.log("This is the Error", error.message) 
    res.status(500).send({ msg: "Error", error: error.message })
  }

}


module.exports.createblog = createblog
module.exports.deleteBlogItem = deleteBlogItem
module.exports.updateBlog = updateBlog
module.exports.deleteByQuery = deleteByQuery
module.exports.filterBlogs = filterBlogs
