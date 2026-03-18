// generatorTables.js
// Static data tables for DM Forge random generators (D&D 5e)

// ---------------------------------------------------------------------------
// NPC_NAMES
// ---------------------------------------------------------------------------

export const NPC_NAMES = {
  Human: {
    male: [
      "Aldric", "Bram", "Caelan", "Dorian", "Edric", "Fenn", "Gareth", "Hadwin",
      "Ivor", "Jasper", "Keiran", "Leland", "Merrick", "Niall", "Oswin", "Peregrine",
      "Quentin", "Rowan", "Stellan", "Tomas", "Ulric", "Vance", "Warren", "Xander",
      "Yorick", "Zane", "Aldous", "Brennan", "Caius", "Desmond"
    ],
    female: [
      "Aelys", "Brynn", "Calista", "Delia", "Elowen", "Fiona", "Gwendolyn", "Hilda",
      "Isolde", "Jana", "Kira", "Lirien", "Maren", "Nessa", "Orla", "Petra",
      "Quintessa", "Rowena", "Seraphina", "Talia", "Ursula", "Vivienne", "Willa",
      "Xanthe", "Yvaine", "Zara", "Amara", "Blythe", "Cressida", "Daphne"
    ],
    surname: [
      "Ashford", "Blackthorn", "Caldwell", "Dunmore", "Easton", "Fairchild",
      "Greymantle", "Hartwell", "Ironwood", "Jennings", "Kessler", "Lorne",
      "Mercer", "Nettleby", "Osborne", "Penngrove", "Quarry", "Redfield",
      "Sternwood", "Thorne", "Underhill", "Vance", "Whitmore", "Yarrow",
      "Aldgate", "Bramble", "Coldwater", "Duskmantle", "Emberton", "Foxgrove"
    ]
  },

  Elf: {
    male: [
      "Aerindel", "Brightwind", "Caladrel", "Daeren", "Erevan", "Faendal",
      "Galdor", "Haldir", "Ilyndrathyl", "Jhaeros", "Kevros", "Laucian",
      "Mirthal", "Naevys", "Oryn", "Paelias", "Quarion", "Riardon", "Soveliss",
      "Thamior", "Urbanus", "Varis", "Weth", "Xanaphia", "Yllaphion", "Zinnien",
      "Adran", "Berrian", "Carric", "Dandrel"
    ],
    female: [
      "Adrie", "Birel", "Caelynn", "Dara", "Enna", "Faral", "Gennal", "Holimion",
      "Ivaura", "Jelenneth", "Keyleth", "Leshanna", "Meriele", "Naivara",
      "Quelenna", "Ryllae", "Sariel", "Tannivh", "Uluvathar", "Valanthe",
      "Wrenaria", "Xanaphia", "Yalanue", "Zylvara", "Amyria", "Brindalle",
      "Cyriel", "Davaria", "Elara", "Filaurel"
    ],
    surname: [
      "Amakiir", "Brightwood", "Crystaldawn", "Dawntracker", "Erevan",
      "Forestmantle", "Galanodel", "Holimion", "Ilphelkiir", "Jelenneth",
      "Liadon", "Meliamne", "Nailo", "Ostoroth", "Parryn", "Quevar",
      "Rial", "Silverfrond", "Taurennil", "Ulondarr", "Virrea", "Windrivver",
      "Xiloscient", "Yeskov", "Zannis", "Aerdrie", "Brightmantle", "Coamenel",
      "Duskwalker", "Eveningstar"
    ]
  },

  Dwarf: {
    male: [
      "Adrik", "Alberich", "Baern", "Barendd", "Brottor", "Bruenor", "Dain",
      "Darrak", "Delg", "Eberk", "Einkil", "Fargrim", "Flint", "Gardain",
      "Harbek", "Kildrak", "Morgran", "Orsik", "Oskar", "Rangrim", "Rurik",
      "Taklinn", "Thoradin", "Thorin", "Tordek", "Traubon", "Travok",
      "Ulfgar", "Veit", "Vondal"
    ],
    female: [
      "Amber", "Artin", "Audhild", "Bardryn", "Dagnal", "Diesa", "Eldeth",
      "Falkrunn", "Finellen", "Gunnloda", "Gurdis", "Helja", "Hlin", "Kathra",
      "Kristryd", "Ilde", "Liftrasa", "Mardred", "Riswynn", "Sannl",
      "Torbera", "Torgga", "Vistra", "Brenat", "Corbela", "Dagna", "Engra",
      "Ferra", "Ghelda", "Hilga"
    ],
    surname: [
      "Balderk", "Battlehammer", "Boulderfoot", "Brasshammer", "Copperkettle",
      "Deepdelve", "Doomforged", "Fireforge", "Foehammer",
      "Giantbane", "Goblinbane", "Goldensword", "Gorunn", "Hammerfall",
      "Holderhek", "Ironforge", "Loderr", "Lutgehr", "Stiffbeard",
      "Stoneback", "Stoutale", "Torunn", "Ungart", "Coppermine",
      "Embertomb", "Granitefist", "Ironhewer", "Kavenhall", "Stonemeld", "Rocksplitter"
    ]
  },

  Halfling: {
    male: [
      "Alton", "Ander", "Cade", "Corrin", "Eldon", "Errich", "Finnan",
      "Garret", "Lindal", "Lyle", "Merric", "Milo", "Osborn", "Perrin",
      "Reed", "Roscoe", "Wellby", "Beau", "Cob", "Dunstan", "Fitch",
      "Holman", "Jasper", "Kes", "Laren", "Ned", "Pip", "Saradoc",
      "Tobold", "Wilibald"
    ],
    female: [
      "Andry", "Bree", "Callie", "Cora", "Euphemia", "Jillian", "Kithri",
      "Lavinia", "Lidda", "Merla", "Nedda", "Paela", "Portia", "Seraphina",
      "Shaena", "Trym", "Vani", "Verna", "Wella", "Amia", "Branda",
      "Contessa", "Daphne", "Elanor", "Fern", "Gloriana", "Hilda",
      "Jessamine", "Kyrie", "Lottie"
    ],
    surname: [
      "Brushgather", "Goodbarrel", "Greenbottle", "High-hill", "Hilltopple",
      "Leagallow", "Sandybanks", "Tealeaf", "Thorngage", "Tosscobble",
      "Underbough", "Warmwater", "Honeycomb", "Appleblossom", "Brandyfield",
      "Buttercup", "Cloverfield", "Dustyfoot", "Elmwood", "Fairmeadow",
      "Goldenrod", "Heatherwick", "Junipervale", "Kettleburn", "Lightfoot",
      "Merryweather", "Newbrook", "Oldbuck", "Proudneck", "Quickstep"
    ]
  },

  Gnome: {
    male: [
      "Alston", "Alvyn", "Boddynock", "Brocc", "Burgell", "Dimble", "Eldon",
      "Erky", "Fonkin", "Frug", "Gerbo", "Gimble", "Glim", "Jebeddo",
      "Kellen", "Namfoodle", "Orryn", "Roondar", "Seebo", "Sindri",
      "Warryn", "Wurp", "Zook", "Alvin", "Binwin", "Clonk", "Drevel",
      "Feebo", "Gidrik", "Hizzle"
    ],
    female: [
      "Bimpnottin", "Breena", "Caramip", "Carlin", "Donella", "Duvamil",
      "Ella", "Ellyjobell", "Ellywick", "Lilli", "Loopmottin", "Lorilla",
      "Mardnab", "Nissa", "Nyx", "Oda", "Orla", "Roywyn", "Shamil",
      "Tana", "Waywocket", "Zanna", "Alise", "Blee", "Crispin", "Dwiddle",
      "Enna", "Fizzle", "Glitter", "Hobkin"
    ],
    surname: [
      "Beren", "Daergel", "Folkor", "Garrick", "Nackle", "Murnig",
      "Ningel", "Raulnor", "Scheppen", "Turen", "Fizzlebang", "Gearsprocket",
      "Gimcrack", "Glittergold", "Goldwhisker", "Kettleburn", "Quillsharp",
      "Rumblebottom", "Sparkmantle", "Tinkerson", "Copperkettle",
      "Crystalvial", "Dustypage", "Embertinkle", "Flashwidget",
      "Gizmowick", "Hammerspring", "Inkwell", "Jinglebox", "Knickknack"
    ]
  },

  "Half-Orc": {
    male: [
      "Dench", "Feng", "Gell", "Henk", "Holg", "Imsh", "Keth", "Krusk",
      "Mhurren", "Ront", "Shump", "Thokk", "Brug", "Drash", "Gorbash",
      "Gralk", "Jarvik", "Karth", "Morg", "Narum", "Ragnok", "Skrag",
      "Targash", "Ugor", "Valkris", "Worg", "Zarkus", "Azog", "Bolg", "Gothmog"
    ],
    female: [
      "Baggi", "Emen", "Engong", "Kansif", "Myev", "Neega", "Ovak", "Ownka",
      "Shautha", "Sutha", "Vola", "Volen", "Yevelda", "Azgul", "Breka",
      "Darga", "Grish", "Harla", "Imog", "Kratha", "Marga", "Narka",
      "Ogda", "Roga", "Serka", "Torga", "Ultha", "Vorka", "Wugga", "Zarga"
    ],
    surname: [
      "Battleborn", "Bloodaxe", "Bonecrusher", "Darkeye", "Deathbringer",
      "Doombringer", "Duskmantle", "Fleshrender", "Giantslayer", "Goreblade",
      "Grimtusk", "Hardfist", "Ironblood", "Jawbreaker", "Killstrike",
      "Lifebane", "Mangledbrow", "Nightbane", "Ogrekin", "Painbringer",
      "Quickblade", "Razorfang", "Skullcleave", "Stonehide", "Tuskcrusher",
      "Urgrosh", "Vileblood", "Warbringer", "Xanthork", "Yarghul"
    ]
  },

  Tiefling: {
    male: [
      "Akmenos", "Amnon", "Barakas", "Damakos", "Ekemon", "Iados", "Kairon",
      "Leucis", "Melech", "Mordai", "Morthos", "Pelaios", "Skamos", "Therai",
      "Aesar", "Balan", "Cain", "Dagon", "Exethanter", "Forneus", "Graz",
      "Haures", "Ipos", "Janus", "Kirax", "Lyrist", "Malphas", "Naberus",
      "Oriax", "Phenex"
    ],
    female: [
      "Akta", "Anakis", "Bryseis", "Criella", "Damaia", "Ea", "Kallista",
      "Lerissa", "Makaria", "Nemeia", "Orianna", "Phelaia", "Rieta",
      "Semira", "Tanis", "Umara", "Vaela", "Xione", "Yeva", "Zara",
      "Adora", "Beleth", "Caress", "Devana", "Enarra", "Fyvus", "Gaele",
      "Hedia", "Ilaris", "Jynx"
    ],
    surname: [
      "Art", "Carrion", "Chant", "Creed", "Despair", "Excellence", "Fear",
      "Glory", "Hope", "Ideal", "Infamy", "Lament", "Lies", "Lust",
      "Mayhem", "Muse", "Nowhere", "Null", "Omen", "Open", "Pain",
      "Pandem", "Question", "Raven", "Reverence", "Sorrow", "Strife",
      "Torment", "Tragedy", "Vice"
    ]
  },

  Dragonborn: {
    male: [
      "Arjhan", "Balasar", "Bharash", "Donaar", "Ghesh", "Heskan", "Kriv",
      "Medrash", "Mehen", "Nadarr", "Pandjed", "Patrin", "Rhogar", "Shamash",
      "Shedinn", "Tarhun", "Torinn", "Akkan", "Balakar", "Durinn", "Essik",
      "Flavikar", "Gorastrix", "Hirrathak", "Ithquent", "Jarvithas", "Kanslar",
      "Lothkarr", "Makhatham", "Narvakian"
    ],
    female: [
      "Akra", "Biri", "Daar", "Farideh", "Harann", "Havilar", "Jheri",
      "Kava", "Korinn", "Mishann", "Nala", "Perra", "Raiann", "Sora",
      "Surina", "Thava", "Uadjit", "Vrinn", "Wrathet", "Yestarra",
      "Agath", "Bosenna", "Chalva", "Daana", "Edina", "Filinna", "Golrana",
      "Hiratha", "Imrath", "Jesmira"
    ],
    surname: [
      "Clethtinthiallor", "Daardendrian", "Delmirev", "Drachedandion",
      "Fenkenkabradon", "Kepeshkmolik", "Kerrhylon", "Kimbatuul", "Linxakasendalor",
      "Myastan", "Nemmonis", "Norixius", "Ophinshtalajiir", "Prexijandilin",
      "Shestendeliath", "Turnuroth", "Verthisathurgiesh", "Yarjerit",
      "Ashwing", "Blazeclaw", "Cinderscale", "Drakemaw", "Embercrest",
      "Frostbreath", "Goldenwing", "Infernoclaw", "Jadescale", "Korthak",
      "Lavastride", "Moonscale"
    ]
  },

  "Half-Elf": {
    male: [
      "Alaric", "Brethian", "Caelar", "Daeron", "Eadric", "Faelirin",
      "Gaelen", "Hadrel", "Ilryn", "Jareth", "Kaelen", "Laerel", "Maedhros",
      "Naethan", "Orvyn", "Phelan", "Quellan", "Raevan", "Silaen", "Taeral",
      "Urien", "Vaeren", "Wylsin", "Xaelian", "Yaevyn", "Zaelar",
      "Aedan", "Brannyn", "Corvin", "Drystan"
    ],
    female: [
      "Aeris", "Briallen", "Caela", "Daelith", "Eirwen", "Faela", "Galaen",
      "Helara", "Isara", "Jaelith", "Kaelia", "Laelith", "Maera", "Naelith",
      "Oraela", "Phaela", "Quaela", "Raelith", "Siara", "Taelia",
      "Uaela", "Vaelith", "Waelith", "Xaela", "Yaelith", "Zaela",
      "Alanis", "Brielle", "Cerris", "Dawnael"
    ],
    surname: [
      "Aelindra", "Brightmantle", "Crystalmere", "Dawnwood", "Evenstar",
      "Forestbrook", "Goldenleaf", "Halfblood", "Ironwood", "Jadeleaf",
      "Kinweave", "Leafmantle", "Moonbrook", "Nightveil", "Oakenshield",
      "Pinehaven", "Quicksilver", "Riverrun", "Silverleaf", "Twilightwood",
      "Underbough", "Valerian", "Willowmere", "Xenith", "Yearning",
      "Zephyrbloom", "Ambervale", "Birchwood", "Copperleaf", "Dawnmist"
    ]
  }
};

// ---------------------------------------------------------------------------
// LOOT_TABLES
// ---------------------------------------------------------------------------

export const LOOT_TABLES = {
  "0-1": {
    mundane: [
      "2d6 copper pieces",
      "1d4 silver pieces",
      "A tarnished brass button",
      "Worn leather gloves",
      "A clay jug of cheap wine",
      "Crude iron dagger, chipped edge",
      "Wooden shield, cracked",
      "Sling with 10 stones",
      "Torch and flint",
      "Hempen rope, 30 ft",
      "Rations for 2 days (stale)",
      "Candle stub and candleholder",
      "Small hunting knife",
      "A pouch of dried herbs",
      "Bone-handled eating knife",
      "Patched wool cloak",
      "Empty leather waterskin",
      "Sack of rotten vegetables",
      "Goblin-made shortbow (poor quality)",
      "Handful of iron caltrops"
    ],
    uncommon: [
      "Potion of Healing (2d4+2 hp)",
      "Potion of Climbing",
      "Spell Scroll — Cantrip: Mage Hand",
      "Potion of Animal Friendship",
      "Sending Stones (cracked, 1 use left)",
      "Bag of Tricks (1 figurine remaining)",
      "Immovable Rod (sticky button)",
      "Potion of Water Breathing",
      "Spell Scroll — 1st-level: Cure Wounds",
      "Dust of Disappearance (1 pinch)",
      "Hat of Disguise (fraying at brim)",
      "Rope of Climbing, 25 ft",
      "Spell Scroll — 1st-level: Shield",
      "Potion of Poison (disguised as healing)",
      "Goggles of Night",
      "Quiver of Ehlonna"
    ],
    rare: [
      "Spell Scroll — 2nd-level: Misty Step",
      "Wand of Magic Missiles (3 charges)",
      "Bag of Holding (torn seam, repaired)",
      "Boots of Elvenkind (size too large)",
      "Cloak of Elvenkind (moth-eaten)",
      "Gauntlets of Ogre Power",
      "Javelin of Lightning",
      "Sword of Vengeance (shortsword)",
      "Wand of Web (5 charges)",
      "Ring of Feather Falling"
    ],
    veryRare: []
  },

  "2-4": {
    mundane: [
      "4d6 silver pieces",
      "1d6 gold pieces",
      "A serviceable longsword",
      "Chain shirt, dented",
      "Heavy crossbow with 20 bolts",
      "Leather armor, well-oiled",
      "Potion of Healing (corked flask)",
      "20 arrows in a birch quiver",
      "Steel shield, scratched but sound",
      "Thieves' tools (incomplete set)",
      "Dungeoneer's pack",
      "Fine wool cloak with silver clasp",
      "Riding saddle and saddlebag",
      "A pouch of spell components",
      "Hourglass (brass)",
      "Set of fine clothes",
      "Whetstone and oil cloth",
      "Signal whistle (bone)",
      "Manacles and a key",
      "A hooded lantern"
    ],
    uncommon: [
      "Potion of Greater Healing (4d4+4 hp)",
      "Spell Scroll — 2nd-level: Suggestion",
      "+1 Ammunition (quiver of 10 arrows)",
      "Potion of Resistance — Fire",
      "Wand of Secrets (3 charges)",
      "Cloak of Protection",
      "Boots of the Winterlands",
      "Pearl of Power",
      "Ring of Swimming",
      "Pipes of Haunting",
      "Potion of Gaseous Form",
      "Gloves of Missile Snaring",
      "Spell Scroll — 2nd-level: Web",
      "Cap of Water Breathing",
      "Dimensional Shackles",
      "Bag of Tricks (gray)",
      "Eyes of the Eagle",
      "Saddle of the Cavalier",
      "Stone of Good Luck (Luckstone)",
      "Helm of Comprehending Languages"
    ],
    rare: [
      "+1 Longsword, pommel engraved with a lion",
      "+1 Shortsword with a serpent hilt",
      "+1 Shield, blazoned with a tower",
      "Spell Scroll — 4th-level: Polymorph",
      "Ring of Protection",
      "Amulet of Health",
      "Belt of Giant Strength — Hill (Str 21)",
      "Staff of the Adder",
      "Wand of Paralysis (5 charges)",
      "Ring of Evasion",
      "Flame Tongue Shortsword",
      "Necklace of Fireballs (4 beads)",
      "Boots of Striding and Springing",
      "Gauntlets of Ogre Power",
      "Cloak of the Manta Ray"
    ],
    veryRare: []
  },

  "5-8": {
    mundane: [
      "3d6 gold pieces",
      "1d4 x 10 gold pieces in a locked coffer",
      "A fine rapier, masterwork quality",
      "Half plate armor, dented pauldron",
      "A warhorse's leather barding",
      "Spellbook (10 random 1st-3rd level spells)",
      "A set of thieves' tools (complete)",
      "Potion of Healing x3",
      "2 Potions of Greater Healing",
      "Crossbow of quality make with 40 bolts",
      "A monocle set with a green gem",
      "A silk-lined travelling chest",
      "2 weeks of rations",
      "Navigator's tools and sea charts",
      "A heavy shield, heraldic crest",
      "Hunting trap (steel)",
      "A doctor's satchel with bandages",
      "A grappling hook and 50 ft rope",
      "Fine wine, crate of 12 bottles",
      "A military saddle with stirrups"
    ],
    uncommon: [
      "Potion of Superior Healing (8d4+8 hp)",
      "Spell Scroll — 3rd-level: Fireball",
      "Wind Fan",
      "Ring of Jumping",
      "Slippers of Spider Climbing",
      "Cloak of Elvenkind",
      "Boots of Elvenkind",
      "Gloves of Thievery",
      "Headband of Intellect",
      "Medallion of Thoughts",
      "Necklace of Adaptation",
      "Periapt of Wound Closure",
      "Pipes of the Sewers",
      "Ring of Mind Shielding",
      "Spell Scroll — 3rd-level: Dispel Magic",
      "Staff of the Python",
      "Wand of Magic Detection",
      "Wand of Web (7 charges)",
      "Wings of Flying",
      "Quaal's Feather Token — Tree"
    ],
    rare: [
      "+2 Longbow, carved from darkwood",
      "+1 Plate Armor, polished to a mirror sheen",
      "Flame Tongue Longsword",
      "Sun Blade (longsword form)",
      "Wand of Fireballs (7 charges)",
      "Staff of Healing (10 charges)",
      "Ring of Spell Storing (3 levels stored)",
      "Mantle of Spell Resistance",
      "Amulet of Health",
      "Belt of Hill Giant Strength",
      "Boots of Speed",
      "Bracers of Defense",
      "Staff of the Woodlands",
      "Wand of Lightning Bolts (7 charges)",
      "Cube of Force",
      "Horn of Blasting",
      "Carpet of Flying, 3 x 5 ft",
      "Daern's Instant Fortress (miniature)"
    ],
    veryRare: [
      "Amulet of the Planes (cracked face)",
      "Cloak of Displacement (faded)",
      "Staff of Fire (10 charges)",
      "Ring of Regeneration"
    ]
  },

  "9-12": {
    mundane: [
      "5d6 x 10 gold pieces in a locked iron chest",
      "A matched set of masterwork dueling blades",
      "Full plate armor, noble crest, custom fit",
      "4 Potions of Superior Healing",
      "A spellbook with 20 spells (1st-5th level)",
      "Navigator's charts of the known seas",
      "An alchemist's traveling laboratory",
      "A fine lute with gold inlay",
      "Jeweller's tools and a velvet gem pouch",
      "War drums and military standard",
      "A set of engraved dice and card decks",
      "A noble's travel wardrobe (10 fine outfits)",
      "A portable writing desk and full supplies",
      "Six horses worth of military barding",
      "Siege engineer's plans and tools",
      "A case of rare alchemical reagents",
      "Months of rations for 10 soldiers",
      "A chest of foreign trade goods",
      "A carved ivory chess set",
      "A warhorse barded in chain"
    ],
    uncommon: [
      "Potion of Supreme Healing (10d4+20 hp)",
      "Spell Scroll — 5th-level: Cone of Cold",
      "Arrow of Slaying — Dragon",
      "Armor of Gleaming (any light armor)",
      "Helm of Telepathy",
      "Medallion of Thoughts",
      "Periapt of Health",
      "Ring of Animal Influence",
      "Sending Stone (pair)",
      "Spell Scroll — 5th-level: Wall of Force",
      "Wand of Secrets (7 charges)",
      "Instrument of the Bards — Canaith Mandolin",
      "Guardian Emblem",
      "Moon-Touched Greatsword",
      "Bead of Nourishment (x10)",
      "Dread Helm",
      "Pot of Awakening",
      "Pole of Collapsing",
      "Earring of Message",
      "Cloak of Many Fashions"
    ],
    rare: [
      "+2 Shortsword, whittled from bone",
      "Nine Lives Stealer (longsword)",
      "Ring of Spell Storing (5 levels stored)",
      "Staff of Striking (10 charges)",
      "Berserker Axe (+1)",
      "Dwarven Thrower (warhammer)",
      "Ioun Stone — Awareness",
      "Mace of Smiting",
      "Oathbow",
      "Ring of Free Action",
      "Ring of X-ray Vision",
      "Spellguard Shield",
      "Staff of the Woodlands (10 charges)",
      "Sword of Wounding (longsword)",
      "Hag Eye",
      "Belt of Dwarvenkind"
    ],
    veryRare: [
      "Amulet of the Planes",
      "Cloak of Displacement",
      "Crystal Ball (telepathy variant)",
      "Helm of Brilliance (10 charges)",
      "Manual of Bodily Health",
      "Ring of Regeneration",
      "Ring of Shooting Stars",
      "Robe of Eyes",
      "Staff of Frost (10 charges)",
      "Tome of Clear Thought"
    ]
  },

  "13-16": {
    mundane: [
      "4d6 x 100 gold pieces in a vault",
      "A full suit of adamantine plate",
      "A library of 500 rare arcane texts",
      "8 Potions of Supreme Healing",
      "A case of legendary vintage wine, 50 bottles",
      "Complete alchemical workshop (portable)",
      "A chest of gemstones (10,000 gp total)",
      "Rare spell components worth 5,000 gp",
      "The deed to a small castle",
      "Maps of uncharted dungeon complexes",
      "Antique armor bearing a legendary house crest",
      "A ship fully crewed and provisioned",
      "Masterwork weapons for an entire company",
      "A gilded chariot with trained warhorses",
      "Enchanted forge capable of working mithral",
      "Rare alchemical reagents (multiple chests)",
      "Thousands of gold coins in a magical vault",
      "A stuffed roc's egg, decorative",
      "A merchant fleet's manifests and cargo",
      "A magical menagerie of 3 rare creatures"
    ],
    uncommon: [
      "Spell Scroll — 7th-level: Plane Shift",
      "Instrument of the Bards — Cli Lyre",
      "Ring of Warmth",
      "Spell Scroll — 6th-level: Chain Lightning",
      "Wand of Wonder (7 charges)",
      "Carpet of Flying, 4 x 6 ft",
      "Helm of Teleportation (3 charges)",
      "Ioun Stone — Protection",
      "Mantle of Spell Resistance",
      "Amulet of the Devout (+2)",
      "Moon Sickle (+2)",
      "Arcane Grimoire (+2)",
      "Rod of the Pact Keeper (+2)",
      "Wand of the War Mage (+2)",
      "Spellwrought Tattoo (5th level)",
      "Spell Scroll — 8th-level: Sunburst",
      "Charm of Plant Command",
      "Ring of Spell Turning",
      "Rhythm-Maker's Drum (+2)",
      "Holy Avenger — Longsword"
    ],
    rare: [
      "+3 Longsword, dragonsteel blade",
      "+3 Breastplate, rune-inscribed",
      "Luck Blade (longsword, 1 wish remaining)",
      "Sword of Answering (greatsword)",
      "Vorpal Sword (longsword, tarnished)",
      "Rod of Lordly Might",
      "Wand of Polymorph (7 charges)",
      "Ring of Djinni Summoning",
      "Ring of Three Wishes (1 wish)",
      "Ioun Stone — Mastery",
      "Tome of the Stilled Tongue",
      "Apparatus of Kwalish (deactivated)",
      "Cubic Gate",
      "Belt of Giant Strength — Storm",
      "Staff of the Magi (partial charges)"
    ],
    veryRare: [
      "Deck of Many Things (full 22-card deck)",
      "Efreeti Bottle",
      "Iron Flask (trapped devil inside)",
      "Sphere of Annihilation (with talisman)",
      "Staff of the Magi (full charges)",
      "Well of Many Worlds (folded up)",
      "Tome of Leadership and Influence",
      "Manual of Quickness of Action",
      "Robe of the Archmagi (gray)",
      "Ring of Three Wishes (2 wishes)"
    ]
  },

  "17+": {
    mundane: [
      "A dragon's hoard (50,000+ gp in coins and gems)",
      "The treasury of a fallen kingdom",
      "Priceless artworks looted from a dozen nations",
      "A dwarven vault sealed for 500 years",
      "Rare spell components worth 50,000 gp",
      "Libraries of divine texts and forbidden lore",
      "The regalia of a lost empire",
      "100 Potions of Supreme Healing",
      "A fleet of ships in a private harbor",
      "Ownership of an entire city district",
      "Secret maps to other planes of existence",
      "Hundreds of pre-drawn ritual circles",
      "A menagerie of legendary beasts",
      "Warehouses of exotic goods from every plane",
      "Deeds to multiple noble estates",
      "The life's work of a legendary archmage",
      "A colosseum and all gladiators' contracts",
      "Entire merchant conglomerate's assets",
      "The accumulated wealth of an abolished thieves' guild",
      "A living dungeon complex as property"
    ],
    uncommon: [
      "Spell Scroll — 9th-level: Wish",
      "Instrument of the Bards — Anstruth Harp",
      "Ioun Stone — Greater Absorption",
      "Spell Scroll — 9th-level: True Resurrection",
      "Ring of Elemental Command — Fire",
      "Talisman of Pure Good",
      "Talisman of Ultimate Evil",
      "Amulet of the Planes (pristine)",
      "Horn of Valhalla (iron)",
      "Manual of Golems — Flesh",
      "Wand of Orcus",
      "Eye of Vecna",
      "Hand of Vecna",
      "Staff of Power (full charges)",
      "Tome of the Stilled Tongue (full power)"
    ],
    rare: [
      "+3 Vorpal Greatsword, dragon-slayer's weapon",
      "+3 Plate Armor of Resistance (all damage types)",
      "Luck Blade (3 wishes remaining)",
      "Ring of Wishes (3 wishes)",
      "Staff of the Magi (50 charges)",
      "Rod of Resurrection (full charges)",
      "Sphere of Annihilation and its Talisman",
      "Deck of Many Things (full deck, sealed)",
      "Tome of Understanding",
      "Manual of Bodily Health (pristine)",
      "Robe of the Archmagi (white)",
      "Cubic Gate (all 6 planes accessible)",
      "Iron Flask (trapped demon lord)",
      "Candle of Invocation (attuned to deity)",
      "Scarab of Protection (12 charges)"
    ],
    veryRare: [
      "Artifact: Axe of the Dwarvish Lords",
      "Artifact: Book of Exalted Deeds",
      "Artifact: Book of Vile Darkness",
      "Artifact: Eye of Vecna",
      "Artifact: Hand of Vecna",
      "Artifact: Orb of Dragonkind",
      "Artifact: Rod of Seven Parts (all pieces)",
      "Artifact: Sword of Kas",
      "Artifact: Wand of Orcus",
      "Artifact: Blackrazor",
      "Artifact: Wave (trident)",
      "Artifact: Whelm (warhammer)",
      "Artifact: The Deck of Many Things (mythic)",
      "Artifact: The Regalia of Might",
      "Artifact: Crown of Might"
    ]
  }
};

// ---------------------------------------------------------------------------
// RANDOM_ENCOUNTER_TABLES
// ---------------------------------------------------------------------------

export const RANDOM_ENCOUNTER_TABLES = {
  forest: {
    "1-4": [
      "1d6+2 Goblins ambush from the treeline, cackling",
      "A wounded deer staggers across the path — something hunted it",
      "2d4 Wolves circle the party, hungry and bold",
      "A lone Bandit demands toll at a rickety bridge",
      "A Druid tends an injured fox and warns of hunters ahead",
      "1d4 Giant Spiders drop from the canopy",
      "A hollow tree hides a Kobold scout nest (3d6 Kobolds inside)",
      "An abandoned campfire still warm, blood near the bedrolls",
      "A Sprite offers to guide the party toward a hidden grove — for a price",
      "1d4 Stirges emerge from a hollow log at dusk"
    ],
    "5-10": [
      "A Green Hag poses as an old woodcutter",
      "2d6 Hobgoblins march in formation through the underbrush",
      "An Owlbear defends her nest of 1d3 eggs",
      "A Dryad pleads for help — loggers threaten her tree",
      "1d4 Will-o'-Wisps lure the party toward a bog",
      "A band of 2d4+2 Bandits with a Bandit Captain waylay the road",
      "A Displacer Beast stalks the rear of the party",
      "A fallen giant oak conceals a Gnoll pack's lair (2d8 Gnolls)",
      "A wounded ranger, poisoned by drow darts, stumbles into camp",
      "1d3 Ankhegs burst from the earthen path"
    ],
    "11-16": [
      "An Ancient Tree Blight rises to defend the forest",
      "A Treant demands the party explain their presence",
      "A pack of 1d4 Werewolves hunts under the full moon",
      "A Green Dragon wyrmling has claimed a clearing as territory",
      "2d6 Yuan-ti Purebloods on a ritual collection mission",
      "The Wild Hunt rides — a Unicorn is their quarry",
      "A Vampire Spawn feeds on a traveler and flees if threatened",
      "A corrupted Dryad commands the forest against intruders",
      "A Medusa lives in a ruined temple surrounded by statue-adventurers",
      "A Behir has made its lair in a ravine crossing the only path"
    ],
    "17+": [
      "An Ancient Green Dragon surveys her domain from the canopy",
      "A Demon (Glabrezu) has been summoned into the heartwood",
      "The spirit of a fallen forest god is restless and enraged",
      "A Kraken cult has secretly defiled a sacred grove",
      "A Lich's phylactery is hidden in a tree hollow — undead swarm to protect it",
      "A Fey lord demands blood tribute for safe passage",
      "An Avatar of Nature manifests to cleanse a corruption",
      "A Storm Giant hermit mistakes the party for poachers",
      "2d6 Vampire Spawn with a Vampire lord lead a blood hunt",
      "A planar rift has opened, spilling demons into the forest"
    ]
  },

  dungeon: {
    "1-4": [
      "1d8 Skeleton archers guard a sealed door",
      "A Gelatinous Cube silently fills a corridor",
      "2d6 Giant Rats swarm from a crumbled wall",
      "A Goblin boss and 2d4 minions argue over a map",
      "A pressure plate triggers a swinging log trap",
      "1d4 Zombies in moldering robes wander aimlessly",
      "A locked iron door with faint moaning on the other side",
      "A Kobold trap-setter flees when spotted, leading toward a pit",
      "A half-open sarcophagus contains a Specter",
      "1d6 Stirges roost in a collapsed ceiling section"
    ],
    "5-10": [
      "A Mimic poses as a treasure chest at the end of a corridor",
      "2d4 Ghouls feast in a charnel pit beneath a grate",
      "A Gargoyle perches motionless above an archway",
      "An Orc war-band (2d6 Orcs + 1 Eye of Gruumsh) pillages a vault",
      "A trapped room begins filling with sand through ceiling slits",
      "1d3 Shadows emerge from darkened alcoves",
      "A Duergar patrol of 1d4+2 moves in magical silence",
      "A Basilisk has turned a previous adventuring party to stone",
      "A trapped Djinni in a sealed urn — freed, it's grateful; attacked, it's furious",
      "A Carrion Crawler lurks on the ceiling of a wide hall"
    ],
    "11-16": [
      "A Beholder tyrant rules the lower vaults and demands tribute",
      "2d4 Wraiths guard an ancient crypt of failed kings",
      "A Mind Flayer colony has an outpost here — 1d4 Illithids and 2d6 Thralls",
      "A Dragon Turtle has been sealed in a flooded vault",
      "A Mummy Lord awakens at the party's footfall",
      "A trapped Pit Fiend bargains for freedom with cursed knowledge",
      "2d6 Vampire Spawn protect a coffin in a sealed chamber",
      "A Death Knight patrols the fallen throne room",
      "An Iron Golem follows ancient instructions to prevent all passage",
      "A Dao has enslaved the inhabitants of an entire dungeon level"
    ],
    "17+": [
      "A Lich holds court in the deepest chamber",
      "A demon lord's avatar has claimed the dungeon as a beachhead",
      "The dungeon is actually a sleeping Zaratan — and it's waking",
      "A Dracolich guards its phylactery room",
      "An Elder Brain has subverted every creature in the dungeon",
      "A imprisoned Balor tests those who find it — only the worthy may pass",
      "A God's divine echo has warped the lowest level into a demiplane",
      "Archlich Acererak's construct army patrols the final tomb",
      "A Tarrasque was sealed here centuries ago and cracks are forming",
      "A Gate to the Nine Hells is fully open"
    ]
  },

  urban: {
    "1-4": [
      "A pickpocket bumps into the party; 1d4 gp goes missing",
      "2d4 city guard confront the party for carrying visible weapons",
      "A merchant's cart overturns, spilling exotic goods into the street",
      "A Spy tails the party at a discreet distance",
      "A barroom brawl spills into the street (2d6 Commoners fighting)",
      "A beggar secretly delivers a cryptic message",
      "A wanted poster bearing a party member's likeness",
      "A fire breaks out in a nearby building with people trapped inside",
      "1d4 Thugs demand protection money from a vendor",
      "A street preacher calls out the party by name in a prophecy"
    ],
    "5-10": [
      "A Doppelganger has replaced a city official — uncovered mid-conversation",
      "A thieves' guild enforcer warns the party to stop asking questions",
      "A disguised Succubus runs an information brokerage",
      "2d4 Cultists perform a ritual in a sealed warehouse",
      "An alchemist's experiment explodes; mutant rats flood the street",
      "A corrupt Watch Captain arrests a party member on false charges",
      "A Vampire Spawn picks off citizens at night; the Watch denies it",
      "A blackmail scheme implicates a local noble — and the party is blamed",
      "A half-mad wizard's animated constructs run amok in the market",
      "Every informant the party trusted has been compromised by a spy network"
    ],
    "11-16": [
      "A Mind Flayer mastermind runs the city's crime syndicate from the shadows",
      "An Archmage's tower has been invaded; rogue magic warps nearby streets",
      "A Night Hag has corrupted the city's dream-catchers; insomnia spreads",
      "A Rakshasa has assumed the identity of a beloved noble",
      "An Assassin with Mage support has a contract on a party member",
      "A planar rift opens in the city square — demons pour through",
      "The city's thieves' guild is secretly a Zhentarim front",
      "A Vampire lord has turned half the city council",
      "A Stone Golem runs amok after its wizard controller was murdered",
      "A dragon extorts the city; the mayor hires the party as negotiators"
    ],
    "17+": [
      "A Lich has been posing as the city's arcane chancellor for decades",
      "A demon lord's cult is one ritual away from opening a permanent gate",
      "An ancient red dragon demands tribute — or the city burns at dawn",
      "A divine avatar walks the streets judging the souls of inhabitants",
      "The entire city guard is thralled to a vampire lord",
      "A god of deception has hidden their chosen artifact in the city vaults",
      "An army of undead besieges the walls, raised from the city's own dead",
      "A Tarrasque has been spotted approaching from the plains",
      "A planar war between celestials and fiends erupts in the noble district",
      "A reality storm from a failed Wish spell reshapes the city block by block"
    ]
  },

  mountain: {
    "1-4": [
      "1d4 Giant Eagles wheel overhead; one swoops at pack animals",
      "A rockslide triggered by 2d6 Kobolds above the path",
      "An Aarakocra scout demands to know the party's intentions",
      "1d6 Orcs have sheltered in a mountain cave and block passage",
      "A blizzard descends with shocking speed — find shelter or suffer",
      "A mountain goat herd is unusually aggressive, corrupted by fey magic",
      "A lone dwarf prospector has found something — and is being followed",
      "2d4 Bandits control a narrow mountain pass",
      "A Harpy sings from a crag above, attempting to lure stragglers",
      "A hidden crevasse swallows one party member's horse"
    ],
    "5-10": [
      "A Griffon nest blocks the only pass; 1d4 Griffons defend it",
      "An Ettin argues with itself at a crossroads",
      "A Stone Giant meditates at a sacred stone circle; intruders unwelcome",
      "1d4 Manticores roost in ruins of an old watchtower",
      "A Frost Giant's hunting party has gone off-range and is lost",
      "A tribe of Goliaths demands the party prove worth before passing",
      "A Chimera's lair is in the only cave shelter on the mountain",
      "1d3 Wyverns attack the party on an exposed ridge",
      "An Air Elemental, bound by a broken talisman, rages across the peak",
      "A pack of 2d4 Winter Wolves hunts the trail"
    ],
    "11-16": [
      "A Roc has claimed the summit and attacks any who near it",
      "A Cloud Giant's castle drifts past — they invite the party aboard",
      "A Frost Giant jarl leads a raiding party down from the peak",
      "A young White Dragon guards a mountain pass as her territory",
      "A Storm Giant hermit has been driven mad by isolation",
      "A Purple Worm surfaces on a slope, hunting",
      "A clan of Fire Giants mines deep beneath the mountain",
      "A Dragon Turtle sleeps in the volcanic crater at the peak",
      "A Djinni offers passage — for a year of service",
      "An Adult White Dragon descends from her lair to investigate intruders"
    ],
    "17+": [
      "An Ancient White Dragon rules the entire range and everything within it",
      "A Titan is imprisoned in the mountain itself — the seal is weakening",
      "A Storm Giant king sits in judgment of the party's quest",
      "A god of mountains has withdrawn divine favor; the peaks shake with rage",
      "A rift to the Elemental Plane of Air has opened at the summit",
      "A Lich's lair has been carved inside the glacier",
      "An Empyrean has chosen this mountain as the site of a divine trial",
      "A convergence of Storm, Cloud, and Frost Giants holds a formal Ordning council",
      "A Dracolich nests within the volcanic peak",
      "Primordial earth spirits have been awakened by mining and are furious"
    ]
  },

  coastal: {
    "1-4": [
      "A Merfolk scout surfaces and demands to speak with the party",
      "2d6 Bandits (sea raiders) beach their longboat and attack",
      "A wounded sailor washes ashore from a wrecked merchant vessel",
      "1d4 Giant Crabs emerge from rock pools at low tide",
      "A Harpy flock wheels over a nearby crag",
      "A wrecked ship hull holds a locked cargo hold with Ghoul guards",
      "Thick sea fog rolls in; 2d6 Shadows move within it",
      "A Sea Hag bargains with desperate fishermen nearby",
      "A strange pulsing light beneath the waves signals something ancient",
      "1d6 Sahuagin drag a fishing boat beneath the surf"
    ],
    "5-10": [
      "A Pirate Captain and crew (2d6 pirates) beach for supplies",
      "A Storm Giant's footprint discovered at low tide — enormous and fresh",
      "A Bronze Dragon patrols the coast in dolphin form",
      "2d4 Merrow raid a tidal village",
      "A Sea Hag coven controls the local lighthouse",
      "A water-logged Ghost haunts the wreck of a famous warship",
      "1d4 Water Elementals spill from a broken binding circle",
      "A Hydra has a den in a sea cave accessible only at low tide",
      "A Sahuagin war-band of 2d8 scouts the beach for invasion routes",
      "A Kraken's tentacle rises to drag a beached whale — and the party — down"
    ],
    "11-16": [
      "A Marid inhabits an undersea palace and demands tribute from coastal towns",
      "A Dragon Turtle extorts a major shipping lane",
      "An ancient Aboleth holds court in a flooded sea cave",
      "A vampire lord's ghost ship sails these waters",
      "A Storm Giant patriarch commands a hurricane to prove a point",
      "A Kraken cult sacrifices sailors to summon their god",
      "2d6 Sahuagin led by a Baron assault a coastal keep",
      "A Bronze Dragon has gone feral after losing her eggs",
      "A planar rift beneath the waves leaks water from the Elemental Plane",
      "An undead armada approaches; a Lich admiral commands from the flagship"
    ],
    "17+": [
      "A Kraken rises — the sea churns for miles in every direction",
      "An Ancient Bronze Dragon has allied with a Storm Giant against a common foe",
      "A divine tempest manifests; the party is at the center",
      "A planar gate to the Elemental Plane of Water opens mid-ocean",
      "An Aboleth elder has psionically enslaved an entire coastal city",
      "A Leviathan older than the gods circles these waters",
      "A god of the sea demands the party retrieve a stolen divine trident",
      "A fleet of ghost ships crewed by the damned blockades the port",
      "A Dracolich inhabits the deepest sea trench",
      "The sea itself rises in revolt as primordial water spirits awaken"
    ]
  },

  plains: {
    "1-4": [
      "A herd of 2d6 horses stampedes toward the party",
      "2d4 Bandits ride down the road at speed",
      "A lone Gnoll hyena trails the party — its pack is not far behind",
      "A prairie fire burns toward the party from the west",
      "A broken wagon and its dead merchant — not yet cold",
      "1d4 Giant Eagles wheel overhead; a Halfling scout rides one",
      "A Centaur patrol questions the party's business in their territory",
      "2d6 Hobgoblins march in disciplined formation on the road",
      "A lightning storm strikes with no shelter in sight",
      "A Dust Mephit emerges from a spinning dust devil"
    ],
    "5-10": [
      "A Gnoll pack of 2d8 with a Flind leader raids a farmstead",
      "A Bulette surfaces under the road, hungry",
      "An Ankheg colony's mounds pepper a field — one erupts underfoot",
      "A Centaur chieftain demands a challenge of skill to pass",
      "2d6 Yuan-ti Purebloods pose as traveling merchants",
      "A Displacer Beast stalks a merchant caravan",
      "A Wyvern pair nests in an abandoned windmill",
      "1d4 Pegasi flee something enormous approaching from the north",
      "A thunderstorm summons 1d4 Air Elementals",
      "A Hobgoblin Iron Shadow assassin targets a party member"
    ],
    "11-16": [
      "A Hill Giant and 2d4 Ogres demolish a roadside inn",
      "A Cyclops wanders off its course, confused and dangerous",
      "A Lamia poses as a noblewoman stranded in a carriage",
      "A clan of Fire Giants marches to war",
      "An Adult Blue Dragon circles overhead, inspecting the road",
      "A Gorgon (iron bull) blocks the only road for miles",
      "2d6 Gnoll Fang of Yeenoghu under a Flind perform a ritual sacrifice",
      "A Nightmare steed runs loose; its rider died in a ditch",
      "A Roc shadow passes over — it's circling back",
      "A Storm Giant challenges the party to a riddle contest"
    ],
    "17+": [
      "An Ancient Blue Dragon taxes everything that moves on these plains",
      "A Titan strides across the plain on a divine errand",
      "A Lich's undead army marches directly toward the party",
      "A Tarrasque rises from the earth in the distance",
      "A divine war spills from the Upper Planes onto this field",
      "A Storm Giant king and his retinue descend from a cloud castle",
      "A Pit Fiend leads a devil army staging from an infernal gate",
      "The plains themselves animate as a primordial earth spirit wakes",
      "A pair of Ancient Dragons contest territory — the party is in the middle",
      "An Empyrean tests a champion; the party is the champion"
    ]
  },

  swamp: {
    "1-4": [
      "2d6 Bullywugs ambush from beneath the murky water",
      "A Will-o'-Wisp lures the party off the safe path",
      "Quicksand ahead — 1 party member sinks before it's noticed",
      "A Poisonous Snake drops from a branch overhead",
      "1d4 Lizardfolk observe from the reeds, unmoving",
      "A Troll lurches from beneath a rope bridge",
      "A Crocodile lunges from the water as the party fords a stream",
      "A witch's hut on stilts — smoke from the chimney signals she's home",
      "A Shambling Mound rises from a pile of rotting vegetation",
      "Swamp gas ignites near a torch; the explosion draws attention"
    ],
    "5-10": [
      "A Black Dragon wyrmling demands treasure to let the party cross her bog",
      "A Hag coven (three Green Hags) tricks the party into a bargain",
      "A Lizardfolk shaman and 2d8 warriors guard a sacred idol",
      "A Hydra has colonized the only ford for miles",
      "2d4 Yuan-ti Malisons conduct a dark ritual on a mossy altar",
      "A Bullywug King and his court demand tribute — in live frogs",
      "A Ghost wails in a sunken ruin; it will not rest until a wrong is righted",
      "A Swamp Troll and her hungry young block the trail",
      "A Banshee haunts the permanent fog bank at the swamp's center",
      "1d4 Merrow have moved into the swamp upriver from the sea"
    ],
    "11-16": [
      "An Adult Black Dragon holds court in a drowned fortress",
      "A Demi-Lich's phylactery lies in the heart of the swamp",
      "A Coven of Night Hags harvests nightmare essence from slumbering travelers",
      "An Aboleth has claimed a flooded temple as its psionic throne",
      "A Death Knight wades the swamp seeking penance",
      "2d6 Lizardfolk Champions defend a dragon turtle's nesting ground",
      "A Yuan-ti Anathema leads a serpent cult ritual",
      "A corrupted Treant commands the whole swamp against intruders",
      "A Vampiric mist drifts across the bog at dusk",
      "A Clay Golem sunk in the mud, reactivated by the party's approach"
    ],
    "17+": [
      "An Ancient Black Dragon, oldest in the region, has awakened from decades of sleep",
      "Juiblex, The Faceless Lord, oozes through the mire",
      "A Lich's ruined tower slowly sinks into the swamp; she does not care",
      "A god of decay has cursed this swamp; everything that enters begins to rot",
      "A Kraken migrated inland via a flooded river — it's hungry",
      "A planar rift to the Abyss seeps filth and demons into the swamp",
      "An undead army lies dormant in the bog — a signal will wake them",
      "An Elder Oblex has consumed every mind in a 10-mile radius",
      "A Demiplane of rot opens in the deepest part of the swamp",
      "The swamp is actually the corpse of an ancient primordial — and it is moving"
    ]
  },

  underdark: {
    "1-4": [
      "2d6 Kobolds wielding poisoned darts ambush from cracks in the wall",
      "A Myconid circle silently requests parley — and offers fungal tea",
      "A cave-in blocks the tunnel; 1d4 creatures are trapped beneath the rubble",
      "A patch of Yellow Mold covers the only path forward",
      "1d4 Giant Centipedes nest in a collapsed camp",
      "A lone Deep Gnome (Svirfneblin) flees from something behind him",
      "A Piercer drops from the ceiling as the party passes underneath",
      "2d4 Duergar prospectors claim this tunnel as their own",
      "Glowing fungi mark a path — to safety or to a trap",
      "A blind Troglodyte patrol smells the party before it sees them"
    ],
    "5-10": [
      "A Mind Flayer Elder Brain tendril reaches out, probing nearby minds",
      "2d6 Drow Warriors with a Drow Priestess escort a slave column",
      "A Cloaker poses as a stalactite above the party's campsite",
      "A Roper patiently waits at the center of a natural bridge",
      "A Beholder Zombie shambles through a ruined Duergar outpost",
      "1d4 Hook Horrors hunt in coordinated pack tactics",
      "A Drow House ambush — 2d8 Warriors and 1d4 Giant Spiders",
      "An Intellect Devourer hunts a separated party member",
      "A Ghost of a long-dead dwarf explorer warns of treachery ahead",
      "A Grick Alpha and 2d4 Gricks colonize a dead-end side tunnel"
    ],
    "11-16": [
      "A Mind Flayer Arcanist with 2d6 Intellect Devourers patrols the tunnel",
      "An Aboleth's psychic call resonates through a vast underground lake",
      "A Beholder demands all creatures in her domain swear an oath of service",
      "The Drow Matron of House Xorlarrin seeks a specific artifact the party holds",
      "A Dao has enslaved an entire Duergar city",
      "A Death Knight and undead legion march toward the surface",
      "A Fomorian king and his entourage of Giants trek through a mega-tunnel",
      "A Shadow Dragon has claimed a section of the Underdark as her lair",
      "A Mind Flayer Elder Brain has established a new colony; thralls swarm outward",
      "A fallen planetar seeks to drag the wicked to judgment"
    ],
    "17+": [
      "Demogorgon's rift has crept into the Underdark; madness spreads in its wake",
      "An Elder Brain Absolute controls every thrall in a 30-mile radius",
      "Lolth's Avatar descends to personally oversee a critical ritual",
      "A Dracolich has awakened in the Underdark's deepest level",
      "The Vault of the Drow is in open civil war; the party is caught between factions",
      "Juiblex rises from a primordial pool; nothing organic is safe",
      "An imprisoned deity's prison cracks — divine energy warps reality around it",
      "A convergence of Beholder hive clusters goes to war for dominance",
      "A Gate to Mechanus has opened; inevitables march through, judging all chaos",
      "The primordial earth itself stirs beneath the Underdark"
    ]
  }
};

// ---------------------------------------------------------------------------
// SHOP_INVENTORIES
// ---------------------------------------------------------------------------

export const SHOP_INVENTORIES = {
  general: {
    items: [
      "Backpack (leather), 2 gp",
      "Bedroll, 1 gp",
      "Blanket (heavy wool), 5 sp",
      "Candles x10, 1 sp",
      "Chalk (one piece), 1 cp",
      "Crowbar (iron), 2 gp",
      "Flask of Oil (lamp oil, 1 pint), 1 sp",
      "Grappling Hook (iron), 2 gp",
      "Hammer (standard), 1 gp",
      "Healer's Kit (10 uses), 5 gp",
      "Hooded Lantern (brass), 5 gp",
      "Iron Pot (cast, 2-quart), 2 gp",
      "Mess Kit (tin), 2 sp",
      "Mirror, small steel, 5 gp",
      "Pitons x10, 5 sp",
      "Pouch, leather, 5 sp",
      "Rations, 1 day (hard tack and dried meat), 5 sp",
      "Rope, hempen (50 ft), 1 gp",
      "Rope, silk (50 ft), 10 gp",
      "Sack, burlap x5, 1 cp each",
      "Sealing Wax, 5 sp",
      "Signal Whistle (bone), 5 cp",
      "Spyglass (scratched lens), 500 gp",
      "Tent, two-person (canvas), 2 gp",
      "Tinderbox (flint, steel, tinder), 5 sp",
      "Torches x10, 1 sp",
      "Vial, glass (empty), 1 gp",
      "Waterskin (leather, 4-pint), 2 sp",
      "Whetstone, 1 cp",
      "Writing Kit (ink, quill, 10 sheets parchment), 12 gp"
    ]
  },

  weapons: {
    items: [
      "Club (hardwood, studded), 1 sp",
      "Dagger (iron, boot knife), 2 gp",
      "Dagger (silver-plated blade), 25 gp",
      "Greataxe (heavy, double-bitted), 30 gp",
      "Greatsword (hand-and-a-half), 50 gp",
      "Handaxe (hatchet), 5 gp",
      "Javelins x5 (iron-tipped), 5 sp each",
      "Light Crossbow with 20 bolts, 35 gp",
      "Longbow (yew, reinforced), 50 gp",
      "Longsword (standard military, plain), 15 gp",
      "Longsword (engraved blade, lion pommel), 40 gp",
      "Mace (flanged, steel), 5 gp",
      "Morningstar (iron), 15 gp",
      "Quarterstaff (ironwood), 2 sp",
      "Rapier (dueling, swept hilt), 25 gp",
      "Scimitar (curved cavalry blade), 25 gp",
      "Shortbow with 20 arrows, 30 gp",
      "Shortsword (straight double-edged), 10 gp",
      "Spear (iron-tipped ash shaft), 1 gp",
      "Trident (fishing-style, balanced), 5 gp",
      "War Pick (heavy mining pick), 5 gp",
      "Warhammer (flanged, heavy), 15 gp",
      "Whip (leather, 10 ft reach), 2 gp",
      "Arrows x20 (goose-feather fletching), 1 gp",
      "Crossbow Bolts x20, 1 gp",
      "Blowgun with 10 needles, 10 gp",
      "Darts x10 (iron tip), 5 cp each",
      "Sling with 20 bullets, 1 sp",
      "Hand Crossbow, 75 gp",
      "Net (weighted), 1 gp"
    ]
  },

  armor: {
    items: [
      "Padded Armor (quilted linen), 5 gp",
      "Leather Armor (boiled and hardened), 10 gp",
      "Studded Leather Armor (iron rivets), 45 gp",
      "Hide Armor (bear hide, rough), 10 gp",
      "Chain Shirt (riveted, short-sleeved), 50 gp",
      "Scale Mail (bronze scales, heavy), 50 gp",
      "Breastplate (burnished steel), 400 gp",
      "Half Plate (steel pauldrons and greaves), 750 gp",
      "Ring Mail (iron rings), 30 gp",
      "Chain Mail (full suit, riveted), 75 gp",
      "Splint Armor (vertical iron strips), 200 gp",
      "Plate Armor (full suit, fitted — 1 week delivery), 1,500 gp",
      "Shield, wooden (round, iron boss), 7 gp",
      "Shield, steel (kite, heraldic blank), 20 gp",
      "Shield, tower (heavy, full-body cover), 35 gp",
      "Helmet (open-faced, iron), 8 gp",
      "Helmet (visored, steel), 20 gp",
      "Gauntlets (leather, padded), 4 gp",
      "Gauntlets (plate, articulated fingers), 50 gp",
      "Greaves (lower leg armor, steel), 30 gp",
      "Vambraces (forearm guards, bronze), 15 gp",
      "Gorget (throat guard), 5 gp",
      "Pauldrons (pair, steel), 25 gp",
      "Brigandine Coat (iron plates sewn into cloth), 100 gp",
      "Lamellar Armor (lacquered bone), 120 gp",
      "Armor Repair Kit (oil, rivets, tools), 10 gp",
      "Padding Underlayer (linen arming doublet), 3 gp",
      "Buckler (small off-hand shield), 5 gp",
      "Cloak with Hidden Chainmail Lining, 150 gp",
      "Custom Plate Order Deposit (noble quality, custom fit), 2,000 gp"
    ]
  },

  potions: {
    items: [
      "Potion of Healing (2d4+2 hp), 50 gp",
      "Potion of Greater Healing (4d4+4 hp), 100 gp",
      "Potion of Superior Healing (8d4+8 hp), 500 gp",
      "Potion of Climbing (1 hour), 75 gp",
      "Potion of Water Breathing (1 hour), 120 gp",
      "Potion of Resistance — Fire (1 hour), 150 gp",
      "Potion of Resistance — Cold (1 hour), 150 gp",
      "Potion of Resistance — Lightning (1 hour), 150 gp",
      "Potion of Gaseous Form (1 hour), 250 gp",
      "Potion of Giant Strength — Hill (8 hours, Str 21), 400 gp",
      "Potion of Invisibility (1 hour), 350 gp",
      "Potion of Speed (1 minute, haste effect), 400 gp",
      "Potion of Heroism (1 hour, bless + 10 temp hp), 250 gp",
      "Potion of Mind Reading (10 minutes), 200 gp",
      "Potion of Flying (1 hour), 500 gp",
      "Oil of Slipperiness (8 hours, grease effect), 175 gp",
      "Oil of Etherealness (1 hour), 1,000 gp",
      "Philter of Love (1 hour charm), 90 gp — kept behind the counter",
      "Antitoxin (1 use, advantage vs. poison saves), 50 gp",
      "Elixir of Health (cures disease and poison), 300 gp",
      "Potion of Vitality (removes exhaustion, maximizes hit dice healing), 960 gp",
      "Universal Solvent (destroys any adhesive), 600 gp",
      "Sovereign Glue (permanent adhesive, 1 oz), 500 gp",
      "Bottled Breath (one use of fresh air in poisonous environments), 10 gp",
      "Potion of Enlarge (as Enlarge/Reduce, large form, 1 min), 80 gp",
      "Potion of Reduce (as Enlarge/Reduce, small form, 1 min), 80 gp",
      "Potion of Animal Friendship (24 hours), 80 gp",
      "Potion of Poison (2d4+2 dmg, disguised as Healing), 100 gp — 'discounted'",
      "Dark Elixir (unknown origin, suspicious green color) 15 gp — proprietor won't say what it does",
      "Potion of Supreme Healing (10d4+20 hp), 1,350 gp — special order"
    ]
  },

  magic: {
    items: [
      "Sending Stones (pair), 250 gp",
      "Bag of Holding (500 lb capacity), 2,500 gp",
      "Cloak of Protection (+1 AC and saves, attunement), 3,500 gp",
      "Boots of Elvenkind (silent movement, attunement), 2,500 gp",
      "Goggles of Night (darkvision 60 ft), 1,500 gp",
      "Rope of Climbing (60 ft, animate on command), 2,000 gp",
      "Hat of Disguise (alter self at will, attunement), 5,000 gp",
      "Ring of Swimming (swim speed 40 ft), 1,200 gp",
      "Immovable Rod (holds in place up to 8,000 lb), 5,000 gp",
      "+1 Longsword (plain, no attunement required), 1,000 gp",
      "+1 Shortsword (drow-make, black steel), 1,000 gp",
      "+1 Longbow (carved holly, no attunement required), 1,000 gp",
      "+1 Chain Mail (rune-marked), 1,500 gp",
      "+1 Shield (hammered steel, celestial rune), 1,500 gp",
      "Wand of Magic Missiles (7 charges, no attunement), 1,500 gp",
      "Spell Scroll — Fireball (3rd level), 300 gp",
      "Spell Scroll — Misty Step (2nd level), 150 gp",
      "Spell Scroll — Cure Wounds (1st level), 50 gp",
      "Spell Scroll — Detect Magic (1st level), 50 gp",
      "Spell Scroll — Identify (1st level), 50 gp",
      "Spell Scroll — Counterspell (3rd level), 300 gp",
      "Periapt of Wound Closure (stabilizes, double hit dice healing, attunement), 5,000 gp",
      "Necklace of Adaptation (breathe in any environment, attunement), 2,000 gp",
      "Headband of Intellect (Int 19 while worn, attunement), 8,000 gp",
      "Pearl of Power (1/day recover a spell slot up to 3rd level, attunement), 6,000 gp",
      "Eyes of Charming (3/day charm person, attunement), 3,000 gp",
      "Wand of Secrets (3 charges, detect secret doors), 1,500 gp",
      "Stone of Good Luck (Luckstone, +1 checks and saves, attunement), 4,200 gp",
      "Eversmoking Bottle (thick smoke 60 ft radius), 1,000 gp",
      "Bag of Tricks — Gray (figurines, 3/week), 500 gp"
    ]
  },

  blackmarket: {
    items: [
      "Dust of Disappearance (3d6 rounds invisibility, group), 200 gp",
      "Dust of Dryness (absorbs 15 gallons of water), 100 gp",
      "Dust of Sneezing and Choking (creature incapacitated — ask no questions), 150 gp",
      "Necklace of Strangulation (cursed, attunes and never releases) 200 gp — sold as 'Necklace of Protection'",
      "Bag of Devouring (cursed Bag of Holding mimic) 500 gp — labeled as Bag of Holding",
      "Berserker Axe (+1, cursed berserk, attunement) 800 gp — sold as +2 Axe",
      "Philter of Love (charm creature for 1 hour), 150 gp",
      "Poison, Basic (vial, 1d4 poison damage per hit for 1 minute), 100 gp",
      "Poison, Midnight Tears (24-hour delay, then 9d6 poison damage), 1,500 gp",
      "Poison, Serpent Venom (vial, 3d6 poison, Con save DC 11), 200 gp",
      "Assassin's Blood Poison (1d12 damage + poisoned condition, DC 10), 150 gp",
      "Drow Poison (unconscious for 1 hour, DC 13), 200 gp per dose",
      "Malice Poison (paralyzed for 1 hour, DC 15), 250 gp per dose",
      "Wyvern Poison (7d6 poison damage, DC 15), 1,200 gp",
      "Forged Writ of Noble Authority (convincing forgery), 500 gp",
      "Forged Guild License (merchant seal, city-specific), 200 gp",
      "Stolen Trade Goods (spices, no questions asked), 30 gp",
      "Spell Scroll — Animate Dead (3rd level, blood-inked), 500 gp",
      "Tattoo of the Fang (uncommon magic tattoo, attunement — applied on premises), 400 gp",
      "Map to a rumored treasure vault (authenticity not guaranteed), 100 gp",
      "Disguise Kit (theatrical quality, includes masks and pigments), 25 gp",
      "Sending Stone — tapped (a third party hears all messages), 100 gp",
      "Stolen Holy Symbol of Tymora (possibly cursed), 50 gp",
      "Unregistered Teleportation Circle Schematic (3 coordinates), 2,000 gp",
      "Tracker's Charm (locates wearer — meant to be slipped onto a target unknowingly), 300 gp",
      "Silence Charm (dampens local magic detection for 1 hour), 300 gp"
    ]
  },

  food: {
    items: [
      "Ale, mug (common local brew), 4 cp",
      "Ale, gallon jug (inn-grade), 2 sp",
      "Banquet Meal per person (roast, wine, dessert), 10 gp",
      "Bread, loaf (fresh rye), 2 cp",
      "Cheese, wedge (aged hard), 1 sp",
      "Chicken, whole roasted, 3 sp",
      "Common Meal (stew, bread, ale), 1 sp",
      "Good Meal (roast, vegetables, wine), 5 sp",
      "Inn Stay — common room, per night, 5 sp",
      "Inn Stay — private room, per night, 8 sp",
      "Exotic Spices (1 oz, saffron), 15 gp",
      "Fine Wine, bottle (Waterdhavian vintage), 10 gp",
      "Fine Wine, bottle (imported Elven vintage), 30 gp",
      "Fish, smoked (whole side), 3 sp",
      "Game Bird, plucked and dressed, 4 sp",
      "Halfling Pipe-Weed, 1 oz pouch, 5 sp",
      "Honey, jar (1 lb), 5 sp",
      "Meat, pound of salt-cured pork, 3 sp",
      "Pastry, meat pie (fresh-baked), 5 cp",
      "Rations, 1 day (trail mix, jerky, hardtack), 5 sp",
      "Rations, 1 day (quality — preserved vegetables and meat), 1 gp",
      "Salt, pound, 5 cp",
      "Spirit, strong (dwarven whiskey, flask), 4 sp",
      "Spirit, very strong (orcish fire-gut, flask — may require Con save), 2 sp",
      "Sugar, pound (fine white), 2 sp",
      "Tea, exotic blend (dried herbs, a merchant's secret), 1 gp",
      "Vegetable Basket (turnips, carrots, onions), 5 cp",
      "Waybread (elvish, counts as 1 day's rations, lasts months), 8 gp — rare stock",
      "Coffee, Zhent-import, cup, 5 cp",
      "Exotic Fruit (Dragon Pepper — causes 1d4 fire damage if eaten raw; shopkeeper grins), 3 cp"
    ]
  }
};
