const Joi = require('joi');
const Pharmacy = require('../../models/Pharmacy');

function validatePharmacyId(pharmacyId){
    const schema = Joi.object({
        pharmacyId    : Joi.number().integer().min(10001).required(),
    });
    return schema.validate(pharmacyId)
}

const viewPharmacyInfo = async(req,res)=>{
    const pharmacyId = req.params.pharmacyid;
    const {error} = validatePharmacyId({pharmacyId:pharmacyId});
    if (error) {
        console.error('Validation Error: pharmacy_id: '+error.details[0].message);
        res.status(400).send("Invalid Account ID provided");
        res.end();
        return;
    }

    const pharmacyInfo = await Pharmacy.getPharmacyInfo(pharmacyId);
    console.log(pharmacyInfo);
    try{
        if (pharmacyInfo.length==0){
            return res.status(404).send("Pharmacy not registered");
        }
        return res.status(200).send(pharmacyInfo);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
};

exports.viewPharmacyInfo = viewPharmacyInfo;