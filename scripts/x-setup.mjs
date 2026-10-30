// Refresh credentials without printing them. Publishing remains disabled unless
// --enable is explicitly requested after the owner approves X API usage charges.
import fs from "node:fs";
import path from "node:path";
import {parseEnv} from "node:util";
import {TwitterApi} from "twitter-api-v2";

const localPath=new URL("../.env.x.local",import.meta.url);
if(!fs.existsSync(localPath))fs.writeFileSync(localPath,"# Save regenerated Read and Write credentials here; never send secrets in chat.\nX_USERNAME=\nTWITTER_API_KEY=\nTWITTER_API_SECRET=\nTWITTER_ACCESS_TOKEN=\nTWITTER_ACCESS_SECRET=\n");
const local=parseEnv(fs.readFileSync(localPath,"utf8"));
const keys=["TWITTER_API_KEY","TWITTER_API_SECRET","TWITTER_ACCESS_TOKEN","TWITTER_ACCESS_SECRET"];
if(!local.X_USERNAME?.trim()||keys.some(key=>!local[key]?.trim()))throw new Error("Fill in X_USERNAME and the four credentials in .env.x.local first");
const client=new TwitterApi({appKey:local.TWITTER_API_KEY.trim(),appSecret:local.TWITTER_API_SECRET.trim(),accessToken:local.TWITTER_ACCESS_TOKEN.trim(),accessSecret:local.TWITTER_ACCESS_SECRET.trim()});
let account;
try{account=(await client.v2.me()).data;}catch{throw new Error("X rejected these credentials. Confirm Read and Write app access and regenerate user access tokens.");}
if(account.username.toLowerCase()!==local.X_USERNAME.trim().replace(/^@/,"").toLowerCase())throw new Error("X credentials do not match the expected username; no settings saved");
console.log(`Verified X account: @${account.username} (${account.id})`);
if(!process.argv.includes("--verify")){
 const siteId="613f23ed-2a89-4a10-9e55-2142f29d7461";
 const config=JSON.parse(fs.readFileSync(path.join(process.env.APPDATA,"netlify/Config/config.json"),"utf8"));
 const headers={Authorization:`Bearer ${config.users[config.userId].auth.token}`,"Content-Type":"application/json"};
 async function api(route,options={}){const r=await fetch(`https://api.netlify.com/api/v1${route}`,{...options,headers,signal:AbortSignal.timeout(30000)});if(!r.ok)throw new Error(`Settings update failed (${r.status})`);return r.status===204?null:r.json();}
 const site=await api(`/sites/${siteId}`),base=`/accounts/${site.account_id}/env`,query=`?site_id=${siteId}`;
 const entries=await api(base+query);
 async function save(key,value){const exists=entries.some(e=>e.key===key),body={key,values:[{context:"all",value}]};await api(base+(exists?`/${key}`:"")+query,{method:exists?"PUT":"POST",body:JSON.stringify(exists?body:[body])});}
 await save("X_AUTOMATION_ENABLED","false");
 for(const key of keys)await save(key,local[key].trim());
 await save("X_ACCOUNT_ID",account.id);
 await save("X_START_DATE",entries.find(e=>e.key==="LINKEDIN_START_DATE")?.values.find(v=>v.context==="all")?.value??"2026-10-28");
 // Refresh the entry list because the enabled flag may have just been created.
 if(process.argv.includes("--enable"))await api(`${base}/X_AUTOMATION_ENABLED${query}`,{method:"PUT",body:JSON.stringify({key:"X_AUTOMATION_ENABLED",values:[{context:"all",value:"true"}]})});
 console.log(`X configuration saved; automation ${process.argv.includes("--enable")?"enabled":"disabled"}. Redeploy to apply.`);
}
