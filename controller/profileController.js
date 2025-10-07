const Profile = require('../models/profileModel.js')

module.exports.index = async (req, res) => {
    const profile = await Profile.find()
    if (profile)
        res.send(profile)
    else {
        throw new ExpressError(204, 'No profle data provided')
    }

}

module.exports.addNewProfile = async (req, res, next) => {

    let url = req.file?.path
    let filename = req.file?.filename
    console.log("image->",req.file)
    const profile = req.body?.profile
    const newProfile = new Profile(profile)
    newProfile.owner = req.user._id
    newProfile.image = { url, filename }
    await newProfile.save()
    res.send('profile added successfully')

}

module.exports.showProfile = async (req, res) => {

    const { id } = req.params;

    const profile = await Profile.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        }).populate('owner')

    if (profile) {

        res.send(profile)
    }
    else {
        throw new ExpressError(404, "Profile is not exist")
    }

}


module.exports.updateProfile= async (req, res) => {

  console.log("image->",req.file)
    const { id } = req.params

    if (!req.body.profile) {
        throw new ExpressError(400, 'No profile data provided');
    }

    let profile = await Profile.findByIdAndUpdate(id, { ...req.body.profile })

    if (!profile) {
        throw new ExpressError(404, 'Profile not found');
    }

   
    if (typeof req.file !== 'undefined') {
        let url = req.file.path
        let filename = req.file.filename
        profile.image = { filename, url }
        await profile.save()
    }
    res.json({ msg: 'profile updated successfully', profile: profile })

}

module.exports.deleteProfile = async (req, res) => {

    const { id } = req.params
    const deletedProfile = await Profile.findByIdAndDelete(id)

    if (!deletedProfile) {
        throw new ExpressError(404, "Profile not foundd")

    }
    res.send({
        success: true,
        msg: "Profile deleted successfully",
        data: deletedProfile
    })

}
