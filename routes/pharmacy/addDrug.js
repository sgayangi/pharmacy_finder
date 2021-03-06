/* 
    :: Add drug_types and branded_drugs
    URL : localhost:3000/pharmacy/addDrug
*/ 

const express = require('express');
const router = express.Router();
const Pharmacy = require('../../models/Pharmacy');
const { getDrugTypes, getBrandedDrugs, putPharmacyDrugTypes,putPharmacyBrandedDrugs,getPharmacyDrugTypes,getDrugTypesOfSelectedBrandedDrugs} = require('../../models/Pharmacy');
const isAPharmacy = require('../../middleware/isAPharmacy');
const { isNull } = require('lodash');
 

//Get drug_types and branded_drugs from the database
// localhost:3000/pharmacy/addDrug
router.get('/', isAPharmacy, function(request, response) {

    async function getData(){
        try{
            const pharmacy_id = request.session.user.id;
            const drug= await getDrugTypes(pharmacy_id);
            const brand = await getBrandedDrugs(pharmacy_id);
            
            response.render('pharmacy/addDrugPage',{drug_types: drug, branded_drugs: brand});
        }
        catch(err){
            console.log(err);
        }        
    }
    getData();
    
});


//Insert submitted data into pharmacy_drug_types and pharmacy_branded_drugs tables
router.post('/', isAPharmacy, function (request, response) {
    const pharmacy_id = request.session.user.id;
    
    const result= Object.keys(request.body);
    const drug_type_data=[];
    const branded_drug_data= [];

    for(var i=0; i<result.length;i++){
        if(result[i][0]==="4"){
            drug_type_data.push(result[i]);
        }else{
            branded_drug_data.push(result[i]);
        }
    }
    

    //Insert submitted data into pharmacy_drug_types table
    async function insertPharmacyDrugTypes(){
        try{
            const drug= await putPharmacyDrugTypes(pharmacy_id, drug_type_data);
        }
        catch(err){
            console.log(err);
        }      
    }
    insertPharmacyDrugTypes();  

    //Insert submitted data into pharmacy_drug_types and pharmacy_branded_drugs table
    async function insertPharmacyBrandedDrugs(){
        try{
            const brand = await putPharmacyBrandedDrugs(pharmacy_id, branded_drug_data);
        }
        catch(err){
            console.log(err);
        }       
    }
    insertPharmacyBrandedDrugs();

    //Newly added method
    //Insert drud_types of submitted pharmacy_branded_drugs which are not in the pharmacy_drug_types table
    async function insertDrugTypesOfSelectedPharmacyBrandedDrugs(){
        try{
            const pharmacy_drug=await getPharmacyDrugTypes(pharmacy_id);
            const pharmacy_drug_array=[];
            const selected_drug_array=[];
            const result_array=[];

            for(var i=0; i<pharmacy_drug.length;i++){
                pharmacy_drug_array.push(pharmacy_drug[i].drug_type_id);  
            }

            for(var j=0; j<branded_drug_data.length;j++){
                const selected_drug=await getDrugTypesOfSelectedBrandedDrugs(branded_drug_data[j]);
                if(j>=1 && selected_drug_array[j-1]===selected_drug[0].drug_type_id){
                    
                }else{
                    selected_drug_array.push(selected_drug[0].drug_type_id);
                }

            }   

            if(pharmacy_drug_array.length===0){
                const final_result=await putPharmacyDrugTypes(pharmacy_id, selected_drug_array);
            }else{
                for(k=0;k<selected_drug_array.length;k++){
                    for(m=1;m<= pharmacy_drug_array.length;m++){
                        if(selected_drug_array[k]=== pharmacy_drug_array[m-1]){
                            break;
                        }
                        else if(selected_drug_array[k]!= pharmacy_drug_array[m-1] && m===pharmacy_drug_array.length){
                            result_array.push(selected_drug_array[k]);
                            const final_result=await putPharmacyDrugTypes(pharmacy_id, result_array);
                            break;
                        }
                    } 
                }       
            }  
            const drug= await getDrugTypes(pharmacy_id);
            const brand = await getBrandedDrugs(pharmacy_id);
            
            response.render('pharmacy/addDrugPage',{drug_types: drug, branded_drugs: brand});

        }
        catch(err){
            console.log(err);
        }       
    }
    insertDrugTypesOfSelectedPharmacyBrandedDrugs();
    
});


module.exports = router;