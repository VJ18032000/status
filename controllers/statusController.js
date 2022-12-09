const Status = require('../models/statusPost')
const User = require('../models/userModel')

const createStatus = (req, res, next) => {
    const post = new Status({
        user_id: req.body.user_id,
        status_text: req.body.status_text,
        font_style: req.body.font_style,
        background_color: req.body.background_color,
        font_color: req.body.font_color
    })
    if (req.file) {
        post.status_post = req.file.path
    }
    console.log(post.status_post)
    if (post.status_text || post.status_post) {
        post.save()
            .then(status => {
                const resdata = {
                    "status": "OK",
                    "message": "create status successfully",
                    "result": status,
                    "error": "{}"
                }
                res.json(resdata)
            })
            .catch(err => {
                const resdata = {
                    "status": "ERROR",
                    "message": "Something went wrong",
                    "result": "{}",
                    "error": err
                }
                res.json(resdata)
            })
    } else {
        const resdata = {
            "status": "ERROR",
            "message": "Please insert correctly",
            "result": "{}",
            "error": "{}"
        }
        res.json(resdata)
    }
}

const deletelStatus = (req, res, next) => {
    var id = req.body.status_id
    var user_id = req.body.user_id

    Status.findOneAndRemove({ $and: [{ _id: id }, { user_id: user_id }] })
        .then(status => {
            status.remove()
            const resdata = {
                "status": "OK",
                "message": "status deleted successfully",
                "result": "{}",
                "error": "{}"
            }
            res.json(resdata)
        })
        .catch(err => {
            const resdata = {
                "status": "ERROR",
                "message": "Please enter valid id",
                "result": "{}",
                "error": `${err}`
            }
            res.json(resdata)
        })
}

const userviewStatus = (req, res, next) => {
    var id = req.body.user_id
    var status_id = req.body.status_id

    Status.findById({ _id: status_id })
        .then(status => {
            if (status.status_post) {
                const resdata = {
                    "status": "OK",
                    "message": "status_post",
                    "result": [status],
                    "error": "{}"
                }
                res.json(resdata)
            } else {
                const resdata = {
                    "status": "OK",
                    "message": "status_text",
                    "result": [status],
                    "error": `${err}`
                }
                res.json(resdata)
            }
            if (status.user_id !== id) {
                status.view_details.push(id)
                status.save()
                console.log("successfully Viewed")
            }

            // if (status.view_details.indexOf(id) !== -1) {
            //     console.log("already Viewed")
            // } else {
            //     status.view_details.push(id)
            //     status.save()
            //     console.log("successfully Viewed")
            // }
        })
        .catch(err => {
            const resdata = {
                "status": "ERROR",
                "message": "Something went wrong",
                "result": "{}",
                "error": err === {} ? "please check status id" : `${err}`
            }
            res.json(resdata)
        })

}

const allstatusDetails =  (req, res, next) => {
        User.find()
            .then(result => {
            var user= []
            for (var i = 0; i < result.length; i++) {
                Status.find({ user_id: result[i].user_id })
                    .then(result => {
                        if (result != 0) {
                            let user_id=result[0].user_id;
                            user.push({[user_id]:result})
                            // console.log(result[0].user_id)
                        }
                    // console.log("inner User: "+user_id[user])
                    }) 
            }
            setTimeout(() => {
                const resdata = {
                    "status": "OK",
                    "message": "status",
                    "result":user,
                    "error":"{}"
                }
                res.json(resdata)
            }, 1000); 
            
        })
    .catch(err => {
        const resdata = {
            "status": "ERROR",
            "message": "Something went wrong",
            "result": "{}",
            "error": `${err}`
        }
        res.json(resdata)
    })



}

const statusDeails = (req, res, next) => {
    var id = req.body.user_id
    Status.find({ user_id: id })
        .then(status => {
            const resdata = {
                "status": status != 0 ? "OK" : "ERROR",
                "message": status != 0 ? "Status successfully Viewed" : "No status available",
                "result": status != 0 ? status : "{}",
                "error": status != 0 ? `{}` : "Please check user_id"
            }
            res.json(resdata)
        })
        .catch(err => {
            const resdata = {
                "status": "ERROR",
                "message": "Something went wrong",
                "result": "{}",
                "error": `${err}`
            }
            res.json(resdata)
        })
}

module.exports = {
    createStatus,
    deletelStatus,
    userviewStatus,
    allstatusDetails,
    statusDeails
}