/*
 * SC26 booth scavenger hunts, typed up from photos of the paper cards.
 * Each hunt:
 *   id       unique, used in URLs (?hunt=<id>) and saved progress
 *   pickup   where you get the card (shown first until it is checked off)
 *   stops    booths to visit; `tasks` lists what to collect at each (one
 *            checkbox per task, so one booth can count for several things)
 *   turnIn   where to bring the finished card (always the last stop)
 *   color    route color on the map, ideally the sponsor's brand color
 *   unit     what the tasks are called in the progress line ("stickers")
 *   register online sign-up instead of a paper card: { text, url }
 *   prizes   name, how it is won, optional small WebP in hunts/
 * Only write what the card (or the booth staff) actually says.
 */
window.SC26_HUNTS = [
  {
    id: 'cisco-ai-pod',
    title: 'Cisco AI Pod sticker hunt',
    color: '#049FD9', // Cisco sky blue
    unit: 'stickers',
    sponsor: 'Cisco',
    how: 'Collect three stickers by visiting Cisco’s demos and chatting with their booth experts. They’ll give you the inside scoop (and a sticker)!',
    pickup: { booth: '3626', label: 'Get the sticker card at Cisco' },
    stops: [
      { booth: '3626', tasks: ['Sticker 1 — a Cisco demo or booth expert', 'Sticker 2 — another demo or expert', 'Sticker 3 — one more demo or expert'] }
    ],
    turnIn: { booth: '3626', label: 'Bring the completed card back to Cisco and claim the prize' },
    prizes: [
      {
        name: 'Limited-edition Cisco AI Pod Brick Set',
        how: 'Bring your completed card (three stickers) to the Cisco booth to claim it.',
        img: 'hunts/cisco-ai-pod.webp',
        alt: 'A brick-built black Cisco AI server rack next to a Cisco minifigure'
      }
    ]
  },
  {
    id: 'intel-innovation-pass',
    title: 'Intel Innovation Pass',
    color: '#0068B5', // Intel classic blue
    sponsor: 'Intel',
    unit: 'experiences',
    how: 'At each booth, scan the Innovation Pass QR code at the Intel demo to earn points \u2014 bonus points if you answer the booth\u2019s quick question. Prizes go by points (see the tiers above); the site doesn\u2019t publish how many points each experience is worth. Redeem at the Intel booth (2819) by 12:00 PM CST on Thursday.',
    register: { text: 'Sign up for the Innovation Pass online (no paper card)', url: 'https://innovationpass.app/sc-2026/experiences' },
    stops: [
      {"booth": "2534", "name": "Ace Computers", "tasks": ["Neuron 6 Workstation", "Recon 2U Server"]},
      {"booth": "5326", "name": "AEWIN", "tasks": ["BIS-5231", "MIS-5131"]},
      {"booth": "1231", "name": "AIC", "tasks": ["SB201-SU"]},
      {"booth": "4532", "name": "AMAX", "tasks": ["AceleMax AXG-228RI"]},
      {"booth": "4424", "name": "ASRock Rack", "tasks": ["6UXGM-GNR2", "W890D8-2L2T"]},
      {"booth": "1218", "name": "Astera Labs", "tasks": ["Leo 2 & Xeon for AI"]},
      {"booth": "835", "name": "Astera Labs", "tasks": ["PCIe 6 Scale-up with Scorpio"]},
      {"booth": "2234", "name": "ASUS", "tasks": ["ESC8000-E12P", "RS700 Series"]},
      {"booth": "4835", "name": "Atipa", "tasks": ["Precision Power for Demanding Workloads"]},
      {"booth": "4819", "name": "AWS", "tasks": ["Agentic AI on AWS with Intel (session)"]},
      {"booth": "3251", "name": "Axelera AI", "tasks": ["AI Zone Protection", "Video Analytics Inference"]},
      {"booth": "4845", "name": "CDAC", "tasks": ["PARAM Shavak", "RUDRA SPX Server"]},
      {"booth": "4634", "name": "Celestica", "tasks": ["DS4150 & DS6001 Switches", "DS5000 in action"]},
      {"booth": "5008", "name": "Compal", "tasks": ["SD230-8", "SR230-2"]},
      {"booth": "6815", "name": "ConfidentialMind", "tasks": ["Private AI Platform"]},
      {"booth": "5003", "name": "Corespan", "tasks": ["Composer 4.0", "Mercury Rack"]},
      {"booth": "1419", "name": "Cornelis Networks", "tasks": ["CN5000"]},
      {"booth": "2223", "name": "Dell Technologies", "tasks": ["PowerEdge R9810", "Intel session — Nov 17, 12:30 PM", "Intel session — Nov 18, 11:30 AM", "Intel session — Nov 19, 10:30 AM"]},
      {"booth": "4433", "name": "Dolphin", "tasks": ["Device Lending", "Reflective Memory/Multicast"]},
      {"booth": "1456", "name": "Fortinet", "tasks": ["Unified SASE"]},
      {"booth": "2516", "name": "Fraunhofer ITWM", "tasks": ["Reservoir Simulation", "Quantum Fit"]},
      {"booth": "2229", "name": "GIGABYTE", "tasks": ["R164-SG2-AAJI"]},
      {"booth": "1429", "name": "Hitachi Vantara", "tasks": ["Data Illuminates Insights"]},
      {"booth": "4250", "name": "Hypertec", "tasks": ["TRIDENT iC610DR-G6", "iGW610R-G6"]},
      {"booth": "6416", "name": "Innodisk", "tasks": ["APEX-S100"]},
      {"booth": "7112", "name": "Insight Public Sector", "tasks": ["AI-Ready Institution", "Esports Lab to AI Lab"]},
      {"booth": "1218", "name": "Intel", "tasks": ["Flat Memory Mode for Agentic AI"]},
      {"booth": "2819", "name": "Intel", "tasks": ["GPU D-series (HPC)", "Agentic AI at Scale", "GPU D-series for Agentic AI", "Disaggregated Inference with SambaNova", "Proof of Performance"]},
      {"booth": "2258", "name": "Inventec", "tasks": ["Core Infrastructure for Tomorrow's AI"]},
      {"booth": "1062", "name": "KONST", "tasks": ["Glows.ai GPU Cloud"]},
      {"booth": "4630", "name": "Lablup", "tasks": ["Backend.AI", "Intel session — Nov 18, 3:00 PM"]},
      {"booth": "3023", "name": "Lenovo", "tasks": ["AI Inference", "LLM Systems", "Intel session — Nov 19, 11:15 AM"]},
      {"booth": "4003", "name": "Marvell", "tasks": ["Bravera SC6 PCIe 6.0 SSD Controller"]},
      {"booth": "1238", "name": "Megware", "tasks": ["Liquid-Cooled CPU Servers"]},
      {"booth": "4230", "name": "Micron", "tasks": ["9650 NVMe SSD"]},
      {"booth": "4615", "name": "MiTAC", "tasks": ["G4520G6 8-GPU", "R2520G6E3XD"]},
      {"booth": "1218", "name": "Montage Technology", "tasks": ["CXL MXC Gen3"]},
      {"booth": "5429", "name": "MSI", "tasks": ["CD270-S3061-X4", "CX270-S5062"]},
      {"booth": "3423", "name": "NEC", "tasks": ["Plasma and Fusion Research"]},
      {"booth": "4811", "name": "NetApp", "tasks": ["Intel session — Nov 18, 4:00–4:20 PM"]},
      {"booth": "1218", "name": "Netlist", "tasks": ["CXL Type3 Persistent Memory"]},
      {"booth": "4405", "name": "Ohio Supercomputer Center", "tasks": ["Cardinal cluster journey"]},
      {"booth": "5416", "name": "Pegatron", "tasks": ["AS210-2T1-8H3", "AS402-2T1-8H2"]},
      {"booth": "1723", "name": "Penguin/SMART", "tasks": ["CXA-8F2W-D4"]},
      {"booth": "5413", "name": "Phison", "tasks": ["Larger AI Workloads on Intel AI PCs"]},
      {"booth": "1218", "name": "Primemas (CXL Consortium)", "tasks": ["PMA16 CXL Memory Card"]},
      {"booth": "6104", "name": "Puget Systems", "tasks": ["Server X122-2U"]},
      {"booth": "2308", "name": "Red Hat", "tasks": ["Intel session — Nov 17, 2:00–2:30 PM"]},
      {"booth": "2815", "name": "Rescale", "tasks": ["Rescale Demo"]},
      {"booth": "2246", "name": "SambaNova", "tasks": ["React Todo App in Under 4 Seconds"]},
      {"booth": "2000", "name": "SHI", "tasks": ["Simplify VCF Fleet Management"]},
      {"booth": "4017", "name": "Supermicro", "tasks": ["X15 SuperBlade", "Next-Gen Hyper System"]},
      {"booth": "835", "name": "Synopsys", "tasks": ["Multi-Vendor PCIe 6.x Interop"]},
      {"booth": "4303", "name": "Teledyne LeCroy", "tasks": ["NVMe SSD Test", "Ultra Ethernet Test"]},
      {"booth": "7214", "name": "TRUSTA", "tasks": ["AI Scaler: Breaking VRAM Limits"]},
      {"booth": "5615", "name": "UNEEC", "tasks": ["Edge-MHS Chassis", "OCP ORv3 Rack"]}
    ],
    turnIn: { booth: '2819', label: 'Redeem your points for prizes at the Intel booth (by 12:00 PM CST Thursday)' },
    prizes: [
      { name: 'Sign up: Intel notebook + Intel tote bag', how: 'Scan your first QR code and sign up.',
        img: 'hunts/intel-signup.webp', alt: 'Black Intel tote bag and a grey Intel notebook' },
      { name: 'Tier 1 (625 points): Intel packable backpack + Intel bunny pin', how: 'Redeem at the Intel booth (2819).',
        img: 'hunts/intel-tier1.webp', alt: 'Black Intel packable backpack, its pouch, and a blue Intel bunny-suit pin' },
      { name: 'Tier 2 (1,250 points): Intel smart AI translation earbuds or a 5,000 mAh power bank with Apple & Samsung watch charging', how: 'Your choice of one; redeem at the Intel booth (2819).',
        img: 'hunts/intel-tier2.webp', alt: 'Intel earbuds case and an Intel power bank charging a phone' },
      { name: '1,750+ points: Grand Prize drawing', how: 'Reaching the Grand Prize total enters you in the drawing automatically.' }
    ]
  },
  {
    id: 'aws-simmania-bingo',
    title: 'AWS SimMania — The Simpossible Trail Bingo',
    color: '#FF9900', // AWS orange
    unit: 'stamps',
    sponsor: 'AWS / AMD',
    how: 'At the AWS booth, visit the demo pods and theater, collect a stamp for each square, and complete a row — rows count across, down, or diagonally. Hosted by AMD at the AWS booth, Tue Nov 17, 4–6 PM.',
    pickup: { booth: '4819', label: 'Get the bingo card at the AWS booth' },
    stops: [
      { booth: '4819', name: 'AWS', tasks: [
        'SIMULATE — Watched a solver run on AMD-powered EC2',
        'SCALE — Saw a simulation scale to the cloud',
        'ACCELERATE W/ AI — Queried an AI surrogate model',
        'CONNECT — Talked to a partner expert',
        'ACCELERATE W/ AI — Heard “surrogate model” explained in 30 sec',
        'ACCELERATE W/ AI — Watched an agent set up a simulation',
        'SCALE — Learned how AWS PCS scales clusters',
        'THEATER — Caught a theater presentation',
        'TRANSFORM — Found a real customer use case'
      ] }
    ],
    turnIn: { booth: '4819', label: 'Bring the completed card (with your name and company on it) back to the AWS booth' }
  }
];
