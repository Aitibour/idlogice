import test from "node:test";
import assert from "node:assert/strict";
import { dueSlots, localClock, completePost, CONTACT_CTA, COMPANY_URN, canClaimPost, isPublishedProduction, executionSlot, postHashtags } from "../src/lib/social/calendar.ts";
import { parseNotices, parseArticleCards, officialUrl, isRecent, chooseEditorialSource, parseMinisterialRounds, recentNews } from "../src/lib/social/news.ts";
import { createContent, validateInformativeCaption, editorialCaption } from "../src/lib/social/content.ts";
import { generateSocialImage, socialGraphicSvg, SOCIAL_TEMPLATES, templateLogoVariant, graphicTopic, chooseTemplate, TEMPLATE_CATALOG } from "../src/lib/social/image.ts";
import { reserveTemplate } from "../src/lib/social/template-rotation.ts";
import { stockPhotoFor } from "../src/lib/social/stock-photos.ts";
import { reserveImage } from "../src/lib/social/image-reservations.ts";
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

test("every caption has exactly ten unique topical hashtags and the correct IDLOGICE CTA", () => {
  for (const [kind, title] of [["job","Chef"],["question","Your next step"],["informative","Express Entry"],["informative","Study permits"],["informative","Family sponsorship"]]) {
    const text = completePost("Helpful guidance #UnexpectedTag",{kind,title});
    const tags = text.match(/#[A-Za-z][A-Za-z0-9_]*/g);
    assert.equal(tags.length,10); assert.equal(new Set(tags).size,10); assert.ok(text.includes(CONTACT_CTA));
  }
  assert.match(postHashtags("informative","Express Entry"),/#ExpressEntry/);
  const article = completePost("Read our guidance",{purpose:"article",articleUrl:"https://idlogice.com/en/blog/express-entry-guide"});
  assert.match(article,/Read the full IDLOGICE article: https:\/\/idlogice.com\/en\/blog\/express-entry-guide/);
  assert.doesNotMatch(article,/book-consultation/);
  assert.throws(()=>completePost("Example",{purpose:"article",articleUrl:"https://other.example/article"}),/IDLOGICE article/);
  assert.throws(()=>completePost("Visit https://other.example/article"),/stay on idlogice/);
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

test("audience questions rotate and their actual question appears in the graphic", async () => {
  const a = await createContent("question", "2026-10-28", 0);
  const b = await createContent("question", "2026-10-31", 1);
  assert.notEqual(a.text, b.text);
  assert.notEqual(a.graphicHeadline, b.graphicHeadline);
  assert.match(a.graphicHeadline, /biggest question/);
  assert.ok(a.text.includes(CONTACT_CTA));
});

test("real PNG graphics need no network or API credentials and vary across editions", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async()=>{throw new Error("Graphics must never request a paid API");};
    const hashes = new Set();
    assert.equal(SOCIAL_TEMPLATES.length,30);
    for (const [ordinal,template] of SOCIAL_TEMPLATES.entries()) {
      const result = await generateSocialImage({title:"Preparing your Canadian journey",kind:"informative",date:"2026-11-01",ordinal,template});
      assert.equal(result.bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
      assert.equal(result.bytes.readUInt32BE(16),1080);
      assert.equal(result.bytes.readUInt32BE(20),1350);
      // A missing/unsupported photographic background can otherwise render a
      // valid PNG containing only text. Real background editions are substantial.
      if (/^(photo|phone|skyline|flag)/.test(template)) assert.ok(result.bytes.length > 150000, "Bundled background must actually be rasterized");
      hashes.add(result.hash);
    }
    assert.equal(hashes.size,30);
    await assert.rejects(generateSocialImage({title:"",kind:"job",date:"2026-11-01",ordinal:0}), /headline/);
  } finally { globalThis.fetch = original; }
});

test("reference templates always include the website and choose transparent logo lettering for their background", () => {
  for (const template of SOCIAL_TEMPLATES) {
    const svg = socialGraphicSvg({title:"Your next step in Canada",kind:"informative",date:"2026-11-01",ordinal:0,template});
    assert.match(svg,/idlogice\.com<\/text>/);
    const light = templateLogoVariant(template) === "light";
    assert.ok(svg.includes(`data-logo-variant="${light ? "light" : "dark"}"`));
    assert.doesNotMatch(svg,/rx="15" fill="#ffffff"/);
    assert.match(svg,/contact@idlogice\.com/);
    assert.match(svg,/\+1 581-634-0224/);
  }
});

test("news uses a relevant stock photograph without branding, headline or CTA overlays", async () => {
  const input={title:"Updated temporary immigration measures",kind:"informative",date:"2026-10-29",ordinal:0,news:true};
  const svg=socialGraphicSvg(input);
  assert.match(svg,/data-stock-photo="parliament"/);
  assert.doesNotMatch(svg,/<text|logo|idlogice|Book your consultation/);
  const result=await generateSocialImage(input);
  assert.equal(result.bytes.readUInt32BE(16),1080);
  assert.equal(result.stockPhoto.id,"parliament");
  assert.equal(stockPhotoFor({...input,title:"Study permit guidance"}).id,"library");
  assert.equal(stockPhotoFor({...input,title:"Spousal sponsorship guidance"}).id,"family");
  assert.notEqual(stockPhotoFor({...input,title:"Chef employment news"}).id,"work");
});

test("graphic text is escaped and all contact actions remain on each image", () => {
  const svg = socialGraphicSvg({title:'A&B <test> "example"',kind:"job",date:"2026-11-01",ordinal:0});
  assert.match(svg,/A&amp;B/); assert.match(svg,/&lt;test&gt;/); assert.doesNotMatch(svg,/<test>/);
  for(const value of ["Book your consultation","idlogice.com/en/book-consultation","contact@idlogice.com","+1 581-634-0224"]) assert.ok(svg.includes(value));
  assert.match(svg,/href="data:image\/png;base64,/);
  const article = socialGraphicSvg({title:"Our latest article",kind:"informative",date:"2026-11-01",ordinal:0,purpose:"article"});
  assert.match(article,/Read the full article/); assert.doesNotMatch(article,/Book your consultation/);
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

test("explicit immediate publication is limited to today's ledger and never mixed with drafts", () => {
  const now = new Date("2026-10-28T00:10:00Z"), start = "2026-10-28";
  assert.throws(()=>executionSlot("2026-10-27/informative",start,{},now), /not due/);
  assert.equal(executionSlot("2026-10-27/informative",start,{publishNow:true},now).ordinal,0);
  assert.throws(()=>executionSlot("2026-10-28/informative",start,{publishNow:true},now), /not due/);
  assert.throws(()=>executionSlot("2026-10-26/informative",start,{publishNow:true},now), /not due/);
  assert.throws(()=>executionSlot("2026-10-27/informative",start,{draft:true,publishNow:true},now), /cannot be combined/);
  assert.throws(()=>executionSlot("other",start,{publishNow:true},now), /Invalid slot/);
  assert.equal(executionSlot("2026-11-01/job",start,{draft:true},now).ordinal,2);
});

test("informative captions hold document-upload timing claims and unsourced document details", () => {
  const intro = "Prepare thoughtfully for your Canadian immigration journey. Compare the official program guidance and check your own circumstances. ";
  assert.throws(()=>validateInformativeCaption(intro+"Have documents ready to upload when creating your profile.","Create an Express Entry profile."), /upload/);
  assert.throws(()=>validateInformativeCaption(intro+"Gather reference letters and contracts.","Check your work experience."), /not supported/);
  assert.doesNotThrow(()=>validateInformativeCaption(intro+"Use the official eligibility questionnaire.","Check your eligibility using our questionnaire."));
});

test("news advisory copy never invents policy-specific fees, durations or eligibility", () => {
  const caption=editorialCaption("Canada updates temporary measures for people affected by crises in Haiti and Sudan",false);
  assert.match(caption,/IRCC update: Canada updates temporary measures/);
  assert.match(caption,/Book a consultation/);
  assert.doesNotMatch(caption,/processing fees|extend your permit|next year|all extensions/i);
  assert.match(editorialCaption("Our topic",true),/Read our IDLOGICE article/);
});

test("news freshness excludes old or future announcements and article discovery requires a real slug", () => {
  const now = new Date("2026-10-28T12:00:00Z");
  const notices = '<li><a href="/en/immigration-refugees-citizenship/news/notices/update.html">Notice – New measures</a><span>October 27, 2026</span></li><li><a href="https://other.example/fake">Fake update</a>October 27, 2026</li><li><a href="/en/immigration-refugees-citizenship/news/notices/old.html">Old measures</a>May 1, 2026</li>';
  assert.equal(parseNotices(notices,now).length,1);
  assert.equal(parseNotices(notices,now)[0].publishedAt,"2026-10-27");
  assert.equal(isRecent("2026-10-29",now),false);
  assert.equal(officialUrl("https://other.example/source"),undefined);
  const cards = '<article><a href="/en/blog/real-article"><span>October 27, 2026</span><h2>Real article</h2></a></article><article><a href="/en/blog?topic=express-entry">Latest news</a></article>';
  assert.deepEqual(parseArticleCards(cards,now),["https://idlogice.com/en/blog/real-article"]);
});

test("recent IRCC news uses a matching live IDLOGICE article and skips already-used sources", async () => {
  const original=globalThis.fetch;
  const official="https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/update.html";
  try {
    globalThis.fetch=async(url)=>{
      let body;
      if(String(url).includes("api.io.canada.ca")) body='<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>IRCC</title><updated>2026-10-27T12:00:00Z</updated></feed>';
      else if(String(url).endsWith("notices.html")) body=`<li><a href="${official}">Notice – Updated measures</a>October 27, 2026</li>`;
      else if(String(url).endsWith("/en/blog")) body='<article><a href="/en/blog/real-article"><span>October 27, 2026</span><h2>Our explanation</h2></a></article>';
      else body=`<script type="application/ld+json">{"@type":"BlogPosting","headline":"Our explanation","datePublished":"2026-10-27T12:00:00Z"}</script><a href="${official}">IRCC source</a>`;
      const response=new Response(body);Object.defineProperty(response,"url",{value:String(url)});return response;
    };
    const chosen=await chooseEditorialSource(async()=>false,new Date("2026-10-28T12:00:00Z"));
    assert.equal(chosen.sourceUrl,official); assert.equal(chosen.articleUrl,"https://idlogice.com/en/blog/real-article");
    assert.equal(chosen.sourceType,"news");
    assert.equal(await chooseEditorialSource(async()=>true,new Date("2026-10-28T12:00:00Z")),undefined);
  } finally {globalThis.fetch=original;}
});

test("preview images cannot block publication; old preview claims promote without allowing duplicate posts", async () => {
  const records=new Map();let version=0;
  const store={
    async setJSON(key,data,options){const previous=records.get(key);if(options.onlyIfNew&&previous||options.onlyIfMatch&&previous?.etag!==options.onlyIfMatch)return {modified:false};records.set(key,{data,etag:String(++version)});return {modified:true};},
    async getWithMetadata(key){return records.get(key)??null;},
  };
  await reserveImage(store,"hash-a","drafts/2026-10-30/job",true);
  await reserveImage(store,"hash-a","posts/2026-10-30/job",false);
  await reserveImage(store,"hash-a","posts/2026-10-30/job",false);
  await assert.rejects(reserveImage(store,"hash-a","posts/2026-11-01/job",false),/Duplicate image/);
  records.set("image-hashes/old-preview",{data:{slot:"drafts/2026-10-30/job"},etag:String(++version)});
  const results=await Promise.allSettled([
    reserveImage(store,"old-preview","posts/2026-10-30/job",false),
    reserveImage(store,"old-preview","posts/2026-11-01/job",false),
  ]);
  assert.equal(results.filter(result=>result.status==="fulfilled").length,1);
});

test("topic selection and durable rotation use all 30 layouts before repeating; drafts and retries are isolated", async () => {
  const records=new Map(); let version=0;
  const store={
    async setJSON(key,data,options){const previous=records.get(key);if(options.onlyIfNew&&previous||options.onlyIfMatch&&previous?.etag!==options.onlyIfMatch)return {modified:false};records.set(key,{data,etag:String(++version)});return {modified:true};},
    async getWithMetadata(key){return records.get(key)??null;},
  };
  const input={title:"Study permit planning",kind:"informative",date:"2026-11-01",ordinal:0};
  assert.equal(graphicTopic(input),"study");
  assert.ok(TEMPLATE_CATALOG.find(t=>t.id===chooseTemplate(input)).topics.includes("study"));
  const history=[];
  for(let i=0;i<60;i++){
    const template=await reserveTemplate(store,{...input,ordinal:i},`posts/${i}`,false);
    assert.ok(!history.slice(-29).includes(template));history.push(template);
    assert.equal(await reserveTemplate(store,input,`posts/${i}`,false),template);
  }
  assert.equal(new Set(history.slice(0,30)).size,30);
  assert.equal(await reserveTemplate(store,input,"drafts/one",true),history[0]);
  const concurrent=await Promise.all([reserveTemplate(store,input,"posts/a",false),reserveTemplate(store,input,"posts/b",false)]);
  assert.notEqual(...concurrent);
  for(const template of SOCIAL_TEMPLATES) assert.doesNotThrow(()=>socialGraphicSvg({...input,template,headline:"Which part of your immigration plan would you like us to explain next: Express Entry, study permits, work permits, or family sponsorship?"}));
});

test("ministerial instructions preserve dates and official URLs; total source outages hold publication", async () => {
  const now=new Date("2026-10-29T12:00:00Z");
  const rounds=parseMinisterialRounds({rounds:[{drawDate:"2026-10-28",mitext:"<a href='/content/canadasite/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds/invitations.html?q=453'>Invitations under Express Entry #453</a>"},{drawDate:"2026-01-01",mitext:"<a href='https://other.example/'>Unverified</a>"}]},now);
  assert.equal(rounds.length,1);assert.equal(rounds[0].sourceKind,"ministerial");assert.match(rounds[0].sourceUrl,/canada.ca\/en\//);
  assert.match(editorialCaption(rounds[0].title,false,true),/^IRCC ministerial instructions:/);
  const original=globalThis.fetch;
  try {globalThis.fetch=async()=>{throw new Error("offline")};await assert.rejects(recentNews(now),/held for retry/);} finally {globalThis.fetch=original;}
});
