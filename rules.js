/* ActiCheck rules, version 0.2
   Edit this file to add or correct illnesses. No other code needs to change.
   IMPORTANT: every rule must be reviewed by a doctor and linked to a guideline before real use.
   Keys: symptom and context keys below, plus "age:adult|child|infant", "dur:short|mid|long",
   and vitals keys the app derives: v:fever v:tachy v:tachypnea v:hypox v:lowbp v:hypotension v:htn v:sevhtn v:hypogly v:hyperglyc v:obese v:underwt */
window.ACTI_RULES={
version:"0.2",
reviewed:false,
threshold:3,
symptoms:{fever:"Fever or feeling feverish",chills:"Chills or rigors",head:"Headache",dizzy:"Dizziness",vision:"Blurred vision",vomit:"Vomiting",diar:"Diarrhoea",abd:"Belly pain",rlq:"Pain in lower right belly",heart:"Heartburn or upper belly pain",cough:"Cough",breath:"Fast or difficult breathing",wheeze:"Wheezing",chest:"Chest pain",palp:"Palpitations",swell:"Swollen legs or face",neck:"Stiff neck",rash:"Rash",jaund:"Yellow eyes or skin",bleed:"Bleeding",seiz:"Seizure",urine:"Painful or frequent urination",thirst:"Excess thirst or urination",throat:"Sore throat",bone:"Bone or joint pain",conf:"Confusion or drowsiness",weak:"One-sided weakness or face droop",speech:"Trouble speaking",pale:"Tiredness or looking pale",sweat:"Night sweats or weight loss"},
context:{preg:"Pregnant",sickle:"Known sickle cell disease",hiv:"Known HIV",htn:"Known high blood pressure",dm:"Known diabetes",lassa:"Lassa or rodent exposure"},
tests:{rdt:"Malaria RDT or microscopy",fbc:"Full blood count",widal:"Typhoid test",bc:"Blood culture",ua:"Urinalysis",rbs:"Blood sugar test",ecg:"ECG",cxr:"Chest X-ray",ct:"CT scan",uss:"Ultrasound",lp:"Lumbar puncture",sputum:"Sputum for TB",hivt:"HIV test",lft:"Liver function",hpylori:"H. pylori test",lassa:"Lassa PCR"},
defaultTests:["rdt","fbc","ua","rbs"],
flags:[
{name:"Possible stroke",msg:"Time critical. Note when symptoms began, check blood sugar, and refer urgently for brain imaging.",tests:["rbs","ct"],when:[["weak"],["speech"]]},
{name:"Very high blood pressure",msg:"If there is headache, chest pain, confusion, vision change or breathlessness, treat as an emergency and refer. Recheck the reading.",tests:["ecg","ua"],when:[["v:sevhtn"]]},
{name:"Possible pre-eclampsia",msg:"Raised blood pressure, or headache with vision change, in pregnancy can be pre-eclampsia. Seizure in pregnancy is an emergency. Urgent obstetric review.",tests:["ua"],when:[["preg","v:htn"],["preg","head","vision"],["preg","seiz"]]},
{name:"Chest pain",msg:"Chest pain can be a heart attack. Check pulse and blood pressure, get an ECG if available, and refer urgently if suspected.",tests:["ecg"],when:[["chest"]]},
{name:"Low blood sugar",msg:"Treat low blood sugar immediately following your protocol, then look for the cause.",tests:["rbs"],when:[["v:hypogly"]]},
{name:"Possible diabetic emergency",msg:"High blood sugar with confusion, or with vomiting and thirst, can be diabetic ketoacidosis. Urgent care.",tests:["ua","rbs"],when:[["v:hyperglyc","conf"],["v:hyperglyc","vomit","thirst"]]},
{name:"Low oxygen level",msg:"Give oxygen if available and arrange urgent review.",tests:["cxr"],when:[["v:hypox"]]},
{name:"Possible shock",msg:"Low blood pressure, or low-normal pressure with a fast pulse, can mean shock. Check perfusion, give fluids per protocol, and refer urgently.",tests:["fbc"],when:[["v:hypotension"],["v:lowbp","v:tachy"]]},
{name:"Possible appendicitis",msg:"Pain in the lower right belly with fever or vomiting needs urgent surgical review.",tests:["fbc","uss"],when:[["rlq","fever"],["rlq","vomit"]]},
{name:"Possible meningitis or CNS infection",msg:"Do not miss. Consider urgent lumbar puncture, blood culture, and early treatment. Refer if not available.",tests:["lp","bc"],when:[["neck"],["conf","head"],["seiz","conf"]]},
{name:"Possible sepsis or severe illness",msg:"Check vitals now: blood pressure, pulse, perfusion. Infants under 1 with fever need urgent assessment.",tests:["bc","fbc"],when:[["conf"],["breath","chills"],["age:infant","fever"],["v:tachypnea","v:lowbp"]]},
{name:"Possible Lassa fever or haemorrhagic fever",msg:"Do not miss. Isolate, use protective equipment, and contact your surveillance team.",tests:["lassa"],when:[["lassa"],["bleed","throat"],["bleed","vomit"],["bleed","head"]]},
{name:"Rash with neck stiffness or confusion",msg:"Treat as possible meningococcal disease until excluded.",tests:["bc"],when:[["rash","neck"],["rash","conf"]]},
{name:"Fever in pregnancy",msg:"Malaria in pregnancy is dangerous. Test and treat early.",tests:["rdt"],when:[["preg","chills"],["preg","fever"]]},
{name:"Known HIV",msg:"Widen the list. TB and other opportunistic infections are more likely.",tests:["sputum","cxr"],when:[["hiv"]]}
],
conditions:[
{n:"Malaria",cat:"Fever",requires:["fever"],base:2,w:{chills:3,head:2,vomit:1,sweat:1,seiz:1},bonus:[{if:["preg"],add:1}],why:"Fever with chills and headache is the classic picture in endemic areas.",tests:["rdt","fbc"],source:"Pending guideline reference"},
{n:"Typhoid fever",cat:"Fever",requires:["fever"],base:1,w:{abd:2,head:1,diar:1,vomit:1},dur:["mid"],why:"Prolonged fever with abdominal symptoms.",tests:["widal","bc","fbc"],source:"Pending guideline reference"},
{n:"Urinary tract infection",cat:"Fever",base:0,w:{urine:4,abd:1,vomit:1,chills:1,fever:1},bonus:[{if:["preg"],add:1},{if:["age:child"],add:1},{if:["age:infant"],add:1}],why:"Urinary symptoms, often with fever. Often missed in children and pregnancy.",tests:["ua"],source:"Pending guideline reference"},
{n:"Pneumonia",cat:"Breathing",base:0,w:{cough:3,breath:3,chills:1,fever:1},bonus:[{if:["v:tachypnea"],add:2},{if:["v:hypox"],add:2}],why:"Cough with fast breathing and fever.",tests:["cxr","fbc"],source:"Pending guideline reference"},
{n:"Tuberculosis",cat:"Breathing",base:0,w:{cough:2,sweat:3,bone:1,fever:1},dur:["long"],bonus:[{if:["hiv"],add:2},{if:["v:underwt"],add:1}],why:"Cough and fever lasting weeks, with night sweats or weight loss.",tests:["sputum","cxr","hivt"],source:"Pending guideline reference"},
{n:"Asthma",cat:"Breathing",base:0,w:{wheeze:4,cough:2,breath:2},why:"Wheezing with cough and breathlessness, often recurrent.",tests:["cxr"],source:"Pending guideline reference"},
{n:"Gastroenteritis",cat:"Stomach",base:0,w:{diar:3,vomit:2,abd:1,fever:1},dur:["short"],why:"Diarrhoea and vomiting with a short illness.",tests:[],source:"Pending guideline reference"},
{n:"Peptic ulcer or gastritis",cat:"Stomach",base:0,w:{heart:4,abd:2,vomit:1},dur:["mid","long"],why:"Burning upper belly pain or heartburn lasting days to weeks.",tests:["hpylori","fbc"],source:"Pending guideline reference"},
{n:"Appendicitis",cat:"Stomach",base:0,w:{rlq:4,abd:1,vomit:1,fever:1},why:"Pain in the lower right belly with fever or vomiting needs surgical review.",tests:["fbc","uss"],source:"Pending guideline reference"},
{n:"Viral hepatitis",cat:"Stomach",base:0,w:{jaund:4,abd:1,vomit:1,fever:1},why:"Jaundice with fever or belly pain.",tests:["lft","fbc"],source:"Pending guideline reference"},
{n:"Viral respiratory infection",cat:"Breathing",base:0,w:{throat:2,cough:1,head:1,fever:1},dur:["short"],why:"Mild symptoms, short course.",tests:[],source:"Pending guideline reference"},
{n:"Raised blood pressure",cat:"Heart",base:0,w:{head:1,dizzy:1,vision:1},bonus:[{if:["v:htn"],add:4},{if:["v:sevhtn"],add:2},{if:["htn"],add:1}],why:"Blood pressure is high on today's reading. Repeat the measurement and arrange follow-up.",tests:["ua","ecg"],source:"Pending guideline reference"},
{n:"Heart-related chest pain",cat:"Heart",base:0,w:{chest:4,breath:1,palp:1},bonus:[{if:["htn"],add:1},{if:["dm"],add:1}],why:"Chest pain with risk factors needs heart assessment.",tests:["ecg"],source:"Pending guideline reference"},
{n:"Heart failure",cat:"Heart",base:0,w:{breath:2,swell:3,pale:1,cough:1},bonus:[{if:["htn"],add:1}],why:"Breathlessness with swollen legs, often with a history of high blood pressure.",tests:["ecg","cxr","fbc"],source:"Pending guideline reference"},
{n:"Stroke or mini-stroke",cat:"Brain",base:0,w:{weak:4,speech:4,vision:1,dizzy:1,head:1},bonus:[{if:["v:sevhtn"],add:1},{if:["htn"],add:1}],why:"Sudden weakness or trouble speaking. Time critical.",tests:["rbs","ct"],source:"Pending guideline reference"},
{n:"Tension or migraine headache",cat:"Brain",base:0,w:{head:3,vomit:1,vision:1,dizzy:1},excludes:["fever","neck","conf","rash","seiz"],why:"Headache without fever or neck stiffness. Always check blood pressure first.",tests:[],source:"Pending guideline reference"},
{n:"Diabetes or high blood sugar",cat:"Blood sugar",base:0,w:{thirst:3,vision:1,pale:1},bonus:[{if:["v:hyperglyc"],add:4},{if:["dm"],add:1},{if:["v:obese"],add:1}],why:"Excess thirst or urination, or a high sugar reading. Confirm with a repeat or fasting test.",tests:["rbs","ua"],source:"Pending guideline reference"},
{n:"Anaemia",cat:"Blood",base:0,w:{pale:4,dizzy:1,breath:1,palp:1},bonus:[{if:["preg"],add:1},{if:["sickle"],add:1}],why:"Tiredness and paleness. Common in pregnancy and sickle cell disease.",tests:["fbc"],source:"Pending guideline reference"},
{n:"Sickle cell crisis with infection",cat:"Blood",requires:["sickle"],base:0,w:{bone:3,jaund:1,breath:1,fever:1},why:"Known sickle cell disease with pain and fever needs urgent review.",tests:["fbc","rdt","bc"],source:"Pending guideline reference"},
{n:"Pre-eclampsia",cat:"Pregnancy",requires:["preg"],base:0,w:{head:2,vision:2,swell:2,abd:1},bonus:[{if:["v:htn"],add:3}],why:"Raised blood pressure with headache, vision change or swelling in pregnancy.",tests:["ua","fbc"],source:"Pending guideline reference"}
]
};
