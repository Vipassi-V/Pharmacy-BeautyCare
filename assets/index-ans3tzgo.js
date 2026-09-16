(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function o(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(i){if(i.ep)return;i.ep=!0;const n=o(i);fetch(i.href,n)}})();const R={name:"Ronit Pharmacy & Beauty Care",subLocation:"Hospital Road, Tansen",phone:"+977-75-520123",subtitle:"Consultation & Skincare Clinic"},ve=[{id:"oily",name:"Oily Skin",nepaliName:"तैलीय छाला",icon:"water_drop",tagline:"Excess sebum, enlarged pores, midday shine",description:"Characterized by visible shine, enlarged pores across T-zone, and prone to blackheads or congestion. Common in warmer lower altitudes or active lifestyles."},{id:"dry",name:"Dry & Dehydrated",nepaliName:"सुख्खा छाला",icon:"grain",tagline:"Tightness, flaking, rough texture, compromised barrier",description:"Skin feels stretched or flaky due to high altitude wind and low mountain humidity in Palpa. Requires barrier lipid replenishment and intense hydration."},{id:"combination",name:"Combination Skin",nepaliName:"मिश्रित छाला",icon:"contrast",tagline:"Oily T-zone (forehead & nose) with normal to dry cheeks",description:"Dual-zone behavior requiring balanced oil control on forehead/nose while preserving moisture across cheeks and jawline."},{id:"sensitive",name:"Sensitive & Reactive",nepaliName:"संवेदनशील छाला",icon:"spa",tagline:"Easily flushed, burning sensation, reactive to climate & fragrances",description:"Prone to stinging, redness, and rapid irritation under UV or cold weather. Demands fragrance-free, calming formulations."},{id:"normal",name:"Balanced (Normal)",nepaliName:"सन्तुलित छाला",icon:"check_circle",tagline:"Well-balanced moisture and oil, smooth texture",description:"Healthy skin barrier with minimal sensitivities. Needs daily antioxidant protection and altitude-grade broad spectrum defense."}],be=[{id:"mountain_uv_pigmentation",title:"High Altitude UV Damage & Melasma",nepaliTitle:"घामको डढेलो र कालो पोतो",image:"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",summary:"Persistent dark patches and stubborn UV pigmentation accelerated by high mountain sun in Palpa.",description:"At Palpa's elevation (~1,350m+), UV radiation index is substantially higher than lowland regions. Chronic sun exposure without adequate UVA/UVB/HEV shielding triggers hyperactive melanocytes, resulting in melasma, freckling, and photo-aging. Requires Tyrosinase inhibitors (Niacinamide, Alpha Arbutin, Vitamin C) paired with broad-spectrum PA++++ sunscreen.",isSevere:!1,categoryKey:"sun_damage"},{id:"acute_barrier_breakdown",title:"Severe Barrier Damage & Cracking",nepaliTitle:"गम्भीर छाला फुट्ने र पोल्ने समस्या",image:"https://images.unsplash.com/photo-1512290900672-1f55b9355755?auto=format&fit=crop&w=600&q=80",summary:"Intense redness, burning sensation upon water contact, and visible peeling due to damaged skin barrier.",description:"Acute degradation of the stratum corneum lipids caused by dry mountain winds, aggressive soap washing, or over-exfoliation. Immediate cessation of harsh actives is required alongside ceramide NP/AP/EOP replenishment and colloidal soothing balms.",isSevere:!0,categoryKey:"barrier"},{id:"hormonal_inflammatory_acne",title:"Active Acne & Inflammatory Breakouts",nepaliTitle:"डन्डिफोर र रातो पिप आउने",image:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",summary:"Papules, pustules, congested comedones, and inflamed bacterial flare-ups across cheeks and chin.",description:"Occurs when excess sebum combines with dead epidermal cells and Cutibacterium acnes colonization. Best addressed through gentle Salicylic Acid (BHA 1-2%), Zinc PCA oil modulation, and non-comedogenic gel hydrators without drying alcohol.",isSevere:!1,categoryKey:"acne"},{id:"acute_cystic_flare",title:"Severe Nodulocystic Flare & Infection Risk",nepaliTitle:"गहिरो पाक्ने दुखाइयुक्त डन्डिफोर",image:"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80",summary:"Deep painful sub-dermal cysts, potential bacterial cellulitis risk, and high scarring likelihood.",description:"Deep follicular disruption triggering profound localized swelling and distress. High risk of permanent tissue scarring. Must not be picked or squeezed; pharmacist evaluation is strictly required for potential topical/systemic antibiotic referral.",isSevere:!0,categoryKey:"acne"},{id:"dryness_winter_tightness",title:"Severe Dehydration & Winter Flakiness",nepaliTitle:"छाला कसिने र सुख्खा भएर पत्र निस्कने",image:"https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=600&q=80",summary:"Loss of natural water binding capacity resulting in chalky texture and uncomfortable tight sensation.",description:"High transepidermal water loss (TEWL) exacerbated by cold seasonal hill weather. Requires multi-molecular weight Hyaluronic Acid, Glycerin, and occlusive Shea/Squalane to lock hydration into cellular layers.",isSevere:!1,categoryKey:"hydration"},{id:"persistent_erythema_redness",title:"Facial Redness, Rosacea & Broken Capillaries",nepaliTitle:"अनुहार रातो हुने र नसा देखिने समस्या",image:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",summary:"Vasodilation, reactive stinging, and visible micro-vessels triggered by temperature swings.",description:"Persistent facial flushing triggered by wind chill, spicy food, or intense sunlight in the hills. Calming bio-actives like Centella Asiatica (Cica), Madecassoside, and Azelaic Acid reinforce vessel resilience and tone down redness.",isSevere:!1,categoryKey:"redness"}],le=[{id:"face_wash",name:"Face Wash & Cleansers",icon:"soap",order:1},{id:"serum",name:"Targeted Treatment Serums",icon:"science",order:2},{id:"moisturizer",name:"Moisturizers & Barrier Creams",icon:"spa",order:3},{id:"sunscreen",name:"Altitude Sunscreens (SPF 50+)",icon:"wb_sunny",order:4},{id:"special_care",name:"Specialized Clinical Balms",icon:"healing",order:5}],$e=[{id:"prod_fw_cera_gentle",categoryId:"face_wash",name:"Hydrating Gentle Foaming Cleanser",brand:"CeraVe Dermatological",price:1850,currency:"NPR",image:"https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",badges:["Ceramides 1,3,6-II","Non-Stripping","Fragrance Free"],isOTC:!0,suitableSkinTypes:["dry","sensitive","normal","combination"],suitableConcerns:["mountain_uv_pigmentation","acute_barrier_breakdown","dryness_winter_tightness","persistent_erythema_redness"],instruction:"Pump 1–2 drops onto wet palms. Gently massage in circular motions over face for 45–60 seconds, then rinse with lukewarm water (Morning & Evening)."},{id:"prod_fw_salicylic",categoryId:"face_wash",name:"Purifying 2% BHA Salicylic Clarifying Wash",brand:"La Roche-Posay Effaclar",price:2150,currency:"NPR",image:"https://images.unsplash.com/photo-1567928805192-d35d641494b1?auto=format&fit=crop&w=500&q=80",badges:["2% Salicylic Acid","Zinc Gluconate","Pore Refining"],isOTC:!0,suitableSkinTypes:["oily","combination"],suitableConcerns:["hormonal_inflammatory_acne","acute_cystic_flare"],instruction:"Lather small amount with water. Focus on T-zone and congested areas. Avoid aggressive scrubbing around active lesions. Use once daily initially, building to twice daily."},{id:"prod_serum_niacinamide",categoryId:"serum",name:"Niacinamide 10% + Zinc 1% Blemish & Tone Serum",brand:"The Ordinary Clinical",price:1650,currency:"NPR",image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80",badges:["10% Pure Niacinamide","Oil Balancing","Reduces Spots"],isOTC:!0,suitableSkinTypes:["oily","combination","normal"],suitableConcerns:["mountain_uv_pigmentation","hormonal_inflammatory_acne"],instruction:"Apply 3–4 drops over cleansed face before heavy creams. Pat gently until absorbed (Morning & Evening)."},{id:"prod_serum_cica_b5",categoryId:"serum",name:"Centella Asiatica + Provitamin B5 Soothing Elixir",brand:"Skin1004 Madagascar",price:2450,currency:"NPR",image:"https://images.unsplash.com/photo-1608248597359-5f2571216d7a?auto=format&fit=crop&w=500&q=80",badges:["100% Cica Extract","Instant Calming","Hypoallergenic"],isOTC:!0,suitableSkinTypes:["sensitive","dry","combination","normal"],suitableConcerns:["acute_barrier_breakdown","persistent_erythema_redness","acute_cystic_flare"],instruction:"Dispense 1 full dropper into palm. Press into inflamed or reddened zones. Safe for immediate post-sun application."},{id:"prod_serum_hyaluronic",categoryId:"serum",name:"Multi-Molecular Hyaluronic Acid 2% + B5",brand:"Cosrx Hydrium",price:1950,currency:"NPR",image:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=500&q=80",badges:["High & Low Dalton HA","Deep Quenching","Plumping"],isOTC:!0,suitableSkinTypes:["dry","normal","combination","sensitive"],suitableConcerns:["dryness_winter_tightness","mountain_uv_pigmentation"],instruction:"Apply onto slightly damp skin right after cleansing. Follow immediately with moisturizer to lock in moisture."},{id:"prod_moist_ceramide_barrier",categoryId:"moisturizer",name:"Advanced Barrier Restorative Ceramide Cream",brand:"Illiyoon Ceramide ATO",price:2200,currency:"NPR",image:"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=500&q=80",badges:["Ceramide Skin Complex™","48h Moisture","Fragrance Free"],isOTC:!0,suitableSkinTypes:["dry","sensitive","combination","normal"],suitableConcerns:["acute_barrier_breakdown","dryness_winter_tightness","persistent_erythema_redness"],instruction:"Smooth a nickel-sized amount over face and neck. Reapply throughout dry windy mountain afternoons if tightness recurs."},{id:"prod_moist_oilfree_gel",categoryId:"moisturizer",name:"Oil-Free Ultra-Light Hydrating Water Cream",brand:"Neutrogena Hydro Boost",price:1750,currency:"NPR",image:"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=500&q=80",badges:["Non-Comedogenic","Zero Grease","Prebiotic Yeast"],isOTC:!0,suitableSkinTypes:["oily","combination"],suitableConcerns:["hormonal_inflammatory_acne","acute_cystic_flare"],instruction:"Apply smoothly every morning and night after serum. Will not clog pores or trigger breakouts."},{id:"prod_sun_altitude_shield",categoryId:"sunscreen",name:"Himalayan UV Defense Fluid SPF 50+ PA++++",brand:"Biore UV Aqua Rich",price:1900,currency:"NPR",image:"https://images.unsplash.com/photo-1567928805192-d35d641494b1?auto=format&fit=crop&w=500&q=80",badges:["High Altitude Broad UV","Water Resistant","Zero White Cast"],isOTC:!0,suitableSkinTypes:["oily","combination","normal"],suitableConcerns:["mountain_uv_pigmentation","hormonal_inflammatory_acne","dryness_winter_tightness"],instruction:"Apply two fingertip lengths evenly to face and neck 15 minutes before outdoor exposure in Tansen. Reapply every 3 hours."},{id:"prod_sun_mineral_sensitive",categoryId:"sunscreen",name:"Pure Mineral Zinc Oxide Sunscreen SPF 50+",brand:"Avene Ultra-Light",price:2850,currency:"NPR",image:"https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",badges:["100% Mineral","Safe on Damaged Skin","Anti-Redness"],isOTC:!0,suitableSkinTypes:["sensitive","dry"],suitableConcerns:["acute_barrier_breakdown","persistent_erythema_redness","acute_cystic_flare"],instruction:"Gently pat onto sensitive or irritated skin as final morning step. Physical zinc shields without stinging open or cracked areas."},{id:"prod_balm_cicaplast_b5",categoryId:"special_care",name:"Cicaplast Baume B5+ Ultra-Repairing Balm",brand:"La Roche-Posay Clinical",price:2600,currency:"NPR",image:"https://images.unsplash.com/photo-1608248597359-5f2571216d7a?auto=format&fit=crop&w=500&q=80",badges:["5% Panthenol","Madecassoside","Tribioma Prebiotic"],isOTC:!0,suitableSkinTypes:["sensitive","dry","combination","normal","oily"],suitableConcerns:["acute_barrier_breakdown","acute_cystic_flare","persistent_erythema_redness"],instruction:"Apply localized thin layer directly onto compromised, cracked, or dry patches twice daily. Avoid eye contour."}];class De{constructor(){this.reset(),this.listeners=[]}reset(){this.currentStep=1,this.customer={firstName:"",lastName:"",gender:"",ageGroup:""},this.selectedSkinTypeId=null,this.selectedConcernIds=[],this.expandedConcernIds=[],this.showQRModal=!1,this.isMobileView=!1,this.sessionId="RP-"+Math.random().toString(36).substring(2,8).toUpperCase(),this.createdAt=new Date().toISOString()}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(o=>o!==e)}}notify(){this.listeners.forEach(e=>e(this.getState()))}getState(){return{currentStep:this.currentStep,customer:{...this.customer},selectedSkinTypeId:this.selectedSkinTypeId,selectedConcernIds:[...this.selectedConcernIds],expandedConcernIds:[...this.expandedConcernIds],showQRModal:this.showQRModal,isMobileView:this.isMobileView,sessionId:this.sessionId,createdAt:this.createdAt}}setStep(e){this.currentStep=e,this.notify()}setCustomerName(e,o){this.customer.firstName=e.trim(),this.customer.lastName=o.trim(),this.notify()}selectSkinType(e){this.selectedSkinTypeId=e,this.notify()}toggleConcern(e){const o=this.selectedConcernIds.indexOf(e);o>-1?this.selectedConcernIds.splice(o,1):this.selectedConcernIds.push(e),this.notify()}toggleExpandConcern(e){const o=this.expandedConcernIds.indexOf(e);o>-1?this.expandedConcernIds.splice(o,1):this.expandedConcernIds.push(e),this.notify()}setQRModal(e){this.showQRModal=e,this.notify()}setMobileView(e){this.isMobileView=e,this.notify()}getSelectedSkinType(){return ve.find(e=>e.id===this.selectedSkinTypeId)||null}getSelectedConcerns(){return be.filter(e=>this.selectedConcernIds.includes(e.id))}hasSevereCondition(){return this.getSelectedConcerns().some(o=>o.isSevere)}getRecommendedProducts(){const e=this.selectedSkinTypeId,o=this.selectedConcernIds,r=$e.filter(n=>{const s=!e||n.suitableSkinTypes.includes(e),l=o.length===0||n.suitableConcerns.some(a=>o.includes(a));return s||l}),i={};return le.forEach(n=>{i[n.id]={category:n,items:[]}}),r.forEach(n=>{i[n.categoryId]&&(i[n.categoryId].items.find(s=>s.id===n.id)||i[n.categoryId].items.push(n))}),i}clearSession(){this.reset(),this.notify()}}const h=new De;var H={},Ue=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},we={},B={};let ce;const Fe=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];B.getSymbolSize=function(e){if(!e)throw new Error('"version" cannot be null or undefined');if(e<1||e>40)throw new Error('"version" should be in range from 1 to 40');return e*4+17};B.getSymbolTotalCodewords=function(e){return Fe[e]};B.getBCHDigit=function(t){let e=0;for(;t!==0;)e++,t>>>=1;return e};B.setToSJISFunction=function(e){if(typeof e!="function")throw new Error('"toSJISFunc" is not a valid function.');ce=e};B.isKanjiModeEnabled=function(){return typeof ce<"u"};B.toSJIS=function(e){return ce(e)};var Y={};(function(t){t.L={bit:1},t.M={bit:0},t.Q={bit:3},t.H={bit:2};function e(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"l":case"low":return t.L;case"m":case"medium":return t.M;case"q":case"quartile":return t.Q;case"h":case"high":return t.H;default:throw new Error("Unknown EC Level: "+o)}}t.isValid=function(r){return r&&typeof r.bit<"u"&&r.bit>=0&&r.bit<4},t.from=function(r,i){if(t.isValid(r))return r;try{return e(r)}catch{return i}}})(Y);function Ce(){this.buffer=[],this.length=0}Ce.prototype={get:function(t){const e=Math.floor(t/8);return(this.buffer[e]>>>7-t%8&1)===1},put:function(t,e){for(let o=0;o<e;o++)this.putBit((t>>>e-o-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(t){const e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}};var He=Ce;function V(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}V.prototype.set=function(t,e,o,r){const i=t*this.size+e;this.data[i]=o,r&&(this.reservedBit[i]=!0)};V.prototype.get=function(t,e){return this.data[t*this.size+e]};V.prototype.xor=function(t,e,o){this.data[t*this.size+e]^=o};V.prototype.isReserved=function(t,e){return this.reservedBit[t*this.size+e]};var Ve=V,Se={};(function(t){const e=B.getSymbolSize;t.getRowColCoords=function(r){if(r===1)return[];const i=Math.floor(r/7)+2,n=e(r),s=n===145?26:Math.ceil((n-13)/(2*i-2))*2,l=[n-7];for(let a=1;a<i-1;a++)l[a]=l[a-1]-s;return l.push(6),l.reverse()},t.getPositions=function(r){const i=[],n=t.getRowColCoords(r),s=n.length;for(let l=0;l<s;l++)for(let a=0;a<s;a++)l===0&&a===0||l===0&&a===s-1||l===s-1&&a===0||i.push([n[l],n[a]]);return i}})(Se);var ke={};const Oe=B.getSymbolSize,ge=7;ke.getPositions=function(e){const o=Oe(e);return[[0,0],[o-ge,0],[0,o-ge]]};var xe={};(function(t){t.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const e={N1:3,N2:3,N3:40,N4:10};t.isValid=function(i){return i!=null&&i!==""&&!isNaN(i)&&i>=0&&i<=7},t.from=function(i){return t.isValid(i)?parseInt(i,10):void 0},t.getPenaltyN1=function(i){const n=i.size;let s=0,l=0,a=0,c=null,d=null;for(let S=0;S<n;S++){l=a=0,c=d=null;for(let p=0;p<n;p++){let u=i.get(S,p);u===c?l++:(l>=5&&(s+=e.N1+(l-5)),c=u,l=1),u=i.get(p,S),u===d?a++:(a>=5&&(s+=e.N1+(a-5)),d=u,a=1)}l>=5&&(s+=e.N1+(l-5)),a>=5&&(s+=e.N1+(a-5))}return s},t.getPenaltyN2=function(i){const n=i.size;let s=0;for(let l=0;l<n-1;l++)for(let a=0;a<n-1;a++){const c=i.get(l,a)+i.get(l,a+1)+i.get(l+1,a)+i.get(l+1,a+1);(c===4||c===0)&&s++}return s*e.N2},t.getPenaltyN3=function(i){const n=i.size;let s=0,l=0,a=0;for(let c=0;c<n;c++){l=a=0;for(let d=0;d<n;d++)l=l<<1&2047|i.get(c,d),d>=10&&(l===1488||l===93)&&s++,a=a<<1&2047|i.get(d,c),d>=10&&(a===1488||a===93)&&s++}return s*e.N3},t.getPenaltyN4=function(i){let n=0;const s=i.data.length;for(let a=0;a<s;a++)n+=i.data[a];return Math.abs(Math.ceil(n*100/s/5)-10)*e.N4};function o(r,i,n){switch(r){case t.Patterns.PATTERN000:return(i+n)%2===0;case t.Patterns.PATTERN001:return i%2===0;case t.Patterns.PATTERN010:return n%3===0;case t.Patterns.PATTERN011:return(i+n)%3===0;case t.Patterns.PATTERN100:return(Math.floor(i/2)+Math.floor(n/3))%2===0;case t.Patterns.PATTERN101:return i*n%2+i*n%3===0;case t.Patterns.PATTERN110:return(i*n%2+i*n%3)%2===0;case t.Patterns.PATTERN111:return(i*n%3+(i+n)%2)%2===0;default:throw new Error("bad maskPattern:"+r)}}t.applyMask=function(i,n){const s=n.size;for(let l=0;l<s;l++)for(let a=0;a<s;a++)n.isReserved(a,l)||n.xor(a,l,o(i,a,l))},t.getBestMask=function(i,n){const s=Object.keys(t.Patterns).length;let l=0,a=1/0;for(let c=0;c<s;c++){n(c),t.applyMask(c,i);const d=t.getPenaltyN1(i)+t.getPenaltyN2(i)+t.getPenaltyN3(i)+t.getPenaltyN4(i);t.applyMask(c,i),d<a&&(a=d,l=c)}return l}})(xe);var J={};const A=Y,O=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],q=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];J.getBlocksCount=function(e,o){switch(o){case A.L:return O[(e-1)*4+0];case A.M:return O[(e-1)*4+1];case A.Q:return O[(e-1)*4+2];case A.H:return O[(e-1)*4+3];default:return}};J.getTotalCodewordsCount=function(e,o){switch(o){case A.L:return q[(e-1)*4+0];case A.M:return q[(e-1)*4+1];case A.Q:return q[(e-1)*4+2];case A.H:return q[(e-1)*4+3];default:return}};var Ee={},G={};const U=new Uint8Array(512),K=new Uint8Array(256);(function(){let e=1;for(let o=0;o<255;o++)U[o]=e,K[e]=o,e<<=1,e&256&&(e^=285);for(let o=255;o<512;o++)U[o]=U[o-255]})();G.log=function(e){if(e<1)throw new Error("log("+e+")");return K[e]};G.exp=function(e){return U[e]};G.mul=function(e,o){return e===0||o===0?0:U[K[e]+K[o]]};(function(t){const e=G;t.mul=function(r,i){const n=new Uint8Array(r.length+i.length-1);for(let s=0;s<r.length;s++)for(let l=0;l<i.length;l++)n[s+l]^=e.mul(r[s],i[l]);return n},t.mod=function(r,i){let n=new Uint8Array(r);for(;n.length-i.length>=0;){const s=n[0];for(let a=0;a<i.length;a++)n[a]^=e.mul(i[a],s);let l=0;for(;l<n.length&&n[l]===0;)l++;n=n.slice(l)}return n},t.generateECPolynomial=function(r){let i=new Uint8Array([1]);for(let n=0;n<r;n++)i=t.mul(i,new Uint8Array([1,e.exp(n)]));return i}})(Ee);const Be=Ee;function de(t){this.genPoly=void 0,this.degree=t,this.degree&&this.initialize(this.degree)}de.prototype.initialize=function(e){this.degree=e,this.genPoly=Be.generateECPolynomial(this.degree)};de.prototype.encode=function(e){if(!this.genPoly)throw new Error("Encoder not initialized");const o=new Uint8Array(e.length+this.degree);o.set(e);const r=Be.mod(o,this.genPoly),i=this.degree-r.length;if(i>0){const n=new Uint8Array(this.degree);return n.set(r,i),n}return r};var qe=de,Te={},N={},ue={};ue.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40};var _={};const Ie="[0-9]+",je="[A-Z $%*+\\-./:]+";let F="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";F=F.replace(/u/g,"\\u");const Ke="(?:(?![A-Z0-9 $%*+\\-./:]|"+F+`)(?:.|[\r
]))+`;_.KANJI=new RegExp(F,"g");_.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");_.BYTE=new RegExp(Ke,"g");_.NUMERIC=new RegExp(Ie,"g");_.ALPHANUMERIC=new RegExp(je,"g");const Qe=new RegExp("^"+F+"$"),Ye=new RegExp("^"+Ie+"$"),Je=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");_.testKanji=function(e){return Qe.test(e)};_.testNumeric=function(e){return Ye.test(e)};_.testAlphanumeric=function(e){return Je.test(e)};(function(t){const e=ue,o=_;t.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},t.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},t.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},t.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},t.MIXED={bit:-1},t.getCharCountIndicator=function(n,s){if(!n.ccBits)throw new Error("Invalid mode: "+n);if(!e.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?n.ccBits[0]:s<27?n.ccBits[1]:n.ccBits[2]},t.getBestModeForData=function(n){return o.testNumeric(n)?t.NUMERIC:o.testAlphanumeric(n)?t.ALPHANUMERIC:o.testKanji(n)?t.KANJI:t.BYTE},t.toString=function(n){if(n&&n.id)return n.id;throw new Error("Invalid mode")},t.isValid=function(n){return n&&n.bit&&n.ccBits};function r(i){if(typeof i!="string")throw new Error("Param is not a string");switch(i.toLowerCase()){case"numeric":return t.NUMERIC;case"alphanumeric":return t.ALPHANUMERIC;case"kanji":return t.KANJI;case"byte":return t.BYTE;default:throw new Error("Unknown mode: "+i)}}t.from=function(n,s){if(t.isValid(n))return n;try{return r(n)}catch{return s}}})(N);(function(t){const e=B,o=J,r=Y,i=N,n=ue,s=7973,l=e.getBCHDigit(s);function a(p,u,y){for(let b=1;b<=40;b++)if(u<=t.getCapacity(b,y,p))return b}function c(p,u){return i.getCharCountIndicator(p,u)+4}function d(p,u){let y=0;return p.forEach(function(b){const x=c(b.mode,u);y+=x+b.getBitsLength()}),y}function S(p,u){for(let y=1;y<=40;y++)if(d(p,y)<=t.getCapacity(y,u,i.MIXED))return y}t.from=function(u,y){return n.isValid(u)?parseInt(u,10):y},t.getCapacity=function(u,y,b){if(!n.isValid(u))throw new Error("Invalid QR Code version");typeof b>"u"&&(b=i.BYTE);const x=e.getSymbolTotalCodewords(u),g=o.getTotalCodewordsCount(u,y),w=(x-g)*8;if(b===i.MIXED)return w;const f=w-c(b,u);switch(b){case i.NUMERIC:return Math.floor(f/10*3);case i.ALPHANUMERIC:return Math.floor(f/11*2);case i.KANJI:return Math.floor(f/13);case i.BYTE:default:return Math.floor(f/8)}},t.getBestVersionForData=function(u,y){let b;const x=r.from(y,r.M);if(Array.isArray(u)){if(u.length>1)return S(u,x);if(u.length===0)return 1;b=u[0]}else b=u;return a(b.mode,b.getLength(),x)},t.getEncodedBits=function(u){if(!n.isValid(u)||u<7)throw new Error("Invalid QR Code version");let y=u<<12;for(;e.getBCHDigit(y)-l>=0;)y^=s<<e.getBCHDigit(y)-l;return u<<12|y}})(Te);var _e={};const re=B,Pe=1335,Ge=21522,pe=re.getBCHDigit(Pe);_e.getEncodedBits=function(e,o){const r=e.bit<<3|o;let i=r<<10;for(;re.getBCHDigit(i)-pe>=0;)i^=Pe<<re.getBCHDigit(i)-pe;return(r<<10|i)^Ge};var Ae={};const We=N;function M(t){this.mode=We.NUMERIC,this.data=t.toString()}M.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)};M.prototype.getLength=function(){return this.data.length};M.prototype.getBitsLength=function(){return M.getBitsLength(this.data.length)};M.prototype.write=function(e){let o,r,i;for(o=0;o+3<=this.data.length;o+=3)r=this.data.substr(o,3),i=parseInt(r,10),e.put(i,10);const n=this.data.length-o;n>0&&(r=this.data.substr(o),i=parseInt(r,10),e.put(i,n*3+1))};var Ze=M;const Xe=N,X=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function L(t){this.mode=Xe.ALPHANUMERIC,this.data=t}L.getBitsLength=function(e){return 11*Math.floor(e/2)+6*(e%2)};L.prototype.getLength=function(){return this.data.length};L.prototype.getBitsLength=function(){return L.getBitsLength(this.data.length)};L.prototype.write=function(e){let o;for(o=0;o+2<=this.data.length;o+=2){let r=X.indexOf(this.data[o])*45;r+=X.indexOf(this.data[o+1]),e.put(r,11)}this.data.length%2&&e.put(X.indexOf(this.data[o]),6)};var et=L;const tt=N;function z(t){this.mode=tt.BYTE,typeof t=="string"?this.data=new TextEncoder().encode(t):this.data=new Uint8Array(t)}z.getBitsLength=function(e){return e*8};z.prototype.getLength=function(){return this.data.length};z.prototype.getBitsLength=function(){return z.getBitsLength(this.data.length)};z.prototype.write=function(t){for(let e=0,o=this.data.length;e<o;e++)t.put(this.data[e],8)};var nt=z;const it=N,rt=B;function $(t){this.mode=it.KANJI,this.data=t}$.getBitsLength=function(e){return e*13};$.prototype.getLength=function(){return this.data.length};$.prototype.getBitsLength=function(){return $.getBitsLength(this.data.length)};$.prototype.write=function(t){let e;for(e=0;e<this.data.length;e++){let o=rt.toSJIS(this.data[e]);if(o>=33088&&o<=40956)o-=33088;else if(o>=57408&&o<=60351)o-=49472;else throw new Error("Invalid SJIS character: "+this.data[e]+`
Make sure your charset is UTF-8`);o=(o>>>8&255)*192+(o&255),t.put(o,13)}};var ot=$,Ne={exports:{}};(function(t){var e={single_source_shortest_paths:function(o,r,i){var n={},s={};s[r]=0;var l=e.PriorityQueue.make();l.push(r,0);for(var a,c,d,S,p,u,y,b,x;!l.empty();){a=l.pop(),c=a.value,S=a.cost,p=o[c]||{};for(d in p)p.hasOwnProperty(d)&&(u=p[d],y=S+u,b=s[d],x=typeof s[d]>"u",(x||b>y)&&(s[d]=y,l.push(d,y),n[d]=c))}if(typeof i<"u"&&typeof s[i]>"u"){var g=["Could not find a path from ",r," to ",i,"."].join("");throw new Error(g)}return n},extract_shortest_path_from_predecessor_list:function(o,r){for(var i=[],n=r;n;)i.push(n),o[n],n=o[n];return i.reverse(),i},find_path:function(o,r,i){var n=e.single_source_shortest_paths(o,r,i);return e.extract_shortest_path_from_predecessor_list(n,i)},PriorityQueue:{make:function(o){var r=e.PriorityQueue,i={},n;o=o||{};for(n in r)r.hasOwnProperty(n)&&(i[n]=r[n]);return i.queue=[],i.sorter=o.sorter||r.default_sorter,i},default_sorter:function(o,r){return o.cost-r.cost},push:function(o,r){var i={value:o,cost:r};this.queue.push(i),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};t.exports=e})(Ne);var st=Ne.exports;(function(t){const e=N,o=Ze,r=et,i=nt,n=ot,s=_,l=B,a=st;function c(g){return unescape(encodeURIComponent(g)).length}function d(g,w,f){const m=[];let v;for(;(v=g.exec(f))!==null;)m.push({data:v[0],index:v.index,mode:w,length:v[0].length});return m}function S(g){const w=d(s.NUMERIC,e.NUMERIC,g),f=d(s.ALPHANUMERIC,e.ALPHANUMERIC,g);let m,v;return l.isKanjiModeEnabled()?(m=d(s.BYTE,e.BYTE,g),v=d(s.KANJI,e.KANJI,g)):(m=d(s.BYTE_KANJI,e.BYTE,g),v=[]),w.concat(f,m,v).sort(function(k,E){return k.index-E.index}).map(function(k){return{data:k.data,mode:k.mode,length:k.length}})}function p(g,w){switch(w){case e.NUMERIC:return o.getBitsLength(g);case e.ALPHANUMERIC:return r.getBitsLength(g);case e.KANJI:return n.getBitsLength(g);case e.BYTE:return i.getBitsLength(g)}}function u(g){return g.reduce(function(w,f){const m=w.length-1>=0?w[w.length-1]:null;return m&&m.mode===f.mode?(w[w.length-1].data+=f.data,w):(w.push(f),w)},[])}function y(g){const w=[];for(let f=0;f<g.length;f++){const m=g[f];switch(m.mode){case e.NUMERIC:w.push([m,{data:m.data,mode:e.ALPHANUMERIC,length:m.length},{data:m.data,mode:e.BYTE,length:m.length}]);break;case e.ALPHANUMERIC:w.push([m,{data:m.data,mode:e.BYTE,length:m.length}]);break;case e.KANJI:w.push([m,{data:m.data,mode:e.BYTE,length:c(m.data)}]);break;case e.BYTE:w.push([{data:m.data,mode:e.BYTE,length:c(m.data)}])}}return w}function b(g,w){const f={},m={start:{}};let v=["start"];for(let C=0;C<g.length;C++){const k=g[C],E=[];for(let T=0;T<k.length;T++){const I=k[T],D=""+C+T;E.push(D),f[D]={node:I,lastCount:0},m[D]={};for(let Z=0;Z<v.length;Z++){const P=v[Z];f[P]&&f[P].node.mode===I.mode?(m[P][D]=p(f[P].lastCount+I.length,I.mode)-p(f[P].lastCount,I.mode),f[P].lastCount+=I.length):(f[P]&&(f[P].lastCount=I.length),m[P][D]=p(I.length,I.mode)+4+e.getCharCountIndicator(I.mode,w))}}v=E}for(let C=0;C<v.length;C++)m[v[C]].end=0;return{map:m,table:f}}function x(g,w){let f;const m=e.getBestModeForData(g);if(f=e.from(w,m),f!==e.BYTE&&f.bit<m.bit)throw new Error('"'+g+'" cannot be encoded with mode '+e.toString(f)+`.
 Suggested mode is: `+e.toString(m));switch(f===e.KANJI&&!l.isKanjiModeEnabled()&&(f=e.BYTE),f){case e.NUMERIC:return new o(g);case e.ALPHANUMERIC:return new r(g);case e.KANJI:return new n(g);case e.BYTE:return new i(g)}}t.fromArray=function(w){return w.reduce(function(f,m){return typeof m=="string"?f.push(x(m,null)):m.data&&f.push(x(m.data,m.mode)),f},[])},t.fromString=function(w,f){const m=S(w,l.isKanjiModeEnabled()),v=y(m),C=b(v,f),k=a.find_path(C.map,"start","end"),E=[];for(let T=1;T<k.length-1;T++)E.push(C.table[k[T]].node);return t.fromArray(u(E))},t.rawSplit=function(w){return t.fromArray(S(w,l.isKanjiModeEnabled()))}})(Ae);const W=B,ee=Y,at=He,lt=Ve,ct=Se,dt=ke,oe=xe,se=J,ut=qe,Q=Te,mt=_e,ft=N,te=Ae;function gt(t,e){const o=t.size,r=dt.getPositions(e);for(let i=0;i<r.length;i++){const n=r[i][0],s=r[i][1];for(let l=-1;l<=7;l++)if(!(n+l<=-1||o<=n+l))for(let a=-1;a<=7;a++)s+a<=-1||o<=s+a||(l>=0&&l<=6&&(a===0||a===6)||a>=0&&a<=6&&(l===0||l===6)||l>=2&&l<=4&&a>=2&&a<=4?t.set(n+l,s+a,!0,!0):t.set(n+l,s+a,!1,!0))}}function pt(t){const e=t.size;for(let o=8;o<e-8;o++){const r=o%2===0;t.set(o,6,r,!0),t.set(6,o,r,!0)}}function ht(t,e){const o=ct.getPositions(e);for(let r=0;r<o.length;r++){const i=o[r][0],n=o[r][1];for(let s=-2;s<=2;s++)for(let l=-2;l<=2;l++)s===-2||s===2||l===-2||l===2||s===0&&l===0?t.set(i+s,n+l,!0,!0):t.set(i+s,n+l,!1,!0)}}function yt(t,e){const o=t.size,r=Q.getEncodedBits(e);let i,n,s;for(let l=0;l<18;l++)i=Math.floor(l/3),n=l%3+o-8-3,s=(r>>l&1)===1,t.set(i,n,s,!0),t.set(n,i,s,!0)}function ne(t,e,o){const r=t.size,i=mt.getEncodedBits(e,o);let n,s;for(n=0;n<15;n++)s=(i>>n&1)===1,n<6?t.set(n,8,s,!0):n<8?t.set(n+1,8,s,!0):t.set(r-15+n,8,s,!0),n<8?t.set(8,r-n-1,s,!0):n<9?t.set(8,15-n-1+1,s,!0):t.set(8,15-n-1,s,!0);t.set(r-8,8,1,!0)}function vt(t,e){const o=t.size;let r=-1,i=o-1,n=7,s=0;for(let l=o-1;l>0;l-=2)for(l===6&&l--;;){for(let a=0;a<2;a++)if(!t.isReserved(i,l-a)){let c=!1;s<e.length&&(c=(e[s]>>>n&1)===1),t.set(i,l-a,c),n--,n===-1&&(s++,n=7)}if(i+=r,i<0||o<=i){i-=r,r=-r;break}}}function bt(t,e,o){const r=new at;o.forEach(function(a){r.put(a.mode.bit,4),r.put(a.getLength(),ft.getCharCountIndicator(a.mode,t)),a.write(r)});const i=W.getSymbolTotalCodewords(t),n=se.getTotalCodewordsCount(t,e),s=(i-n)*8;for(r.getLengthInBits()+4<=s&&r.put(0,4);r.getLengthInBits()%8!==0;)r.putBit(0);const l=(s-r.getLengthInBits())/8;for(let a=0;a<l;a++)r.put(a%2?17:236,8);return wt(r,t,e)}function wt(t,e,o){const r=W.getSymbolTotalCodewords(e),i=se.getTotalCodewordsCount(e,o),n=r-i,s=se.getBlocksCount(e,o),l=r%s,a=s-l,c=Math.floor(r/s),d=Math.floor(n/s),S=d+1,p=c-d,u=new ut(p);let y=0;const b=new Array(s),x=new Array(s);let g=0;const w=new Uint8Array(t.buffer);for(let k=0;k<s;k++){const E=k<a?d:S;b[k]=w.slice(y,y+E),x[k]=u.encode(b[k]),y+=E,g=Math.max(g,E)}const f=new Uint8Array(r);let m=0,v,C;for(v=0;v<g;v++)for(C=0;C<s;C++)v<b[C].length&&(f[m++]=b[C][v]);for(v=0;v<p;v++)for(C=0;C<s;C++)f[m++]=x[C][v];return f}function Ct(t,e,o,r){let i;if(Array.isArray(t))i=te.fromArray(t);else if(typeof t=="string"){let c=e;if(!c){const d=te.rawSplit(t);c=Q.getBestVersionForData(d,o)}i=te.fromString(t,c||40)}else throw new Error("Invalid data");const n=Q.getBestVersionForData(i,o);if(!n)throw new Error("The amount of data is too big to be stored in a QR Code");if(!e)e=n;else if(e<n)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+n+`.
`);const s=bt(e,o,i),l=W.getSymbolSize(e),a=new lt(l);return gt(a,e),pt(a),ht(a,e),ne(a,o,0),e>=7&&yt(a,e),vt(a,s),isNaN(r)&&(r=oe.getBestMask(a,ne.bind(null,a,o))),oe.applyMask(r,a),ne(a,o,r),{modules:a,version:e,errorCorrectionLevel:o,maskPattern:r,segments:i}}we.create=function(e,o){if(typeof e>"u"||e==="")throw new Error("No input text");let r=ee.M,i,n;return typeof o<"u"&&(r=ee.from(o.errorCorrectionLevel,ee.M),i=Q.from(o.version),n=oe.from(o.maskPattern),o.toSJISFunc&&W.setToSJISFunction(o.toSJISFunc)),Ct(e,i,r,n)};var Re={},me={};(function(t){function e(o){if(typeof o=="number"&&(o=o.toString()),typeof o!="string")throw new Error("Color should be defined as hex string");let r=o.slice().replace("#","").split("");if(r.length<3||r.length===5||r.length>8)throw new Error("Invalid hex color: "+o);(r.length===3||r.length===4)&&(r=Array.prototype.concat.apply([],r.map(function(n){return[n,n]}))),r.length===6&&r.push("F","F");const i=parseInt(r.join(""),16);return{r:i>>24&255,g:i>>16&255,b:i>>8&255,a:i&255,hex:"#"+r.slice(0,6).join("")}}t.getOptions=function(r){r||(r={}),r.color||(r.color={});const i=typeof r.margin>"u"||r.margin===null||r.margin<0?4:r.margin,n=r.width&&r.width>=21?r.width:void 0,s=r.scale||4;return{width:n,scale:n?4:s,margin:i,color:{dark:e(r.color.dark||"#000000ff"),light:e(r.color.light||"#ffffffff")},type:r.type,rendererOpts:r.rendererOpts||{}}},t.getScale=function(r,i){return i.width&&i.width>=r+i.margin*2?i.width/(r+i.margin*2):i.scale},t.getImageWidth=function(r,i){const n=t.getScale(r,i);return Math.floor((r+i.margin*2)*n)},t.qrToImageData=function(r,i,n){const s=i.modules.size,l=i.modules.data,a=t.getScale(s,n),c=Math.floor((s+n.margin*2)*a),d=n.margin*a,S=[n.color.light,n.color.dark];for(let p=0;p<c;p++)for(let u=0;u<c;u++){let y=(p*c+u)*4,b=n.color.light;if(p>=d&&u>=d&&p<c-d&&u<c-d){const x=Math.floor((p-d)/a),g=Math.floor((u-d)/a);b=S[l[x*s+g]?1:0]}r[y++]=b.r,r[y++]=b.g,r[y++]=b.b,r[y]=b.a}}})(me);(function(t){const e=me;function o(i,n,s){i.clearRect(0,0,n.width,n.height),n.style||(n.style={}),n.height=s,n.width=s,n.style.height=s+"px",n.style.width=s+"px"}function r(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}t.render=function(n,s,l){let a=l,c=s;typeof a>"u"&&(!s||!s.getContext)&&(a=s,s=void 0),s||(c=r()),a=e.getOptions(a);const d=e.getImageWidth(n.modules.size,a),S=c.getContext("2d"),p=S.createImageData(d,d);return e.qrToImageData(p.data,n,a),o(S,c,d),S.putImageData(p,0,0),c},t.renderToDataURL=function(n,s,l){let a=l;typeof a>"u"&&(!s||!s.getContext)&&(a=s,s=void 0),a||(a={});const c=t.render(n,s,a),d=a.type||"image/png",S=a.rendererOpts||{};return c.toDataURL(d,S.quality)}})(Re);var Me={};const St=me;function he(t,e){const o=t.a/255,r=e+'="'+t.hex+'"';return o<1?r+" "+e+'-opacity="'+o.toFixed(2).slice(1)+'"':r}function ie(t,e,o){let r=t+e;return typeof o<"u"&&(r+=" "+o),r}function kt(t,e,o){let r="",i=0,n=!1,s=0;for(let l=0;l<t.length;l++){const a=Math.floor(l%e),c=Math.floor(l/e);!a&&!n&&(n=!0),t[l]?(s++,l>0&&a>0&&t[l-1]||(r+=n?ie("M",a+o,.5+c+o):ie("m",i,0),i=0,n=!1),a+1<e&&t[l+1]||(r+=ie("h",s),s=0)):i++}return r}Me.render=function(e,o,r){const i=St.getOptions(o),n=e.modules.size,s=e.modules.data,l=n+i.margin*2,a=i.color.light.a?"<path "+he(i.color.light,"fill")+' d="M0 0h'+l+"v"+l+'H0z"/>':"",c="<path "+he(i.color.dark,"stroke")+' d="'+kt(s,n,i.margin)+'"/>',d='viewBox="0 0 '+l+" "+l+'"',p='<svg xmlns="http://www.w3.org/2000/svg" '+(i.width?'width="'+i.width+'" height="'+i.width+'" ':"")+d+' shape-rendering="crispEdges">'+a+c+`</svg>
`;return typeof r=="function"&&r(null,p),p};const xt=Ue,ae=we,Le=Re,Et=Me;function fe(t,e,o,r,i){const n=[].slice.call(arguments,1),s=n.length,l=typeof n[s-1]=="function";if(!l&&!xt())throw new Error("Callback required as last argument");if(l){if(s<2)throw new Error("Too few arguments provided");s===2?(i=o,o=e,e=r=void 0):s===3&&(e.getContext&&typeof i>"u"?(i=r,r=void 0):(i=r,r=o,o=e,e=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(o=e,e=r=void 0):s===2&&!e.getContext&&(r=o,o=e,e=void 0),new Promise(function(a,c){try{const d=ae.create(o,r);a(t(d,e,r))}catch(d){c(d)}})}try{const a=ae.create(o,r);i(null,t(a,e,r))}catch(a){i(a)}}H.create=ae.create;H.toCanvas=fe.bind(null,Le.render);H.toDataURL=fe.bind(null,Le.renderToDataURL);H.toString=fe.bind(null,function(t,e,o){return Et.render(t,o)});function Bt(t){return`
    <header class="kiosk-header">
      <div class="kiosk-header-inner">
        <a href="#" class="brand-emblem" id="headerHomeBtn">
          <div class="brand-icon-box">
            <span class="material-symbols-outlined" style="font-size: 26px;">local_pharmacy</span>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="font-label-lg" style="color: var(--primary);">${R.name}</span>
              <span class="location-chip">
                <span class="material-symbols-outlined" style="font-size: 14px;">location_on</span>
                Tansen, Palpa
              </span>
            </div>
            <div class="font-body-sm" style="color: var(--on-surface-variant); font-size: 0.8rem;">
              ${R.subtitle} • Interactive Skin Clinic Kiosk
            </div>
          </div>
        </a>

        ${t.currentStep>1&&t.currentStep<9?`
          <button class="btn-danger-ghost" id="endSessionTopBtn" style="font-size: 0.85rem; padding: 0 0.9rem; min-height: 40px;">
            <span class="material-symbols-outlined" style="font-size: 18px;">power_settings_new</span>
            End Session
          </button>
        `:""}
      </div>
    </header>
  `}function Tt(t){if(t<2||t>6)return"";const e=5,o=t-2;let r="";for(let n=0;n<e;n++){const s=n===o?"active":n<o?"completed":"";r+=`<div class="step-dot ${s}"></div>`}const i=["Your Info","Skin Type","Concerns","Review","Regimen"];return`
    <div style="text-align: center; margin-top: 1rem;">
      <div class="progress-stepper">
        ${r}
      </div>
      <div class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: 0.05em;">
        Step ${o+1} of ${e}: <span style="color: var(--primary); font-weight: 700;">${i[o]}</span>
      </div>
    </div>
  `}function ye(){return`
    <div class="kiosk-container" style="max-width: 720px; text-align: center; padding: 2.5rem 1rem;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 88px; height: 88px; border-radius: 24px; background: #f0fdf4; border: 2px solid var(--primary-fixed-dim); color: var(--primary-container); margin-bottom: 1.5rem; box-shadow: var(--shadow-level-1);">
        <span class="material-symbols-outlined" style="font-size: 48px;">spa</span>
      </div>

      <h1 class="font-headline-xl" style="color: var(--primary); margin-bottom: 0.75rem;">
        Welcome to Ronit Skincare Consultation
      </h1>
      
      <p class="font-body-lg" style="color: var(--on-surface-variant); max-width: 580px; margin: 0 auto 2rem;">
        Get an altitude-calibrated, clinical skincare routine tailored to your skin type and concerns in Tansen, Palpa.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2.5rem; text-align: left;">
        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="color: var(--secondary); margin-bottom: 0.5rem;">
            <span class="material-symbols-outlined" style="font-size: 28px;">verified_user</span>
          </div>
          <div class="font-label-md" style="color: var(--on-surface); margin-bottom: 0.25rem;">Pharmacist-Curated</div>
          <div class="font-body-sm" style="color: var(--on-surface-variant);">Safe, clinically verified OTC formulations.</div>
        </div>

        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="color: var(--primary-container); margin-bottom: 0.5rem;">
            <span class="material-symbols-outlined" style="font-size: 28px;">wb_sunny</span>
          </div>
          <div class="font-label-md" style="color: var(--on-surface); margin-bottom: 0.25rem;">Altitude-Aware Defense</div>
          <div class="font-body-sm" style="color: var(--on-surface-variant);">Formulated for high UV & mountain dry weather.</div>
        </div>

        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="color: var(--tertiary-container); margin-bottom: 0.5rem;">
            <span class="material-symbols-outlined" style="font-size: 28px;">qr_code_2</span>
          </div>
          <div class="font-label-md" style="color: var(--on-surface); margin-bottom: 0.25rem;">Phone Sync</div>
          <div class="font-body-sm" style="color: var(--on-surface-variant);">Instant QR code handover to take home.</div>
        </div>
      </div>

      <button class="btn-primary" id="startConsultationBtn" style="font-size: 1.15rem; min-height: 64px; padding: 0 2.5rem; border-radius: 16px; width: 100%; max-width: 380px;">
        <span>Start Consultation</span>
        <span class="material-symbols-outlined" style="font-size: 24px;">arrow_forward</span>
      </button>

      <div class="font-body-sm" style="color: var(--outline); margin-top: 1.25rem;">
        Takes ~2 minutes • No account registration required
      </div>
    </div>
  `}function It(t){return`
    <div class="kiosk-container" style="max-width: 600px; padding-top: 1.5rem;">
      <div style="margin-bottom: 2rem; text-align: center;">
        <h2 class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.5rem;">
          Let's personalize your visit
        </h2>
        <p class="font-body-md" style="color: var(--on-surface-variant);">
          Please enter your name so we can customize your skincare routine.
        </p>
      </div>

      <form id="nameEntryForm" style="background: #ffffff; padding: 2rem; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
        <div class="form-group">
          <label class="form-label" for="firstNameInput">
            First Name <span style="color: var(--error);">*</span>
          </label>
          <input 
            type="text" 
            id="firstNameInput" 
            class="form-input" 
            placeholder="e.g. Ronit, Sunita, Aarav" 
            value="${t.customer.firstName}" 
            required 
            autocomplete="off"
            autofocus
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="lastNameInput">
            Surname / Last Name <span style="color: var(--error);">*</span>
          </label>
          <input 
            type="text" 
            id="lastNameInput" 
            class="form-input" 
            placeholder="e.g. Shrestha, Thapa, Pandey" 
            value="${t.customer.lastName}" 
            required 
            autocomplete="off"
          />
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button type="button" class="btn-ghost" id="backToWelcomeBtn" style="flex: 1;">
            <span class="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <button type="submit" class="btn-primary" style="flex: 2;">
            <span>Continue to Skin Type</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  `}function _t(t){return`
    <div class="kiosk-container" style="padding-top: 1rem; padding-bottom: 3rem;">
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <h2 class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.5rem;">
          What is your primary skin type?
        </h2>
        <p class="font-body-md" style="color: var(--on-surface-variant);">
          Select the option that best describes how your skin feels throughout a normal day.
        </p>
      </div>

      <div class="selection-grid" style="margin-bottom: 2rem;">
        ${ve.map(o=>{const r=t.selectedSkinTypeId===o.id;return`
      <div class="selection-card ${r?"selected":""}" data-type-id="${o.id}">
        <div class="selection-radio">
          ${r?'<span class="material-symbols-outlined" style="font-size: 18px;">check</span>':""}
        </div>
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span class="font-headline-sm" style="color: var(--on-surface); font-size: 1.15rem;">${o.name}</span>
            <span class="font-label-sm" style="color: var(--secondary); background: #f0fdfa; padding: 2px 8px; border-radius: 9999px;">${o.nepaliName}</span>
          </div>
          <div class="font-label-md" style="color: var(--primary-container); margin-bottom: 6px;">${o.tagline}</div>
          <div class="font-body-sm" style="color: var(--on-surface-variant);">${o.description}</div>
        </div>
      </div>
    `}).join("")}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn-ghost" id="backToNameBtn">
          <span class="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <button class="btn-primary" id="continueToConcernsBtn" ${t.selectedSkinTypeId?"":'disabled style="opacity: 0.5; pointer-events: none;"'}>
          <span>Next: Select Concerns</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  `}function Pt(t){const e=t.selectedConcernIds.length;return`
    <div class="kiosk-container" style="padding-top: 1rem; padding-bottom: 6rem;">
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <h2 class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.5rem;">
          Select your active skin concerns
        </h2>
        <p class="font-body-md" style="color: var(--on-surface-variant);">
          Select all that apply. Tap any card body to read full details, or click Add to include in your routine.
        </p>
      </div>

      <div class="selection-grid selection-grid-2">
        ${be.map(r=>{const i=t.selectedConcernIds.includes(r.id),n=t.expandedConcernIds.includes(r.id);return`
      <div class="concern-card ${i?"selected":""}" data-concern-id="${r.id}">
        <!-- Image without decorative tags -->
        <img src="${r.image}" alt="${r.title}" class="concern-header-img" />

        <!-- Card Body (Clicking expands or collapses full description) -->
        <div class="concern-body" data-action="toggle-expand">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <h3 class="font-headline-sm" style="color: var(--on-surface); font-size: 1.15rem; line-height: 1.3;">
              ${r.title}
            </h3>
            ${r.isSevere?`
              <span style="display: inline-flex; align-items: center; gap: 2px; color: var(--tertiary); background: var(--warning-wash); padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">
                <span class="material-symbols-outlined" style="font-size: 14px;">priority_high</span>
                Severe
              </span>
            `:""}
          </div>

          <div class="font-label-sm" style="color: var(--secondary); margin-bottom: 8px;">
            ${r.nepaliTitle}
          </div>

          <div class="font-body-sm" style="color: var(--on-surface-variant); margin-bottom: 8px;">
            ${n?r.description:r.summary}
          </div>

          <button type="button" class="expand-toggle">
            <span>${n?"Show Less":"Read Clinical Details"}</span>
            <span class="material-symbols-outlined" style="font-size: 18px;">
              ${n?"expand_less":"expand_more"}
            </span>
          </button>
        </div>

        <!-- Card Footer Actions: Add / Added Toggle -->
        <div class="concern-actions">
          <div class="font-body-sm" style="color: var(--outline);">
            ${i?'<span style="color: var(--primary); font-weight: 600;">Selected for analysis</span>':"Tap Add to include"}
          </div>

          <button 
            type="button" 
            class="btn-add-concern ${i?"selected":"unselected"}" 
            data-action="toggle-add"
          >
            <span class="material-symbols-outlined" style="font-size: 18px;">
              ${i?"check":"add"}
            </span>
            <span>${i?"Added":"Add"}</span>
          </button>
        </div>
      </div>
    `}).join("")}
      </div>
    </div>

    <!-- Floating Bottom Selection Tray (Shopping-cart style counter & action) -->
    <div class="floating-bottom-tray">
      <div class="tray-content">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="btn-ghost" id="backToSkinTypeBtn">
            <span class="material-symbols-outlined">arrow_back</span>
            Back
          </button>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="tray-counter-badge">${e}</span>
            <div>
              <div class="font-label-md" style="color: var(--on-surface);">
                ${e===0?"No concerns selected":`${e} Concern${e>1?"s":""} Selected`}
              </div>
              <div class="font-body-sm" style="color: var(--on-surface-variant); font-size: 0.8rem;">
                ${e===0?"Pick at least 1 concern":"Ready to generate customized regimen"}
              </div>
            </div>
          </div>
        </div>

        <button 
          class="btn-primary" 
          id="proceedToReviewBtn"
          ${e===0?'disabled style="opacity: 0.5; pointer-events: none;"':""}
        >
          <span>Review Selection</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  `}function At(t){const e=h.getSelectedSkinType(),o=h.getSelectedConcerns(),r=h.hasSevereCondition(),i=o.map(n=>`
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${n.image}" alt="${n.title}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;" />
        <div>
          <div class="font-label-md" style="color: var(--on-surface);">${n.title}</div>
          <div class="font-body-sm" style="color: var(--secondary);">${n.nepaliTitle}</div>
        </div>
      </div>
      ${n.isSevere?`
        <span style="color: var(--tertiary); background: var(--warning-wash); padding: 3px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">
          Severe Condition
        </span>
      `:`
        <span style="color: var(--primary); font-size: 0.85rem; font-weight: 600;">Active Target</span>
      `}
    </div>
  `).join("");return`
    <div class="kiosk-container" style="max-width: 680px; padding-top: 1.5rem; padding-bottom: 3rem;">
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <h2 class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.5rem;">
          Review Your Skin Profile
        </h2>
        <p class="font-body-md" style="color: var(--on-surface-variant);">
          Please confirm your details before we build your personalized product recommendations.
        </p>
      </div>

      <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1); margin-bottom: 1.5rem;">
        <!-- Customer Info -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1.5px solid #e2e8f0; margin-bottom: 1.25rem;">
          <div>
            <div class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">Customer Name</div>
            <div class="font-headline-sm" style="color: var(--primary);">${t.customer.firstName} ${t.customer.lastName}</div>
          </div>
          <button class="btn-ghost" id="editNameBtn" style="font-size: 0.85rem; padding: 0 0.75rem;">Edit</button>
        </div>

        <!-- Skin Type -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1.5px solid #e2e8f0; margin-bottom: 1.25rem;">
          <div>
            <div class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">Primary Skin Type</div>
            <div class="font-headline-sm" style="color: var(--on-surface);">${e?e.name:"Not selected"}</div>
            <div class="font-body-sm" style="color: var(--secondary);">${e?e.tagline:""}</div>
          </div>
          <button class="btn-ghost" id="editSkinTypeBtn" style="font-size: 0.85rem; padding: 0 0.75rem;">Change</button>
        </div>

        <!-- Concerns -->
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">
              Selected Concerns (${o.length})
            </div>
            <button class="btn-ghost" id="editConcernsBtn" style="font-size: 0.85rem; padding: 0 0.75rem;">Modify</button>
          </div>
          <div>
            ${i}
          </div>
        </div>

        ${r?`
          <div style="margin-top: 1.25rem; padding: 0.9rem; background: var(--warning-wash); border-radius: var(--radius-md); display: flex; align-items: center; gap: 8px; color: var(--tertiary);">
            <span class="material-symbols-outlined" style="font-size: 20px;">info</span>
            <span class="font-body-sm" style="font-weight: 600;">A severe condition was noted. Specialized precautions will be included in your recommendations.</span>
          </div>
        `:""}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn-ghost" id="backToConcernsBtn">
          <span class="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <button class="btn-primary" id="generateRecommendationsBtn" style="font-size: 1.05rem; padding: 0 2rem;">
          <span>Generate Recommendations</span>
          <span class="material-symbols-outlined">auto_awesome</span>
        </button>
      </div>
    </div>
  `}function Nt(t){const e=h.getRecommendedProducts(),o=h.hasSevereCondition(),r=h.getSelectedConcerns();let i="";return le.forEach(n=>{const s=e[n.id];if(!s||s.items.length===0)return;const l=s.items.map(a=>`
      <div class="product-card">
        <img src="${a.image}" alt="${a.name}" class="product-card-img" />
        <div class="product-card-body">
          <div class="font-label-sm" style="color: var(--secondary); text-transform: uppercase; margin-bottom: 4px;">
            ${a.brand}
          </div>
          <h4 class="font-headline-sm" style="color: var(--on-surface); font-size: 1.1rem; line-height: 1.35; margin-bottom: 8px;">
            ${a.name}
          </h4>

          <div class="product-badges">
            ${a.badges.map(c=>`<span class="product-badge">${c}</span>`).join("")}
          </div>

          <div class="product-instruction-box">
            <div style="display: flex; align-items: center; gap: 4px; font-weight: 600; color: var(--secondary); margin-bottom: 2px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">schedule</span>
              Application Usage:
            </div>
            ${a.instruction}
          </div>

          <div style="margin-top: auto; padding-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div class="font-label-sm" style="color: var(--outline);">Pharmacy Price</div>
              <div class="product-price-tag">Rs. ${a.price.toLocaleString()}</div>
            </div>
            <span style="display: inline-flex; align-items: center; gap: 4px; color: var(--primary); font-size: 0.85rem; font-weight: 600; background: #f0fdf4; padding: 4px 10px; border-radius: 9999px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">check_circle</span>
              In Stock
            </span>
          </div>
        </div>
      </div>
    `).join("");i+=`
      <div class="category-section">
        <div class="category-header">
          <div class="category-icon">
            <span class="material-symbols-outlined" style="font-size: 22px;">${n.icon}</span>
          </div>
          <h3 class="font-headline-md" style="color: var(--on-surface);">${n.name}</h3>
        </div>
        <div class="selection-grid selection-grid-2">
          ${l}
        </div>
      </div>
    `}),`
    <div class="kiosk-container" style="padding-top: 1.5rem; padding-bottom: 5rem;">
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; color: var(--primary-container); padding: 4px 12px; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">
          <span class="material-symbols-outlined" style="font-size: 16px;">verified</span>
          Customized for ${t.customer.firstName} ${t.customer.lastName}
        </div>
        <h2 class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.5rem;">
          Your Pharmacist-Recommended Regimen
        </h2>
        <p class="font-body-md" style="color: var(--on-surface-variant); max-width: 600px; margin: 0 auto;">
          Formulated to target your specific concerns while protecting against high-altitude mountain sun in Palpa.
        </p>
      </div>

      <!-- Severe Condition Warning Banner (Shown if any concern is marked severe) -->
      ${o?`
        <div class="severe-warning-banner">
          <span class="material-symbols-outlined severe-warning-icon">health_and_safety</span>
          <div>
            <div class="font-headline-sm" style="color: var(--tertiary); font-size: 1.15rem; margin-bottom: 4px;">
              Clinical Pharmacist Consultation Advisory
            </div>
            <div class="font-body-md" style="color: #78350f; line-height: 1.5;">
              One or more of your selected concerns (${r.filter(n=>n.isSevere).map(n=>`<strong>${n.title}</strong>`).join(", ")}) indicates acute skin irritation or infection risk. 
              <strong>Please speak directly with our attending pharmacist at the counter before beginning any high-strength exfoliants or peeling agents.</strong>
            </div>
          </div>
        </div>
      `:""}

      <!-- Categorized Products -->
      <div>
        ${i}
      </div>

      <!-- Action Footer -->
      <div style="margin-top: 3rem; padding: 2rem; background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.5rem; box-shadow: var(--shadow-level-1);">
        <div>
          <h4 class="font-headline-sm" style="color: var(--on-surface); margin-bottom: 0.25rem;">
            Take this routine with you on your phone
          </h4>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Scan our live QR code to open and save your product list directly onto your smartphone.
          </p>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center;">
          <button class="btn-secondary" id="openQRModalBtn" style="min-height: 56px;">
            <span class="material-symbols-outlined">qr_code_scanner</span>
            <span>Scan QR Code</span>
          </button>
          <button class="btn-ghost" id="previewMobilePageBtn" style="min-height: 56px;">
            <span class="material-symbols-outlined">phone_iphone</span>
            <span>View Mobile Page</span>
          </button>
        </div>
      </div>
    </div>
  `}function Rt(t){return t.showQRModal?`
    <div class="modal-backdrop" id="qrModalBackdrop">
      <div class="modal-dialog">
        <div style="padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-outlined" style="color: var(--primary-container);">qr_code_2</span>
            <h3 class="font-headline-sm" style="color: var(--on-surface);">Scan Regimen to Phone</h3>
          </div>
          <button class="btn-ghost" id="closeQRModalBtn" style="min-height: 36px; padding: 0 8px;">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style="padding: 2rem; text-align: center;">
          <div style="background: #f8fafc; padding: 1.25rem; border-radius: var(--radius-lg); display: inline-block; margin-bottom: 1.25rem; border: 1px solid #e2e8f0;">
            <canvas id="qrCanvas" style="display: block; margin: 0 auto; width: 220px; height: 220px;"></canvas>
          </div>

          <div class="font-label-lg" style="color: var(--on-surface); margin-bottom: 0.25rem;">
            Consultation Pass: ${t.sessionId}
          </div>
          <p class="font-body-sm" style="color: var(--on-surface-variant); max-width: 360px; margin: 0 auto 1.5rem;">
            Point your mobile camera at this QR code to view your personalized routine, dosage instructions, and product prices on your phone.
          </p>

          <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <button class="btn-secondary" id="directMobileOpenBtn" style="min-height: 48px; font-size: 0.95rem;">
              <span class="material-symbols-outlined">open_in_new</span>
              <span>Open Handover View</span>
            </button>
            <button class="btn-primary" id="doneWithQRBtn" style="min-height: 48px; font-size: 0.95rem;">
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `:""}function Mt(t){const e=h.getSelectedSkinType(),o=h.getSelectedConcerns(),r=h.getRecommendedProducts(),i=h.hasSevereCondition();let n="";return le.forEach(s=>{const l=r[s.id];!l||l.items.length===0||(n+=`
      <div style="margin-top: 1.25rem;">
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 4px;">
          <span class="material-symbols-outlined" style="font-size: 16px;">${s.icon}</span>
          ${s.name}
        </div>
        ${l.items.map(a=>`
          <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; padding: 1rem; margin-bottom: 0.75rem; box-shadow: var(--shadow-level-1);">
            <div style="display: flex; gap: 12px; margin-bottom: 0.5rem;">
              <img src="${a.image}" alt="${a.name}" style="width: 64px; height: 64px; border-radius: 8px; object-fit: cover; flex-shrink: 0;" />
              <div>
                <div style="font-size: 0.75rem; font-weight: 600; color: var(--secondary);">${a.brand}</div>
                <div style="font-size: 0.95rem; font-weight: 700; color: var(--on-surface); line-height: 1.25;">${a.name}</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: var(--primary); margin-top: 4px;">Rs. ${a.price.toLocaleString()}</div>
              </div>
            </div>
            <div style="background: #f8fafc; border-left: 2px solid var(--secondary); padding: 6px 8px; font-size: 0.8rem; color: var(--on-surface-variant); border-radius: 4px;">
              <strong>Usage:</strong> ${a.instruction}
            </div>
          </div>
        `).join("")}
      </div>
    `)}),`
    <div class="mobile-view-wrapper">
      <!-- Mobile App Header -->
      <div style="padding: 1rem; background: var(--primary-container); color: #ffffff; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-outlined">local_pharmacy</span>
          <div>
            <div style="font-size: 0.95rem; font-weight: 700;">${R.name}</div>
            <div style="font-size: 0.75rem; opacity: 0.9;">Tansen, Palpa • Routine Pass</div>
          </div>
        </div>
        <button class="btn-ghost" id="exitMobileViewBtn" style="color: #ffffff; min-height: 36px; padding: 0 8px;">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div style="padding: 1rem; background: #f8f9ff; flex: 1;">
        <!-- User Summary -->
        <div style="background: #ffffff; border-radius: var(--radius-lg); padding: 1rem; border: 1px solid #e2e8f0; margin-bottom: 1rem;">
          <div style="font-size: 0.75rem; color: var(--outline); text-transform: uppercase;">Prescription For</div>
          <div style="font-size: 1.15rem; font-weight: 700; color: var(--primary);">${t.customer.firstName} ${t.customer.lastName}</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px;">
            <span style="font-size: 0.75rem; background: #eff4ff; color: var(--secondary); padding: 2px 8px; border-radius: 9999px; font-weight: 600;">
              ${e?e.name:""}
            </span>
            ${o.map(s=>`<span style="font-size: 0.75rem; background: #f0fdf4; color: var(--primary-container); padding: 2px 8px; border-radius: 9999px; font-weight: 600;">${s.title}</span>`).join("")}
          </div>
        </div>

        ${i?`
          <div style="background: var(--warning-wash); border: 1px solid #fcd34d; border-left: 4px solid var(--warning-stripe); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.85rem; color: #78350f; margin-bottom: 1rem;">
            <strong>Pharmacist Note:</strong> Severe skin condition flagged. Please consult our attending pharmacist before applying active exfoliants.
          </div>
        `:""}

        <!-- Products -->
        <h3 style="font-size: 1rem; font-weight: 700; color: var(--on-surface);">Recommended Skincare Items</h3>
        ${n}

        <!-- Pharmacy Contact -->
        <div style="margin-top: 1.5rem; padding: 1rem; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; text-align: center;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--on-surface);">${R.name}</div>
          <div style="font-size: 0.8rem; color: var(--on-surface-variant);">${R.subLocation}</div>
          <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-top: 4px;">Phone: ${R.phone}</div>
        </div>
      </div>
    </div>
  `}function Lt(){return`
    <div class="kiosk-container" style="max-width: 600px; text-align: center; padding: 3rem 1rem;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 20px; background: #f0fdf4; border: 2px solid var(--primary-fixed-dim); color: var(--primary-container); margin-bottom: 1.5rem;">
        <span class="material-symbols-outlined" style="font-size: 40px;">check_circle</span>
      </div>

      <h2 class="font-headline-lg" style="color: var(--primary); margin-bottom: 0.5rem;">
        Thank You for Visiting!
      </h2>
      <p class="font-body-md" style="color: var(--on-surface-variant); max-width: 480px; margin: 0 auto 2rem;">
        Your consultation session is complete. For your privacy, session details will automatically reset for the next customer.
      </p>

      <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.5rem; margin-bottom: 2rem; box-shadow: var(--shadow-level-1); text-align: left;">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <span class="material-symbols-outlined" style="color: var(--secondary); font-size: 24px;">storefront</span>
          <div>
            <div class="font-label-md" style="color: var(--on-surface);">Need product assistance right now?</div>
            <div class="font-body-sm" style="color: var(--on-surface-variant);">
              Take your prescription slip or phone pass to our counter. Our pharmacist is ready to assist you.
            </div>
          </div>
        </div>
      </div>

      <button class="btn-primary" id="returnHomeBtn" style="font-size: 1.1rem; min-height: 56px; padding: 0 2rem; border-radius: 14px;">
        <span class="material-symbols-outlined">restart_alt</span>
        <span>Start New Consultation</span>
      </button>

      <div class="font-body-sm" id="autoResetTimer" style="color: var(--outline); margin-top: 1.5rem;">
        Auto-resetting in 30 seconds...
      </div>
    </div>
  `}let j=null;function ze(){const t=h.getState(),e=document.getElementById("app");if(t.isMobileView){e.innerHTML=Mt(t),Dt();return}let o="";switch(t.currentStep){case 1:o=ye();break;case 2:o=It(t);break;case 3:o=_t(t);break;case 4:o=Pt(t);break;case 5:o=At(t);break;case 6:o=Nt(t);break;case 9:o=Lt();break;default:o=ye()}if(e.innerHTML=`
    ${Bt(t)}
    <main style="flex: 1; display: flex; flex-direction: column;">
      ${Tt(t.currentStep)}
      ${o}
    </main>
    ${Rt(t)}
  `,t.showQRModal){const r=document.getElementById("qrCanvas");if(r){const i=`${window.location.origin}/?session=${t.sessionId}&view=mobile`;H.toCanvas(r,i,{width:220,margin:1,color:{dark:"#004c22",light:"#ffffff"}})}}t.currentStep===9?zt():clearInterval(j),$t()}function zt(){clearInterval(j);let t=30;const e=document.getElementById("autoResetTimer");j=setInterval(()=>{t--,e&&(e.textContent=`Auto-resetting in ${t} seconds...`),t<=0&&(clearInterval(j),h.clearSession())},1e3)}function $t(){var e,o,r,i,n,s,l,a,c,d,S,p,u,y,b,x,g,w,f,m;(e=document.getElementById("headerHomeBtn"))==null||e.addEventListener("click",v=>{v.preventDefault(),h.setStep(1)}),(o=document.getElementById("endSessionTopBtn"))==null||o.addEventListener("click",()=>{h.setStep(9)}),(r=document.getElementById("startConsultationBtn"))==null||r.addEventListener("click",()=>{h.setStep(2)});const t=document.getElementById("nameEntryForm");t==null||t.addEventListener("submit",v=>{v.preventDefault();const C=document.getElementById("firstNameInput").value,k=document.getElementById("lastNameInput").value;C.trim()&&k.trim()&&(h.setCustomerName(C,k),h.setStep(3))}),(i=document.getElementById("backToWelcomeBtn"))==null||i.addEventListener("click",()=>{h.setStep(1)}),document.querySelectorAll(".selection-card[data-type-id]").forEach(v=>{v.addEventListener("click",()=>{const C=v.getAttribute("data-type-id");h.selectSkinType(C)})}),(n=document.getElementById("backToNameBtn"))==null||n.addEventListener("click",()=>{h.setStep(2)}),(s=document.getElementById("continueToConcernsBtn"))==null||s.addEventListener("click",()=>{h.getState().selectedSkinTypeId&&h.setStep(4)}),document.querySelectorAll(".concern-card[data-concern-id]").forEach(v=>{var k,E;const C=v.getAttribute("data-concern-id");(k=v.querySelector(".concern-body"))==null||k.addEventListener("click",()=>{h.toggleExpandConcern(C)}),(E=v.querySelector(".btn-add-concern"))==null||E.addEventListener("click",T=>{T.stopPropagation(),h.toggleConcern(C)})}),(l=document.getElementById("backToSkinTypeBtn"))==null||l.addEventListener("click",()=>{h.setStep(3)}),(a=document.getElementById("proceedToReviewBtn"))==null||a.addEventListener("click",()=>{h.getState().selectedConcernIds.length>0&&h.setStep(5)}),(c=document.getElementById("editNameBtn"))==null||c.addEventListener("click",()=>h.setStep(2)),(d=document.getElementById("editSkinTypeBtn"))==null||d.addEventListener("click",()=>h.setStep(3)),(S=document.getElementById("editConcernsBtn"))==null||S.addEventListener("click",()=>h.setStep(4)),(p=document.getElementById("backToConcernsBtn"))==null||p.addEventListener("click",()=>h.setStep(4)),(u=document.getElementById("generateRecommendationsBtn"))==null||u.addEventListener("click",()=>h.setStep(6)),(y=document.getElementById("openQRModalBtn"))==null||y.addEventListener("click",()=>{h.setQRModal(!0)}),(b=document.getElementById("previewMobilePageBtn"))==null||b.addEventListener("click",()=>{h.setMobileView(!0)}),(x=document.getElementById("closeQRModalBtn"))==null||x.addEventListener("click",()=>h.setQRModal(!1)),(g=document.getElementById("doneWithQRBtn"))==null||g.addEventListener("click",()=>{h.setQRModal(!1),h.setStep(9)}),(w=document.getElementById("directMobileOpenBtn"))==null||w.addEventListener("click",()=>{h.setQRModal(!1),h.setMobileView(!0)}),(f=document.getElementById("qrModalBackdrop"))==null||f.addEventListener("click",v=>{v.target.id==="qrModalBackdrop"&&h.setQRModal(!1)}),(m=document.getElementById("returnHomeBtn"))==null||m.addEventListener("click",()=>{h.clearSession()})}function Dt(){var t;(t=document.getElementById("exitMobileViewBtn"))==null||t.addEventListener("click",()=>{h.setMobileView(!1)})}h.subscribe(()=>{ze()});window.addEventListener("DOMContentLoaded",()=>{new URLSearchParams(window.location.search).get("view")==="mobile"&&h.setMobileView(!0),ze()});
