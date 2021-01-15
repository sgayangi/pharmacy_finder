// authorize pharmacy acc
// view pharmacy info
// view pending pharmacy accounts
const express = require('express');
const router = express.Router();

const {viewPharmacyInfo,viewPendingPharmacies,approvePharmacy} = require('../../controllers/system_admin/pharmacy');

/**
 * @description Load the data of all approval pending pharmacies
 * @URL http://localhost:3000/system_admin/pharmacy/pending
 * @method GET
 * @todo return results in response body in html file
 */
router.get('/pending',viewPendingPharmacies);

/**
 * @description Load the data of a pharmacy given a pharmacy ID
 * @URL http://localhost:3000/system_admin/pharmacy/view/{pharmacyid}
 * @method GET
 * @todo return results in response body in html file
 */
router.get('/view/:pharmacyid', viewPharmacyInfo);

/**
 * @description Approve a pharmacy that is not already approved and notify approval
 * @URL http://localhost:3000/system_admin/pharmacy/approve/{pharmacyid}
 * @method PUT
 */
router.put('/approve/:pharmacyid',approvePharmacy);

module.exports = router;