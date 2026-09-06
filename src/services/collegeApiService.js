// Comprehensive Live API Service for Maharashtra Colleges & Universities
// Includes: Engineering, Technology, Arts, Science, Commerce, Management, Law & Medical Institutions
// Features Strict Deduplication, Regional City Mapping & Multi-Disciplinary Department Mapping

export const ALL_DISCIPLINE_DEPARTMENTS = [
  // --- Computer Science, AI & Engineering ---
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Artificial Intelligence & Data Science (AI & DS)",
  "Electronics & Telecommunication Engineering (EXTC / ECE)",
  "Electrical Engineering (EE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Data Science & Machine Learning",
  "Cyber Security & Digital Forensics",
  "Biotechnology & Bioinformatics",
  "Chemical Engineering",
  "Instrumentation & Control Engineering",
  "Robotics & Automation",
  "Aerospace & Aeronautical Engineering",

  // --- Computer Applications & Software ---
  "Bachelor of Computer Applications (BCA)",
  "Master of Computer Applications (MCA)",
  "B.Sc. Computer Science / IT",
  "M.Sc. Computer Science / Data Analytics",

  // --- Commerce, Business & Management ---
  "Bachelor of Commerce - General (B.Com)",
  "B.Com (Accounting & Finance - BAF)",
  "B.Com (Banking & Insurance - BBI)",
  "B.Com (Financial Markets - BFM)",
  "Bachelor of Management Studies (BMS)",
  "Bachelor of Business Administration (BBA)",
  "Master of Business Administration (MBA / MMS)",

  // --- Arts, Humanities & Social Sciences ---
  "B.A. English Literature & Linguistics",
  "B.A. Economics & Econometrics",
  "B.A. Psychology & Behavioral Sciences",
  "B.A. Journalism & Mass Communication (BAMMC)",
  "B.A. Political Science & Public Administration",
  "B.A. Sociology & Social Work (BSW / MSW)",
  "Visual Arts & Design",

  // --- Pure Sciences & Mathematics ---
  "B.Sc. Mathematics & Statistics",
  "B.Sc. Physics",
  "B.Sc. Chemistry & Industrial Chemistry",
  "B.Sc. Microbiology & Biochemistry",
  "B.Sc. Biotechnology & Genetic Engineering",

  // --- Law & Medical Sciences ---
  "Bachelor of Laws (LL.B / B.A. LL.B)",
  "Master of Laws (LL.M)",
  "Bachelor of Pharmacy (B.Pharm)",
  "Master of Pharmacy (M.Pharm)",
  "Bachelor of Architecture (B.Arch)"
];

export const STANDARD_INDIAN_DEPARTMENTS = ALL_DISCIPLINE_DEPARTMENTS;

// Public API Endpoints for fallback Live University verification
const PUBLIC_API_ENDPOINTS = [
  'https://cdn.jsdelivr.net/gh/Hipo/university-domains-list@master/world_universities_and_domains.json',
  'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json'
];

/**
 * Exhaustive Curated Directory of Premier Maharashtra Colleges & Universities
 * Strictly Deduplicated Across All Regions & Disciplines
 */
export const CURATED_MAHARASHTRA_COLLEGES = [
  // ==========================================
  // 1. PREMIER UNIVERSITIES & INSTITUTES OF NATIONAL IMPORTANCE
  // ==========================================
  { name: "Indian Institute of Technology Bombay (IIT Bombay)", city: "Mumbai", location: "Powai, Mumbai, Maharashtra", website: "https://www.iitb.ac.in" },
  { name: "Institute of Chemical Technology (ICT Mumbai)", city: "Mumbai", location: "Matunga East, Mumbai, Maharashtra", website: "https://www.ictmumbai.edu.in" },
  { name: "College of Engineering Pune (COEP Technological University)", city: "Pune", location: "Shivajinagar, Pune, Maharashtra", website: "https://www.coep.org.in" },
  { name: "Veermata Jijabai Technological Institute (VJTI)", city: "Mumbai", location: "Matunga, Mumbai, Maharashtra", website: "https://www.vjti.ac.in" },
  { name: "Visvesvaraya National Institute of Technology (VNIT Nagpur)", city: "Nagpur", location: "South Ambazari Road, Nagpur, Maharashtra", website: "https://vnit.ac.in" },
  { name: "Indian Institute of Information Technology, Pune (IIIT Pune)", city: "Pune", location: "Ambegaon Budruk, Pune, Maharashtra", website: "https://www.iiitp.ac.in" },
  { name: "Indian Institute of Information Technology, Nagpur (IIIT Nagpur)", city: "Nagpur", location: "Kalmeshwar, Nagpur, Maharashtra", website: "https://iiitn.ac.in" },
  { name: "Indian Institute of Management Mumbai (IIM Mumbai / formerly NITIE)", city: "Mumbai", location: "Powai, Mumbai, Maharashtra", website: "https://iimmumbai.ac.in" },
  { name: "Tata Institute of Fundamental Research (TIFR)", city: "Mumbai", location: "Colaba, Mumbai, Maharashtra", website: "https://www.tifr.res.in" },
  { name: "Tata Institute of Social Sciences (TISS)", city: "Mumbai", location: "Deonar, Mumbai, Maharashtra", website: "https://www.tiss.edu" },
  { name: "Homi Bhabha National Institute (HBNI)", city: "Mumbai", location: "Anushaktinagar, Mumbai, Maharashtra", website: "https://www.hbni.ac.in" },
  { name: "Defense Institute of Advanced Technology (DIAT)", city: "Pune", location: "Girinagar, Pune, Maharashtra", website: "https://diat.ac.in" },

  // ==========================================
  // 2. MAHARASHTRA STATE PUBLIC UNIVERSITIES
  // ==========================================
  { name: "University of Mumbai (MU)", city: "Mumbai", location: "Fort & Kalina, Mumbai, Maharashtra", website: "https://mu.ac.in" },
  { name: "Savitribai Phule Pune University (SPPU)", city: "Pune", location: "Ganeshkhind, Pune, Maharashtra", website: "http://www.unipune.ac.in" },
  { name: "Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)", city: "Nagpur", location: "Civil Lines, Nagpur, Maharashtra", website: "https://nagpuruniversity.ac.in" },
  { name: "Dr. Babasaheb Ambedkar Marathwada University (BAMU)", city: "Chhatrapati Sambhajinagar", location: "University Campus, Chhatrapati Sambhajinagar, Maharashtra", website: "http://www.bamu.ac.in" },
  { name: "Dr. Babasaheb Ambedkar Technological University (DBATU)", city: "Raigad", location: "Lonere, Mangaon, Raigad, Maharashtra", website: "https://dbatu.ac.in" },
  { name: "Shivaji University, Kolhapur", city: "Kolhapur", location: "Vidyanagar, Kolhapur, Maharashtra", website: "http://www.unishivaji.ac.in" },
  { name: "Sant Gadge Baba Amravati University (SGBAU)", city: "Amravati", location: "Tapovan Road, Amravati, Maharashtra", website: "https://www.sgbau.ac.in" },
  { name: "Punyashlok Ahilyadevi Holkar Solapur University", city: "Solapur", location: "Kegaon, Solapur, Maharashtra", website: "http://su.digitaluniversity.ac" },
  { name: "Swami Ramanand Teerth Marathwada University (SRTMU)", city: "Nanded", location: "Dnyanteerth, Vishnupuri, Nanded, Maharashtra", website: "https://www.srtmun.ac.in" },
  { name: "Kavayitri Bahinabai Chaudhari North Maharashtra University (KBCNMU)", city: "Jalgaon", location: "Umavi Nagar, Jalgaon, Maharashtra", website: "http://www.nmu.ac.in" },
  { name: "Gondwana University", city: "Gadchiroli", location: "MIDC Road, Gadchiroli, Maharashtra", website: "https://unigondwana.ac.in" },
  { name: "Maharashtra University of Health Sciences (MUHS)", city: "Nashik", location: "Mhasrul, Vani Dindori Road, Nashik, Maharashtra", website: "https://www.muhs.ac.in" },
  { name: "Maharashtra National Law University, Mumbai (MNLU Mumbai)", city: "Mumbai", location: "Powai, Mumbai, Maharashtra", website: "https://mnlumumbai.edu.in" },
  { name: "Maharashtra National Law University, Nagpur (MNLU Nagpur)", city: "Nagpur", location: "Waranga, Nagpur, Maharashtra", website: "https://nlunagpur.ac.in" },
  { name: "Maharashtra National Law University, Aurangabad (MNLU Aurangabad)", city: "Chhatrapati Sambhajinagar", location: "Chhatrapati Sambhajinagar, Maharashtra", website: "https://mnlua.ac.in" },

  // ==========================================
  // 3. PROMINENT DEEMED & PRIVATE UNIVERSITIES (MAHARASHTRA)
  // ==========================================
  { name: "Symbiosis International University (SIU)", city: "Pune", location: "Lavale & Senapati Bapat Road, Pune, Maharashtra", website: "https://www.siu.edu.in" },
  { name: "Narsee Monjee Institute of Management Studies (NMIMS)", city: "Mumbai", location: "Vile Parle West, Mumbai, Maharashtra", website: "https://www.nmims.edu" },
  { name: "MIT World Peace University (MIT-WPU)", city: "Pune", location: "Kothrud, Pune, Maharashtra", website: "https://mitwpu.edu.in" },
  { name: "Bharati Vidyapeeth Deemed to be University", city: "Pune", location: "Dhankawadi, Pune, Maharashtra", website: "https://bvuniversity.edu.in" },
  { name: "Dr. D. Y. Patil Vidyapeeth (Deemed University)", city: "Pune", location: "Pimpri, Pune, Maharashtra", website: "https://dpu.edu.in" },
  { name: "Somaiya Vidyavihar University", city: "Mumbai", location: "Vidyavihar East, Mumbai, Maharashtra", website: "https://somaiya.edu" },
  { name: "MGM University", city: "Chhatrapati Sambhajinagar", location: "N-6 CIDCO, Chhatrapati Sambhajinagar, Maharashtra", website: "https://mgmu.ac.in" },
  { name: "Vishwakarma University (VU)", city: "Pune", location: "Kondhwa Budruk, Pune, Maharashtra", website: "https://www.vupune.ac.in" },
  { name: "Sandip University", city: "Nashik", location: "Mahiravani, Trimbak Road, Nashik, Maharashtra", website: "https://www.sandipuniversity.edu.in" },
  { name: "Sanjay Ghodawat University (SGU)", city: "Kolhapur", location: "Atigre, Kolhapur, Maharashtra", website: "https://www.sanjayghodawatuniversity.ac.in" },
  { name: "Pravara Institute of Medical Sciences (PIMS)", city: "Ahmednagar", location: "Loni, Rahata, Ahmednagar, Maharashtra", website: "https://www.pravara.com" },
  { name: "Datta Meghe Institute of Higher Education and Research", city: "Wardha", location: "Sawangi Meghe, Wardha, Maharashtra", website: "https://www.dmiher.edu.in" },
  { name: "Krishna Vishwa Vidyapeeth (KIMS)", city: "Satara", location: "Malkapur, Karad, Satara, Maharashtra", website: "https://kvv.edu.in" },

  // ==========================================
  // 4. TOP ENGINEERING & TECH INSTITUTES - MUMBAI & MMR
  // ==========================================
  { name: "Sardar Patel Institute of Technology (SPIT)", city: "Mumbai", location: "Munshi Nagar, Andheri West, Mumbai, Maharashtra", website: "https://www.spit.ac.in" },
  { name: "Sardar Patel College of Engineering (SPCE)", city: "Mumbai", location: "Munshi Nagar, Andheri West, Mumbai, Maharashtra", website: "https://www.spce.ac.in" },
  { name: "Dwarkadas J. Sanghvi College of Engineering (DJSCE)", city: "Mumbai", location: "JVPD Scheme, Vile Parle West, Mumbai, Maharashtra", website: "https://www.djsce.ac.in" },
  { name: "K. J. Somaiya College of Engineering (KJSCE)", city: "Mumbai", location: "Vidyavihar East, Mumbai, Maharashtra", website: "https://kjsce.somaiya.edu" },
  { name: "Fr. Conceicao Rodrigues College of Engineering (CRCE)", city: "Mumbai", location: "Bandstand, Bandra West, Mumbai, Maharashtra", website: "https://www.frcrce.ac.in" },
  { name: "Thadomal Shahani Engineering College (TSEC)", city: "Mumbai", location: "Bandra West, Mumbai, Maharashtra", website: "https://tsec.edu" },
  { name: "Ramrao Adik Institute of Technology (RAIT)", city: "Navi Mumbai", location: "Sector 7, Nerul, Navi Mumbai, Maharashtra", website: "https://dypatil.edu/schools/rait" },
  { name: "Vivekanand Education Society's Institute of Technology (VESIT)", city: "Mumbai", location: "Collector's Colony, Chembur, Mumbai, Maharashtra", website: "https://vesit.ves.ac.in" },
  { name: "Vidyalankar Institute of Technology (VIT Wadala)", city: "Mumbai", location: "Wadala East, Mumbai, Maharashtra", website: "https://vit.edu.in" },
  { name: "Fr. C. Rodrigues Institute of Technology (FCRIT Vashi)", city: "Navi Mumbai", location: "Sector 9A, Vashi, Navi Mumbai, Maharashtra", website: "https://www.fcrit.ac.in" },
  { name: "Thakur College of Engineering and Technology (TCET)", city: "Mumbai", location: "Kandivali East, Mumbai, Maharashtra", website: "https://www.tcetmumbai.in" },
  { name: "K. J. Somaiya Institute of Technology (KJSIT Sion)", city: "Mumbai", location: "Sion East, Mumbai, Maharashtra", website: "https://kjsit.somaiya.edu" },
  { name: "Don Bosco Institute of Technology (DBIT)", city: "Mumbai", location: "Kurla West, Mumbai, Maharashtra", website: "https://www.dbit.in" },
  { name: "Rajiv Gandhi Institute of Technology (RGIT)", city: "Mumbai", location: "Juhu Versova Link Road, Andheri West, Mumbai, Maharashtra", website: "https://mctrgit.ac.in" },
  { name: "SIES Graduate School of Technology (SIES GST)", city: "Navi Mumbai", location: "Sector 5, Nerul, Navi Mumbai, Maharashtra", website: "https://siesgst.edu.in" },
  { name: "Terna Engineering College", city: "Navi Mumbai", location: "Sector 22, Nerul, Navi Mumbai, Maharashtra", website: "https://ternaengg.ac.in" },
  { name: "Pillai College of Engineering (PCE)", city: "Navi Mumbai", location: "Dr. K. M. Vasudevan Pillai Campus, New Panvel, Maharashtra", website: "https://www.pce.ac.in" },
  { name: "Lokmanya Tilak College of Engineering (LTCE)", city: "Navi Mumbai", location: "Sector 4, Vikas Nagar, Koparkhairane, Navi Mumbai, Maharashtra", website: "https://ltce.in" },
  { name: "Atharva College of Engineering", city: "Mumbai", location: "Malad West, Mumbai, Maharashtra", website: "https://atharvacoe.ac.in" },
  { name: "St. Francis Institute of Technology (SFIT)", city: "Mumbai", location: "Mount Poinsur, Borivali West, Mumbai, Maharashtra", website: "https://www.sfit.ac.in" },
  { name: "Finolex Academy of Management and Technology (FAMT)", city: "Ratnagiri", location: "MIDC Mirjole, Ratnagiri, Maharashtra", website: "https://famt.ac.in" },

  // ==========================================
  // 5. TOP ENGINEERING & TECH INSTITUTES - PUNE REGION
  // ==========================================
  { name: "Pune Institute of Computer Technology (PICT)", city: "Pune", location: "Dhankawadi, Pune, Maharashtra", website: "https://pict.edu" },
  { name: "Vishwakarma Institute of Technology (VIT Pune)", city: "Pune", location: "Bibwewadi, Pune, Maharashtra", website: "https://www.vit.edu" },
  { name: "Pimpri Chinchwad College of Engineering (PCCOE)", city: "Pune", location: "Sector 26, Pradhikaran, Nigdi, Pune, Maharashtra", website: "https://www.pccoepune.com" },
  { name: "Pimpri Chinchwad College of Engineering and Research (PCCOER)", city: "Pune", location: "Ravet, Pune, Maharashtra", website: "https://www.pccoer.com" },
  { name: "MKSSS's Cummins College of Engineering for Women", city: "Pune", location: "Karvenagar, Pune, Maharashtra", website: "https://www.cumminscollege.org" },
  { name: "Vishwakarma Institute of Information Technology (VIIT)", city: "Pune", location: "Kondhwa Budruk, Pune, Maharashtra", website: "https://www.viit.ac.in" },
  { name: "Army Institute of Technology (AIT Pune)", city: "Pune", location: "Alandi Road, Dighi, Pune, Maharashtra", website: "https://www.aitpune.com" },
  { name: "Sinhgad College of Engineering (SCOE)", city: "Pune", location: "Vadgaon Budruk, Pune, Maharashtra", website: "https://cms.sinhgad.edu" },
  { name: "Smt. Kashibai Navale College of Engineering (SKNCOE)", city: "Pune", location: "Vadgaon Budruk, Pune, Maharashtra", website: "https://cms.sinhgad.edu" },
  { name: "MIT Academy of Engineering (MITAOE Alandi)", city: "Pune", location: "Alandi Road, Pune, Maharashtra", website: "https://mitaoe.ac.in" },
  { name: "Dr. D. Y. Patil Institute of Technology (DYPIT Pimpri)", city: "Pune", location: "Sant Tukaram Nagar, Pimpri, Pune, Maharashtra", website: "https://engg.dypvp.edu.in" },
  { name: "Dr. D. Y. Patil College of Engineering (DYPCOE Akurdi)", city: "Pune", location: "Sector 29, Nigdi Pradhikaran, Akurdi, Pune, Maharashtra", website: "https://www.dypcoeakurdi.ac.in" },
  { name: "JSPM's Rajarshi Shahu College of Engineering (RSCOE)", city: "Pune", location: "Tathawade, Pune, Maharashtra", website: "https://www.jspmrscoe.edu.in" },
  { name: "Progressive Education Society's Modern College of Engineering (MCOE)", city: "Pune", location: "Shivajinagar, Pune, Maharashtra", website: "https://moderncoe.edu.in" },
  { name: "AISSMS College of Engineering (AISSMS COE)", city: "Pune", location: "Kennedy Road, Shivajinagar, Pune, Maharashtra", website: "https://aissmscoe.com" },
  { name: "AISSMS Institute of Information Technology (AISSMS IOIT)", city: "Pune", location: "Kennedy Road, Pune, Maharashtra", website: "https://aissmsioit.org" },
  { name: "Marathwada Mitra Mandal's College of Engineering (MMCOE)", city: "Pune", location: "Karvenagar, Pune, Maharashtra", website: "https://www.mmcoe.edu.in" },
  { name: "Bharati Vidyapeeth College of Engineering (BVCOE Pune)", city: "Pune", location: "Pune-Satara Road, Dhankawadi, Pune, Maharashtra", website: "http://bvucoepune.edu.in" },
  { name: "GH Raisoni College of Engineering and Management (GHRCEM)", city: "Pune", location: "Wagholi, Pune, Maharashtra", website: "https://ghrcem.raisoni.net" },
  { name: "Zeal College of Engineering and Research (ZCOER)", city: "Pune", location: "Narhe, Pune, Maharashtra", website: "https://zcoer.in" },

  // ==========================================
  // 6. TOP ENGINEERING & TECH - REST OF MAHARASHTRA
  // ==========================================
  { name: "Shri Ramdeobaba College of Engineering and Management (RCOEM)", city: "Nagpur", location: "Katol Road, Nagpur, Maharashtra", website: "http://www.rknec.edu" },
  { name: "Yeshwantrao Chavan College of Engineering (YCCE)", city: "Nagpur", location: "Hingna Road, Wanadongri, Nagpur, Maharashtra", website: "https://www.ycce.edu" },
  { name: "Government College of Engineering, Nagpur (GCOEN)", city: "Nagpur", location: "Sector 27, Mihan Rehab, Nagpur, Maharashtra", website: "https://gcoen.ac.in" },
  { name: "G. H. Raisoni College of Engineering (GHRCE)", city: "Nagpur", location: "CRPF Gate No. 3, Hingna Road, Digdoh Hills, Nagpur, Maharashtra", website: "https://ghrce.raisoni.net" },
  { name: "K. K. Wagh Institute of Engineering Education & Research (KKWIEER)", city: "Nashik", location: "Amrutdham, Panchavati, Nashik, Maharashtra", website: "https://engg.kkwagh.edu.in" },
  { name: "MET Institute of Engineering (Bhujbal Knowledge City)", city: "Nashik", location: "Adgaon, Nashik, Maharashtra", website: "https://metbhujbalknowledgecity.ac.in" },
  { name: "NDMVP Samaj's KBT College of Engineering", city: "Nashik", location: "Udoji Maratha Boarding Campus, Gangapur Road, Nashik, Maharashtra", website: "https://kbtcoe.org" },
  { name: "Government College of Engineering, Aurangabad (GECA)", city: "Chhatrapati Sambhajinagar", location: "Osmanpura, Chhatrapati Sambhajinagar, Maharashtra", website: "https://geca.ac.in" },
  { name: "Jawaharlal Nehru Engineering College (JNEC MGM)", city: "Chhatrapati Sambhajinagar", location: "MGM Campus, CIDCO, Chhatrapati Sambhajinagar, Maharashtra", website: "https://jnec.org" },
  { name: "Government College of Engineering, Karad (GCEK)", city: "Satara", location: "Vidyanagar, Karad, Satara, Maharashtra", website: "https://www.gcekarad.ac.in" },
  { name: "Walchand College of Engineering (WCE Sangli)", city: "Sangli", location: "Vishrambag, Sangli, Maharashtra", website: "http://www.walchandsangli.ac.in" },
  { name: "Government College of Engineering, Amravati (GCOEA)", city: "Amravati", location: "Kathora Naka, VMV Road, Amravati, Maharashtra", website: "https://gcoea.ac.in" },
  { name: "Prof. Ram Meghe Institute of Technology & Research (PRMIT&R)", city: "Amravati", location: "Anjangaon Bari Road, Badnera, Amravati, Maharashtra", website: "https://mitra.ac.in" },
  { name: "Walchand Institute of Technology (WIT Solapur)", city: "Solapur", location: "Seth Walchand Hirachand Marg, Ashok Chowk, Solapur, Maharashtra", website: "https://witsolapur.org" },
  { name: "Sanjivani College of Engineering", city: "Ahmednagar", location: "Sanjivani Rural Education Society, Kopargaon, Ahmednagar, Maharashtra", website: "https://sanjivanicoe.org.in" },
  { name: "Amrutvahini College of Engineering (AVCOE)", city: "Ahmednagar", location: "Amrutnagar, Sangamner, Ahmednagar, Maharashtra", website: "https://www.avcoe.org" },
  { name: "Kolhapur Institute of Technology's College of Engineering (KITCoEK)", city: "Kolhapur", location: "Gokul Shirgaon, Kolhapur, Maharashtra", website: "https://kitcoek.in" },
  { name: "D. Y. Patil College of Engineering and Technology (DYPCET)", city: "Kolhapur", location: "Kasaba Bawada, Kolhapur, Maharashtra", website: "https://coek.dypgroup.edu.in" },
  { name: "Shri Guru Gobind Singhji Institute of Engineering and Technology (SGGSIE&T)", city: "Nanded", location: "Vishnupuri, Nanded, Maharashtra", website: "https://www.sggs.ac.in" },
  { name: "Government College of Engineering, Chandrapur", city: "Chandrapur", location: "Babupeth, Ballarpur Bypass Road, Chandrapur, Maharashtra", website: "http://www.gcoec.ac.in" },
  { name: "Government College of Engineering, Yavatmal", city: "Yavatmal", location: "Dhamangaon Road, Yavatmal, Maharashtra", website: "https://gcoey.ac.in" },
  { name: "Shri Sant Gajanan Maharaj College of Engineering (SSGMCE)", city: "Buldhana", location: "Shegaon, Buldhana, Maharashtra", website: "https://www.ssgmce.ac.in" },

  // ==========================================
  // 7. PREMIER ARTS, SCIENCE & COMMERCE COLLEGES (MAHARASHTRA)
  // ==========================================
  { name: "St. Xavier's College (Autonomous), Mumbai", city: "Mumbai", location: "Mahapalika Marg, Dhobi Talao, Mumbai, Maharashtra", website: "https://xaviers.edu" },
  { name: "Fergusson College (Autonomous), Pune", city: "Pune", location: "FC Road, Shivajinagar, Pune, Maharashtra", website: "https://www.fergusson.edu" },
  { name: "Mithibai College of Arts, Chauhan Institute of Science & A.J. College of Commerce", city: "Mumbai", location: "Vile Parle West, Mumbai, Maharashtra", website: "https://www.mithibai.ac.in" },
  { name: "Narsee Monjee College of Commerce and Economics (NM College)", city: "Mumbai", location: "Vile Parle West, Mumbai, Maharashtra", website: "https://nmcollege.in" },
  { name: "Jai Hind College (Autonomous)", city: "Mumbai", location: "A Road, Churchgate, Mumbai, Maharashtra", website: "https://www.jaihindcollege.com" },
  { name: "H.R. College of Commerce and Economics", city: "Mumbai", location: "Vidyasagar Principal K.M. Kundnani Chowk, Churchgate, Mumbai, Maharashtra", website: "https://www.hrcollege.edu" },
  { name: "K. C. College (Kishinchand Chellaram College)", city: "Mumbai", location: "Dinshaw Wachha Road, Churchgate, Mumbai, Maharashtra", website: "https://kccollege.edu.in" },
  { name: "Ramnarain Ruia Autonomous College", city: "Mumbai", location: "L. Nappo Road, Matunga East, Mumbai, Maharashtra", website: "https://www.ruiacollege.edu" },
  { name: "D. G. Ruparel College of Arts, Science and Commerce", city: "Mumbai", location: "Senapati Bapat Marg, Mahim, Matunga West, Mumbai, Maharashtra", website: "https://ruparel.edu" },
  { name: "Symbiosis College of Arts and Commerce", city: "Pune", location: "Senapati Bapat Road, Pune, Maharashtra", website: "https://symbiosiscollege.edu.in" },
  { name: "Brihan Maharashtra College of Commerce (BMCC)", city: "Pune", location: "BMCC Road, Deccan Gymkhana, Pune, Maharashtra", website: "https://www.bmcc.ac.in" },
  { name: "Sir Parashurambhau College (SP College)", city: "Pune", location: "Tilak Road, Sadashiv Peth, Pune, Maharashtra", website: "https://spcollegepune.ac.in" },
  { name: "K. J. Somaiya College of Arts and Commerce", city: "Mumbai", location: "Vidyavihar East, Mumbai, Maharashtra", website: "https://kjsac.somaiya.edu" },
  { name: "R. A. Podar College of Commerce and Economics", city: "Mumbai", location: "L. N. Road, Matunga East, Mumbai, Maharashtra", website: "https://www.rapodar.ac.in" },
  { name: "Sydenham College of Commerce and Economics", city: "Mumbai", location: "B-Road, Churchgate, Mumbai, Maharashtra", website: "http://sydenham.ac.in" },
  { name: "Wilson College", city: "Mumbai", location: "Chowpatty Seaface, Mumbai, Maharashtra", website: "https://wilsoncollege.edu" },
  { name: "Elphinstone College", city: "Mumbai", location: "156 M.G. Road, Fort, Mumbai, Maharashtra", website: "https://elphinstone.ac.in" },
  { name: "Progressive Education Society's Modern College of Arts, Science and Commerce", city: "Pune", location: "Shivajinagar, Pune, Maharashtra", website: "https://moderncollegepune.edu.in" },
  { name: "Ness Wadia College of Commerce", city: "Pune", location: "Late Prin. V.K. Joag Path, Pune, Maharashtra", website: "https://nesswadiacollege.edu.in" },
  { name: "Abasaheb Garware College", city: "Pune", location: "Karve Road, Pune, Maharashtra", website: "https://garwarecollege.mespune.in" },
  { name: "Nowrosjee Wadia College", city: "Pune", location: "Prin. V. K. Joag Path, Bund Garden, Pune, Maharashtra", website: "https://nowrosjeewadiacollege.edu.in" },
  { name: "Hislop College", city: "Nagpur", location: "Temple Road, Civil Lines, Nagpur, Maharashtra", website: "https://hislopcollege.ac.in" },
  { name: "G. S. College of Commerce and Economics", city: "Nagpur", location: "Amravati Road, Law College Square, Nagpur, Maharashtra", website: "https://gscen.shikshamandal.org" },
  { name: "Dr. Ambedkar College", city: "Nagpur", location: "Deekshabhoomi, Nagpur, Maharashtra", website: "https://dacn.in" },
  { name: "HPT Arts and RYK Science College", city: "Nashik", location: "Prin. T. A. Kulkarni Vidyanagar, Nashik, Maharashtra", website: "https://hptrykcollege.com" },
  { name: "BYK College of Commerce", city: "Nashik", location: "Prin. T. A. Kulkarni Vidyanagar, College Road, Nashik, Maharashtra", website: "https://bykcollege.com" },
  { name: "Deogiri College", city: "Chhatrapati Sambhajinagar", location: "Railway Station Road, Chhatrapati Sambhajinagar, Maharashtra", website: "https://deogiricollege.org" },
  { name: "Rajarshi Shahu Mahavidyalaya (Autonomous)", city: "Latur", location: "Kaku Seth Ukka Marg, Chandra Nagar, Latur, Maharashtra", website: "https://shahucollegelatur.org.in" },
  { name: "Dayanand College of Arts", city: "Latur", location: "Barshi Road, Latur, Maharashtra", website: "https://dlatr.org.in" },
  { name: "Willingdon College", city: "Sangli", location: "Vishrambag, Sangli, Maharashtra", website: "https://willingdoncollege.ac.in" },
  { name: "Chhatrapati Shahu Institute of Business Education and Research (CSIBER)", city: "Kolhapur", location: "University Road, Kolhapur, Maharashtra", website: "https://siberindia.edu.in" },
  { name: "Rajaram College", city: "Kolhapur", location: "Sagarmal, Kolhapur, Maharashtra", website: "https://rajaramcollege.com" },
  { name: "Vivekananda College (Autonomous)", city: "Kolhapur", location: "Tarabai Park, Kolhapur, Maharashtra", website: "https://vivekanandcollege.ac.in" },
  { name: "Sangameshwar College (Autonomous)", city: "Solapur", location: "Saat Rasta, Solapur, Maharashtra", website: "https://sangameshwarcollege.ac.in" },
  { name: "Walchand College of Arts and Science", city: "Solapur", location: "Ashok Chowk, Solapur, Maharashtra", website: "https://walchandsolapur.org" },
  { name: "Pratap College (Autonomous)", city: "Jalgaon", location: "Amalner, Jalgaon, Maharashtra", website: "https://pcamalner.ac.in" },
  { name: "Moolji Jaitha College (MJ College, Autonomous)", city: "Jalgaon", location: "Prabhat Colony, Jalgaon, Maharashtra", website: "https://mjcollege.kces.in" },
  { name: "Vidyabharti Mahavidyalaya", city: "Amravati", location: "C.K. Naidu Road, Camp, Amravati, Maharashtra", website: "https://vbmv.org" },
  { name: "Brijlal Biyani Science College", city: "Amravati", location: "Biyani Educational Campus, Dasera Maidan Road, Amravati, Maharashtra", website: "https://bbscamt.com" },

  // ==========================================
  // 8. MEDICAL, LAW & MANAGEMENT INSTITUTIONS
  // ==========================================
  { name: "Grant Government Medical College & Sir J.J. Group of Hospitals", city: "Mumbai", location: "Byculla, Mumbai, Maharashtra", website: "https://ggmcjjh.com" },
  { name: "Seth G.S. Medical College & KEM Hospital", city: "Mumbai", location: "Parel, Mumbai, Maharashtra", website: "https://www.kem.edu" },
  { name: "Lokmanya Tilak Municipal Medical College (LTMG Hospital / Sion)", city: "Mumbai", location: "Sion West, Mumbai, Maharashtra", website: "https://ltmmc.edu.in" },
  { name: "Topiwala National Medical College & Nair Hospital", city: "Mumbai", location: "Mumbai Central, Mumbai, Maharashtra", website: "https://tnmc.edu.in" },
  { name: "Armed Forces Medical College (AFMC)", city: "Pune", location: "Southern Command, Wanowrie, Pune, Maharashtra", website: "https://afmc.nic.in" },
  { name: "B. J. Government Medical College & Sassoon General Hospital", city: "Pune", location: "Near Pune Railway Station, Pune, Maharashtra", website: "https://bjmcpune.org" },
  { name: "Government Medical College (GMC Nagpur)", city: "Nagpur", location: "Hanuman Nagar, Medical Square, Nagpur, Maharashtra", website: "https://gmcnagpur.org" },
  { name: "Indira Gandhi Government Medical College (IGGMC)", city: "Nagpur", location: "Mayo Hospital, Central Avenue Road, Nagpur, Maharashtra", website: "https://iggmc.org" },
  { name: "Government Law College (GLC Mumbai)", city: "Mumbai", location: "'A' Road, Churchgate, Mumbai, Maharashtra", website: "https://www.glcmumbai.com" },
  { name: "ILS Law College", city: "Pune", location: "Law College Road, Pune, Maharashtra", website: "https://ilslaw.edu" },
  { name: "Symbiosis Law School (SLS Pune)", city: "Pune", location: "Survey No 227, Rohan Mithila, Viman Nagar, Pune, Maharashtra", website: "https://www.symlaw.ac.in" },
  { name: "DES Shri Navalmal Firodia Law College", city: "Pune", location: "Fergusson College Campus, Shivajinagar, Pune, Maharashtra", website: "https://deslaw.edu.in" },
  { name: "Jamnalal Bajaj Institute of Management Studies (JBIMS)", city: "Mumbai", location: "H.T. Parekh Marg, Churchgate, Mumbai, Maharashtra", website: "https://jbims.edu" },
  { name: "Sydenham Institute of Management Studies (SIMSREE)", city: "Mumbai", location: "B-Road, Churchgate, Mumbai, Maharashtra", website: "https://simsree.org" },
  { name: "S. P. Jain Institute of Management and Research (SPJIMR)", city: "Mumbai", location: "Munshi Nagar, Andheri West, Mumbai, Maharashtra", website: "https://www.spjimr.org" },
  { name: "Welingkar Institute of Management (WeSchool)", city: "Mumbai", location: "L. Napoo Road, Matunga Central, Mumbai, Maharashtra", website: "https://www.welingkar.org" },
  { name: "Department of Management Sciences (PUMBA, SPPU)", city: "Pune", location: "Ganeshkhind, Pune, Maharashtra", website: "https://pumba.in" }
];

let inMemoryCollegesCache = null;

/**
 * Strict Normalize Key for Deduplication
 * Strips parentheses, punctuation, common university prefixes/suffixes, extra spaces
 */
export function normalizeKey(str) {
  return (str || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove (IITB), (Autonomous), etc.
    .replace(/\b(autonomous|deemed to be university|deemed university|affiliated to|college of|institute of|vidyapeeth|university)\b/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if an institution belongs exclusively to Maharashtra
 */
export function isMaharashtraInstitution(name, state = '', location = '') {
  const text = `${name} ${state} ${location}`.toLowerCase();

  // Known other states keywords to reject immediately
  const otherStateKeywords = [
    'tamil nadu', 'chennai', 'coimbatore', 'madurai', 'trichy', 'vellore',
    'karnataka', 'bangalore', 'bengaluru', 'mysore', 'mangalore',
    'delhi', 'new delhi', 'noida', 'gurugram', 'gurgaon', 'haryana',
    'uttar pradesh', 'lucknow', 'kanpur', 'varanasi', 'aligarh',
    'west bengal', 'kolkata', 'calcutta', 'howrah',
    'kerala', 'kochi', 'trivandrum', 'thiruvananthapuram', 'calicut',
    'telangana', 'hyderabad', 'andhra pradesh', 'visakhapatnam', 'vijayawada',
    'rajasthan', 'jaipur', 'pilani', 'jodhpur', 'udaipur',
    'gujarat', 'ahmedabad', 'surat', 'vadodara', 'gandhinagar',
    'punjab', 'chandigarh', 'amritsar', 'ludhiana',
    'madhya pradesh', 'bhopal', 'indore', 'gwalior',
    'bihar', 'patna', 'odisha', 'bhubaneswar', 'cuttack', 'assam', 'guwahati'
  ];

  for (const kw of otherStateKeywords) {
    if (text.includes(kw) && !text.includes('maharashtra') && !text.includes('mumbai') && !text.includes('pune')) {
      return false;
    }
  }

  // Maharashtra regional identifiers
  const mhKeywords = [
    'maharashtra', 'mumbai', 'bombay', 'pune', 'nagpur', 'nashik', 'aurangabad',
    'sambhajinagar', 'chhatrapati sambhajinagar', 'kolhapur', 'solapur', 'amravati',
    'nanded', 'jalgaon', 'sangli', 'satara', 'karad', 'latur', 'ahmednagar', 'dhule',
    'chandrapur', 'wardha', 'gadchiroli', 'buldhana', 'shegaon', 'lonere', 'raigad',
    'ratnagiri', 'sindhudurg', 'thane', 'navi mumbai', 'kalyan', 'dombivli', 'panvel',
    'pimpri', 'chinchwad', 'vadgaon', 'dhankawadi', 'vile parle', 'matunga', 'chembur',
    'powai', 'bandra', 'churchgate', 'vidyavihar', 'savitribai phule', 'vjti', 'coep',
    'ict mumbai', 'spit', 'pict', 'walchand', 'cummins college', 'ramdeobaba', 'ycce'
  ];

  return mhKeywords.some(kw => text.includes(kw));
}

/**
 * Extract City from Maharashtra institution details
 */
export function extractCityFromLocation(location = '', name = '') {
  const combined = `${location} ${name}`.toLowerCase();
  if (combined.includes('mumbai') || combined.includes('bombay') || combined.includes('powai') || combined.includes('matunga') || combined.includes('churchgate') || combined.includes('vile parle')) return 'Mumbai';
  if (combined.includes('navi mumbai') || combined.includes('panvel') || combined.includes('nerul') || combined.includes('vashi')) return 'Navi Mumbai';
  if (combined.includes('thane') || combined.includes('kalyan') || combined.includes('dombivli')) return 'Thane';
  if (combined.includes('pune') || combined.includes('pimpri') || combined.includes('chinchwad') || combined.includes('nigdi') || combined.includes('shivajinagar') || combined.includes('kothrud')) return 'Pune';
  if (combined.includes('nagpur')) return 'Nagpur';
  if (combined.includes('nashik')) return 'Nashik';
  if (combined.includes('sambhajinagar') || combined.includes('aurangabad')) return 'Chhatrapati Sambhajinagar';
  if (combined.includes('kolhapur')) return 'Kolhapur';
  if (combined.includes('solapur')) return 'Solapur';
  if (combined.includes('sangli')) return 'Sangli';
  if (combined.includes('satara') || combined.includes('karad')) return 'Satara';
  if (combined.includes('amravati') || combined.includes('badnera')) return 'Amravati';
  if (combined.includes('nanded')) return 'Nanded';
  if (combined.includes('jalgaon') || combined.includes('amalner')) return 'Jalgaon';
  if (combined.includes('latur')) return 'Latur';
  if (combined.includes('ahmednagar') || combined.includes('sangamner') || combined.includes('kopargaon') || combined.includes('loni')) return 'Ahmednagar';
  if (combined.includes('chandrapur')) return 'Chandrapur';
  if (combined.includes('wardha')) return 'Wardha';
  if (combined.includes('ratnagiri')) return 'Ratnagiri';
  if (combined.includes('raigad') || combined.includes('lonere')) return 'Raigad';
  if (combined.includes('buldhana') || combined.includes('shegaon')) return 'Buldhana';
  return 'Maharashtra';
}

/**
 * Fetch ALL Maharashtra Colleges & Universities
 * Strict Zero-Duplicate Engine — Filters out all non-Maharashtra institutions
 */
export async function fetchAllIndianCollegesAPI() {
  // Purge old all-India localStorage caches if they exist
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('nexthire_all_india_colleges_v6');
      localStorage.removeItem('nexthire_all_india_colleges_v5');
    }
  } catch (e) {
    // Ignore storage restrictions
  }

  if (inMemoryCollegesCache && inMemoryCollegesCache.length > 20) {
    return inMemoryCollegesCache;
  }

  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('nexthire_maharashtra_colleges_v2');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 20) {
          inMemoryCollegesCache = parsed;
          refreshMaharashtraCollegesBackground();
          return parsed;
        }
      } catch (e) {
        console.warn("Maharashtra colleges cache parse error:", e);
      }
    }
  }

  return await refreshMaharashtraCollegesBackground();
}

/**
 * Alias export for semantic clarity
 */
export const fetchAllMaharashtraCollegesAPI = fetchAllIndianCollegesAPI;

/**
 * Merges Online Public API (filtered strictly for Maharashtra) with Curated Maharashtra Colleges
 * Enforcing 100% Strict Unique Names & No Duplicates
 */
async function refreshMaharashtraCollegesBackground() {
  const normalizedSeen = new Set();
  const canonicalNameMap = new Map();
  const unifiedColleges = [];

  // Helper to add uniquely without duplicate variations
  const addUniqueCollege = (item) => {
    const cleanName = (item.name || '').trim();
    if (!cleanName || cleanName.length < 3) return;

    // Reject non-Maharashtra items
    if (!isMaharashtraInstitution(cleanName, item.state, item.location)) {
      return;
    }

    const normKey = normalizeKey(cleanName);
    if (!normKey || normKey.length < 3) return;

    if (!normalizedSeen.has(normKey)) {
      normalizedSeen.add(normKey);

      const city = item.city || extractCityFromLocation(item.location, cleanName);
      const location = item.location || `${city}, Maharashtra`;
      const id = `col_mh_${normKey.replace(/\s+/g, '_').substring(0, 32)}_${unifiedColleges.length + 1}`;

      const collegeRecord = {
        id,
        name: cleanName,
        state: 'Maharashtra',
        city: city,
        location: location,
        website: item.website || ''
      };

      canonicalNameMap.set(normKey, collegeRecord);
      unifiedColleges.push(collegeRecord);
    }
  };

  // 1. Add Pre-Curated Maharashtra Colleges first (Guarantees best naming convention)
  for (const c of CURATED_MAHARASHTRA_COLLEGES) {
    addUniqueCollege(c);
  }

  // 2. Fetch Live Online Global/India Universities API & strictly extract only Maharashtra entries
  for (const endpoint of PUBLIC_API_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const allData = await response.json();
        const mhApiItems = allData.filter(item => {
          const isIndia = item.country === 'India' || item.alpha_two_code === 'IN';
          if (!isIndia) return false;
          return isMaharashtraInstitution(item.name, item['state-province'], '');
        });

        mhApiItems.forEach(apiItem => {
          addUniqueCollege({
            name: apiItem.name,
            state: 'Maharashtra',
            city: extractCityFromLocation('', apiItem.name),
            location: `${extractCityFromLocation('', apiItem.name)}, Maharashtra`,
            website: apiItem.web_pages?.[0] || apiItem.domains?.[0] || ''
          });
        });
        break;
      }
    } catch (err) {
      console.warn(`Maharashtra endpoint ${endpoint} failed, continuing with curated list:`, err);
    }
  }

  // 3. Sort alphabetically by Name
  unifiedColleges.sort((a, b) => a.name.localeCompare(b.name));

  inMemoryCollegesCache = unifiedColleges;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nexthire_maharashtra_colleges_v2', JSON.stringify(unifiedColleges));
    }
  } catch (e) {
    // Quota safety
  }

  return unifiedColleges;
}

/**
 * Get multi-disciplinary departments for any college
 */
export function getDepartmentsForCollege(collegeId) {
  return ALL_DISCIPLINE_DEPARTMENTS.map((deptName, idx) => ({
    id: `dept_${idx + 1}`,
    name: deptName,
    collegeId: collegeId || 'all'
  }));
}
