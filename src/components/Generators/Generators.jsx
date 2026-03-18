import { useState, useCallback } from "react";
import { genId } from "../../store.js";
import { LOOT_TABLES, SHOP_INVENTORIES, NPC_NAMES, RANDOM_ENCOUNTER_TABLES } from "../../data/generatorTables.js";
import { MONSTERS } from "../../data/monsters.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pickRandom(arr) {
  if (!arr || arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple(arr, count) {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

const RARITY_KEY = { Any: null, Mundane: "mundane", Uncommon: "uncommon", Rare: "rare", "Very Rare": "veryRare" };

// ─── XP Thresholds ────────────────────────────────────────────────────────────

const XP_THRESHOLDS = {
  1:[25,50,75,100],        2:[50,100,150,200],      3:[75,150,225,400],
  4:[125,250,375,500],     5:[250,500,750,1100],     6:[300,600,900,1400],
  7:[350,750,1100,1700],   8:[450,900,1400,2100],    9:[550,1100,1600,2400],
  10:[600,1200,1900,2800], 11:[800,1600,2400,3600],  12:[1000,2000,3000,4500],
  13:[1100,2200,3400,5100],14:[1250,2500,3800,5700], 15:[1400,2800,4300,6400],
  16:[1600,3200,4800,7200],17:[2000,3900,5900,8800], 18:[2100,4200,6300,9500],
  19:[2400,4900,7300,10900],20:[2800,5700,8500,12700],
};

function getMultiplier(count) {
  if (count === 1) return 1;
  if (count === 2) return 1.5;
  if (count <= 6) return 2;
  if (count <= 10) return 2.5;
  if (count <= 14) return 3;
  return 4;
}

// ─── NPC local data ───────────────────────────────────────────────────────────

const RACES = ["Human","Elf","Dwarf","Halfling","Gnome","Tiefling","Half-Orc","Dragonborn","Half-Elf","Aasimar"];
const CLASSES = ["Barbarian","Bard","Cleric","Druid","Fighter","Monk","Paladin","Ranger","Rogue","Sorcerer","Warlock","Wizard","Artificer","Blood Hunter"];
const ROLES = ["Merchant","Guard","Noble","Innkeeper","Blacksmith","Farmer","Scholar","Priest","Bandit","Sailor","Spy","Herald","Beggar","Apothecary"];
const BACKGROUNDS = ["Acolyte","Charlatan","Criminal","Entertainer","Folk Hero","Guild Artisan","Hermit","Noble","Outlander","Sage","Sailor","Soldier","Urchin","Far Traveler","Haunted One","Gladiator","Courtier","Archaeologist"];
const ALIGNMENTS = ["Lawful Good","Neutral Good","Chaotic Good","Lawful Neutral","True Neutral","Chaotic Neutral","Lawful Evil","Neutral Evil","Chaotic Evil"];
const BUILDS = ["stocky","wiry","muscular","slender","heavyset","lithe","broad-shouldered","gaunt","compact","lanky"];
const HAIR = ["raven-black","chestnut brown","fiery red","silver-streaked","ash blonde","iron grey","sandy","platinum white","auburn","jet black"];
const EYES = ["piercing blue","warm brown","cold grey","bright green","amber","violet","hazel","ice blue","dark brown","golden"];
const FEATURES = [
  "a jagged scar across the left cheek","calloused, ink-stained fingers","a missing front tooth revealed by a wide grin",
  "an elaborate tattoo curling up the neck","a nervous habit of drumming fingers on every surface",
  "deep-set worry lines that age them beyond their years","a crooked nose broken more than once",
  "unusually long fingers adorned with many rings","a permanent squint as though sizing everyone up",
  "a birthmark shaped like a crescent on the jaw","one ear noticeably higher than the other",
  "eyes that never quite settle on one thing",
];
const PERSONALITY_TRAITS = [
  "I always have a plan for what to do when things go wrong.",
  "I am always calm, no matter the situation — never raise my voice.",
  "The first thing I do in a new place is note the exits.",
  "I hoard small trinkets that others would consider junk.",
  "I tell very long, elaborate stories that often have no point.",
  "I misuse long words in an attempt to sound smarter.",
  "I have a strong sense of fair play and always try to find the most equitable solution.",
  "I can't resist a pretty face or a captivating smile.",
  "I blow up at the slightest insult and hold grudges for years.",
  "I am slow to trust but fiercely loyal once earned.",
  "I use flattery to get what I want and rarely reveal my true intentions.",
  "I love a good argument and will play devil's advocate just to see where it leads.",
  "I have little respect for anyone who can't handle themselves in a fight.",
  "I speak very quietly, forcing others to lean in to hear me.",
  "I am deeply suspicious of magic I don't understand.",
  "Everything I do has a reason — I don't believe in luck.",
  "I find beauty in unexpected places and stop to note them often.",
  "I never make eye contact when lying, but I've gotten very good at looking people in the eye.",
];
const IDEALS = [
  "Freedom. Chains, whether physical or social, are an affront to the self.",
  "Power. The strong shape the world; the weak endure it.",
  "Community. Everything I do, I do for the people around me.",
  "Knowledge. The truth is worth any price.",
  "Redemption. I have done wrong. I will spend my life making it right.",
  "Beauty. The world is more bearable when there is art in it.",
  "Order. Chaos destroys everything it touches. Structure is salvation.",
  "Change. Old ways must give way to new or they calcify into chains.",
  "Ambition. Mediocrity is the slow death. I will be remembered.",
  "Honor. My word is my bond; break it and I am nothing.",
  "Survival. Every choice I make keeps me alive one more day.",
  "Loyalty. I will not abandon those who stand with me.",
  "Justice. The guilty answer for their crimes or the world has no meaning.",
];
const BONDS = [
  "There is someone I wronged long ago. I look for them everywhere.",
  "I protect a secret that would ruin someone I love.",
  "A mentor shaped who I am. I carry their lessons like a scar.",
  "I owe a debt to someone who saved my life — money or otherwise.",
  "My hometown is everything to me, even in its absence.",
  "There is a relic in my possession I would die before surrendering.",
  "I have a sibling I haven't seen in years. I still search for them.",
  "An old rival defines me as much as any friend ever did.",
  "I carry a letter I was never able to deliver.",
  "I served an institution that I left in disgrace.",
  "The person who hurt me most is still out there.",
];
const FLAWS = [
  "I cannot back down from a challenge, even a foolish one.",
  "I would rather lie smoothly than tell the truth awkwardly.",
  "I have a vice — drink, gambling, something — that surfaces under pressure.",
  "I assume I am the most capable person in any room.",
  "I am deeply superstitious and avoid anything that might bring bad luck.",
  "I hold people to standards I don't apply to myself.",
  "I will sacrifice almost anything for what I want.",
  "I run from emotional intimacy the moment I sense it forming.",
  "I deflect every serious moment with a joke.",
  "I am obsessed with a past failure and make poor decisions because of it.",
  "I trust authority figures instinctively, even when I shouldn't.",
  "I nurse old grudges long after everyone else has moved on.",
];
const SECRET_MOTIVATIONS = [
  "Seeks to locate a missing person — and fears what they'll find.",
  "Believes they are destined for something great and is terrified of being ordinary.",
  "Carries guilt over a death they caused, accidentally or not.",
  "Is slowly working toward revenge against someone who wronged them years ago.",
  "Wants to acquire enough wealth to disappear entirely and start over.",
  "Has been feeding information to a rival faction.",
  "Is hiding their true identity; their past would change everything.",
  "Searching for a cure — for themselves or someone they love.",
  "Was sent here by someone they dare not name, to watch and report.",
  "Believes they are being followed and is looking for proof.",
  "Is sitting on knowledge that could destabilize something powerful.",
  "Trying to undo a past deal that has started to cost more than expected.",
];

function generateLocalNPC({ race }) {
  const raceData = NPC_NAMES[race] || NPC_NAMES["Human"];
  const gender = pickRandom(["male", "female"]);
  const firstName = pickRandom(raceData[gender] || raceData.male || []);
  const surname = pickRandom(raceData.surname || []);
  const name = surname ? `${firstName} ${surname}` : firstName;
  const build = pickRandom(BUILDS);
  const hair = pickRandom(HAIR);
  const eyes = pickRandom(EYES);
  const feature = pickRandom(FEATURES);
  const appearance = `${build.charAt(0).toUpperCase() + build.slice(1)}, with ${hair} hair and ${eyes} eyes. ${feature.charAt(0).toUpperCase() + feature.slice(1)}.`;
  return {
    name, gender, appearance,
    personalityTrait: pickRandom(PERSONALITY_TRAITS),
    ideal: pickRandom(IDEALS),
    bond: pickRandom(BONDS),
    flaw: pickRandom(FLAWS),
    secretMotivation: pickRandom(SECRET_MOTIVATIONS),
  };
}

// ─── Location type data ───────────────────────────────────────────────────────

const LOCATION_TYPES = {
  "Inn & Tavern": {
    prefixes: ["The Rusty","The Silver","The Golden","The Copper","The Wanderer's","The Weary","The Dragon's","The Prancing","The Merry","The Broken"],
    suffixes: ["Flagon","Stag","Coin","Shield","Goblin","Boot","Anvil","Sword","Hearth","Lantern"],
    nameFormat: "prefix suffix",
    atmospheres: [
      "Smoke from a dozen pipes hangs in the air. The smell of roasting meat and spilled ale fills the room.",
      "A bard plays an off-key ballad in the corner while regulars argue loudly over a dice game.",
      "Half-empty mugs litter every table. A one-eyed barkeep watches the door with practiced suspicion.",
      "The inn is quieter than expected for this hour — just a few cloaked travelers who don't make eye contact.",
      "A fire roars in the hearth and the smell of fresh bread cuts through the pipe smoke.",
    ],
    features: [
      "A notice board by the door covered in torn bounty posters and job listings.",
      "A locked cabinet behind the bar that the innkeeper glances at far too often.",
      "A private booth in the back that's always reserved — no one knows for whom.",
      "A trapdoor under a rug that leads to a cold storage cellar.",
      "The house specialty is something unidentifiable but surprisingly good.",
      "Regulars who haven't left their stools in days; they know everything that happens here.",
      "A battered trophy — a monster's head, a broken sword — mounted above the fireplace.",
    ],
    dangers: [
      "A bar fight is brewing between two rival groups of mercenaries.",
      "The innkeeper is in debt to a local crime lord who collects 'protection fees' tonight.",
      "A guest has been poisoned — the culprit is still in the building.",
      "A pickpocket is working the crowd, emboldened by the noise and drink.",
    ],
    secrets: [
      "The cellar connects to a smuggling tunnel running beneath the street.",
      "The innkeeper shelters fugitives for coin — and has one upstairs right now.",
      "A spy uses this inn as a dead drop, passing messages through the bard's set list.",
      "The 'house wine' is watered down — with something mildly hallucinogenic.",
      "The owner is a retired adventurer in hiding from a past they'd rather forget.",
    ],
    extras: {
      "Rumors Overheard": [
        "Someone found a body in the river three nights running.",
        "The merchant guild is fixing prices — half the vendors in the market are in on it.",
        "A noble's heir went missing a fortnight ago. The family is paying for silence.",
        "Strange lights in the old tower on the hill. Been dark for twenty years.",
        "A courier went missing on the south road. Had important papers on them.",
        "They say the new temple is cursed — three priests have died since it opened.",
      ],
    },
  },
  "Alley & Back Street": {
    prefixes: ["Cutpurse","Shadow","Blind","Narrow","Blood","Rat","Broken","Dark"],
    suffixes: ["Alley","Run","Lane","Cut","Passage","Way","Walk","Close"],
    nameFormat: "prefix suffix",
    atmospheres: [
      "Wet cobblestones reflect a sliver of moonlight. Something skitters in the darkness ahead.",
      "The alley smells of rot and old cooking. Laundry lines criss-cross overhead, blocking the sky.",
      "Graffiti covers every surface — some of it is clearly coded. Someone is communicating here.",
      "Too quiet for this part of town. Even the usual vermin seem to be keeping away tonight.",
      "A single torch at the far end flickers like it might go out at any moment.",
    ],
    features: [
      "A chalk mark on the wall — a dead drop signal for someone who knows the code.",
      "Crates stacked against a wall, some of them recently moved. The dirt says so.",
      "A rusted iron door, padlocked — but the hinges are newer than they appear.",
      "Someone has carved a map into the wall. You're not sure of what.",
      "A body-sized bundle wrapped in canvas, leaned against a wall. It hasn't moved. Yet.",
      "A small shrine to a forgotten god, still lit with fresh candles.",
    ],
    dangers: [
      "Three figures step out of the shadows. They look like they were waiting.",
      "A tripwire strung knee-high across the alley — someone doesn't want visitors.",
      "A rooftop figure has been tracking the party's movement for two blocks.",
      "A child begs for help — their desperate eyes are watching someone behind the party.",
    ],
    secrets: [
      "This alley is the entrance to an underground fighting ring — if you know which door to knock on.",
      "A fence operates out of the cellar below the butcher at the alley's end.",
      "Someone used this alley to dump a body three nights ago — the blood is still here if you look.",
      "A thieves' guild safe house sits behind the false wall of the old storehouse.",
    ],
    extras: {},
  },
  "Market & Shop": {
    prefixes: [""],
    suffixes: [""],
    nameFormat: "custom",
    shopNames: ["The Gilded Scale Emporium","Duskwood Trading Co.","Ironhand Smithy","The Curious Curio","Mortar & Pestle Apothecary","The Wandering Merchant","Saltmarsh Goods","The Amber Stall","The Crooked Coin","Bram's Oddities"],
    atmospheres: [
      "The market is alive with haggling voices and the smell of spiced food from nearby stalls.",
      "A quiet shop, dusty and cramped. The merchant watches your every move.",
      "The stall is busy but the merchant seems distracted — eyes keep flicking to a man across the square.",
      "Pleasant and well-lit. A little too clean. A little too perfect.",
      "Half the goods are under a tarp. The merchant 'saves the good stuff for serious buyers.'",
    ],
    features: [
      "A locked glass cabinet with items the merchant won't discuss the price of publicly.",
      "A scale with weights that look subtly wrong.",
      "A back room the merchant doesn't want you going near.",
      "An unusual item mixed in with mundane goods — clearly misidentified or hidden.",
      "A 'sold' tag on something the merchant seems oddly reluctant to actually hand over.",
      "A loyal dog sleeping under the counter that wakes the moment anyone opens the back door.",
    ],
    dangers: [
      "A pickpocket is using the crowd to lift purses — they've already taken one from a party member.",
      "The merchant is selling cursed goods — unknowingly, or so they claim.",
      "A rival trader has paid the local guard to harass this stall's customers.",
      "A gang runs 'insurance' on this market — and they're collecting today.",
    ],
    secrets: [
      "A fence for stolen goods operates quietly from the back room.",
      "The merchant is a guild spy — cataloging what adventurers are buying and selling.",
      "A rare item in the mundane pile is actually priceless — misidentified decades ago.",
      "The merchant is being blackmailed and is desperate for help.",
    ],
    extras: {},
  },
  "Temple & Shrine": {
    deities: ["Pelor (Sun, healing)","Moradin (Dwarves, creation)","Corellon (Elves, art)","Avandra (Change, luck)","Sehanine (Moon, dreams)","Bahamut (Justice, dragons)","Erathis (Law, civilization)","Ioun (Knowledge, prophecy)","The Raven Queen (Death, fate)","Melora (Nature, sea)","Tiamat (Evil dragons, conquest)","Vecna (Secrets, undeath)"],
    atmospheres: [
      "Incense smoke curls toward a high vaulted ceiling painted with celestial figures.",
      "The temple is nearly empty — a lone priest kneels at the altar, whispering.",
      "Worshippers fill the pews, singing softly. It's peaceful, but something feels observed.",
      "The shrine is outdoors, wind-worn, and ancient. Offerings have been left recently.",
      "Rows of candles flicker in unison as if moved by a single breath.",
    ],
    features: [
      "An elaborate bas-relief depicting scenes the clergy seem reluctant to explain.",
      "A healing font — currently dry, though it shouldn't be.",
      "A donation box that's clearly been recently forced open and resealed.",
      "A sealed reliquary behind the altar. The lock is new.",
      "A confessional booth with a well-worn floor on both sides.",
      "Votive candles for the dead — one bears a very recent name.",
    ],
    dangers: [
      "The high priest is subtly coercing donations under threat of 'divine disfavor.'",
      "A divine ward activates the moment a worshipper of a rival deity enters.",
      "The cult within the cult is holding a secret rite below, tonight.",
      "A sacred artifact was stolen — and the clergy suspects it was an inside job.",
    ],
    secrets: [
      "The temple's crypt beneath hides a secret far older than the faith it now serves.",
      "A heretical priest is hiding texts the Church has declared forbidden.",
      "The 'miraculous healer' is a charlatan — the actual magic comes from a captured imp.",
      "A powerful relic beneath the altar was stolen and replaced with a forgery years ago.",
      "This temple serves two faiths — one public, one hidden from view.",
    ],
    extras: {
      "Services Offered": ["Healing wounds (minor)","Last rites and burial","Divination (limited)","Sanctuary for the hunted","Exorcism (expensive)","Blessing of arms","Scroll transcription"],
    },
  },
  "Dungeon & Cave": {
    prefixes: ["Shadow","Iron","Bloodrock","Deepstone","Black","Sunken","Shattered","Grimdark","Ancient","Forsaken"],
    suffixes: ["Caverns","Delve","Mines","Hollow","Warrens","Depths","Pit","Vault","Chasm"],
    nameFormat: "prefix suffix",
    atmospheres: [
      "Water drips steadily somewhere ahead. The echo makes it impossible to judge distance.",
      "The air is cold and stale, and your light barely pushes back the dark.",
      "Bioluminescent fungi provide a faint blue glow. Beautiful. Deeply unsettling.",
      "The cave floor is slick with moisture. Somewhere deep, something moves.",
      "An unnatural silence presses down — no insects, no dripping, nothing.",
    ],
    features: [
      "The remains of an old campsite — still warm ash, but no one is here.",
      "Crystal formations that vibrate faintly when magic is used nearby.",
      "A carved archway far older than the dungeon around it.",
      "An underground stream, cold and fast, cutting across the path.",
      "Walls marked with old scratches — tallied days, or warnings, or both.",
      "A collapsed side passage that smells of something recently disturbed.",
      "A crude fortification — someone was defending this position not long ago.",
    ],
    dangers: [
      "A section of ceiling is cracked — structural collapse is imminent.",
      "A pocket of toxic gas seeps from a fissure ahead.",
      "Something large is nesting in the next chamber — and it knows you're here.",
      "A tripwire connected to an alarm triggers as the party passes.",
    ],
    secrets: [
      "A hidden level below the dungeon predates it by centuries — the original builders are still there.",
      "A fortune in raw gemstones is embedded in the deepest wall, overlooked by every prior expedition.",
      "The dungeon was not built as a dungeon — it was a refuge, sealed from inside.",
      "A surviving creature here has been waiting to make a deal with someone brave enough to listen.",
    ],
    extras: {},
  },
  "Forest & Wilderness": {
    prefixes: ["Thornwood","Silverleaf","Deepwood","Mistwood","Ironbark","Duskwood","Ashenvale","Hollowwood","Elder","Ancient"],
    suffixes: ["Forest","Grove","Thicket","Glade","Glen","Wood","Reach","Wilds","Vale"],
    nameFormat: "prefix suffix",
    atmospheres: [
      "Dappled light filters through a canopy so thick the sky is barely visible.",
      "The forest is unnaturally silent. Even the birds have stopped.",
      "Mist clings to the ground, obscuring roots and stones. Moving quickly seems unwise.",
      "Wind moves through the trees in waves. It sounds almost like whispering.",
      "Late afternoon light turns everything amber and shadow. The forest feels older at this hour.",
    ],
    features: [
      "An enormous tree, ancient beyond reckoning. Something has been carved deep into the bark.",
      "A hidden path — faint, but deliberate. Someone maintains this.",
      "A natural spring, still and clear. Offerings have been left around its edge.",
      "Animal tracks that shift species mid-trail, as if something changed shape.",
      "Ruins of a stone structure swallowed by roots over centuries.",
      "A clearing where no plants grow — the soil is black and the air is cold.",
    ],
    dangers: [
      "A territorial predator has been tracking the party since the tree line.",
      "The 'path' through the forest doubles back on itself — there's a maze-like quality to it.",
      "A patch of plants ahead is highly toxic — contact causes hallucinations.",
      "A trap set by rangers or poachers — designed for large game.",
    ],
    secrets: [
      "A fey crossing exists in the oldest part of this forest — it opens at dusk.",
      "A druid circle meets in the hidden glade — they are not welcoming of outsiders.",
      "A buried chest from a robbery decades old sits beneath the roots of the great oak.",
      "The forest is slowly growing in a direction it shouldn't — something beneath it is pulling it.",
    ],
    extras: {},
  },
  "Harbor & Docks": {
    prefixes: ["Saltmere","Ironhook","Stormbreak","Deepwater","Blackwater","Gull's","Anchor","Fogwatch"],
    suffixes: ["Docks","Wharf","Quay","Harbor","Marina","Landing","Port"],
    nameFormat: "prefix suffix",
    atmospheres: [
      "Salt air and fish guts. Gulls scream overhead. A dozen ships creak against their moorings.",
      "Thick fog rolls in off the water, reducing visibility to a few feet on the far end of the dock.",
      "The docks are busy even at night — crates move by torchlight, no questions asked.",
      "A harbor patrol vessel sits anchored offshore, but the crew seems unusually inattentive.",
      "The smell of tar and rope and something else — cargo that wasn't declared.",
    ],
    features: [
      "A harbormaster's ledger that doesn't match the ships actually moored here.",
      "A ship flying false colors — its real markings are visible if you know where to look.",
      "A tavern at the dock's end where no questions are asked and no names are given.",
      "A warehouse with a heavy private lock and no trade markings.",
      "A sunken vessel just visible beneath the clear harbor shallows.",
      "A ship preparing to depart at odd hours with a skeleton crew.",
    ],
    dangers: [
      "Press gangs are working this district tonight — two parties have already been taken.",
      "A smuggling operation uses this dock — and they don't appreciate observers.",
      "A rival crew has marked this area as their territory. Violence is expected.",
      "Something large has been spotted in the harbor water near the main pier.",
    ],
    secrets: [
      "A smuggling network moves contraband through the harbor — the harbormaster is in on it.",
      "A pirate captain has a secret identity as a respected merchant in this port.",
      "The wreck in the harbor holds something valuable — and something that guards it.",
      "A spy courier uses the fishing boats to pass information to foreign agents offshore.",
    ],
    extras: {},
  },
  "Ruins": {
    prefixes: ["Shadow","Iron","Crimson","Ashen","Broken","Fallen","Forsaken","Hollow","Ancient","Crumbled"],
    suffixes: ["Ruins","Keep","Citadel","Tower","Hall","Bastion","Fortress","Abbey","Barrow","Mausoleum"],
    nameFormat: "prefix suffix",
    atmospheres: [
      "Fallen stones and collapsed arches stretch in every direction. The place was massive once.",
      "Wind moans through empty windows and broken walls. It sounds almost like voices.",
      "Vegetation has reclaimed everything — thick roots split stone, vines hide doorways.",
      "The silence here feels inhabited. Like something is listening.",
      "Pale moonlight illuminates carved inscriptions too worn to read. They were warnings.",
    ],
    features: [
      "An intact relief carving depicting the site's original purpose — and its end.",
      "A well that still draws water from somewhere deep below.",
      "A sealed vault door, still functional despite the ruin around it.",
      "The throne room is mostly intact — the throne itself is still occupied. By a skeleton.",
      "A mosaic floor with a map of the surrounding region as it was centuries ago.",
      "Crumbled stairs leading to a level below that the ruin's age suggests shouldn't exist.",
    ],
    dangers: [
      "The ruin is structurally unsound — sections are actively collapsing.",
      "The original guardians are still here, in a form that doesn't need to eat or sleep.",
      "A rival expedition is already inside — and they're not interested in sharing.",
      "A magical ward placed by the original inhabitants still functions perfectly.",
    ],
    secrets: [
      "The ruin was not destroyed by war — its inhabitants sealed it from within for a reason.",
      "A royal bloodline is connected to this place. Their descendants don't know it exists.",
      "Something survives in the lowest level. It has been down there since the fall.",
      "A cache of the original civilization's magic items is still here, perfectly preserved.",
    ],
    extras: {},
  },
  "Mansion & Estate": {
    prefixes: ["Ashford","Blackwell","Grimholt","Ironvale","Mournstead","Silverbrook","Thornfield","Ravenswood","Coldmere","Duskmere"],
    suffixes: ["Manor","Hall","Estate","Grange","House","Lodge","Keep"],
    nameFormat: "prefix suffix",
    atmospheres: [
      "Grand but faded — chandeliers missing crystals, tapestries moth-eaten, servants few.",
      "Immaculate and cold. The kind of wealth that doesn't allow for warmth.",
      "Oil portraits of ancestors line every hall. Their eyes seem to follow you.",
      "A house in mourning — black drapes, hushed staff, a family fractured by recent loss.",
      "Laughter and candlelight from inside contrast sharply with the dark rumors outside.",
    ],
    features: [
      "A locked study with light under the door — and it wasn't locked this morning.",
      "A portrait gallery with one painting conspicuously missing from the wall.",
      "Servants who are helpful, efficient, and volunteering absolutely nothing.",
      "A trophy room containing things that shouldn't have been hunted.",
      "A garden maze — the center of which cannot be seen from any window.",
      "A wine cellar with a section bricked off that doesn't appear on any floor plan.",
    ],
    dangers: [
      "A jealous heir is willing to do anything to secure their inheritance — anything.",
      "A cursed heirloom in the collection is slowly poisoning its surroundings.",
      "The household staff are being controlled — magically or through fear.",
      "The estate is the subject of a legal dispute — and one party is willing to burn it down.",
    ],
    secrets: [
      "The current owner made a deal decades ago. The devil is coming to collect.",
      "A hidden passage runs from the study to the servants' quarters — for reasons no one discusses.",
      "The family fortune was built on something the current generation wants to keep buried.",
      "A prisoner is being held in the estate — a family member everyone believes is dead.",
    ],
    extras: {},
  },
  "Military Outpost": {
    prefixes: ["Iron","Redwall","Blackrock","Stoneguard","Vanguard","Frontier","Highwatch","Wardens'"],
    suffixes: ["Fort","Watch","Post","Garrison","Keep","Station","Redoubt","Bastion"],
    nameFormat: "prefix suffix",
    atmospheres: [
      "Drilling soldiers kick up dust on the parade ground. The commander watches from a high window.",
      "The fort is understaffed and everyone knows it. Morale is a rumor from headquarters.",
      "Cookfire smoke and the clang of the armorer's hammer. The work never stops.",
      "Tense. Something happened on patrol recently and no one is talking about it officially.",
      "A supply wagon was expected three days ago. The rations are being rationed.",
    ],
    features: [
      "A wall map showing patrol routes with areas marked 'do not approach' in red.",
      "A brig with a prisoner who wasn't there on the last official inspection.",
      "A siege weapon in obvious disrepair — no one has parts or knows how to fix it.",
      "A secret correspondence hidden in the commander's desk.",
      "A memorial marker for soldiers lost on a mission that doesn't appear in any record.",
      "A quartermaster whose ledgers never quite add up — in their favor.",
    ],
    dangers: [
      "A spy among the soldiers has been leaking patrol schedules to someone outside.",
      "Deserters from this post are armed and hiding in the region — bitter and desperate.",
      "An enemy faction is planning a targeted strike on this location tonight.",
      "The commanding officer is giving orders that will get people killed — knowingly.",
    ],
    secrets: [
      "The fort is sitting on something it was built to guard — not a border.",
      "Secret orders arrived from the capital. The commander is following them. It's wrong.",
      "Supply theft has been systematic for months — the proceeds fund something political.",
      "A soldier here witnessed something they shouldn't have. They've been waiting for someone trustworthy.",
    ],
    extras: {},
  },
  "Wizard's Tower": {
    prefixes: ["Ashenmere","Cerulean","Obsidian","Silverveil","Dawnwatch","Grimoire","Arcane","Starfall","Voidwatch"],
    suffixes: ["Tower","Spire","Observatory","Sanctum","Pinnacle","Citadel","Aerie"],
    nameFormat: "prefix suffix",
    atmospheres: [
      "A low magical hum resonates from the stones. Dust motes float in patterns that aren't random.",
      "Books and scrolls cover every surface. The smell of parchment and ozone fills the air.",
      "The tower seems taller on the inside than outside. The geometry is subtly wrong.",
      "Something small and many-legged watches you from a high shelf. It does not blink.",
      "The temperature drops on the upper floors. The air itself feels charged with potential.",
    ],
    features: [
      "An arcane laboratory with an experiment in progress — unattended, and clearly unstable.",
      "A familiar — owl, cat, or stranger — that refuses to leave a certain room.",
      "A forbidden library section sealed behind a glyph that causes nausea to approach.",
      "A scrying pool reflecting a location that isn't nearby.",
      "An automaton housekeeper going about its routines with fixed, unsettling calm.",
      "A locked cabinet humming audibly with contained energy.",
    ],
    dangers: [
      "A magical alarm triggered by the party's presence has already notified someone.",
      "A bound elemental serving as a guardian has been here long enough to develop opinions.",
      "An experiment in the upper levels has escaped its containment.",
      "Teleportation within the tower is deliberately disrupted — no leaving the quick way.",
    ],
    secrets: [
      "The wizard is dead. A simulacrum has been running the tower for months — perfectly.",
      "A gateway to another plane is hidden behind a mundane-looking door on the third floor.",
      "The tower's foundations are built atop a sealed rift. The seal is weakening.",
      "Illegal enchantments are being performed here — on people, not objects.",
    ],
    extras: {},
  },
};

const LOC_TYPE_KEYS = Object.keys(LOCATION_TYPES);

function generateLocationName(typeKey) {
  const data = LOCATION_TYPES[typeKey];
  if (typeKey === "Market & Shop") return pickRandom(data.shopNames);
  if (typeKey === "Temple & Shrine") {
    const deity = pickRandom(data.deities);
    return pickRandom(["Temple of","Shrine of","Sanctum of"]) + " " + deity.split(" (")[0];
  }
  const prefix = pickRandom(data.prefixes);
  const suffix = pickRandom(data.suffixes);
  return prefix ? `${prefix} ${suffix}` : suffix;
}

function generateLocation(typeKey) {
  const data = LOCATION_TYPES[typeKey];
  const name = generateLocationName(typeKey);
  const atmosphere = pickRandom(data.atmospheres);
  const features = pickMultiple(data.features, 3);
  const danger = pickRandom(data.dangers);
  const secret = pickRandom(data.secrets);
  const extras = {};
  for (const [label, pool] of Object.entries(data.extras || {})) {
    extras[label] = pickMultiple(pool, Math.min(3, pool.length));
  }
  return { type: typeKey, name, atmosphere, features, danger, secret, extras };
}

// ─── Combat encounter logic ───────────────────────────────────────────────────

function generateCombatEncounter({ partyLevel, partySize, difficulty, monsterType, customMonsters }) {
  const diffIdx = ["Easy","Medium","Hard","Deadly"].indexOf(difficulty);
  const lvl = Math.max(1, Math.min(20, parseInt(partyLevel) || 1));
  const size = Math.max(1, parseInt(partySize) || 4);
  const thresholds = XP_THRESHOLDS[lvl] || XP_THRESHOLDS[1];
  const budget = thresholds[diffIdx] * size;
  const allMonsters = [...MONSTERS, ...(customMonsters || [])];
  let pool = allMonsters;
  if (monsterType && monsterType !== "Any") {
    const filtered = allMonsters.filter(m => m.type && m.type.toLowerCase().includes(monsterType.toLowerCase()));
    if (filtered.length >= 3) pool = filtered;
  }
  const minXp = Math.max(10, budget * 0.04);
  const maxXp = budget * 0.8;
  let eligible = pool.filter(m => (m.xp || 0) >= minXp && (m.xp || 0) <= maxXp);
  if (eligible.length === 0) eligible = pool.filter(m => (m.xp || 0) <= budget);
  if (eligible.length === 0) return null;
  const groups = [];
  let usedXp = 0;
  let attempts = 0;
  while (usedXp < budget * 0.65 && groups.length < 3 && attempts < 30) {
    attempts++;
    const remaining = budget - usedXp;
    const candidates = eligible.filter(m => !groups.find(g => g.monster.id === m.id) && (m.xp || 0) <= remaining);
    if (candidates.length === 0) break;
    const monster = pickRandom(candidates);
    const mxp = monster.xp || 10;
    const maxCount = Math.min(8, Math.floor(remaining / mxp));
    if (maxCount === 0) break;
    const count = Math.max(1, Math.ceil(Math.random() * Math.min(maxCount, 4)));
    usedXp += mxp * count;
    groups.push({ monster, count });
  }
  if (groups.length === 0) return null;
  const totalMonsters = groups.reduce((s, g) => s + g.count, 0);
  const multiplier = getMultiplier(totalMonsters);
  const rawXp = groups.reduce((s, g) => s + (g.monster.xp || 0) * g.count, 0);
  const adjustedXp = Math.round(rawXp * multiplier);
  return { groups, rawXp, adjustedXp, budget, multiplier, difficulty };
}

function generateLoot({ crRange, rarity }) {
  const crTable = LOOT_TABLES[crRange] || LOOT_TABLES["0-1"];
  const key = RARITY_KEY[rarity];
  const pool = key ? (crTable[key] || []) : [
    ...(crTable.mundane || []), ...(crTable.uncommon || []),
    ...(crTable.rare || []),    ...(crTable.veryRare || []),
  ];
  if (!pool || pool.length === 0) return [];
  return pickMultiple(pool, 3 + Math.floor(Math.random() * 3));
}

function generateShopInventory({ shopType }) {
  const key = shopType.toLowerCase().replace(" ", "");
  const shopData = SHOP_INVENTORIES[key] || SHOP_INVENTORIES["general"];
  const pool = shopData.items || shopData || [];
  return pickMultiple(pool, 6 + Math.floor(Math.random() * 3));
}

function generateLocalEncounters({ terrain, partyLevel, count = 3 }) {
  const lvl = parseInt(partyLevel) || 1;
  const band = lvl <= 4 ? "1-4" : lvl <= 10 ? "5-10" : lvl <= 16 ? "11-16" : "17+";
  const keys = terrain === "Any" ? Object.keys(RANDOM_ENCOUNTER_TABLES) : [terrain.toLowerCase()];
  const results = [];
  const used = new Set();
  let attempts = 0;
  while (results.length < count && attempts < count * 10) {
    attempts++;
    const terrainKey = pickRandom(keys);
    const tableData = RANDOM_ENCOUNTER_TABLES[terrainKey];
    if (!tableData) continue;
    const pool = tableData[band] || tableData["1-4"] || [];
    if (pool.length === 0) continue;
    const enc = pickRandom(pool);
    if (!used.has(enc)) { used.add(enc); results.push({ terrain: terrainKey, band, encounter: enc }); }
  }
  return results;
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  wrap: { background: "#1a0800", borderRadius: 6, border: "1px solid rgba(92,51,23,.45)", marginBottom: 18, overflow: "hidden" },
  header: { background: "linear-gradient(135deg,#120400,#1e0a02)", borderBottom: "1px solid rgba(200,149,42,.25)", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  headerTitle: { fontFamily: "'Cinzel Decorative',serif", color: "var(--gold)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 },
  headerIcon: { fontSize: 16 },
  body: { padding: "12px 14px 14px" },
  row: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 },
  label: { fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1.5, color: "rgba(245,230,200,.5)", textTransform: "uppercase", marginBottom: 3 },
  select: { background: "rgba(26,8,0,.8)", border: "1px solid rgba(92,51,23,.6)", borderRadius: 3, color: "var(--vel)", fontFamily: "'IM Fell English',Georgia,serif", fontSize: 12, padding: "4px 8px", outline: "none", cursor: "pointer", minWidth: 120 },
  input: { background: "rgba(26,8,0,.8)", border: "1px solid rgba(92,51,23,.6)", borderRadius: 3, color: "var(--vel)", fontFamily: "'IM Fell English',Georgia,serif", fontSize: 12, padding: "4px 8px", outline: "none", width: 60 },
  inputFull: { background: "rgba(245,230,200,.05)", border: "1px solid rgba(92,51,23,.4)", borderRadius: 3, color: "var(--vel)", fontFamily: "'IM Fell English',serif", fontSize: 13, padding: "6px 10px", outline: "none", width: "100%" },
  btnGold: { background: "var(--gold)", border: "none", borderRadius: 3, color: "#1a0a00", fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1.5, fontWeight: 700, textTransform: "uppercase", padding: "6px 14px", cursor: "pointer", transition: "background .15s", whiteSpace: "nowrap" },
  btnGhost: { background: "transparent", border: "1px solid rgba(200,149,42,.4)", borderRadius: 3, color: "var(--gold)", fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase", padding: "4px 10px", cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap" },
  btnDanger: { background: "transparent", border: "1px solid rgba(139,26,26,.5)", borderRadius: 3, color: "var(--cr)", fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap" },
  resultItem: { background: "rgba(0,0,0,.25)", border: "1px solid rgba(92,51,23,.35)", borderRadius: 3, padding: "6px 10px", marginBottom: 5, display: "flex", alignItems: "center", gap: 8 },
  resultText: { fontFamily: "'IM Fell English',Georgia,serif", fontSize: 13, color: "var(--vel)", flex: 1 },
  noResults: { fontFamily: "'IM Fell English',Georgia,serif", fontStyle: "italic", fontSize: 12, color: "rgba(245,230,200,.3)", textAlign: "center", padding: "12px 0" },
  divider: { border: "none", borderTop: "1px solid rgba(200,149,42,.15)", margin: "10px 0" },
  lStyle: { fontFamily: "'Cinzel',serif", fontSize: 8, letterSpacing: 1.5, color: "rgba(92,51,23,.9)", textTransform: "uppercase", marginBottom: 4 },
  panel: { background: "rgba(26,10,2,.7)", border: "1px solid rgba(92,51,23,.4)", borderRadius: 4, padding: 14 },
  badgeRarity: (rarity) => {
    const colors = { Mundane:{bg:"rgba(92,51,23,.35)",text:"rgba(245,230,200,.5)"}, Uncommon:{bg:"rgba(0,128,0,.2)",text:"#4caf50"}, Rare:{bg:"rgba(0,80,200,.2)",text:"#5b9cf6"}, "Very Rare":{bg:"rgba(128,0,200,.2)",text:"#b47ef5"}, Legendary:{bg:"rgba(200,149,0,.2)",text:"var(--gl)"} };
    const c = colors[rarity] || colors.Mundane;
    return { background:c.bg, color:c.text, fontFamily:"'Cinzel',serif", fontSize:7, letterSpacing:1, textTransform:"uppercase", padding:"2px 6px", borderRadius:2, whiteSpace:"nowrap", flexShrink:0 };
  },
};

// ─── Button components ────────────────────────────────────────────────────────

function GoldHover({ children, style, ...props }) {
  const [hover, setHover] = useState(false);
  return <button style={{ ...style, background: hover ? "var(--gl)" : style?.background }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...props}>{children}</button>;
}

function GhostHover({ children, style, ...props }) {
  const [hover, setHover] = useState(false);
  return <button style={{ ...style, borderColor: hover ? "var(--gold)" : style?.borderColor || "rgba(200,149,42,.4)", color: hover ? "var(--gl)" : style?.color || "var(--gold)", background: hover ? "rgba(200,149,42,.08)" : "transparent" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...props}>{children}</button>;
}

function DangerHover({ children, style, ...props }) {
  const [hover, setHover] = useState(false);
  return <button style={{ ...style, borderColor: hover ? "var(--cr)" : "rgba(139,26,26,.5)", color: hover ? "var(--crl)" : "var(--cr)", background: hover ? "rgba(139,26,26,.1)" : "transparent" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...props}>{children}</button>;
}

function SectionHeader({ icon, title }) {
  return (
    <div style={S.header}>
      <div style={S.headerTitle}><span style={S.headerIcon}>{icon}</span>{title}</div>
    </div>
  );
}

function RerollButton({ onClick }) {
  return (
    <button onClick={onClick} title="Reroll" style={{ background:"none", border:"1px solid rgba(200,149,42,.3)", borderRadius:3, color:"var(--gold)", cursor:"pointer", fontSize:11, padding:"2px 6px", flexShrink:0 }}>🎲</button>
  );
}

function Pills({ items, onSelect }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:5 }}>
      {items.map(item => (
        <button key={item} onClick={() => onSelect(item)}
          style={{ background:"rgba(200,149,42,.08)", border:"1px solid rgba(92,51,23,.35)", borderRadius:2, color:"rgba(245,230,200,.5)", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:.5, padding:"2px 8px", cursor:"pointer" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,149,42,.18)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,149,42,.08)"; e.currentTarget.style.color = "rgba(245,230,200,.5)"; }}
        >{item}</button>
      ))}
    </div>
  );
}

// ─── NPC Generator ────────────────────────────────────────────────────────────

const NPC_FIELDS = [
  { key:"appearance",       label:"Appearance" },
  { key:"personalityTrait", label:"Personality Trait" },
  { key:"ideal",            label:"Ideal" },
  { key:"bond",             label:"Bond" },
  { key:"flaw",             label:"Flaw" },
  { key:"secretMotivation", label:"Secret Motivation" },
];

const FIELD_POOLS = {
  personalityTrait: PERSONALITY_TRAITS,
  ideal: IDEALS,
  bond: BONDS,
  flaw: FLAWS,
  secretMotivation: SECRET_MOTIVATIONS,
};

function NPCGenerator({ onSaveToWiki, onSaveNote }) {
  const [race, setRace]             = useState("Human");
  const [npcClass, setNpcClass]     = useState("");
  const [alignment, setAlignment]   = useState("True Neutral");
  const [level, setLevel]           = useState(1);
  const [background, setBackground] = useState("Folk Hero");
  const [profile, setProfile]       = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  function generate() {
    setProfile(generateLocalNPC({ race }));
  }

  function rerollField(key) {
    if (!profile) return;
    if (key === "name") {
      const raceData = NPC_NAMES[race] || NPC_NAMES["Human"];
      const gender = profile.gender || "male";
      const firstName = pickRandom(raceData[gender] || raceData.male || []);
      const surname = pickRandom(raceData.surname || []);
      setProfile(p => ({ ...p, name: surname ? `${firstName} ${surname}` : firstName }));
    } else if (key === "appearance") {
      const build = pickRandom(BUILDS);
      const hair = pickRandom(HAIR);
      const eyes = pickRandom(EYES);
      const feature = pickRandom(FEATURES);
      setProfile(p => ({ ...p, appearance: `${build.charAt(0).toUpperCase() + build.slice(1)}, with ${hair} hair and ${eyes} eyes. ${feature.charAt(0).toUpperCase() + feature.slice(1)}.` }));
    } else {
      const pool = FIELD_POOLS[key];
      if (pool) setProfile(p => ({ ...p, [key]: pickRandom(pool) }));
    }
  }

  function handleSaveToWiki() {
    if (!profile || !onSaveToWiki) return;
    onSaveToWiki({
      id: genId(),
      type: "NPC",
      name: profile.name || "Unnamed NPC",
      description: profile.appearance || "",
      tags: [],
      links: [],
      createdAt: Date.now(),
      race: race || "",
      role: npcClass || "Commoner",
      alignment,
      level,
      background,
      appearance: profile.appearance || "",
      personalityTrait: profile.personalityTrait || "",
      ideal: profile.ideal || "",
      bond: profile.bond || "",
      flaw: profile.flaw || "",
      secretMotivation: profile.secretMotivation || "",
    });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  function handleSaveToNotes() {
    if (!profile || !onSaveNote) return;
    const lines = [
      `NPC: ${profile.name} — ${race} ${npcClass || "Commoner"} Lvl ${level} (${alignment})`,
      `Appearance: ${profile.appearance}`,
      `Trait: ${profile.personalityTrait}`,
      `Ideal: ${profile.ideal}`,
      `Bond: ${profile.bond}`,
      `Flaw: ${profile.flaw}`,
      `Motivation: ${profile.secretMotivation}`,
    ].join("\n");
    onSaveNote({ id: genId(), text: lines, createdAt: new Date().toISOString() });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <div>
          <div style={S.lStyle}>Race</div>
          <select value={race} onChange={e => setRace(e.target.value)} style={S.inputFull}>
            {RACES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <div style={S.lStyle}>Class / Role</div>
          <input value={npcClass} onChange={e => setNpcClass(e.target.value)} placeholder="Fighter, Merchant…" style={S.inputFull} />
          <Pills items={[...CLASSES.slice(0,6), ...ROLES.slice(0,6)]} onSelect={setNpcClass} />
        </div>
        <div>
          <div style={S.lStyle}>Alignment</div>
          <select value={alignment} onChange={e => setAlignment(e.target.value)} style={S.inputFull}>
            {ALIGNMENTS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"120px 1fr", gap:12 }}>
        <div>
          <div style={S.lStyle}>Level (1–20)</div>
          <input type="number" min={1} max={20} value={level} onChange={e => setLevel(Math.max(1,Math.min(20,parseInt(e.target.value)||1)))} style={S.inputFull} />
        </div>
        <div>
          <div style={S.lStyle}>Background</div>
          <select value={background} onChange={e => setBackground(e.target.value)} style={S.inputFull}>
            {BACKGROUNDS.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div><GoldHover style={S.btnGold} onClick={generate}>✦ Generate NPC</GoldHover></div>

      {profile && (
        <div style={{ ...S.panel, display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(200,149,42,.25)", paddingBottom:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"var(--gold)", fontSize:13 }}>{profile.name || "Unnamed"}</div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, color:"rgba(200,149,42,.5)", letterSpacing:1, marginTop:3 }}>
                {race} · {npcClass || "Commoner"} · Lvl {level} · {background} · {alignment}
              </div>
            </div>
            <RerollButton onClick={() => rerollField("name")} />
          </div>

          {NPC_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <div style={{ ...S.lStyle, marginBottom:0, flex:1 }}>{label}</div>
                <RerollButton onClick={() => rerollField(key)} />
              </div>
              <div style={{ fontFamily:"'IM Fell English',serif", fontSize:13, color:"var(--vel)", lineHeight:1.55, padding:"6px 10px", background:"rgba(0,0,0,.25)", borderRadius:3, border:"1px solid rgba(92,51,23,.25)", fontStyle:key==="secretMotivation"||key==="ideal"||key==="bond"?"italic":"normal" }}>
                {profile[key]}
              </div>
            </div>
          ))}

          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:4, flexWrap:"wrap" }}>
            <GhostHover style={S.btnGhost} onClick={handleSaveToNotes}>✦ Save to Notes</GhostHover>
            {onSaveToWiki && (
              <GoldHover style={{ ...S.btnGold, background: savedFlash ? "rgba(76,175,80,.85)" : "var(--gold)", color: savedFlash ? "#fff" : "var(--ink)" }} onClick={handleSaveToWiki}>
                {savedFlash ? "✓ Saved to Wiki" : "✦ Save to Wiki"}
              </GoldHover>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Location Generator (enhanced) ────────────────────────────────────────────

function LocationGenerator({ onSaveNote, onSaveToWiki, wiki }) {
  const [locType, setLocType] = useState(LOC_TYPE_KEYS[0]);
  const [location, setLocation] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [linkedNpcIds, setLinkedNpcIds] = useState([]);
  const [savedFlash, setSavedFlash] = useState(false);

  // NPCs from wiki for linking
  const wikiNpcs = wiki ? Object.values(wiki).filter(e => e.type === "NPC") : [];

  function generate() {
    setLocation(generateLocation(locType));
    setGenerated(true);
    setLinkedNpcIds([]);
  }

  function toggleNpc(id) {
    setLinkedNpcIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
  }

  function handleSaveToWiki() {
    if (!location || !onSaveToWiki) return;
    const entry = {
      id: genId(),
      type: "Location",
      name: location.name,
      description: location.atmosphere,
      tags: [location.type],
      links: linkedNpcIds.map(id => ({ targetId: id, type: "npc" })),
      createdAt: Date.now(),
      locationType: location.type,
      atmosphere: location.atmosphere,
      features: location.features,
      danger: location.danger,
      secret: location.secret,
    };
    onSaveToWiki(entry);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  function handleSaveToNotes() {
    if (!location) return;
    const lines = [
      `Location: ${location.name} (${location.type})`,
      `Atmosphere: ${location.atmosphere}`,
      `Features: ${location.features.join("; ")}`,
      `Danger: ${location.danger}`,
      `Secret: ${location.secret}`,
      ...Object.entries(location.extras || {}).map(([label, items]) => `${label}: ${items.join("; ")}`),
    ].join("\n");
    onSaveNote({ id: genId(), text: lines, createdAt: new Date().toISOString() });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"flex-end" }}>
        <div style={{ flex:1, minWidth:180 }}>
          <div style={S.lStyle}>Location Type</div>
          <select value={locType} onChange={e => setLocType(e.target.value)} style={{ ...S.inputFull }}>
            {LOC_TYPE_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <GoldHover style={S.btnGold} onClick={generate}>✦ Generate Location</GoldHover>
        {generated && <GhostHover style={S.btnGhost} onClick={generate}>🎲 Reroll</GhostHover>}
      </div>

      {location && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* Name */}
          <div style={{ ...S.panel, borderLeft:"3px solid var(--gold)" }}>
            <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:15, color:"var(--gold)", textShadow:"0 0 12px rgba(200,149,42,.3)", marginBottom:4 }}>
              {location.name}
            </div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"rgba(200,149,42,.5)", letterSpacing:1.5, textTransform:"uppercase" }}>
              {location.type}
            </div>
          </div>

          {/* Atmosphere */}
          <div>
            <div style={{ ...S.lStyle, marginBottom:5 }}>Atmosphere</div>
            <div style={{ ...S.resultItem, borderColor:"rgba(200,149,42,.2)", background:"rgba(200,149,42,.05)" }}>
              <span style={{ ...S.resultText, fontStyle:"italic" }}>{location.atmosphere}</span>
            </div>
          </div>

          {/* Features */}
          <div>
            <div style={{ ...S.lStyle, marginBottom:5 }}>Notable Features</div>
            {location.features.map((f, i) => (
              <div key={i} style={S.resultItem}>
                <span style={{ color:"var(--gold)", fontSize:10, flexShrink:0 }}>✦</span>
                <span style={S.resultText}>{f}</span>
              </div>
            ))}
          </div>

          {/* Danger */}
          <div>
            <div style={{ ...S.lStyle, marginBottom:5 }}>Hidden Danger</div>
            <div style={{ ...S.resultItem, borderColor:"rgba(139,26,26,.35)", background:"rgba(139,26,26,.07)" }}>
              <span style={{ color:"var(--cr)", fontSize:12, flexShrink:0 }}>⚠</span>
              <span style={S.resultText}>{location.danger}</span>
            </div>
          </div>

          {/* Secret */}
          <div>
            <div style={{ ...S.lStyle, marginBottom:5 }}>Secret</div>
            <div style={{ ...S.resultItem, borderColor:"rgba(100,50,200,.35)", background:"rgba(100,50,200,.07)" }}>
              <span style={{ color:"#b47ef5", fontSize:12, flexShrink:0 }}>🔮</span>
              <span style={S.resultText}>{location.secret}</span>
            </div>
          </div>

          {/* Type-specific extras */}
          {Object.entries(location.extras || {}).map(([label, items]) => items.length > 0 && (
            <div key={label}>
              <div style={{ ...S.lStyle, marginBottom:5 }}>{label}</div>
              {items.map((item, i) => (
                <div key={i} style={S.resultItem}>
                  <span style={{ color:"var(--gold)", fontSize:10, flexShrink:0 }}>·</span>
                  <span style={S.resultText}>{item}</span>
                </div>
              ))}
            </div>
          ))}

          {/* NPC linking */}
          {wikiNpcs.length > 0 && (
            <div>
              <div style={{ ...S.lStyle, marginBottom:5 }}>Link NPCs from Wiki</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {wikiNpcs.map(npc => {
                  const linked = linkedNpcIds.includes(npc.id);
                  return (
                    <button key={npc.id} onClick={() => toggleNpc(npc.id)} style={{
                      background: linked ? "rgba(200,149,42,.2)" : "rgba(245,230,200,.04)",
                      border: `1px solid ${linked ? "var(--gold)" : "rgba(92,51,23,.35)"}`,
                      borderRadius: 3, color: linked ? "var(--gold)" : "rgba(245,230,200,.5)",
                      fontFamily: "'Cinzel',serif", fontSize: 8, letterSpacing: .5,
                      padding: "3px 9px", cursor: "pointer",
                    }}>
                      {linked ? "✦ " : ""}{npc.name}
                    </button>
                  );
                })}
              </div>
              {linkedNpcIds.length > 0 && (
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"rgba(200,149,42,.5)", marginTop:5 }}>
                  {linkedNpcIds.length} NPC{linkedNpcIds.length > 1 ? "s" : ""} linked to this location
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <GhostHover style={S.btnGhost} onClick={handleSaveToNotes}>✦ Save to Notes</GhostHover>
            {onSaveToWiki && (
              <GoldHover style={{ ...S.btnGold, background: savedFlash ? "rgba(76,175,80,.85)" : "var(--gold)", color: savedFlash ? "#fff" : "var(--ink)" }} onClick={handleSaveToWiki}>
                {savedFlash ? "✓ Saved to Wiki" : "✦ Save to Wiki"}
              </GoldHover>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Combat Encounter Generator ────────────────────────────────────────────────

const MONSTER_TYPES = ["Any","aberration","beast","celestial","construct","dragon","elemental","fey","fiend","giant","humanoid","monstrosity","ooze","plant","undead"];
const DIFFICULTIES = ["Easy","Medium","Hard","Deadly"];

function CombatEncounterGenerator({ characters, customMonsters, onSendToInitiative, onSaveNote }) {
  const partyAvgLevel = characters?.length > 0 ? Math.round(characters.reduce((s, c) => s + (parseInt(c.level) || 1), 0) / characters.length) : 1;
  const [partyLevel, setPartyLevel] = useState(String(partyAvgLevel));
  const [partySize, setPartySize]   = useState(String(Math.max(1, characters?.length || 4)));
  const [difficulty, setDifficulty] = useState("Medium");
  const [monsterType, setMonsterType] = useState("Any");
  const [encounter, setEncounter]   = useState(null);
  const [generated, setGenerated]   = useState(false);

  function generate() {
    setEncounter(generateCombatEncounter({ partyLevel, partySize, difficulty, monsterType, customMonsters }));
    setGenerated(true);
  }

  function sendToCombat() {
    if (!encounter || !onSendToInitiative) return;
    const combatants = encounter.groups.flatMap(({ monster, count }) =>
      Array.from({ length: count }, (_, i) => ({
        ...monster, id: genId(),
        name: count > 1 ? `${monster.name} ${i + 1}` : monster.name,
        currentHp: monster.hp,
      }))
    );
    onSendToInitiative(combatants);
  }

  function saveToNotes() {
    if (!encounter) return;
    const lines = encounter.groups.map(g => `${g.count}× ${g.monster.name} (CR ${g.monster.cr})`).join(", ");
    onSaveNote({ id: genId(), text: `Encounter [${difficulty}, Lvl ${partyLevel}×${partySize}]: ${lines} — ${encounter.adjustedXp} adj. XP`, createdAt: new Date().toISOString() });
  }

  const diffColor = { Easy:"#4caf50", Medium:"#f5c842", Hard:"#f57c42", Deadly:"#e53935" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:12 }}>
        <div>
          <div style={S.lStyle}>Party Level</div>
          <input type="number" min={1} max={20} value={partyLevel} onChange={e => setPartyLevel(e.target.value)} style={S.inputFull} />
        </div>
        <div>
          <div style={S.lStyle}>Party Size</div>
          <input type="number" min={1} max={10} value={partySize} onChange={e => setPartySize(e.target.value)} style={S.inputFull} />
        </div>
        <div>
          <div style={S.lStyle}>Difficulty</div>
          <select style={S.inputFull} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <div style={S.lStyle}>Monster Type</div>
          <select style={S.inputFull} value={monsterType} onChange={e => setMonsterType(e.target.value)}>
            {MONSTER_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <GoldHover style={S.btnGold} onClick={generate}>✦ Generate</GoldHover>
        {generated && <GhostHover style={S.btnGhost} onClick={generate}>🎲 Reroll</GhostHover>}
      </div>

      {encounter && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:11, color:"var(--gold)" }}>{difficulty} Encounter</span>
            <span style={{ background:`${diffColor[difficulty]}22`, color:diffColor[difficulty], fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:1, padding:"2px 8px", borderRadius:2, border:`1px solid ${diffColor[difficulty]}44` }}>{difficulty.toUpperCase()}</span>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"rgba(245,230,200,.4)", marginLeft:"auto" }}>Budget {encounter.budget} XP · Adj {encounter.adjustedXp} XP ×{encounter.multiplier}</span>
          </div>
          {encounter.groups.map(({ monster, count }, i) => (
            <div key={i} style={{ ...S.resultItem, borderColor:"rgba(139,26,26,.35)", background:"rgba(139,26,26,.08)", flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:9, color:"#e57373", background:"rgba(139,26,26,.3)", borderRadius:3, padding:"2px 6px", flexShrink:0 }}>×{count}</span>
              <span style={{ ...S.resultText, fontWeight:"bold" }}>{monster.name}</span>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"rgba(245,230,200,.45)" }}>CR {monster.cr} · {monster.type}</span>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"rgba(200,149,42,.5)" }}>{(monster.xp||0)*count} XP</span>
            </div>
          ))}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {onSendToInitiative && <GoldHover style={S.btnGold} onClick={sendToCombat}>⚔ Send to Combat</GoldHover>}
            <GhostHover style={S.btnGhost} onClick={saveToNotes}>✦ Save to Notes</GhostHover>
          </div>
        </div>
      )}
      {generated && !encounter && <p style={S.noResults}>No suitable encounter found — try adjusting the difficulty or party level.</p>}
    </div>
  );
}

// ─── Encounter Suggester ──────────────────────────────────────────────────────

const TERRAINS = ["Any","Forest","Dungeon","Urban","Mountain","Coastal","Plains","Swamp","Underdark"];
const TERRAIN_COLORS = { forest:"#4a7c59", dungeon:"#7c4a4a", urban:"#4a5c7c", mountain:"#6a6a7c", coastal:"#4a6a7c", plains:"#7c6a4a", swamp:"#5a7c4a", underdark:"#5a4a7c" };

function EncounterSuggester({ characters, onSaveNote }) {
  const detectedLevel = characters?.length > 0 ? Math.max(1, Math.round(characters.map(c=>c.level||1).reduce((a,b)=>a+b,0)/characters.length)) : 1;
  const [partyLevel, setPartyLevel] = useState(detectedLevel);
  const [partySize, setPartySize]   = useState(characters?.length || 4);
  const [terrain, setTerrain]       = useState("Any");
  const [results, setResults]       = useState([]);

  function generate() {
    setResults(generateLocalEncounters({ terrain, partyLevel, count: 3 }));
  }

  const band = partyLevel <= 4 ? "1-4" : partyLevel <= 10 ? "5-10" : partyLevel <= 16 ? "11-16" : "17+";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <div>
          <div style={S.lStyle}>Party Level {characters?.length > 0 && <span style={{ color:"rgba(200,149,42,.5)", marginLeft:4, textTransform:"none", letterSpacing:0, fontSize:8 }}>auto</span>}</div>
          <input type="number" min={1} max={20} value={partyLevel} onChange={e => setPartyLevel(Math.max(1,Math.min(20,parseInt(e.target.value)||1)))} style={S.inputFull} />
        </div>
        <div>
          <div style={S.lStyle}>Party Size {characters?.length > 0 && <span style={{ color:"rgba(200,149,42,.5)", marginLeft:4, textTransform:"none", letterSpacing:0, fontSize:8 }}>{characters.length} in party</span>}</div>
          <input type="number" min={1} max={10} value={partySize} onChange={e => setPartySize(Math.max(1,Math.min(10,parseInt(e.target.value)||4)))} style={S.inputFull} />
        </div>
        <div>
          <div style={S.lStyle}>Terrain</div>
          <select value={terrain} onChange={e => setTerrain(e.target.value)} style={S.inputFull}>
            {TERRAINS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div><GoldHover style={S.btnGold} onClick={generate}>✦ Suggest Encounters</GoldHover></div>

      {results.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1.5, color:"rgba(200,149,42,.5)", textTransform:"uppercase", borderBottom:"1px solid rgba(200,149,42,.15)", paddingBottom:6 }}>
            {results.length} Suggestions · Tier {band} · {partySize} Players
          </div>
          {results.map((r, i) => {
            const terrColor = TERRAIN_COLORS[r.terrain] || "#6a6a6a";
            return (
              <div key={i} style={{ ...S.panel, borderLeft:"3px solid var(--gold)" }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:9, color:"rgba(200,149,42,.5)" }}>{i+1}.</span>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, background:terrColor+"33", border:`1px solid ${terrColor}88`, color:terrColor, borderRadius:2, padding:"2px 8px", textTransform:"capitalize" }}>{r.terrain}</span>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:1, background:"rgba(200,149,42,.1)", border:"1px solid rgba(200,149,42,.3)", color:"var(--gold)", borderRadius:2, padding:"2px 8px" }}>Tier {r.band}</span>
                  <button onClick={() => onSaveNote({ id:genId(), text:`Encounter Idea [${r.terrain}, Tier ${r.band}]: ${r.encounter}`, createdAt:new Date().toISOString() })} style={{ ...S.btnGhost, marginLeft:"auto", padding:"2px 8px" }}>✦ Save</button>
                </div>
                <div style={{ fontFamily:"'IM Fell English',serif", fontSize:13, color:"var(--vel)", lineHeight:1.6, fontStyle:"italic" }}>{r.encounter}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Loot Generator ───────────────────────────────────────────────────────────

const CR_RANGES = ["0-1","2-4","5-8","9-12","13-16","17+"];
const RARITIES  = ["Any","Mundane","Uncommon","Rare","Very Rare"];

function LootGenerator({ onSaveNote }) {
  const [crRange, setCrRange] = useState("0-1");
  const [rarity, setRarity]   = useState("Any");
  const [items, setItems]     = useState([]);
  const [generated, setGenerated] = useState(false);

  function generate() { setItems(generateLoot({ crRange, rarity })); setGenerated(true); }

  function saveItem(item) {
    onSaveNote({ id:genId(), text:`Loot [CR ${crRange}]: ${item.name}${item.rarity&&item.rarity!=="Any"?` (${item.rarity})`:""}`, createdAt:new Date().toISOString() });
  }

  return (
    <div style={S.wrap}>
      <SectionHeader icon="💰" title="Loot Generator" />
      <div style={S.body}>
        <div style={S.row}>
          <div><div style={S.label}>CR Range</div><select style={S.select} value={crRange} onChange={e=>setCrRange(e.target.value)}>{CR_RANGES.map(r=><option key={r}>CR {r}</option>)}</select></div>
          <div><div style={S.label}>Rarity</div><select style={S.select} value={rarity} onChange={e=>setRarity(e.target.value)}>{RARITIES.map(r=><option key={r}>{r}</option>)}</select></div>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", paddingBottom:1 }}>
            <GoldHover style={S.btnGold} onClick={generate}>Roll Loot</GoldHover>
            {generated && <GhostHover style={S.btnGhost} onClick={generate}>🎲 Reroll</GhostHover>}
          </div>
        </div>
        {items.length > 0 && (
          <>
            <hr style={S.divider}/>
            {items.map((item, i) => (
              <div key={i} style={S.resultItem}>
                <span style={S.resultText}>{item.name}</span>
                {item.rarity && <span style={S.badgeRarity(item.rarity)}>{item.rarity}</span>}
                <GhostHover style={S.btnGhost} onClick={() => saveItem(item)}>✦ Save</GhostHover>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
              <GhostHover style={S.btnGhost} onClick={() => items.forEach(i => saveItem(i))}>✦ Save All</GhostHover>
            </div>
          </>
        )}
        {generated && items.length === 0 && <p style={S.noResults}>No loot found.</p>}
      </div>
    </div>
  );
}

// ─── Shop Inventory Generator ─────────────────────────────────────────────────

const SHOP_TYPES = ["General","Weapons","Armor","Potions","Magic","Black Market","Food"];

function ShopInventoryGenerator({ onSaveNote }) {
  const [shopType, setShopType] = useState("General");
  const [inventory, setInventory] = useState([]);
  const [generated, setGenerated] = useState(false);

  function generate() { setInventory(generateShopInventory({ shopType })); setGenerated(true); }

  function saveItem(item) {
    onSaveNote({ id:genId(), text:`Shop Item [${shopType}]: ${item}`, createdAt:new Date().toISOString() });
  }

  return (
    <div style={S.wrap}>
      <SectionHeader icon="🏪" title="Shop Inventory" />
      <div style={S.body}>
        <div style={S.row}>
          <div><div style={S.label}>Shop Type</div><select style={S.select} value={shopType} onChange={e=>setShopType(e.target.value)}>{SHOP_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", paddingBottom:1 }}>
            <GoldHover style={S.btnGold} onClick={generate}>Generate Inventory</GoldHover>
            {generated && <GhostHover style={S.btnGhost} onClick={generate}>🎲 Reroll</GhostHover>}
          </div>
        </div>
        {inventory.length > 0 && (
          <>
            <hr style={S.divider}/>
            {inventory.map((item, i) => (
              <div key={i} style={S.resultItem}>
                <span style={S.resultText}>{item}</span>
                <GhostHover style={S.btnGhost} onClick={() => saveItem(item)}>✦ Save</GhostHover>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
              <GhostHover style={S.btnGhost} onClick={() => inventory.forEach(i => saveItem(i))}>✦ Save All</GhostHover>
            </div>
          </>
        )}
        {generated && inventory.length === 0 && <p style={S.noResults}>No inventory available.</p>}
      </div>
    </div>
  );
}

// ─── Notes Scratchpad ─────────────────────────────────────────────────────────

function NotesScratchpad({ notes, onDeleteNote }) {
  const sorted = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  function fmtDate(iso) {
    try { const d = new Date(iso); return d.toLocaleDateString(undefined,{month:"short",day:"numeric"})+" "+d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"}); }
    catch { return ""; }
  }
  return (
    <div style={{ ...S.wrap, marginBottom:0 }}>
      <div style={S.header}>
        <div style={S.headerTitle}><span style={S.headerIcon}>📜</span>Notes Scratchpad</div>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, color:"rgba(200,149,42,.4)", letterSpacing:1 }}>{notes.length} {notes.length===1?"note":"notes"}</div>
      </div>
      <div style={S.body}>
        {sorted.length === 0 && <p style={S.noResults}>No notes yet. Use ✦ Save buttons above to add notes here.</p>}
        {sorted.map(note => (
          <div key={note.id} style={{ ...S.resultItem, flexDirection:"column", alignItems:"flex-start", gap:4 }}>
            <p style={{ ...S.resultText, lineHeight:1.5, wordBreak:"break-word", whiteSpace:"pre-line" }}>{note.text}</p>
            <div style={{ display:"flex", justifyContent:"space-between", width:"100%", alignItems:"center" }}>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:"rgba(245,230,200,.25)", letterSpacing:.5 }}>{fmtDate(note.createdAt)}</span>
              <DangerHover style={S.btnDanger} onClick={() => onDeleteNote(note.id)}>🗑 Delete</DangerHover>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const TABS = [
  { id:"npc",       label:"NPC Generator",    icon:"🧙" },
  { id:"locations", label:"Locations",         icon:"🗺" },
  { id:"combat",    label:"Combat Encounter",  icon:"⚔" },
  { id:"encounters",label:"Encounter Ideas",   icon:"🌐" },
  { id:"loot",      label:"Loot & Shop",       icon:"💰" },
  { id:"notes",     label:"Notes",             icon:"📜" },
];

function TabBar({ active, setActive }) {
  return (
    <div style={{ display:"flex", gap:0, borderBottom:"2px solid rgba(200,149,42,.25)", marginBottom:18, flexWrap:"wrap" }}>
      {TABS.map(t => (
        <button key={t.id} onClick={() => setActive(t.id)} style={{
          background: active===t.id ? "rgba(200,149,42,.1)" : "none",
          border: "none",
          borderBottom: active===t.id ? "2px solid var(--gold)" : "2px solid transparent",
          color: active===t.id ? "var(--gold)" : "rgba(200,149,42,.4)",
          cursor: "pointer",
          fontFamily: "'Cinzel',serif",
          fontSize: 8,
          letterSpacing: 1.5,
          padding: "10px 14px",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 5,
          transition: "all .15s",
          marginBottom: -2,
          whiteSpace: "nowrap",
        }}
        onMouseEnter={e => { if (active!==t.id) e.currentTarget.style.color="rgba(200,149,42,.75)"; }}
        onMouseLeave={e => { if (active!==t.id) e.currentTarget.style.color="rgba(200,149,42,.4)"; }}
        >
          <span style={{ fontSize:12 }}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Generators Component ────────────────────────────────────────────────

export default function Generators({
  generatorNotes,
  onSaveNote,
  onDeleteNote,
  characters,
  customMonsters,
  onSendToInitiative,
  onSaveToWiki,
  wiki,
}) {
  const [activeTab, setActiveTab] = useState("npc");
  const handleSaveNote = useCallback(note => onSaveNote(note), [onSaveNote]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"var(--gold)", fontSize:13, letterSpacing:3, textTransform:"uppercase", textAlign:"center", padding:"4px 0 18px", textShadow:"0 0 20px rgba(200,149,42,.4)" }}>
        ✦ Generators ✦
      </div>

      <TabBar active={activeTab} setActive={setActiveTab} />

      <div style={{ ...S.panel, minHeight:320 }}>
        {activeTab === "npc" && (
          <NPCGenerator onSaveNote={handleSaveNote} onSaveToWiki={onSaveToWiki} />
        )}
        {activeTab === "locations" && (
          <LocationGenerator onSaveNote={handleSaveNote} onSaveToWiki={onSaveToWiki} wiki={wiki} />
        )}
        {activeTab === "combat" && (
          <CombatEncounterGenerator
            characters={characters}
            customMonsters={customMonsters}
            onSendToInitiative={onSendToInitiative}
            onSaveNote={handleSaveNote}
          />
        )}
        {activeTab === "encounters" && (
          <EncounterSuggester characters={characters} onSaveNote={handleSaveNote} />
        )}
        {activeTab === "loot" && (
          <div>
            <LootGenerator onSaveNote={handleSaveNote} />
            <ShopInventoryGenerator onSaveNote={handleSaveNote} />
          </div>
        )}
        {activeTab === "notes" && (
          <NotesScratchpad notes={generatorNotes || []} onDeleteNote={onDeleteNote} />
        )}
      </div>
    </div>
  );
}
