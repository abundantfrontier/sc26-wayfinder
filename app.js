/*
 * SC26 Wayfinder — app logic.
 * Booth data is embedded below (BOOTH_ROWS, generated from booths.json), so
 * the page makes no data request and works the same over http and file://.
 */
(function () {
  'use strict';

  var BOOTH_ROWS = [["156","Passport to Prizes",3719,12597,3839,13077],["252","Spectral Compute",3959,12117,4199,12477],["256","INAF",3959,12597,4199,12837],["259","The Ohio State University",3959,12957,4199,13197],["450","AIST",4319,11877,4559,12117],["453","CINECA",4319,12237,4559,12477],["455","INFN CNAF",4319,12477,4559,12717],["458","Amtrol",4319,12837,4439,12957],["460","Valvoline Global",4319,13077,4439,13197],["537","CSCS / ETH Zurich",4439,10317,4559,10557],["539","Bergen Language Design Laboratory, University of Bergen",4439,10557,4559,10677],["540","Irish Centre for High-End Computing",4439,10677,4559,10917],["545","PermAlert",4439,11277,4559,11517],["547","University at Buffalo / Center for Computational Research",4439,11517,4559,11757],["558","ServerMonkey",4439,12837,4559,12957],["559","SoftBank Corp. / SB Intuitions Corp.",4439,12957,4559,13197],["638","University of Utah",4679,10437,4919,10797],["641","South Carolina Research Computing Consortium",4679,10797,4919,11037],["644","Super Radiator Coils",4679,11157,4919,11397],["646","dNOC",4679,11397,4799,11517],["648","MooseFS",4679,11637,4799,11757],["650","CEA",4679,11877,4919,12237],["653","Flatiron Institute",4679,12237,4919,12477],["656","KEK",4679,12597,4919,12837],["659","Tennessee Tech University",4679,12957,4919,13197],["725","Inteleca",4799,8877,4919,9117],["727","Rotork",4799,9117,4919,9357],["735","Lessengers",4799,10077,4919,10317],["746","Fujikura America, Inc",4799,11397,4919,11637],["748","SIPEARL",4799,11637,4919,11757],["826","Gems Setra",5039,8997,5159,9237],["829","MangoBoost, Inc.",5039,9357,5279,9597],["832","Georgia Institute of Technology",5039,9717,5279,10077],["835","PCI-SIG",5039,10077,5279,10317],["838","NCSA",5039,10437,5279,10797],["842","Gates",5039,10917,5279,11277],["846","Radiant",5039,11397,5279,11757],["850","NSF-ACCESS",5039,11877,5279,12237],["853","Advanced Cooling Technologies, Inc.",5039,12237,5159,12477],["856","Japan Aerospace Exploration Agency (JAXA)",5039,12597,5279,12837],["859","Texas Tech University",5039,12957,5279,13197],["862","MEGMEET",5066,13316,5186,13436],["913","BAC",5159,7497,5279,7737],["915","HARTING Americas",5159,7737,5279,7977],["924","Lutz Network & Power Group",5159,8757,5279,9117],["927","Transource Computers",5159,9117,5279,9237],["953","PoINT Software & Systems GmbH / BDT Media Automation GmbH",5159,12237,5279,12477],["962","F5",5186,13316,5306,13436],["1012","QStar Technologies, Inc",5399,7557,5519,7677],["1014","Qualstar Corporation",5399,7677,5519,7797],["1016","MinIO",5399,7797,5639,8157],["1020","Open Standards Pavilion",5399,8277,5639,8517],["1023","Data Center Technical Solutions Inc.",5399,8637,5639,9237],["1029","Eaton Corporation",5399,9357,5639,9837],["1034","Arizona Research Computing",5399,9957,5639,10317],["1038","Mississippi State University",5399,10437,5639,10797],["1041","SITELIN Hydraulic Manufacturing(Ningbo)Co.,Ltd",5399,10797,5639,11037],["1044","Klique",5399,11157,5639,11397],["1046","Cirrascale Cloud Services",5399,11397,5639,11757],["1050","CIDS @ TU Dresden",5399,11877,5639,12237],["1053","Trane Technologies",5399,12237,5639,12477],["1056","Guntner",5399,12597,5639,12837],["1059","Queen's University",5399,12957,5639,13197],["1062","KONST",5306,13316,5426,13436],["1105","Inventec Performance Chemicals",5519,6477,5639,6717],["1113","Sunrich Technology (H.K.) Limited",5519,7437,5639,7677],["1115","GOREAL ELECTRIC TECHNOLOGY (M) SDN. BHD.",5519,7677,5639,7797],["1205","Tongyu Electronics Co., Ltd",5759,6477,5999,6717],["1207","MBA Energy & Industrial",5759,6717,5879,6837],["1209","KAS Estimating Services, Inc",5759,6957,5879,7077],["1211","2CRSi",5759,7197,5999,7557],["1214","Flakt Group/Samsung",5759,7557,5999,7917],["1218","CXL Consortium",5759,8037,5999,8517],["1224","Asia Supercomputer Community",5759,8757,5879,8997],["1226","ENET",5759,8997,5879,9237],["1228","WD",5759,9237,5999,9477],["1231","AIC Inc.",5759,9597,5999,9837],["1233","Kingston Technology",5759,9837,5879,10077],["1236","Affiliated Engineers Inc.",5759,10197,5879,10317],["1238","MEGWARE Computer",5759,10437,5999,10677],["1240","Do IT Now",5759,10677,5999,10917],["1243","IQM Quantum Computers",5759,11037,5999,11277],["1245","SWEP North America",5759,11277,5879,11517],["1248","Hammond Manufacturing",5759,11637,5879,11757],["1250","The University of Texas at Dallas",5759,11877,5999,12237],["1253","Nscale",5759,12237,5999,12477],["1256","Mission Critical Group",5759,12597,5999,12837],["1260","Cleerline Technology Group",5759,13077,5879,13197],["1307","Omni Services",5879,6717,5999,7077],["1323","CEJN",5879,8637,5999,8997],["1326","Graid Technology Inc.",5879,8997,5999,9237],["1333","SIEMON",5879,9837,5999,10077],["1335","Quantum Corporation",5879,10077,5999,10317],["1345","Corning",5879,11277,5999,11517],["1347","Speck Industries, LP",5879,11517,5999,11757],["1359","Pacific Wave",5879,12957,5999,13197],["1405","JAMSTEC",6119,6477,6359,6717],["1408","OFEX",6119,6837,6359,7077],["1411","AI Semiconductor KOREA",6119,7197,6479,7557],["1415","Viking Enterprise Solutions",6119,7677,6479,8037],["1419","Cornelis Networks",6119,8157,6479,8517],["1423","VDURA",6119,8637,6479,9237],["1429","Hitachi Vantara",6119,9357,6479,9717],["1433","Seagate Technology",6119,9837,6479,10317],["1438","RIKEN",6119,10437,6479,10917],["1443","Delta Electronics (Americas) Ltd.",6119,11037,6479,11277],["1446","National Center for High-performance Computing, National Institutes of Applied Research",6119,11397,6479,11757],["1450","EBARA Pumps Americas Corporation",6119,11877,6359,12237],["1453","PCSS/PIONIER - Polish Optical Internet",6119,12237,6359,12477],["1456","Fortinet",6119,12597,6359,12837],["1459","National Institute of Informatics",6119,12957,6359,13197],["1600","SCC",6479,5997,6719,6117],["1602","The George Washington University",6479,6117,6599,6237],["1603","COOLTECH",6479,6237,6599,6597],["1606","MOREH",6479,6597,6599,6717],["1608","Boyd Thermal by Eaton",6479,6837,6719,7077],["1650","Center for Translational Data Science - Open Commons Consortium",6479,11877,6719,12357],["1655","RENCI",6479,12477,6719,12837],["1659","University of New Mexico - CARC",6479,12957,6719,13197],["1702","DapuStor Corporation",6599,6117,6719,6237],["1703","Malico Inc",6599,6237,6719,6357],["1704","AlmaLinux",6599,6357,6719,6477],["1705","FUSO.",6599,6477,6719,6717],["1711","Slurm",6599,7197,6959,7917],["1718","Everpure, Inc.",6599,8037,6959,8517],["1723","Penguin Solutions",6599,8637,6959,8997],["1727","Synopsys",6599,9117,6959,9477],["1731","Indiana University",6599,9597,6959,10317],["1738","Purdue University",6599,10437,6959,11037],["1744","Airsys",6599,11157,6959,11757],["1800","SCC",6839,5997,7079,6117],["1802","SPAL",6839,6117,7079,6477],["1806","IBM",6839,6597,7079,7077],["1850","King Abdullah University of Science & Technology",6839,11877,7079,12237],["1854","Advanced Computing Center for Research and Education",6839,12357,7079,12717],["1858","Castrol ON",6839,12837,7079,13197],["2000","SHI International Corp",7199,5877,7799,6477],["2006","Carahsoft Technology Corp.",7199,6597,7319,6717],["2007","Tuxera",7199,6717,7319,6837],["2009","dNOC",7199,6957,7319,7077],["2011","Bull",7079,7197,7439,7797],["2017","NextSilicon",7079,7917,7439,8517],["2024","Cerebras Systems",7079,8757,7439,9117],["2028","Vertiv",7079,9237,7439,10077],["2036","Vertiv",7079,10197,7439,10317],["2038","Digital Shovel HPC Solutions",7079,10437,7439,10917],["2043","ProLabs",7079,11037,7439,11517],["2048","General Dynamics Information Technology",7199,11637,7439,11757],["2050","Netris",7199,11877,7439,12237],["2054","Globus",7199,12357,7439,12717],["2058","International Computer Concepts",7199,12837,7319,12957],["2060","FT Energy",7199,13077,7319,13197],["2106","n2 Group",7319,6597,7439,6837],["2108","Qumulo",7319,6837,7439,7077],["2158","DRC Heat Transfer",7319,12837,7439,13077],["2160","Broocean Technologies Company Limited",7319,13077,7439,13197],["2206","SiliconANGLE Media, Inc.",7559,6597,7799,6837],["2208","Tachyum Inc.",7559,6837,7679,6957],["2209","General Dynamics Mission Systems",7559,6957,7679,7077],["2211","KAYTUS SYSTEMS PTE. LTD.",7559,7197,7919,7557],["2215","Starfish Storage",7559,7677,7919,8517],["2223","Dell Technologies",7559,8637,8519,9237],["2229","GIGABYTE",7559,9357,7919,9837],["2234","ASUS",7559,9957,7919,10317],["2238","SK Hynix",7559,10437,7919,10917],["2243","DDC Solutions",7559,11037,7919,11277],["2246","SambaNova",7559,11397,7919,11757],["2250","KISTI",7559,11877,7919,12237],["2254","Juelich Supercomputing Centre",7559,12357,7919,12717],["2258","Inventec Corporation",7559,12837,7919,13197],["2308","Red Hat",7679,6837,7799,7077],["2502","Rosenberger Site Solutions",8214,5993,8334,6353],["2511","Oracle",8039,7197,8519,7677],["2516","Fraunhofer ITWM",8039,7797,8519,8037],["2519","Weka",8039,8157,8519,8517],["2529","CIQ",8039,9357,8519,9837],["2534","Ace Computers",8039,9957,8279,10317],["2538","OpenHPC",8039,10437,8159,10557],["2539","Procurri",8039,10557,8159,10677],["2540","ShengRongYuan (Suzhou) Technology Co., Ltd (Multi-loop heat pipe)",8039,10677,8159,10797],["2541","JMC Global Technologies",8039,10797,8159,10917],["2542","ANEO",8039,10917,8159,11037],["2543","Security Engineered Machinery",8039,11037,8159,11157],["2544","dNOC",8039,11157,8159,11277],["2546","Amphenol",8039,11397,8279,11757],["2551","Ecolab",8039,11997,8519,12837],["2556","Legrand",8039,12957,8279,13197],["2658","ARaymond",8279,12957,8519,13197],["2662","HPC SOLUTIONS,INC",8291,13317,8531,13437],["2811","Siemens",8639,7197,8879,7557],["2815","Rescale",8639,7677,8879,8037],["2819","Intel Corporation",8639,8157,8879,8517],["2824","One Stop Systems",8639,8757,8759,9117],["2827","Staubli",8639,9117,8759,9357],["2829","Perforce TotalView",8639,9357,8759,9477],["2848","Flex",8582,11615,8822,11855],["2851","Virginia Tech",8639,11997,8879,12237],["2854","Altera Corporation",8639,12357,8759,12597],["2856","SunSource",8639,12597,8759,12717],["2858","ATTO Technology, Inc.",8639,12837,8759,12957],["2860","Rafay",8639,13077,8759,13197],["2923","STULZ",8759,8637,8879,9237],["2928","BittWare",8759,9237,8879,9477],["2930","Arista Networks",8639,9477,8879,9837],["2954","Tenstorrent",8759,12357,8879,12597],["2956","Aegiq Limited",8759,12597,8879,12717],["2958","PennEngineering",8759,12837,8879,13077],["2960","GFLOPS Co., Ltd.",8759,13077,8879,13197],["3011","NVIDIA Corporation",8999,7197,9599,7797],["3017","HPE",8999,7917,9599,8517],["3023","Lenovo",8999,8637,9599,9117],["3028","Advanced Micro Devices (AMD)",8999,9237,9599,9597],["3034","SCinet",8999,9837,9839,11157],["3051","NCAR",8999,11997,9239,12357],["3055","Alfa Laval",8999,12477,9239,12957],["3251","Axelera AI",9359,11997,9959,12357],["3255","MGHPCC",9359,12477,9599,12957],["3330","DriveNets",9719,9477,9959,9597],["3411","Microsoft",9719,7197,10319,7917],["3418","Google Cloud",9719,8037,10319,8517],["3423","NEC Corporation",9719,8637,9959,8877],["3426","Nokia",9719,8997,9959,9357],["3455","EPCC - The University of Edinburgh",9719,12477,9959,12717],["3530","MoBATCH",9959,9477,10079,9597],["3532","SCinet Research",9959,9597,10079,9837],["3548","TareCule",10020,11617,10260,11857],["3624","CPC",10079,8757,10199,8997],["3626","Cisco",10079,8997,10319,9357],["3630","KeystoneREN",10079,9477,10319,9837],["3651","StarLight",10079,11997,10319,12357],["3654","Keysight",10079,12357,10319,12717],["3723","Omnibond",10199,8637,10319,8997],["3811","nVent",10439,7197,11039,7797],["3817","VAST Data",10439,7917,10679,8517],["3823","Motivair",10439,8637,11039,9237],["3829","Internet2",10439,9357,10679,9837],["3850","ZutaCore",10439,11877,10679,12237],["3854","Texas A&M University/ High Performance Research Computing",10439,12357,10679,12717],["3858","SSERCA",10439,12837,10679,13197],["3934","Texas Advanced Computing Center",10559,9957,11039,10437],["3947","fluidiQ by Magnalytix",10559,11517,10679,11757],["4000","Panduit",10799,5877,11039,6117],["4003","Marvell",10799,6237,11039,6477],["4017","SUPERMICRO",10919,7917,11759,8517],["4029","SCinet Help Desk/SC Theatre",10799,9357,11039,9837],["4038","NASA",10679,10557,11039,10917],["4044","GRC",10679,11037,11039,11397],["4047","5C",10799,11517,11039,11757],["4050","croit",10799,11877,11039,12237],["4054","Pittsburgh Supercomputing Center",10799,12357,11039,12837],["4059","Tohoku University",10799,12957,11039,13197],["4062","IT4Innovations National Supercomputing Center",10811,13317,11051,13437],["4106","HLRS",10919,6597,11399,7077],["4200","Parameter",11159,5877,11279,6117],["4202","AVS Römer GmbH & Co. KG",11159,6117,11279,6237],["4203","Chatsworth Products",11159,6237,11279,6477],["4211","DDN",11159,7197,11759,7797],["4223","Fourier Cooling",11159,8637,11399,9357],["4230","Micron Technology",11159,9477,11399,9837],["4234","Rittal LLC",11159,9957,11399,10317],["4238","Hammerspace",11159,10437,11399,10797],["4242","Parker Hannifin",11159,10917,11399,11277],["4246","Phononic, Inc.",11159,11385,11399,11745],["4250","Hypertec",11159,11877,11399,12237],["4254","Leibniz Supercomputing Centre",11159,12357,11399,12837],["4259","Barcelona Supercomputing Center",11159,12957,11399,13197],["4300","Modular Power & Data",11279,5877,11399,5997],["4301","Dixon",11279,5997,11399,6117],["4302","Monolithic Power Systems",11279,6117,11399,6237],["4303","Teledyne LeCroy",11279,6237,11399,6477],["4400","Axiado Corporation",11519,5877,11639,6117],["4402","Nimbus Data, Inc.",11519,6117,11639,6357],["4405","Ohio Supercomputer Center & Open OnDemand",11519,6477,11759,6837],["4409","dNOC",11519,6957,11639,7077],["4424","ASRock Rack Inc.",11519,8757,11639,8997],["4426","LDA Technologies",11519,8997,11639,9117],["4427","Dynatron Corporation",11519,9117,11639,9237],["4428","Alabama Supercomputer Authority",11519,9237,11639,9597],["4431","GRI Pumps",11519,9597,11639,9837],["4433","Dolphin Interconnect Solutions",11519,9837,11639,10077],["4436","Cloudian",11519,10197,11639,10317],["4438","Airedale",11519,10437,12119,10797],["4442","MathWorks",11519,10917,11759,11157],["4445","StarNet Communications",11519,11277,11639,11397],["4446","Lintes Technology Co., Ltd.",11519,11397,11639,11517],["4448","Computer Recovery Associates",11519,11637,11639,11757],["4450","Shenling",11519,11877,11699,12237],["4454","ENEOS USA, Inc.",11519,12357,11759,12597],["4456","ebm-papst",11519,12597,11639,12837],["4458","The Institute of Statistical Mathematics (ISM)",11519,12837,11639,12957],["4460","CDW",11519,13077,11639,13197],["4500","Clivet",11639,5877,11759,6117],["4502","FuriosaAI",11639,6117,11759,6357],["4508","Ohio Supercomputer Center & Open OnDemand",11639,6837,11759,6957],["4509","ATEMPO",11639,6957,11759,7077],["4523","Advanced Clustering Technologies",11639,8637,11759,8877],["4525","Shenzhen Apaltek Co. Ltd.",11639,8877,11759,9237],["4528","Bacula Systems Corp",11639,9237,11759,9597],["4531","ProDesign Electronic GmbH",11639,9597,11759,9717],["4532","AMAX Engineering",11639,9717,11759,9837],["4533","The University of Tennessee",11639,9837,11759,10077],["4535","HPCwire",11639,10077,11759,10317],["4545","dNOC",11639,11277,11759,11397],["4546","ANEN POWER",11639,11397,11759,11517],["4547","Moog, Inc.",11639,11517,11759,11757],["4550","SuperX AI Technology Limited",11699,11877,12119,12237],["4556","GKN Powder Metallurgy",11639,12597,11759,12837],["4558","Maddox Transformer",11639,12837,11759,13197],["4600","Hydraquip, Inc.",11879,5877,11999,6117],["4603","MicroAge",11879,6117,11999,6237],["4604","Preferred Networks Inc.",11879,6357,12119,6717],["4608","nVent",11879,6837,12119,7077],["4611","Data in Science Corporation",11879,7197,12119,7557],["4615","MiTAC Computing Technology Corporation",11879,7677,12119,8037],["4619","Fujitsu Limited",11879,8157,12119,8517],["4623","Samtec",11879,8637,12119,8877],["4626","Broadcom",11879,8997,12119,9357],["4630","Lablup Inc.",11879,9477,12119,9837],["4634","Celestica",11879,9957,12119,10317],["4642","GigaIO",11879,10917,12119,11157],["4645","SDSC",11879,11277,12119,11757],["4654","CommScope",11879,12357,12119,12597],["4656","UCL",11879,12597,12119,12837],["4659","IEEE Computer Society",11879,12957,12119,13197],["4662","Axiom Upgrades",11901,13319,12141,13439],["4700","Rogers Corporation",11999,5877,12119,5997],["4701","AMCO Enclosures by IMS Engineered Products",11999,5997,12119,6237],["4763","CONCENTRIC",12141,13319,12381,13439],["4800","ITBL Community",12239,5877,12359,6117],["4802","Kyushu University",12239,6117,12359,6357],["4804","imec",12239,6357,12359,6477],["4805","Quobyte",12239,6477,12359,6717],["4808","d-Matrix",12239,6837,12479,7077],["4811","NetApp, Inc.",12239,7197,12839,7557],["4815","SourceCode/Boston LTM",12239,7677,12839,8037],["4819","Amazon Web Services (AWS)",12239,8157,12839,8517],["4823","Danfoss",12239,8637,12839,9237],["4829","Department of Energy",12239,9357,12839,9957],["4835","Atipa Technologies",12239,10077,12479,10317],["4838","Quantinuum",12239,10437,12839,11037],["4845","Centre for Development of Advanced Computing",12239,11157,12839,11757],["4850","Science and Technology Facilities Council",12239,11877,12479,12237],["4854","Institute of Science Tokyo",12239,12357,12479,12597],["4857","Research Organization for Information Science and Technology",12239,12717,12479,12957],["4859","JAIST",12239,12957,12359,13197],["4900","Open Compute Project Foundation",12359,5877,12479,6237],["4903","The University of Tokyo",12359,6237,12479,6477],["4905","Southco, Inc",12359,6477,12479,6717],["4959","Scality",12359,12957,12479,13197],["5000","DryCoolers",12599,5877,12719,6117],["5002","Avtron Power Solutions",12599,6117,12719,6237],["5003","Corespan Systems",12599,6237,12719,6477],["5005","TrueNAS",12599,6477,12839,6717],["5008","Compal",12599,6837,12839,7077],["5035","CIENA",12599,10077,12839,10317],["5050","Great Plains Network",12599,11877,12839,12237],["5054","ITC/JCAHPC, The University of Tokyo",12599,12357,12839,12597],["5057","CCS/JCAHPC, University of Tsukuba",12599,12717,12839,12957],["5059","Kyoto University",12599,12957,12719,13197],["5100","DoD HPCMP",12719,5877,12839,6117],["5102","LightSolver",12719,6117,12839,6237],["5103","NSF Center for Space, High-Performance, and Resilient Computing",12719,6237,12839,6477],["5159","Gradian Thermal Solutions",12719,12957,12839,13197],["5201","HIPER Global US",12959,5997,13079,6237],["5203","T-GLOBAL TECHNOLOGY CO., LTD.",12959,6237,13079,6357],["5204","Johnson Controls",12959,6357,13079,6477],["5205","Berkeley Communications",12959,6477,13079,6597],["5206","CLYSO",12959,6597,13079,6837],["5209","10Gtek",12959,6957,13079,7077],["5211","CoCoLink",12959,7197,13199,7437],["5214","Liqid",12959,7557,13199,7797],["5217","OpenMP ARB",12959,7917,13199,8157],["5220","Spectra Logic",12959,8277,13199,8517],["5224","VIAVI Solutions",12959,8757,13079,8997],["5226","Kitware Inc.",12959,8997,13079,9237],["5229","Tudertechnica",12959,9357,13199,9597],["5232","Pasqal",12959,9717,13079,9957],["5234","QuEra Computing Inc.",12959,9957,13079,10077],["5236","DiCon Fiberoptics",12959,10197,13079,10317],["5238","IonQ",12959,10437,13199,10677],["5241","D-Wave Quantum",12959,10797,13199,11157],["5245","Tatsuta Electric Wire&Cable Co.Ltd.",12959,11277,13079,11517],["5248","Qunova Computing",12959,11637,13079,11757],["5250","A*STAR NSCC Singapore",12959,11877,13199,12117],["5253","D3C - Osaka University",12959,12237,13199,12477],["5256","Nagoya University",12959,12597,13079,12837],["5258","Neuvys Technologies",12959,12837,13079,12957],["5260","WanHe Filtration Inc",12959,13077,13079,13197],["5301","Park Place Technologies",13079,5997,13199,6237],["5303","Avicena Tech Corp.",13079,6237,13199,6357],["5304","TigerFlow",13079,6357,13199,6477],["5305","Xiamen Set Electronics Co., Ltd.",13079,6477,13199,6597],["5306","EnGenius Technologies, Inc",13079,6597,13199,6837],["5308","PFX Group",13079,6837,13199,7077],["5323","In Win Development (U.S.A.) Inc.",13079,8637,13199,8877],["5325","NexGen Cloud",13079,8877,13199,8997],["5326","AEWIN",13079,8997,13199,9237],["5332","Q-CTRL",13079,9717,13199,9837],["5333","memQ, Inc.",13079,9837,13199,9957],["5334","Crosstown Fiber",13079,9957,13199,10077],["5335","Qudora",13079,10077,13199,10197],["5336","Alice & Bob",13079,10197,13199,10317],["5345","Quantum Computing Inc.",13079,11277,13199,11517],["5347","Infleqtion",13079,11517,13199,11757],["5356","Nara Institute of Science & Technology",13079,12597,13199,12837],["5358","Energy Efficient HPC Working Group",13079,12837,13199,12957],["5359","NIST (National Institute of Standards and Technology)",13079,12957,13199,13197],["5405","Parallel Works",13319,6477,13439,6717],["5409","ZOTAC USA INC.",13319,6957,13439,7197],["5413","PHISON",13319,7437,13559,7797],["5416","PEGATRON",13319,7797,13559,8157],["5420","Microway Inc.",13319,8277,13439,8517],["5425","SANYO DENKI AMERICA",13319,8877,13559,9237],["5429","Micro-Star INT'L CO., LTD",13319,9357,13559,9597],["5432","Zurich Instruments",13319,9717,13439,9837],["5433","PsiQuantum",13319,9837,13439,10077],["5435","Quantum Machines",13319,10077,13439,10317],["5438","California Institute of Technology /CACR",13319,10437,13559,10797],["5442","Classiq",13319,10917,13559,11397],["5447","Quantum Motion",13319,11517,13439,11637],["5448","Cornell University Center for Advanced Computing",13319,11637,13439,11877],["5450","Krell Institute",13319,11877,13439,12117],["5454","Hokkaido University",13319,12417,13439,12537],["5456","PTS Data Center Solutions",13319,12652,13439,12892],["5460","Baya Systems",13319,13072,13439,13192],["5613","Dnotitia",13679,7437,13799,7677],["5615","UNEEC",13679,7677,13799,7917],["5617","Infraeo Inc.",13679,7917,13799,8157],["5625","T1Nexus",13679,8877,13799,9117],["5627","DataCore",13679,9117,13799,9237],["5628","Southwest Research Institute",13679,9237,13799,9357],["5629","Linkreal Co., Ltd.",13679,9357,13799,9477],["5630","Hose Master",13679,9477,13799,9597],["5637","University of Kentucky",13679,10317,13799,10557],["5639","Qblox",13679,10557,13799,10797],["5641","Rensselaer Polytechnic Institute",13679,10797,13799,11037],["5643","Bluefors",13679,11037,13799,11397],["6100","SafeWay - a division of The Specialty Mfg. Co.",12527,3766,12647,3886],["6102","ZEISS Research and Quality Solutions",12527,3526,12647,3646],["6103","Packet Power",12527,3406,12647,3526],["6104","Puget Systems",12527,3166,12647,3406],["6107","AurCore Networks USA",12527,2806,12647,3046],["6109","BUTZ Fluid Technology",12527,2686,12647,2806],["6111","INFINITIX",12527,2446,12647,2566],["6112","EXCOOL",12527,2326,12647,2446],["6113","Winchain Material Technology Co., Ltd.",12527,2206,12647,2326],["6114","Oxide Computer Company",12527,2086,12647,2206],["6115","Linaro Ltd.",12527,1846,12647,2086],["6121ES","VDURA",12467,1306,12647,1486],["6125ES","Micron Technology",12467,1006,12647,1186],["6200","Aravolta",12287,3766,12407,3886],["6201","Foot Master Casters & Wheels",12287,3646,12407,3766],["6202","LUMI TECH LIMITED",12287,3526,12407,3646],["6204","Kuriyama of America",12287,3166,12407,3406],["6207","US Valve",12167,2806,12407,3046],["6209","Alta Technologies",12287,2566,12407,2806],["6211","Grundfos",12287,2326,12407,2566],["6213","BRUNS-PAK WORLDWIDE, INC.",12287,2206,12407,2326],["6214","Nitta Corporation of America",12287,2086,12407,2206],["6215","TecEx",12287,1966,12407,2086],["6216","INFICON",12287,1846,12407,1966],["6221ES","VDURA",12287,1306,12467,1486],["6225ES","Micron Technology",12287,1006,12467,1186],["6300","Gamma Technologies",12167,3766,12287,3886],["6301","TrustClarity",12167,3646,12287,3766],["6302","Future Intelligence Lab",12167,3526,12287,3646],["6304","Alfagomma SpA",12167,3166,12287,3406],["6309","Royal Pacific Corp",12167,2686,12287,2806],["6310","Cadence",12167,2446,12287,2686],["6312","PDU Cables",12167,2326,12287,2446],["6313","Martin International Enclosures",12167,2206,12287,2326],["6314","Sani-Matic, Inc.",12167,2086,12287,2206],["6315","Omega Flex, Inc.",12167,1966,12287,2086],["6316","Shenzhen Lightx Technology Co., Ltd.",12167,1846,12287,1966],["6321ES","WD",12107,1306,12287,1486],["6325ES","Siemens",12107,1006,12287,1186],["6400","ABB",11807,3526,12047,3886],["6404","LINKS Foundation Research Center",11807,3166,12047,3406],["6407","Giga Energy",11807,2806,12047,3046],["6409","High Performance Software Foundation",11927,2566,12047,2806],["6411","Griswold Controls",11927,2326,12047,2566],["6413","Runpod",11927,2206,12047,2326],["6414","Molten Dynamics",11927,2086,12047,2206],["6415","Memblaze",11927,1966,12047,2086],["6416","Innodisk USA Corporation",11927,1846,12047,1966],["6418","Feller Power Cords",12167,1546,12287,1666],["6420","Reserved",12287,1546,12407,1666],["6421ES","Rebellions",11927,1306,12107,1486],["6425ES","Cerebras Systems",11927,1006,12107,1186],["6509","xByte Technologies",11807,2566,11927,2806],["6511","The University of Alabama High Performance Computing and Data Center",11807,2446,11927,2566],["6512","Vultr",11807,2326,11927,2446],["6513","Penflex",11807,2206,11927,2326],["6514","Ideal Tridon Group",11807,2086,11927,2206],["6515","Smith",11807,1846,11927,2086],["6518","Stauff Corporation",11927,1546,12047,1666],["6520","Tiiny AI Inc.",12047,1546,12167,1666],["6521ES","D-Wave Quantum",11747,1306,11927,1486],["6525ES","ClusterVision",11747,1006,11927,1186],["6600","Bolt Graphics Inc.",11447,3526,11687,3886],["6604","Quandela",11567,3166,11687,3406],["6606","Hedgehog",11567,3046,11687,3166],["6607","PUN TEH INDUSTRIAL CO., LTD.",11567,2926,11687,3046],["6608","Fabric8Labs",11567,2806,11687,2926],["6609","Surfx Technologies LLC",11567,2686,11687,2806],["6610","San Diego State University",11567,2446,11687,2686],["6612","HUN-REN SZTAKI / HunAIFA",11567,2326,11687,2446],["6613","Xylem",11567,2206,11687,2326],["6614","The Lee Company",11567,2086,11687,2206],["6615","BASX",11567,1966,11687,2086],["6616","Hefei Shinhoo Canned Motor Pump Co., Ltd.",11567,1846,11687,1966],["6618","IPEX USA LLC",11687,1546,11807,1666],["6620","Oetiker, Inc.",11807,1546,11927,1666],["6621ES","Danfoss Power Solutions",11567,1306,11747,1486],["6625ES","Weka",11567,1006,11747,1186],["6704","Link Oregon",11447,3166,11567,3406],["6706","dNOC",11447,3046,11567,3166],["6707","Indium Corporation",11447,2926,11567,3046],["6708","Minerva Innovation Company",11447,2806,11567,2926],["6709","Goopax",11447,2686,11567,2806],["6710","XSight",11447,2446,11567,2686],["6712","PINGOOD ENTERPRISE CO., LTD.",11447,2326,11567,2446],["6713","Metraflex",11447,2206,11567,2326],["6714","Rocket Software",11447,2086,11567,2206],["6715","Cincinnati Test Systems",11447,1966,11567,2086],["6716","Tylok International",11447,1846,11567,1966],["6718","NOSHOK, Inc.",11447,1546,11567,1666],["6720","AHEAD",11567,1546,11687,1666],["6721ES","Advanced Micro Devices (AMD)",11387,1306,11567,1486],["6725ES","Weka",11387,1006,11567,1186],["6800","Kryonix",11087,3526,11327,3886],["6804","University of Bristol",11087,3166,11327,3406],["6807","OneQode",11207,2806,11327,3046],["6809","University of Delaware",11207,2566,11327,2806],["6811","Gfarm/Supercomputing Japan",11207,2326,11327,2566],["6813","SUSE",11207,2206,11327,2326],["6814","Metropolitan Air Technology",11207,2086,11327,2206],["6815","ConfidentialMind",11207,1966,11327,2086],["6816","Silicon Motion Inc.",11207,1846,11327,1966],["6817ES","Airsys",11267,1486,11447,1666],["6821ES","Advanced Micro Devices (AMD)",11207,1306,11387,1486],["6825ES","Parker Hannifin",11207,1006,11387,1186],["6907","Sunbird Software",11087,2926,11207,3046],["6908","Koch Filter Corporation",11087,2806,11207,2926],["6909","Tanlink Optics",11087,2686,11207,2806],["6910","Dataprana",11087,2566,11207,2686],["6911","Transcend Information Inc.",11087,2446,11207,2566],["6912","COMSOL",11087,2326,11207,2446],["6913","VAOPTO",11087,2206,11207,2326],["6914","DESMI, Inc",11087,2086,11207,2206],["6915","WAIN Electrical Co., Ltd.",11087,1846,11207,2086],["6917ES","Hammerspace",11087,1486,11267,1666],["6921ES","Cornelis Networks",11027,1306,11207,1486],["6925ES","DDN",11027,1006,11207,1186],["7000","FCH Data Cooling",10727,3646,10967,3886],["7003","Rebellions",10727,3286,10967,3526],["7006","Acbel",10727,2926,10967,3166],["7008","Continental",10847,2686,10967,2926],["7010","Hexonic",10847,2446,10967,2686],["7011","Sterlite Technologies Inc",10847,2326,10967,2446],["7012","Zettai LLC",10847,2206,10967,2326],["7014","PlanQC GmbH",10847,2086,10967,2206],["7015","ifm efector Inc.",10847,1846,10967,2086],["7017ES","Hammerspace",10907,1486,11087,1666],["7021ES","NScale Operations (UK) Ltd",10847,1306,11027,1486],["7025ES","DDN",10847,1006,11027,1186],["7108","Computer Network Information Center of Chinese Academy of Sciences",10727,2806,10847,2926],["7109","Xinnor",10727,2686,10847,2806],["7110","KAORI Heat Treatment Co., LTD.",10727,2446,10847,2686],["7112","Insight Public Sector",10727,2326,10847,2446],["7113","Nupi Americas",10727,2206,10847,2326],["7114","X SERVE COMPUTE TECH SDN.BHD",10727,2086,10847,2206],["7115","Lucky Harvest Co., Ltd.",10727,1966,10847,2086],["7116","Cloud Native Computing Foundation (CNCF)",10727,1846,10847,1966],["7117ES","Marvell",10727,1486,10907,1666],["7121ES","SambaNova",10667,1306,10847,1486],["7125ES","DDN",10667,1006,10847,1186],["7200","DataLight Optics",10487,3796,10607,3916],["7202","Spectro Cloud",10487,3537,10607,3657],["7203","Instrumental Inc",10487,3297,10607,3537],["7205","Clockwork",10487,3177,10607,3297],["7207","Jetstor",10487,2877,10607,2997],["7212","United States Research Software Engineer Association",10487,2446,10607,2566],["7213","Berliner Nanotest und Design GmbH",10487,2326,10607,2446],["7214","TRUSTA",10487,2206,10607,2326],["7215","Singer Industrial",10487,2086,10607,2206],["7216","Coalition for Academic Scientific Computation (CASC)",10487,1846,10607,2086],["7217ES","Marvell",10547,1486,10727,1666],["7221ES","Everpure, Inc.",10487,1306,10667,1486],["7225ES","DDN",10487,1006,10667,1186],["SCC1","Clemson University",6839,5637,6959,5757],["SCC10","Georgia Institute of Technology",6959,5877,7079,5997],["SCC2","National Taiwan University",6719,5637,6839,5757],["SCC3","FAU Erlangen-Nurnberg",6599,5637,6719,5757],["SCC4","University of Bristol",6479,5637,6599,5757],["SCC5","National Tsing Hua University",6359,5637,6479,5757],["SCC6","Nanyang Technological University, Singapore",6239,5637,6359,5757],["SCC7","University of California, San Diego",6479,5877,6599,5997],["SCC8","CSCS / ETH Zurich",6599,5877,6719,5997],["SCC9","Texas A&M University",6839,5877,6959,5997]];

  var $ = function (id) { return document.getElementById(id); };
  var booths = [], byNum = {}, router = null;
  var fromBooth = null, toBooth = null, currentRoute = null;

  /* ---------------- data ---------------- */
  function rowsToBooths(rows) {
    return rows.map(function (r) {
      return { n: r[0], name: r[1], x0: r[2], y0: r[3], x1: r[4], y1: r[5],
               cx: Math.round((r[2] + r[4]) / 2), cy: Math.round((r[3] + r[5]) / 2) };
    });
  }
  function loadBooths() {
    return Promise.resolve(rowsToBooths(BOOTH_ROWS));
  }
  function label(b) { return b.name ? b.name + ' · Booth ' + b.n : 'Booth ' + b.n; }

  function resolveBooth(text) {
    if (!text) return null;
    var q = String(text).trim();
    if (!q) return null;
    var m = q.match(/booth\s+#?\s*([A-Za-z0-9]+)/i);
    if (m && byNum[m[1].toUpperCase()]) return byNum[m[1].toUpperCase()];
    var bare = q.replace(/^#/, '').toUpperCase();
    if (byNum[bare]) return byNum[bare];
    var ql = q.toLowerCase();
    var exact = null, partial = null;
    booths.forEach(function (b) {
      var nm = (b.name || '').toLowerCase();
      if (nm === ql && (!exact || area(b) > area(exact))) exact = b;
      if (nm && nm.indexOf(ql) !== -1 && (!partial || area(b) > area(partial))) partial = b;
    });
    return exact || partial || null;
  }
  function area(b) { return (b.x1 - b.x0) * (b.y1 - b.y0); }

  /* ---------------- map ---------------- */
  var svg, view = { x: 0, y: 0, w: 100, h: 100 }, extent = null;
  var nameLabelGroup, numLabelGroup, calloutGroup, routeLayer, boothRects = [];

  function isLandmark(b) {
    var w = b.x1 - b.x0, h = b.y1 - b.y0;
    return w >= 240 && h >= 200 && area(b) >= 86400;
  }
  function wrapName(name, boothW, fontSize) {
    var maxChars = Math.max(4, Math.floor(boothW / (fontSize * 0.54)));
    var words = name.split(/\s+/), lines = [], cur = '';
    words.forEach(function (wd) {
      if (!cur) cur = wd;
      else if ((cur + ' ' + wd).length <= maxChars) cur += ' ' + wd;
      else { lines.push(cur); cur = wd; }
    });
    if (cur) lines.push(cur);
    if (lines.length > 2) {
      lines = [lines[0], lines.slice(1).join(' ')];
      if (lines[1].length > maxChars + 4) lines[1] = lines[1].slice(0, maxChars + 3).trim() + '…';
    }
    if (lines.length === 1 && lines[0].length > maxChars + 6) lines[0] = lines[0].slice(0, maxChars + 5).trim() + '…';
    return lines;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildMap() {
    svg = $('map');
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    booths.forEach(function (b) {
      minX = Math.min(minX, b.x0); maxX = Math.max(maxX, b.x1);
      minY = Math.min(minY, b.y0); maxY = Math.max(maxY, b.y1);
    });
    extent = { x: minX - 180, y: -(maxY) - 180, w: (maxX - minX) + 360, h: (maxY - minY) + 360 };
    var rects = '', names = '', nums = '';
    booths.forEach(function (b, i) {
      var w = b.x1 - b.x0, h = b.y1 - b.y0;
      var sy = -(b.y1); // screen y (flip)
      rects += '<rect class="booth' + (isLandmark(b) ? ' landmark' : '') + '" data-i="' + i +
               '" x="' + b.x0 + '" y="' + sy + '" width="' + w + '" height="' + h + '"/>';
      if (isLandmark(b) && b.name) {
        var tier = area(b) >= 260000 ? 'nm1' : (area(b) >= 129600 ? 'nm2' : 'nm3');
        var nameFs = tier === 'nm1' ? 96 : (tier === 'nm2' ? 74 : 56);
        var lines = wrapName(b.name, w, nameFs);
        var tsp = lines.map(function (ln, li) {
          return '<tspan x="' + b.cx + '" dy="' + (li === 0 ? (-(lines.length - 1) * nameFs * 0.6) : nameFs * 1.2) + '">' + esc(ln) + '</tspan>';
        }).join('');
        names += '<text class="lbl-name ' + tier + '" font-size="' + nameFs + '" x="' + b.cx + '" y="' + (-b.cy) + '">' + tsp + '</text>';
      } else if (w >= 100 && h >= 100) {
        nums += '<text class="lbl-num" x="' + b.cx + '" y="' + (-b.cy) + '">' + esc(b.n) + '</text>';
      }
    });
    svg.innerHTML =
      '<g id="boothRects">' + rects + '</g>' +
      '<g id="numLabels" font-size="44">' + nums + '</g>' +
      '<g id="nameLabels">' + names + '</g>' +
      '<g id="routeLayer"></g>' +
      '<g id="callouts"></g>';
    nameLabelGroup = $('nameLabels'); numLabelGroup = $('numLabels');
    calloutGroup = $('callouts'); routeLayer = $('routeLayer');
    boothRects = Array.prototype.slice.call(svg.querySelectorAll('.booth'));
    // opening view: the neighbourhood of Booth 3723 (where the sign is),
    // close enough that landmark labels are readable; "Whole hall" zooms out.
    var home = byNum['3723'];
    if (home) fitView({ x: home.cx - 2100, y: -home.cy - 2100, w: 4200, h: 4200 });
    else fitView(extent);
    attachMapControls();
  }

  function applyView() {
    svg.setAttribute('viewBox', view.x + ' ' + view.y + ' ' + view.w + ' ' + view.h);
    svg.dataset.band = view.w > 7000 ? 'hall' : (view.w > 4200 ? 'mid' : 'near');
    var cw = svg.clientWidth || 380;
    var callFs = Math.round(view.w * 13 / cw);
    if (calloutGroup) calloutGroup.setAttribute('font-size', callFs);
  }
  function fitView(box) {
    var cw = svg.clientWidth || 380, ch = svg.clientHeight || 320;
    var aspect = cw / ch;
    var w = box.w, h = w / aspect;
    if (h < box.h) { h = box.h; w = h * aspect; }
    view = { x: box.x + box.w / 2 - w / 2, y: box.y + box.h / 2 - h / 2, w: w, h: h };
    applyView();
  }
  function fitRoute() {
    if (!currentRoute) { fitView(extent); return; }
    var xs = currentRoute.points.map(function (p) { return p[0]; });
    var ys = currentRoute.points.map(function (p) { return -p[1]; });
    var pad = 720;
    fitView({
      x: Math.min.apply(null, xs) - pad, y: Math.min.apply(null, ys) - pad,
      w: (Math.max.apply(null, xs) - Math.min.apply(null, xs)) + 2 * pad,
      h: (Math.max.apply(null, ys) - Math.min.apply(null, ys)) + 2 * pad
    });
  }

  function attachMapControls() {
    var pointers = new Map(), lastPinch = 0;
    function toWorld(cx, cy) {
      var r = svg.getBoundingClientRect();
      return [view.x + (cx - r.left) / r.width * view.w, view.y + (cy - r.top) / r.height * view.h];
    }
    svg.addEventListener('pointerdown', function (e) {
      svg.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        lastPinch = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
      }
    });
    svg.addEventListener('pointermove', function (e) {
      if (!pointers.has(e.pointerId)) return;
      var prev = pointers.get(e.pointerId);
      pointers.set(e.pointerId, [e.clientX, e.clientY]);
      var r = svg.getBoundingClientRect();
      if (pointers.size === 1) {
        view.x -= (e.clientX - prev[0]) / r.width * view.w;
        view.y -= (e.clientY - prev[1]) / r.height * view.h;
        applyView();
      } else if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        var dist = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
        if (lastPinch > 0 && dist > 0) {
          var mid = toWorld((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
          zoomAt(mid, lastPinch / dist);
        }
        lastPinch = dist;
      }
    });
    function endPointer(e) { pointers.delete(e.pointerId); if (pointers.size < 2) lastPinch = 0; }
    svg.addEventListener('pointerup', endPointer);
    svg.addEventListener('pointercancel', endPointer);
    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      zoomAt(toWorld(e.clientX, e.clientY), Math.pow(1.0015, e.deltaY));
    }, { passive: false });
    svg.addEventListener('dblclick', function (e) {
      zoomAt(toWorld(e.clientX, e.clientY), 0.55);
    });
    function zoomAt(worldPt, factor) {
      var nw = Math.min(extent.w, Math.max(420, view.w * factor));
      var f = nw / view.w;
      view.x = worldPt[0] - (worldPt[0] - view.x) * f;
      view.y = worldPt[1] - (worldPt[1] - view.y) * f;
      view.w = nw; view.h = view.h * f;
      applyView();
    }
    window.addEventListener('resize', applyView);
  }

  /* ---------------- routing ---------------- */
  function setMsg(text, ok) {
    var m = $('formMsg');
    m.textContent = text || '';
    m.style.color = ok ? '#224733' : '';
  }
  function computeRoute(pushUrl) {
    var f = resolveBooth($('fromInput').value);
    var t = resolveBooth($('toInput').value);
    fromBooth = f; toBooth = t;
    if (!f || !t) {
      setMsg(!f && !t ? 'Pick a starting booth and a destination from the list — or type a booth number.'
           : !f ? 'We couldn’t find that starting point. Pick from the list or type a booth number.'
           : 'We couldn’t find that destination. Pick from the list or type a booth number.');
      return false;
    }
    if (f === t) {
      setMsg('That’s the same booth — you’re already there.', true);
      $('result').hidden = true; currentRoute = null; clearRouteDrawing();
      return false;
    }
    var route = router.findRoute(f, t);
    if (!route) {
      setMsg('Sorry — no walking route found between those booths.');
      return false;
    }
    currentRoute = route;
    setMsg('');
    var ft = Math.round(route.lengthFt / 10) * 10;
    var mins = Math.max(1, Math.round(route.lengthFt / 150));
    $('resultTitle').textContent = f.name + ' → ' + t.name;
    $('resultStats').innerHTML =
      '<span class="dest">' + esc(t.name) + ' · Booth ' + esc(t.n) + '</span>' +
      '<span class="distline">≈ ' + ft + ' ft · about a ' + mins + '-minute walk</span>';
    var dirs = Wayfinder.makeDirections(route.points, f, t);
    $('directions').innerHTML = dirs.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('');
    $('result').hidden = false;
    drawRoute(route, f, t);
    fitRoute();
    layoutCallouts(f, t);
    if (pushUrl !== false && window.history && history.replaceState) {
      var url = location.pathname + '?from=' + encodeURIComponent(f.n) + '&to=' + encodeURIComponent(t.n);
      history.replaceState(null, '', url);
    }
    return true;
  }
  function clearRouteDrawing() {
    if (routeLayer) routeLayer.innerHTML = '';
    if (calloutGroup) calloutGroup.innerHTML = '';
    boothRects.forEach(function (el) { el.classList.remove('sel-from'); el.classList.remove('sel-to'); });
  }
  function drawRoute(route, f, t) {
    clearRouteDrawing();
    boothRects.forEach(function (el) {
      var b = booths[Number(el.getAttribute('data-i'))];
      if (b === f) el.classList.add('sel-from');
      if (b === t) el.classList.add('sel-to');
    });
    var pts = route.points.map(function (p) { return p[0] + ',' + (-p[1]); }).join(' ');
    routeLayer.innerHTML =
      '<polyline points="' + pts + '" fill="none" stroke="#1C191A" stroke-width="10" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity="0.8"/>' +
      '<polyline points="' + pts + '" fill="none" stroke="#C89932" stroke-width="5.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
      '<circle cx="' + f.cx + '" cy="' + (-f.cy) + '" r="62" fill="#224733" stroke="#FCF4E7" stroke-width="4" vector-effect="non-scaling-stroke"/>' +
      '<circle cx="' + t.cx + '" cy="' + (-t.cy) + '" r="62" fill="#C89932" stroke="#1C191A" stroke-width="3" vector-effect="non-scaling-stroke"/>';
  }
  // Callout labels, clamped horizontally inside the fitted view so a long
  // name never runs off the edge of the phone screen.
  function layoutCallouts(f, t) {
    if (!calloutGroup) return;
    var cw = svg.clientWidth || 380;
    var callFs = view.w * 13 / cw;
    function clampedX(booth, text) {
      var half = text.length * 0.60 * callFs / 2;
      return Math.min(Math.max(booth.cx, view.x + half + 30), view.x + view.w - half - 30);
    }
    var t1 = 'You are here · Booth ' + f.n;
    var t2 = t.name + ' · Booth ' + t.n;
    calloutGroup.innerHTML =
      '<text class="lbl-callout" x="' + clampedX(f, t1) + '" y="' + (-(f.y1) - 105) + '">' + esc(t1) + '</text>' +
      '<text class="lbl-callout" x="' + clampedX(t, t2) + '" y="' + (-(t.y1) - 105) + '">' + esc(t2) + '</text>';
    calloutGroup.setAttribute('font-size', Math.round(callFs));
  }

  /* ---------------- sharing ---------------- */
  function shareUrl() {
    var base = location.href.split('#')[0].split('?')[0];
    if (fromBooth && toBooth && currentRoute) {
      return base + '?from=' + encodeURIComponent(fromBooth.n) + '&to=' + encodeURIComponent(toBooth.n);
    }
    return base;
  }
  function shareFeedback(text) {
    setMsg(text, true);
    var sm = $('shareMsg');
    if (sm) sm.textContent = text;
  }
  function shareRoute() {
    var url = shareUrl();
    var text = (fromBooth && toBooth && currentRoute)
      ? 'SC26 Wayfinder — route to ' + (toBooth.name || 'Booth ' + toBooth.n) + ' (Booth ' + toBooth.n + ')'
      : 'SC26 Wayfinder — find your way around the SC26 exhibit hall';
    if (navigator.share) {
      navigator.share({ title: 'SC26 Wayfinder', text: text, url: url }).catch(function () { /* user closed the share sheet */ });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function () { shareFeedback('Link copied — paste it anywhere to share your route.'); },
        function () { shareFeedback('Copy this link: ' + url); });
    } else {
      shareFeedback('Copy this link: ' + url);
      if (window.prompt) window.prompt('Copy this link:', url);
    }
  }

  /* ---------------- exhibitor picker ----------------
   * Each field is a combobox: tap the field (or its ▾ button) to browse
   * the full scrollable exhibitor list; type to filter it live with
   * ranked suggestions (exact booth number, then name matches). */
  var pickerBooths = null; // booths sorted A–Z by name, built once
  function browseOrder() {
    if (!pickerBooths) {
      pickerBooths = booths.slice().sort(function (a, b) {
        var an = (a.name || '').toLowerCase(), bn = (b.name || '').toLowerCase();
        if (an !== bn) return an < bn ? -1 : 1;
        return String(a.n) < String(b.n) ? -1 : (String(a.n) > String(b.n) ? 1 : 0);
      });
    }
    return pickerBooths;
  }
  function filterBooths(q) {
    var all = browseOrder();
    q = (q || '').trim().toLowerCase();
    if (!q) return all;
    var exactNum = [], nameStart = [], numStart = [], nameHit = [], numHit = [];
    all.forEach(function (b) {
      var nm = (b.name || '').toLowerCase(), num = String(b.n).toLowerCase();
      if (num === q) exactNum.push(b);
      else if (nm.indexOf(q) === 0) nameStart.push(b);
      else if (num.indexOf(q) === 0) numStart.push(b);
      else if (nm.indexOf(q) !== -1) nameHit.push(b);
      else if (num.indexOf(q) !== -1) numHit.push(b);
    });
    return exactNum.concat(nameStart, numStart, nameHit, numHit);
  }
  function closeAllPickers(exceptKey) {
    ['from', 'to'].forEach(function (k) {
      if (k === exceptKey) return;
      var p = $(k + 'Panel'); if (p) p.hidden = true;
      var i = $(k + 'Input'); if (i) i.setAttribute('aria-expanded', 'false');
    });
  }
  function buildPicker(input, panel, list, emptyEl, dropBtn, nextInput) {
    var activeIdx = -1, current = [];
    function isOpen() { return !panel.hidden; }
    function render(matches, scrollToSel) {
      current = matches; activeIdx = -1;
      var sel = resolveBooth(input.value);
      list.innerHTML = matches.map(function (b, i) {
        return '<li role="option" id="' + input.id + '-opt' + i + '" data-i="' + i + '"' +
          (sel === b ? ' class="current" aria-selected="true"' : ' aria-selected="false"') + '>' +
          '<span class="p-name">' + esc(b.name || ('Booth ' + b.n)) + '</span>' +
          '<span class="p-num">Booth ' + esc(b.n) + '</span></li>';
      }).join('');
      emptyEl.hidden = matches.length > 0;
      if (scrollToSel && sel) {
        var idx = matches.indexOf(sel);
        var el = idx >= 0 ? list.children[idx] : null;
        if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center' });
      }
    }
    function open() {
      closeAllPickers(input.id.replace('Input', ''));
      var exact = resolveBooth(input.value);
      var showingLabel = !!exact && input.value === label(exact);
      render((showingLabel || !input.value.trim()) ? browseOrder() : filterBooths(input.value), true);
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }
    function close() {
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }
    function pick(b) {
      input.value = label(b);
      close();
      if (input.id === 'fromInput') fromBooth = b; else toBooth = b;
      if (resolveBooth($('fromInput').value) && resolveBooth($('toInput').value)) computeRoute(true);
      else if (nextInput) nextInput.focus();
    }
    function setActive(i) {
      if (!current.length) return;
      activeIdx = Math.max(0, Math.min(current.length - 1, i));
      Array.prototype.forEach.call(list.children, function (el, j) {
        el.classList.toggle('active', j === activeIdx);
      });
      var el = list.children[activeIdx];
      if (el) { el.scrollIntoView({ block: 'nearest' }); input.setAttribute('aria-activedescendant', el.id); }
    }
    input.addEventListener('focus', open);
    input.addEventListener('input', function () {
      if (!isOpen()) { panel.hidden = false; input.setAttribute('aria-expanded', 'true'); }
      render(filterBooths(input.value), false);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (!isOpen()) open(); setActive(activeIdx + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (isOpen()) setActive(activeIdx - 1); }
      else if (e.key === 'Enter' && isOpen() && activeIdx >= 0 && current[activeIdx]) {
        e.preventDefault(); e.stopImmediatePropagation(); pick(current[activeIdx]);
      }
      else if (e.key === 'Escape' && isOpen()) close();
    });
    list.addEventListener('pointerdown', function (e) {
      var li = e.target && e.target.closest ? e.target.closest('li') : null;
      if (!li) return;
      e.preventDefault(); // fires before the input blurs, so the tap lands
      var b = current[Number(li.getAttribute('data-i'))];
      if (b) pick(b);
    });
    dropBtn.addEventListener('click', function () {
      if (isOpen()) close();
      else { input.focus(); open(); }
    });
    document.addEventListener('pointerdown', function (e) {
      if (!isOpen()) return;
      var wrap = input.closest ? input.closest('.picker') : null;
      if (wrap && !wrap.contains(e.target)) close();
    });
    input.addEventListener('blur', function () {
      setTimeout(function () { if (document.activeElement !== input) close(); }, 150);
    });
  }

  /* ---------------- init ---------------- */
  function init() {
    loadBooths().then(function (list) {
      booths = list;
      booths.forEach(function (b) { byNum[String(b.n).toUpperCase()] = b; });
      buildPicker($('fromInput'), $('fromPanel'), $('fromList'), $('fromEmpty'), $('fromDrop'), $('toInput'));
      buildPicker($('toInput'), $('toPanel'), $('toList'), $('toEmpty'), $('toDrop'), null);
      router = Wayfinder.createRouter(booths);
      buildMap();

      var params = new URLSearchParams(location.search);
      var start = resolveBooth(params.get('from')) || byNum['3723'] || null;
      var dest = resolveBooth(params.get('to')) || null;
      if (start) { $('fromInput').value = label(start); fromBooth = start; }
      if (dest) { $('toInput').value = label(dest); toBooth = dest; }
      if (start && dest) computeRoute(false);

      $('routeBtn').addEventListener('click', function () { computeRoute(true); });
      $('swapBtn').addEventListener('click', function () {
        closeAllPickers();
        var a = $('fromInput').value;
        $('fromInput').value = $('toInput').value;
        $('toInput').value = a;
        if ($('fromInput').value && $('toInput').value) computeRoute(true);
      });
      $('shareBtn').addEventListener('click', shareRoute);
      var sb2 = $('shareBtn2');
      if (sb2) sb2.addEventListener('click', shareRoute);
      $('clearFrom').addEventListener('click', function () { $('fromInput').value = ''; $('fromInput').focus(); });
      $('clearTo').addEventListener('click', function () { $('toInput').value = ''; $('toInput').focus(); });
      $('fitHallBtn').addEventListener('click', function () { fitView(extent); });
      $('fitRouteBtn').addEventListener('click', fitRoute);
      [$('fromInput'), $('toInput')].forEach(function (inp) {
        inp.addEventListener('change', function () {
          if ($('fromInput').value && $('toInput').value) computeRoute(true);
        });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); computeRoute(true); } });
      });
      $('aboutBtn').addEventListener('click', function () {
        var panel = $('aboutPanel');
        var open = panel.hidden;
        panel.hidden = !open;
        $('aboutBtn').setAttribute('aria-expanded', String(open));
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
