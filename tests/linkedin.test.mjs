import test from "node:test";
import assert from "node:assert/strict";
import { dueSlots, localClock, completePost, CONTACT_CTA, COMPANY_URN, canClaimPost, isPublishedProduction } from "../src/lib/social/calendar.ts";
import { createContent, visualDirection } from "../src/lib/social/content.ts";
import { generateSocialImage } from "../src/lib/social/image.ts";
import { publishSocialPost, uploadSocialImage, toLinkedInText } from "../src/lib/social/linkedin.ts";

test("daily, two-day and three-day cadence survives month and DST changes", () => {
  const start = "2026-10-28";
  assert.deepEqual(dueSlots(new Date("2026-10-28T12:59:00Z"), start), []);
  assert.equal(dueSlots(new Date("2026-10-28T13:00:00Z"), start)[0].kind, "informative");
  assert.deepEqual(dueSlots(new Date("2026-10-28T20:00:00Z"), start).map(s=>s.kind), ["informative", "job", "question"]);
  assert.deepEqual(dueSlots(new Date("2026-10-29T20:00:00Z"), start).map(s=>s.kind), ["informative"]);
  assert.deepEqual(dueSlots(new Date("2026-10-30T20:00:00Z"), start).map(s=>s.kind), ["informative", "job"]);
  assert.deepEqual(dueSlots(new Date("2026-10-31T20:00:00Z"), start).map(s=>s.kind), ["informative", "question"]);
  assert.equal(localClock(new Date("2026-11-02T14:00:00Z")).minutes, 540);
  assert.equal(dueSlots(new Date("2026-11-01T21:00:00Z"), start).find(s=>s.kind==="job").ordinal, 2);
});

test("every caption includes all three contact actions and stays within LinkedIn limits", () => {
  assert.ok(completePost("Helpful post").includes(CONTACT_CTA));
  assert.throws(()=>completePost("x".repeat(3000)), /3,000/);
});

test("job spotlights use website wages and retain the listing age and availability qualification", async () => {
  const job = await createContent("job", "2026-10-28", 2);
  assert.match(job.text, /Kitchen Helper/);
  assert.match(job.text, /\$18 – \$22\/hr/);
  assert.match(job.text, /April 1, 2026/);
  assert.match(job.text, /confirm whether it is still open/);
  assert.ok(job.text.includes(CONTACT_CTA));
  assert.doesNotMatch(job.text, /8 slots|8 positions/);
});

test("audience questions rotate and image direction changes across editions", async () => {
  const a = await createContent("question", "2026-10-28", 0);
  const b = await createContent("question", "2026-10-31", 1);
  assert.notEqual(a.text, b.text);
  assert.notEqual(visualDirection("job", "2026-10-28", "Chef", 0), visualDirection("job", "2026-10-30", "Chef", 1));
  assert.ok(a.text.includes(CONTACT_CTA));
});

test("image failure holds the post; fallback keys accept base64 PNG responses", async () => {
  const original = globalThis.fetch;
  const old = [process.env.OPENAI_API_KEY, process.env.OPENAI_API_KEY_1, process.env.OPENAI_API_KEY_2];
  delete process.env.OPENAI_API_KEY; process.env.OPENAI_API_KEY_1 = "test-one"; process.env.OPENAI_API_KEY_2 = "test-two";
  let calls = 0;
  const png = Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), Buffer.alloc(1200)]);
  try {
    globalThis.fetch = async()=> ++calls === 1 ? new Response("rate limited", {status:429}) : Response.json({data:[{b64_json:png.toString("base64")}]});
    assert.equal((await generateSocialImage("Unique concept")).bytes.length, png.length);
    assert.equal(calls, 2);
    globalThis.fetch = async()=>new Response("failed",{status:500});
    await assert.rejects(generateSocialImage("Unique concept"), /generation failed/);
  } finally { globalThis.fetch = original; ["OPENAI_API_KEY","OPENAI_API_KEY_1","OPENAI_API_KEY_2"].forEach((key,i)=>old[i]===undefined ? delete process.env[key] : process.env[key]=old[i]); }
});

test("publishing uses only the IDLOGICE company author, a ready image and full CTA", async () => {
  const original=globalThis.fetch; let body;
  try {
    globalThis.fetch=async(url,options)=>{assert.equal(url,"https://api.linkedin.com/rest/posts");body=JSON.parse(options.body);return new Response(null,{status:201,headers:{"x-restli-id":"urn:li:share:123"}})};
    assert.equal(await publishSocialPost("test",completePost("Test"),"urn:li:image:123","Example"),"urn:li:share:123");
    assert.equal(body.author,COMPANY_URN); assert.ok(body.commentary.includes(toLinkedInText(CONTACT_CTA)));
    await assert.rejects(publishSocialPost("test","Test","","Example"), /ready LinkedIn image/);
    globalThis.fetch=async()=>{throw new Error("network")};
    await assert.rejects(publishSocialPost("test","Test","urn:li:image:123","Example"), e=>e.uncertain===true);
  } finally {globalThis.fetch=original}
});

test("image upload failure never proceeds to create a post", async () => {
  const original=globalThis.fetch; let calls=0;
  try {
    globalThis.fetch=async()=>{calls++;return new Response("denied",{status:403})};
    await assert.rejects(uploadSocialImage("test",Buffer.alloc(1000)), /initialization failed/);
    assert.equal(calls,1);
  } finally {globalThis.fetch=original}
});

test("a second worker cannot claim a prepared, publishing, completed or uncertain post", () => {
  const now=Date.now(); const fresh={updatedAt:new Date(now).toISOString(),attempts:1};
  for(const status of ["generating","prepared","publishing","published","needs_review"]) assert.equal(canClaimPost({...fresh,status},now),false,status);
  assert.equal(canClaimPost({...fresh,status:"failed"},now),true);
  assert.equal(canClaimPost({...fresh,status:"failed",attempts:3},now),false);
  const stale={...fresh,updatedAt:new Date(now-21*60000).toISOString()};
  assert.equal(canClaimPost({...stale,status:"prepared"},now),true);
  assert.equal(canClaimPost({...stale,status:"publishing"},now),false);
});

test("email, job-title punctuation and hashtags render through LinkedIn little text", () => {
  assert.equal(toLinkedInText("RN (Canada) contact@idlogice.com #CanadaJobs"), "RN \\(Canada\\) contact\\@idlogice.com {hashtag|\\#|CanadaJobs}");
});

test("only the currently published production deployment can automatically post", () => {
  assert.equal(isPublishedProduction({deploy:{context:"production",published:true}}),true);
  assert.equal(isPublishedProduction({deploy:{context:"production",published:false}}),false);
  assert.equal(isPublishedProduction({deploy:{context:"deploy-preview",published:false}}),false);
});
