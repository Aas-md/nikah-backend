const Listing = require('../models/listingModel.js')

module.exports.index = async (req, res) => {
    const listings = await Listing.find()
    if (listings)
        res.send(listings)
    else {
        throw new ExpressError(204, 'No listing data provided')
    }

}

module.exports.addNewListing = async (req, res, next) => {
    
    let url = req.file?.path
    let filename = req.file?.filename
    const listing = req.body?.listing
    const newListing = new Listing(listing)
    newListing.owner = req.user._id
    newListing.image = { url, filename }
    await newListing.save()
    res.send('listing added successfully')

}

module.exports.showListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        }).populate('owner')

    if (listing) {

        res.send(listing)
    }
    else {
        throw new ExpressError(404, "Listing is not exist")
    }

}


module.exports.updateListing = async (req, res) => {


    const { id } = req.params

    if (!req.body.listing) {
        throw new ExpressError(400, 'No listing data provided');
    }

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

    if (!listing) {
        throw new ExpressError(404, 'Listing not found');
    }

    if (typeof req.file !== 'undefined') {
        let url = req.file.path
        let filename = req.file.filename
        listing.image = { filename, url }
        await listing.save()
    }
    res.json({ msg: 'listing updated successfully', listing })

}

module.exports.deleteListing = async (req, res) => {

    const { id } = req.params
    const deletedListing = await Listing.findByIdAndDelete(id)

    if (!deletedListing) {
        throw new ExpressError(404, "Listing not foundd")

    }
    res.send({
        success: true,
        msg: "Listing deleted successfully",
        data: deletedListing
    })

}
