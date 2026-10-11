/* ActiCheck rules, version 0.1
   Edit this file to add or correct illnesses. No other code needs to change.
   IMPORTANT: every rule must be reviewed by a doctor and linked to a guideline before real use.
   Keys: symptom and context keys below, plus "age:adult|child|infant" and "dur:short|mid|long". */
window.ACTI_RULES={
version:"0.1",
reviewed:false,
threshold:3,
symptoms:{chills:"Chills or rigors",head:"Headache",vomit:"Vomiting",diar:"Diarrhoea",abd:"Abdominal pain",cough:"Cough",breath:"Fast or difficult breathing",neck:"Stiff neck",rash:"Rash",jaund:"Yellow eyes or skin",bleed:"Bleeding",seiz:"Seizure",urine:"Painful or frequent urination",throat:"Sore throat",bone:"Bone or joint pain",conf:"Confusion or drowsiness",sweat:"Night sweats or weight loss"},
context:{preg:"Pregnant",sickle:"Known sickle cell disease",hiv:"Known HIV",lassa:"Lassa or rodent exposure"},
tests:{rdt:"Malaria RDT or microscopy",fbc:"Full blood count",widal:"Typhoid test",bc:"Blood culture",ua:"Urinalysis",cxr:"Chest X-ray",lp:"Lumbar puncture",sputum:"Sputum for TB",hivt:"HIV test",lft:"Liver function",lassa:"Lassa PCR"},
defaultTests:["rdt","fbc","ua"],
flags:[
{name:"Possible meningitis or CNS infection",msg:"Do not miss. Consider urgent lumbar puncture, blood culture, and early treatment. Refer if not available.",tests:["lp","bc"],when:[["neck"],["conf","head"],["seiz","conf"]]},
{name:"Possible sepsis or severe illness",msg:"Check vitals now: blood pressure, pulse, perfusion. Infants under 1 with fever need urgent assessment.",tests:["bc","fbc"],when:[["conf"],["breath","chills"],["age:infant"]]},
{name:"Possible Lassa fever or haemorrhagic fever",msg:"Do not miss. Isolate, use protective equipment, and contact your surveillance team.",tests:["lassa"],when:[["lassa"],["bleed","throat"],["bleed","vomit"],["bleed","head"]]},
{name:"Rash with neck stiffness or confusion",msg:"Treat as possible meningococcal disease until excluded.",tests:["bc"],when:[["rash","neck"],["rash","conf"]]},
{name:"Fever in pregnancy",msg:"Malaria in pregnancy is dangerous. Test and treat early.",tests:["rdt"],when:[["preg","chills"]]},
{name:"Known HIV",msg:"Widen the list. TB and other opportunistic infections are more likely.",tests:["sputum","cxr"],when:[["hiv"]]}
],
conditions:[
{n:"Malaria",base:2,w:{chills:3,head:2,vomit:1,sweat:1,seiz:1},bonus:[{if:["preg"],add:1}],why:"Fever with chills and headache is the classic picture in endemic areas.",tests:["rdt","fbc"],source:"Pending guideline reference"},
{n:"Typhoid fever",base:1,w:{abd:2,head:1,diar:1,vomit:1},dur:["mid"],why:"Prolonged fever with abdominal symptoms.",tests:["widal","bc","fbc"],source:"Pending guideline reference"},
{n:"Urinary tract infection",base:0,w:{urine:4,abd:1,vomit:1,chills:1},bonus:[{if:["preg"],add:1},{if:["age:child"],add:1},{if:["age:infant"],add:1}],why:"Urinary symptoms with fever. Often missed in children and pregnancy.",tests:["ua"],source:"Pending guideline reference"},
{n:"Pneumonia",base:0,w:{cough:3,breath:3,chills:1},why:"Cough with fast breathing and fever.",tests:["cxr","fbc"],source:"Pending guideline reference"},
{n:"Tuberculosis",base:0,w:{cough:2,sweat:3,bone:1},dur:["long"],bonus:[{if:["hiv"],add:2}],why:"Fever and cough lasting weeks, with night sweats or weight loss.",tests:["sputum","cxr","hivt"],source:"Pending guideline reference"},
{n:"Gastroenteritis",base:0,w:{diar:3,vomit:2,abd:1},dur:["short"],why:"Diarrhoea and vomiting with a short fever.",tests:[],source:"Pending guideline reference"},
{n:"Viral respiratory infection",base:0,w:{throat:2,cough:1,head:1},dur:["short"],why:"Mild symptoms, short course.",tests:[],source:"Pending guideline reference"},
{n:"Viral hepatitis",base:0,w:{jaund:4,abd:1,vomit:1},why:"Fever with jaundice.",tests:["lft","fbc"],source:"Pending guideline reference"},
{n:"Sickle cell crisis with infection",base:0,w:{bone:3,jaund:1,breath:1},requires:"sickle",why:"Known sickle cell disease with pain and fever needs urgent review.",tests:["fbc","rdt","bc"],source:"Pending guideline reference"}
]
};
