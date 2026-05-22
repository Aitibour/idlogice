/**
 * Canadian city GEO data.
 * Each entry drives a /in/[slug] programmatic SEO page targeting
 * "immigration consultant [city]" and related local-intent keywords.
 */
export type CityData = {
  slug: string;
  name: { en: string; fr: string; es: string; ar: string };
  province: string;
  provinceCode: string;
  provinceSlug: string;
  population: number;
  topPrograms: string[];
  majorIndustries: string[];
  lead: { en: string; fr: string; es: string; ar: string };
  stats: {
    immigrantsPerYear: string;
    topSourceCountries: string[];
    unemploymentRate: string;
  };
  neighborhoods: string[];
  landmarks: { en: string; fr: string };
};

export const CITIES: CityData[] = [
  {
    slug: "toronto",
    name: { en: "Toronto", fr: "Toronto", es: "Toronto", ar: "تورونتو" },
    province: "Ontario",
    provinceCode: "ON",
    provinceSlug: "ontario",
    population: 2930000,
    topPrograms: ["Express Entry", "Ontario PNP (OINP)", "Family Sponsorship", "Work Permit"],
    majorIndustries: ["Finance", "Technology", "Healthcare", "Film & Media", "Manufacturing"],
    lead: {
      en: "Toronto is Canada's largest city and its immigration capital, welcoming over 100,000 newcomers every year. As the economic hub of Ontario, Toronto offers unmatched job opportunities across tech, finance, healthcare, and creative industries.",
      fr: "Toronto est la plus grande ville du Canada et sa capitale de l'immigration, accueillant plus de 100 000 nouveaux arrivants chaque année. En tant que pôle économique de l'Ontario, Toronto offre des opportunités d'emploi inégalées.",
      es: "Toronto es la ciudad más grande de Canadá y su capital de inmigración, recibiendo más de 100,000 recién llegados cada año. Como centro económico de Ontario, Toronto ofrece oportunidades de empleo inigualables.",
      ar: "تورونتو هي أكبر مدينة في كندا وعاصمة الهجرة، حيث ترحب بأكثر من 100,000 وافد جديد كل عام. بوصفها المركز الاقتصادي لأونتاريو، تقدم تورونتو فرص عمل لا مثيل لها في قطاعات التقنية والمالية والرعاية الصحية.",
    },
    stats: {
      immigrantsPerYear: "100,000+",
      topSourceCountries: ["India", "China", "Philippines", "Iran", "Pakistan"],
      unemploymentRate: "5.8%",
    },
    neighborhoods: ["North York", "Scarborough", "Etobicoke", "Mississauga", "Brampton"],
    landmarks: {
      en: "CN Tower, Distillery District, Kensington Market",
      fr: "Tour CN, Distillery District, marché Kensington",
    },
  },
  {
    slug: "vancouver",
    name: { en: "Vancouver", fr: "Vancouver", es: "Vancouver", ar: "فانكوفر" },
    province: "British Columbia",
    provinceCode: "BC",
    provinceSlug: "british-columbia",
    population: 675218,
    topPrograms: ["Express Entry", "BC PNP", "Work Permit", "Study Permit"],
    majorIndustries: ["Technology", "Film & TV", "Tourism", "Real Estate", "Forestry", "Port & Trade"],
    lead: {
      en: "Vancouver is Canada's gateway to the Pacific and a global tech hub. With the BC PNP Tech Pilot actively recruiting software engineers, data scientists, and IT professionals, Vancouver offers fast-track immigration pathways — sometimes as short as 8 weeks from provincial nomination to PR.",
      fr: "Vancouver est la porte d'entrée du Canada vers le Pacifique et un pôle tech mondial. Avec le Volet tech PNP-CB recrutant activement des ingénieurs logiciels et scientifiques des données, Vancouver offre des voies d'immigration accélérées.",
      es: "Vancouver es la puerta de Canadá al Pacífico y un hub tecnológico global. Con el BC PNP Tech Pilot reclutando activamente ingenieros de software y científicos de datos, Vancouver ofrece vías de inmigración aceleradas.",
      ar: "فانكوفر هي بوابة كندا نحو المحيط الهادئ ومركز تقني عالمي. مع مشروع PNP التقني في BC الذي يجنّد مهندسي البرمجيات وعلماء البيانات بنشاط، تقدم فانكوفر مسارات هجرة سريعة.",
    },
    stats: {
      immigrantsPerYear: "40,000+",
      topSourceCountries: ["China", "India", "Philippines", "South Korea", "Iran"],
      unemploymentRate: "5.2%",
    },
    neighborhoods: ["Burnaby", "Surrey", "Richmond", "Coquitlam", "North Vancouver"],
    landmarks: {
      en: "Stanley Park, Granville Island, Whistler ski resort nearby",
      fr: "Parc Stanley, Île Granville, station de ski Whistler à proximité",
    },
  },
  {
    slug: "montreal",
    name: { en: "Montreal", fr: "Montréal", es: "Montreal", ar: "مونتريال" },
    province: "Quebec",
    provinceCode: "QC",
    provinceSlug: "quebec",
    population: 1762949,
    topPrograms: ["Quebec Skilled Worker (QSWP)", "PEQ", "Express Entry (non-Quebec)", "Work Permit"],
    majorIndustries: ["AI & Technology", "Aerospace", "Video Games", "Finance", "Pharmaceuticals", "Fashion"],
    lead: {
      en: "Montreal is Canada's second-largest city and a world leader in artificial intelligence research, home to MILA and the Vector Institute. Its unique bilingual character, lower cost of living compared to Toronto/Vancouver, and thriving tech scene make it a top destination for skilled immigrants.",
      fr: "Montréal est la deuxième plus grande ville du Canada et un leader mondial en recherche en IA, accueillant MILA et Vector Institute. Son caractère bilingue unique et son coût de la vie inférieur à Toronto/Vancouver en font une destination de choix.",
      es: "Montreal es la segunda ciudad más grande de Canadá y líder mundial en investigación de IA, con MILA y Vector Institute. Su carácter bilingüe único y menor costo de vida en comparación con Toronto/Vancouver la hacen un destino top.",
      ar: "مونتريال هي ثاني أكبر مدينة في كندا ورائدة عالمية في أبحاث الذكاء الاصطناعي، حيث يقع كلٌّ من MILA وVector Institute. طابعها الثنائي اللغة الفريد وتكاليف المعيشة المنخفضة مقارنةً بتورونتو/فانكوفر يجعلانها وجهة متميزة.",
    },
    stats: {
      immigrantsPerYear: "55,000+",
      topSourceCountries: ["Morocco", "France", "Algeria", "Haiti", "India"],
      unemploymentRate: "6.1%",
    },
    neighborhoods: ["Laval", "Longueuil", "Saint-Laurent", "Côte-des-Neiges", "Plateau Mont-Royal"],
    landmarks: {
      en: "Mont Royal, Old Montreal, McGill University, MILA AI Institute",
      fr: "Mont-Royal, Vieux-Montréal, Université McGill, Institut MILA",
    },
  },
  {
    slug: "calgary",
    name: { en: "Calgary", fr: "Calgary", es: "Calgary", ar: "كالغاري" },
    province: "Alberta",
    provinceCode: "AB",
    provinceSlug: "alberta",
    population: 1336000,
    topPrograms: ["Express Entry", "Alberta AAIP", "Work Permit (LMIA)", "Atlantic Immigration (not applicable)"],
    majorIndustries: ["Oil & Gas", "Technology", "Agriculture", "Finance", "Construction", "Clean Energy"],
    lead: {
      en: "Calgary is Alberta's economic engine, driven by energy, technology, and agriculture. With no provincial income tax and one of Canada's lowest costs of living among major cities, Calgary attracts skilled workers from around the world through Alberta's AAIP immigration program.",
      fr: "Calgary est le moteur économique de l'Alberta, porté par l'énergie, la technologie et l'agriculture. Sans impôt provincial sur le revenu et avec l'un des coûts de la vie les plus bas parmi les grandes villes, Calgary attire des travailleurs qualifiés du monde entier.",
      es: "Calgary es el motor económico de Alberta, impulsado por energía, tecnología y agricultura. Sin impuesto provincial sobre la renta y con uno de los costos de vida más bajos entre las ciudades principales, Calgary atrae trabajadores calificados de todo el mundo.",
      ar: "كالغاري هي المحرك الاقتصادي لألبرتا، مدفوعةً بالطاقة والتكنولوجيا والزراعة. بدون ضريبة دخل إقليمية وبأحد أدنى تكاليف المعيشة بين المدن الكبرى، تستقطب كالغاري العمال المهرة من جميع أنحاء العالم.",
    },
    stats: {
      immigrantsPerYear: "30,000+",
      topSourceCountries: ["Philippines", "India", "China", "Nigeria", "Pakistan"],
      unemploymentRate: "5.9%",
    },
    neighborhoods: ["Airdrie", "Cochrane", "Chestermere", "Okotoks", "Red Deer"],
    landmarks: {
      en: "Calgary Stampede grounds, Banff National Park 90 min away, Bow River",
      fr: "Terrain du Stampede de Calgary, Parc national Banff à 90 min, Rivière Bow",
    },
  },
  {
    slug: "ottawa",
    name: { en: "Ottawa", fr: "Ottawa", es: "Ottawa", ar: "أوتاوا" },
    province: "Ontario",
    provinceCode: "ON",
    provinceSlug: "ontario",
    population: 1017449,
    topPrograms: ["Express Entry", "Ontario PNP (OINP)", "Federal Public Service", "Work Permit"],
    majorIndustries: ["Government", "Technology", "Healthcare", "Education", "Defence & Security"],
    lead: {
      en: "Ottawa, Canada's capital, combines a stable government-driven economy with a growing tech sector (Kanata North tech park). As a bilingual city bordering Quebec, Ottawa offers exceptional opportunities for French-speaking immigrants and francophone immigration programs.",
      fr: "Ottawa, la capitale du Canada, combine une économie stable dirigée par l'État et un secteur technologique en pleine croissance. En tant que ville bilingue frontalière du Québec, Ottawa offre des opportunités exceptionnelles pour les immigrants francophones.",
      es: "Ottawa, la capital de Canadá, combina una economía estable impulsada por el gobierno con un creciente sector tecnológico. Como ciudad bilingüe que limita con Quebec, Ottawa ofrece oportunidades excepcionales para inmigrantes francófonos.",
      ar: "أوتاوا، عاصمة كندا، تجمع اقتصادًا مستقرًا تقوده الحكومة مع قطاع تقني متنامٍ. بوصفها مدينة ثنائية اللغة على الحدود مع كيبيك، تقدم أوتاوا فرصًا استثنائية للمهاجرين الناطقين بالفرنسية.",
    },
    stats: {
      immigrantsPerYear: "20,000+",
      topSourceCountries: ["China", "India", "Lebanon", "Iran", "France"],
      unemploymentRate: "4.9%",
    },
    neighborhoods: ["Nepean", "Gloucester", "Kanata", "Gatineau (QC)", "Orleans"],
    landmarks: {
      en: "Parliament Hill, Rideau Canal, National Arts Centre, Kanata North tech hub",
      fr: "Colline du Parlement, Canal Rideau, Centre national des Arts, hub tech Kanata Nord",
    },
  },
  {
    slug: "edmonton",
    name: { en: "Edmonton", fr: "Edmonton", es: "Edmonton", ar: "إدمونتون" },
    province: "Alberta",
    provinceCode: "AB",
    provinceSlug: "alberta",
    population: 1010899,
    topPrograms: ["Express Entry", "Alberta AAIP", "Work Permit (LMIA)"],
    majorIndustries: ["Oil Sands Services", "Healthcare", "Education", "Technology", "Construction", "Agriculture"],
    lead: {
      en: "Edmonton, Alberta's capital, is the gateway to Canada's oil sands and a major healthcare and education hub. With the University of Alberta driving research and innovation, Edmonton offers a lower cost of living than Calgary and strong employment across healthcare, tech, and trades.",
      fr: "Edmonton, la capitale de l'Alberta, est la porte d'entrée des sables pétrolifères du Canada et un pôle majeur de santé et d'éducation. Avec l'Université de l'Alberta stimulant la recherche, Edmonton offre un coût de la vie inférieur à Calgary.",
      es: "Edmonton, la capital de Alberta, es la puerta de entrada a las arenas petrolíferas de Canadá y un importante centro de salud y educación. Con la Universidad de Alberta impulsando investigación e innovación, Edmonton ofrece menor costo de vida que Calgary.",
      ar: "إدمونتون، عاصمة ألبرتا، هي بوابة رمال النفط الكندية ومركز رئيسي للرعاية الصحية والتعليم. مع دور جامعة ألبرتا في دفع عجلة البحث والابتكار، توفر إدمونتون تكاليف معيشة أقل من كالغاري.",
    },
    stats: {
      immigrantsPerYear: "20,000+",
      topSourceCountries: ["Philippines", "India", "China", "Nigeria", "Pakistan"],
      unemploymentRate: "6.2%",
    },
    neighborhoods: ["Sherwood Park", "St. Albert", "Spruce Grove", "Leduc", "Beaumont"],
    landmarks: {
      en: "West Edmonton Mall, Fort Edmonton Park, University of Alberta",
      fr: "Centre commercial West Edmonton, Parc Fort Edmonton, Université de l'Alberta",
    },
  },
  {
    slug: "winnipeg",
    name: { en: "Winnipeg", fr: "Winnipeg", es: "Winnipeg", ar: "وينيبيغ" },
    province: "Manitoba",
    provinceCode: "MB",
    provinceSlug: "manitoba",
    population: 749534,
    topPrograms: ["Manitoba PNP (MPNP)", "Express Entry", "Atlantic Immigration (not applicable)"],
    majorIndustries: ["Agriculture", "Manufacturing", "Healthcare", "Transportation", "Finance", "Insurance"],
    lead: {
      en: "Winnipeg, Manitoba's capital, is one of Canada's most immigrant-friendly cities with a strong Manitoba PNP program actively recruiting skilled workers and international graduates. The city's diverse economy, lower housing costs, and established ethnic communities make it a gateway city for newcomers.",
      fr: "Winnipeg, la capitale du Manitoba, est l'une des villes les plus accueillantes pour les immigrants au Canada. Son programme MPNP actif recrute des travailleurs qualifiés et des diplômés étrangers. Coûts de logement inférieurs et communautés ethniques bien établies.",
      es: "Winnipeg, la capital de Manitoba, es una de las ciudades más amigables con los inmigrantes de Canadá, con un programa MPNP activo que recluta trabajadores calificados y graduados internacionales. Costos de vivienda más bajos y comunidades étnicas establecidas.",
      ar: "وينيبيغ، عاصمة مانيتوبا، واحدة من أكثر المدن الكندية ترحيبًا بالمهاجرين، مع برنامج MPNP نشط يجنّد العمال المهرة وخريجي المؤسسات الدولية. تكاليف إسكان أقل ومجتمعات عرقية راسخة.",
    },
    stats: {
      immigrantsPerYear: "18,000+",
      topSourceCountries: ["Philippines", "India", "Nigeria", "Colombia", "China"],
      unemploymentRate: "5.6%",
    },
    neighborhoods: ["Saint Boniface", "East Kildonan", "Transcona", "Steinbach", "Portage la Prairie"],
    landmarks: {
      en: "The Forks, Canadian Museum for Human Rights, Assiniboine Park",
      fr: "The Forks, Musée canadien pour les droits de la personne, Parc Assiniboine",
    },
  },
  {
    slug: "halifax",
    name: { en: "Halifax", fr: "Halifax", es: "Halifax", ar: "هاليفاكس" },
    province: "Nova Scotia",
    provinceCode: "NS",
    provinceSlug: "nova-scotia",
    population: 440918,
    topPrograms: ["Atlantic Immigration Program (AIP)", "Nova Scotia PNP", "Express Entry"],
    majorIndustries: ["Ocean Technology", "Defence", "Healthcare", "Education", "Fisheries", "Tourism"],
    lead: {
      en: "Halifax is the fastest-growing major city in Atlantic Canada and a hub for ocean technology, defence, and healthcare. The Atlantic Immigration Program offers one of Canada's most employer-friendly immigration pathways with processing times as fast as 4–6 months.",
      fr: "Halifax est la ville à la croissance la plus rapide du Canada atlantique et un pôle pour la technologie océanique, la défense et la santé. Le Programme atlantique offre l'une des voies d'immigration les plus favorables aux employeurs, avec des délais aussi courts que 4 à 6 mois.",
      es: "Halifax es la ciudad de mayor crecimiento en el Canadá atlántico y un hub para tecnología oceánica, defensa y salud. El Programa Atlántico ofrece una de las vías de inmigración más amigables con empleadores, con tiempos de procesamiento de 4–6 meses.",
      ar: "هاليفاكس هي أسرع مدينة كبرى نموًا في كندا الأطلسية ومركز لتكنولوجيا المحيطات والدفاع والرعاية الصحية. يقدم برنامج هجرة الأطلسي واحدًا من أكثر مسارات الهجرة ملاءمةً لأصحاب العمل، بأوقات معالجة تصل إلى 4-6 أشهر.",
    },
    stats: {
      immigrantsPerYear: "8,000+",
      topSourceCountries: ["India", "Nigeria", "Philippines", "Pakistan", "China"],
      unemploymentRate: "5.4%",
    },
    neighborhoods: ["Dartmouth", "Bedford", "Sackville", "Cole Harbour", "Timberlea"],
    landmarks: {
      en: "Halifax Citadel, Peggy's Cove, Dalhousie University, Halifax Waterfront",
      fr: "Citadelle d'Halifax, Peggy's Cove, Université Dalhousie, bord de mer d'Halifax",
    },
  },
  {
    slug: "saskatoon",
    name: { en: "Saskatoon", fr: "Saskatoon", es: "Saskatoon", ar: "ساسكاتون" },
    province: "Saskatchewan",
    provinceCode: "SK",
    provinceSlug: "saskatchewan",
    population: 317480,
    topPrograms: ["Saskatchewan Immigrant Nominee Program (SINP)", "Express Entry", "Rural & Northern Pilot"],
    majorIndustries: ["Agriculture & Agri-tech", "Mining", "Healthcare", "Education", "Technology"],
    lead: {
      en: "Saskatoon is the economic capital of Saskatchewan and home to the world's largest potash reserves. With a strong SINP (Saskatchewan Immigrant Nominee Program) that actively recruits healthcare workers, trades, and tech professionals, Saskatoon offers a path to permanent residency with lower housing costs than Toronto or Vancouver.",
      fr: "Saskatoon est la capitale économique de la Saskatchewan et abrite les plus grandes réserves de potasse au monde. Avec un SINP actif recrutant professionnels de santé et gens de métier, Saskatoon offre un chemin vers la RP avec des coûts de logement bien inférieurs à Toronto ou Vancouver.",
      es: "Saskatoon es la capital económica de Saskatchewan y alberga las mayores reservas de potasa del mundo. Con un SINP activo que recluta trabajadores de salud, oficios y profesionales de tecnología, Saskatoon ofrece un camino hacia la RP con costos de vivienda más bajos.",
      ar: "ساسكاتون هي العاصمة الاقتصادية لساسكاتشوان وتحتضن أكبر احتياطيات البوتاس في العالم. مع برنامج SINP النشط الذي يجنّد عمال الرعاية الصحية والحرفيين والمتخصصين التقنيين، تقدم ساسكاتون مسارًا للإقامة الدائمة بتكاليف إسكان أقل بكثير.",
    },
    stats: {
      immigrantsPerYear: "5,000+",
      topSourceCountries: ["Philippines", "India", "China", "Nigeria", "Ukraine"],
      unemploymentRate: "4.8%",
    },
    neighborhoods: ["Warman", "Martensville", "Osler", "Dalmeny"],
    landmarks: {
      en: "University of Saskatchewan, Waskesiu Lake, Wanuskewin Heritage Park",
      fr: "Université de la Saskatchewan, lac Waskesiu, Parc patrimonial Wanuskewin",
    },
  },
  {
    slug: "quebec-city",
    name: { en: "Quebec City", fr: "Québec (ville)", es: "Ciudad de Quebec", ar: "مدينة كيبيك" },
    province: "Quebec",
    provinceCode: "QC",
    provinceSlug: "quebec",
    population: 531902,
    topPrograms: ["Quebec Skilled Worker (QSWP)", "PEQ", "Quebec Experience Program"],
    majorIndustries: ["Government", "Tourism", "Insurance", "Technology", "Healthcare", "Defence"],
    lead: {
      en: "Quebec City, the heart of French Canada, is one of North America's most historically significant cities. For French-speaking immigrants, Quebec City offers a straightforward path to permanent residency through the Quebec Skilled Worker Program and the Programme de l'expérience québécoise (PEQ).",
      fr: "Québec, cœur du Canada français, est l'une des villes historiquement les plus importantes d'Amérique du Nord. Pour les immigrants francophones, Québec offre un chemin direct vers la résidence permanente via le PRTQ et le PEQ.",
      es: "Ciudad de Quebec, el corazón del Canadá francófono, es una de las ciudades históricamente más significativas de América del Norte. Para inmigrantes francófonos, ofrece un camino directo hacia la residencia permanente a través del QSWP y el PEQ.",
      ar: "مدينة كيبيك، قلب كندا الفرانكوفونية، إحدى أبرز المدن تاريخيًا في أمريكا الشمالية. بالنسبة للمهاجرين الناطقين بالفرنسية، تقدم مدينة كيبيك مسارًا مباشرًا نحو الإقامة الدائمة.",
    },
    stats: {
      immigrantsPerYear: "6,000+",
      topSourceCountries: ["France", "Morocco", "Algeria", "Tunisia", "Colombia"],
      unemploymentRate: "4.2%",
    },
    neighborhoods: ["Lévis", "Sainte-Foy", "Charlesbourg", "Beauport"],
    landmarks: {
      en: "Château Frontenac, Old Quebec (UNESCO World Heritage), Plains of Abraham",
      fr: "Château Frontenac, Vieux-Québec (patrimoine UNESCO), Plaines d'Abraham",
    },
  },
  {
    slug: "hamilton",
    name: { en: "Hamilton", fr: "Hamilton", es: "Hamilton", ar: "هاميلتون" },
    province: "Ontario",
    provinceCode: "ON",
    provinceSlug: "ontario",
    population: 569353,
    topPrograms: ["Express Entry", "Ontario PNP (OINP)", "Work Permit", "Atlantic Immigration (not applicable)"],
    majorIndustries: ["Steel & Manufacturing", "Healthcare", "Education", "Technology", "Arts & Culture"],
    lead: {
      en: "Hamilton, Ontario's 'Ambitious City', is transforming from a steel town into a dynamic hub for healthcare, tech, and creative industries. Situated just 45 minutes from Toronto with lower housing costs and a growing startup ecosystem, Hamilton is increasingly popular among skilled immigrants.",
      fr: "Hamilton, la 'Ville ambitieuse' de l'Ontario, se transforme d'une ville sidérurgique en un pôle dynamique pour la santé, la tech et les industries créatives. Située à 45 minutes de Toronto avec des coûts de logement inférieurs et un écosystème de startups croissant.",
      es: "Hamilton, la 'Ciudad Ambiciosa' de Ontario, se transforma de ciudad de acero a hub dinámico de salud, tecnología e industrias creativas. Ubicada a 45 minutos de Toronto con costos de vivienda más bajos y un ecosistema de startups creciente.",
      ar: "هاميلتون، 'المدينة الطموحة' في أونتاريو، تتحول من مدينة فولاذية إلى مركز ديناميكي للرعاية الصحية والتقنية والصناعات الإبداعية. تقع على بُعد 45 دقيقة فقط من تورونتو بتكاليف إسكان أقل.",
    },
    stats: {
      immigrantsPerYear: "7,000+",
      topSourceCountries: ["India", "Philippines", "China", "Pakistan", "Nigeria"],
      unemploymentRate: "5.7%",
    },
    neighborhoods: ["Stoney Creek", "Ancaster", "Dundas", "Waterdown", "Grimsby"],
    landmarks: {
      en: "Niagara Escarpment waterfalls, McMaster University, FirstOntario Centre",
      fr: "Chutes de l'Escarpement du Niagara, Université McMaster, FirstOntario Centre",
    },
  },
  {
    slug: "kitchener",
    name: { en: "Kitchener-Waterloo", fr: "Kitchener-Waterloo", es: "Kitchener-Waterloo", ar: "كيتشنر-واترلو" },
    province: "Ontario",
    provinceCode: "ON",
    provinceSlug: "ontario",
    population: 522889,
    topPrograms: ["Express Entry", "Ontario PNP (OINP) Tech", "Work Permit", "Study Permit"],
    majorIndustries: ["Technology", "Insurance", "Manufacturing", "Education", "Fintech", "AI"],
    lead: {
      en: "The Kitchener-Waterloo tech corridor is home to Google Canada's largest office, dozens of unicorn startups, and the University of Waterloo — Canada's top engineering and computer science school. Often called 'Canada's Silicon Valley', KW is a top destination for international tech talent.",
      fr: "Le corridor technologique Kitchener-Waterloo abrite le plus grand bureau canadien de Google, des dizaines de startups et l'Université de Waterloo. Souvent appelé le 'Silicon Valley du Canada', KW est une destination de choix pour les talents tech internationaux.",
      es: "El corredor tecnológico Kitchener-Waterloo alberga la oficina canadiense más grande de Google, docenas de unicornios y la Universidad de Waterloo. A menudo llamado el 'Silicon Valley de Canadá', KW es un destino top para talento tech internacional.",
      ar: "يضم ممر Kitchener-Waterloo التقني أكبر مكتب لجوجل كندا وعشرات شركات الناشئة وجامعة واترلو. يُطلق عليه كثيرًا 'وادي السيليكون الكندي'، وهو وجهة رائدة للكفاءات التقنية الدولية.",
    },
    stats: {
      immigrantsPerYear: "9,000+",
      topSourceCountries: ["India", "China", "Iran", "Pakistan", "Ukraine"],
      unemploymentRate: "5.1%",
    },
    neighborhoods: ["Cambridge", "Guelph", "Elmira", "Brantford"],
    landmarks: {
      en: "University of Waterloo, Communitech tech hub, Grand River trails",
      fr: "Université de Waterloo, pôle tech Communitech, sentiers de la rivière Grand",
    },
  },
];

export const CITY_MAP: Record<string, CityData> = Object.fromEntries(
  CITIES.map((c) => [c.slug, c])
);
