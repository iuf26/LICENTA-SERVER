const { default: axios } = require("axios");
const fs = require("fs");

const mapForArtistId = (resp) => {
  return resp.artists.items[0].id;
};

const artists = [
  "Lorde",
  "Avicii",
  "Katy Perry",
  "Beyoncé",
  "Miley Cyrus",
  "Imagine Dragons",
  "Eminem",
  "Pitbull",
  "Daft Punk",
  "OneRepublic",
  "Ellie Goulding",
  "One Direction",
  "Lady Gaga",
  "Pharrell",
  "Drake",
  "Shakira",
  "Bruno Mars",
  "Jason Derülo",
  "Calvin Harris",
  "Bastille",
  "Arctic Monkeys",
  "Macklemore & Ryan Lewis",
  "Lana Del Rey",
  "Martin Garrix",
  "Rihanna",
  "Demi Lovato",
  "Robin Thicke",
  "Zedd",
  "Passenger",
  "Stromae",
  "U2",
  "Justin Timberlake",
  "John Newman",
  "John Legend",
  "Britney Spears",
  "Lily Allen",
  "Capital Cities",
  "Ed Sheeran",
  "Katy B",
  "David Guetta",
  "P!nk",
  "Taylor Swift",
  "Kid Ink",
  "will.i.am",
  "James Blunt",
  "Enrique Iglesias",
  "Adele",
  "Bruce Springsteen",
  "A Great Big World",
  "London Grammar",
  "Idina Menzel",
  "The Verve",
  "Broken Bells",
  "Rudimental",
  "Justin Bieber",
  "Romeo Santos",
  "Linkin Park",
  "Klingande",
  "Fall Out Boy",
  "The Beatles",
  "Flo Rida",
  "Tiësto",
  "Marteria",
  "AWOLNATION",
  "Avril Lavigne",
  "Kendrick Lamar",
  "Little Mix",
  "Icona Pop",
  "The XX",
  "Arcade Fire",
  "Bombay Bicycle Club",
  "Marc Anthony",
  "The Neighbourhood",
  "Birdy",
  "Clean Bandit",
  "Disclosure",
  "Haim",
  "Selena Gomez",
  "Chris Brown",
  "CHVRCHES",
  "Prince Royce",
  "Luke Bryan",
  "Warpaint",
  "The 1975",
  "Aloe Blacc",
  "Sara Bareilles",
  "Afrojack",
  "Mike Will Made-It",
  "Milky Chance",
  "Tom Odell",
  "Vampire Weekend",
  "Radiohead",
  "Coldplay",
  "Mariah Carey",
  "Red Hot Chili Peppers",
  "Maroon 5",
  "Florida Georgia Line",
  "AC/DC",
  "Ariana Grande",
  "Queen",
  "Kanye West",
  "Pink Floyd",
  "Metallica",
  "Beck",
  "Mika",
  "Kylie Minogue",
  "Daddy Yankee",
  "You Me At Six",
  "Exo",
  "Nirvana",
  "The Lumineers",
  "Howard Shore",
  "Nicki Minaj",
  "American Authors",
  "Showtek",
  "James Arthur",
  "Olly Murs",
  "Foster the People",
  "Blake Shelton",
  "Macklemore",
  "Vance Joy",
  "Paramore",
  "Keith Urban",
  "The Fray",
  "Eric Church",
  "Hardwell",
  "Lady Antebellum",
  "Busta Rhymes",
  "Behemoth",
  "Within Temptation",
  "Ylvis",
  "Kings of Leon",
  "Indila",
  "The Killers",
  "Dvbbs",
  "Robbie Williams",
  "Guns N' Roses",
  "Jason Aldean",
  "Christina Aguilera",
  "비",
  "Led Zeppelin",
  "Naughty Boy",
  "Alicia Keys",
  "Pearl Jam",
  "Mumford and Sons",
  "Giorgia",
  "Maitre Gim's",
  "Laura Pausini",
  "Austin Mahone",
  "Michael Jackson",
  "Major Lazer",
  "Christina Perri",
  "Childish Gambino",
  "소녀시대",
  "Fleetwood Mac",
  "Muse",
  "Jennifer Lopez",
  "George Ezra",
  "Bob Marley",
  "Fergie",
  "Bliss n Eso",
  "동방신기",
  "安室奈美恵",
  "SHINee",
  "David Bisbal",
  "Of Monsters and Men",
  "PHANTOGRAM",
  "Tinie Tempah",
  "John Mayer",
  "Sam Smith",
  "Alligatoah",
  "Neon Jungle",
  "The Rolling Stones",
  "B.o.B",
  "Zac Brown Band",
  "J. Cole",
  "Daughtry",
  "Fatboy Slim",
  "5 Seconds Of Summer",
  "Green Day",
  "Adel Tawil",
  "M83",
  "Jay-Z",
  "IU",
  "AKB48",
  "G-Dragon",
  "Lil Wayne",
  "Zendaya",
  "Gorgon City",
  "Cage the Elephant",
  "Steve Aoki",
  "Michael Bublé",
  "ABBA",
  "Inna",
  "Panic! At the Disco",
  "Kacey Musgraves",
  "Ricky Martin",
  "Paul McCartney",
  "DJ Fresh",
  "Trey Songz",
  "A$AP Rocky",
  "Fauve",
  "JHene Aiko",
  "Oasis",
  "Jorge & Mateus",
  "Marco Mengoni",
  "T-Pain",
  "Kristen Bell",
  "Young The Giant",
  "Sub Focus",
  "Sun Kil Moon",
  "Florence + The Machine",
  "Revolverheld",
  "B1A4",
  "Vamps",
  "Psy",
  "Wiz Khalifa",
  "Sophie Ellis-Bextor",
  "The Black Keys",
  "Cash Cash",
  "R. Kelly",
  "Cole Swindell",
  "Elisa",
  "Bon Iver",
  "Madonna",
  "Empire of the Sun",
  "Mogwai",
  "Schoolboy Q",
  "Gorillaz",
  "The National",
  "Sunidhi Chauhan",
  "Pablo Alboran",
  "Swedish House Mafia",
  "Franz Ferdinand",
  "SEKAI NO OWARI",
  "Anitta",
  "Black Sabbath",
  "Jesse & Joy",
  "Brantley Gilbert",
  "Goo Goo Dolls",
  "Nickelback",
  "Juanes",
  "Shreya Ghoshal",
  "Johnny Cash",
  "MKTO",
  "Luan Santana",
  "Rick Ross",
  "Tyga",
  "Sunrise Avenue",
  "Bon Jovi",
  "Malú",
  "Chase & Status",
  "Woodkid",
  "Foo Fighters",
  "Evanescence",
  "Pixies",
  "Yo Yo Honey Singh",
  "Armin van Buuren",
  "Band of Horses",
  "La Oreja de Van Gogh",
  "A.R. Rahman",
  "Dimitri Vegas",
  "Carly Rae Jepsen",
  "Phoenix",
  "Queens of the Stone Age",
  "Switchfoot",
  "Flume",
  "The Glitch Mob",
  "Two Door Cinema Club",
  "Rascal Flatts",
  "David Bowie",
  "Sevyn Streeter",
  "The Band Perry",
  "Avenged Sevenfold",
  "The John Butler Trio",
  "Emeli Sande",
  "30 Seconds to Mars",
  "Skrillex",
  "Perfume",
  "Sage The Gemini",
  "Cher",
  "Dolly Parton",
  "The Smiths",
  "ALTJ",
  "Whitney Houston",
  "Mr. Probz",
  "Temples",
  "The Script",
  "Kelly Clarkson",
  "東方神起",
  "Lykke Li",
  "MGMT",
  "Dani Martín",
  "Daughter",
  "2NE1",
  "Fuse ODG",
  "Lupe Fiasco",
  "Kodaline",
  "Ke$ha",
  "Casting Crowns",
  "Dierks Bentley",
  "Helene Fischer",
  "miss A",
  "James Blake",
  "Mohit Chauhan",
  "Arijit Singh",
  "4minute",
  "OutKast",
  "BigBang",
  "Depeche Mode",
  "Thalia",
  "Jake Bugg",
  "Eros Ramazzotti",
  "Plan B",
  "Zoé",
  "Banda Sinaloense MS de Sergio Lizárraga",
  "System of a Down",
  "Elyar Fox",
  "Juicy J",
  "The White Stripes",
  "Colbie Caillat",
  "The Piano Guys",
  "Metronomy",
  "Hunter Hayes",
  "50 Cent",
  "August Alsina",
  "Rosanne Cash",
  "Paula Fernandes",
  "Céline Dion",
  "The Wanted",
  "시크릿",
  "Alan Jackson",
  "Hillsong United",
  "Moby",
  "The Notorious B.I.G.",
  "Thomas Rhett",
  "NxZero",
  "Reik",
  "Cats on Trees",
  "지아",
  "LIGABUE",
  "Andrea Bocelli",
  "Tegan and Sara",
  "Bob Dylan",
  "Fernando & Sorocaba",
  "Nicky Romero",
  "Fly Project",
  "David Nail",
  "Fitz & The Tantrums",
  "The Doors",
  "blink-182",
  "Shankar Mahadevan",
  "2Pac",
  "Alejandro Fernández",
  "2 Chainz",
  "Maxïmo Park",
  "Sonu Nigam",
  "Somo",
  "Ciara",
  "Wilkinson",
  "西野カナ",
  "Nine Inch Nails",
  "Future",
  "Serebro",
  "Havana Brown",
  "Deorro",
  "Vasco Rossi",
  "Fettes Brot",
  "The Cure",
  "Wale",
  "Dillon Francis",
  "Keane",
  "Eric Clapton",
  "Lucas Lucco",
  "Klangkarussell",
  "Jack Johnson",
  "Cristiano Araújo",
  "LMFAO",
  "K.will",
  "Skillet",
  "Calibre 50",
  "Usher",
  "Danielle Bradbery",
  "Leona Lewis",
  "Gloria Trevi",
  "Girl's Day",
  "Jessie J",
  "Tim McGraw",
  "Max Pezzali",
  "Ivete Sangalo",
  "Neon Trees",
  "Thompson Square",
  "Amy Winehouse",
  "Alessandra Amoroso",
  "Voz De Mando",
  "きゃりーぱみゅぱみゅ",
  "Faul & Wad Ad vs. Pnau",
  "DVBBS & Borgeous",
  "Krewella",
  "Darius Rucker",
  "BAP",
  "Tim Bendzko",
  "ATB",
  "Neil Young",
  "Five Finger Death Punch",
  "Dum Dum Girls",
  "Ricardo Arjona",
  "K. Michelle",
  "Don Omar",
  "Abel Pintos",
  "Modà",
  "Eric Paslay",
  "Pentatonix",
  "Placebo",
  "Lata Mangeshkar",
  "BlasterJaxx",
  "Neil Finn",
  "Toni Braxton",
  "Alex Hepburn",
  "Cris Cab",
  "Guy Sebastian",
  "INXS",
  "Alesso",
  "2PM",
  "Santana",
  "Aerosmith",
  "Sheryl Crow",
  "James Vincent McMorrow",
  "Kid Cudi",
  "Ludacris",
  "Julien Doré",
  "Atif Aslam",
  "Hozier",
  "The Strokes",
  "My Chemical Romance",
  "コブクロ",
  "Against Me!",
  "Sportfreunde Stiller",
  "Rebecca Ferguson",
  "Rasmus Seebach",
  "Zezé Di Camargo & Luciano",
  "Kaiser Chiefs",
  "Foals",
  "The Jezabels",
  "Akon",
  "Ahzee",
  "Frank Ocean",
  "Dappy",
  "Lindsey Stirling",
  "The Allman Brothers Band",
  "Apink",
  "Family of the Year",
  "Tal",
  "Vitaa",
  "Big Sean",
  "miwa",
  "Frankie Ballard",
  "New World Sound",
  "Sean Paul",
  "Editors",
  "AAA",
  "Yellow Claw",
  "Def Leppard",
  "The Weeknd",
  "Peter Maffay",
  "Yo Gotti",
  "Joy Division",
  "Gusttavo Lima",
  "Lynyrd Skynyrd",
  "Emma",
  "Kim Cesarion",
  "Григорий Лепс",
  "Emma Marrone",
  "Manuel Carrasco",
  "Pet Shop Boys",
  "Eagles",
  "Frank Sinatra",
  "태양",
  "Massive Attack",
  "田馥甄",
  "Gary",
  "A Day to Remember",
  "Banda El Recodo De Cruz Lizárraga",
  "Alejandro Sanz",
  "Сергей Лазарев",
  "Sky Ferreira",
  "Bring Me the Horizon",
  "T.I.",
  "Lea Michele",
  "Nina Nesbitt",
  "Iron Maiden",
  "Bob Sinclar",
  "AOA",
  "Sorriso Maroto",
  "The Offspring",
  "Boyzone",
  "M.I.A.",
  "Tamar Braxton",
  "EXILE",
  "휘성",
  "As Animals",
  "St. Vincent",
  "Snow Patrol",
  "Cassadee Pope",
  "Gabrielle Aplin",
  "O Rappa",
  "Randy Houser",
  "Scotty McCreery",
  "Turma do Pagode",
  "Gerardo Ortiz",
  "Elton John",
  "Tame Impala",
  "EXO-M",
  "Scandal",
  "Jon Pardi",
  "Natalia Kills",
  "Bunbury",
  "Half Moon Run",
  "Cro",
  "Río Roma",
  "R.E.M.",
  "Max Herre",
  "Thiaguinho",
  "Modest Mouse",
  "Tiromancino",
  "The Aston Shuffle",
  "Kavinsky",
  "Moderat",
  "中島美嘉",
  "Claudia Leitte",
  "Jeff Bernat",
  "Sleeping With Sirens",
  "Jagjit Singh",
  "Martin Solveig",
  "Asaf Avidan & the Mojos",
  "Carlos Vives",
  "Marco Borsato",
  "Jovanotti",
  "Young Jeezy",
  "Yeah Yeah Yeahs",
  "Bakermat",
  "효린",
  "John Lennon",
  "Eli Young Band",
  "The Pretty Reckless",
  "Blur",
  "Duke Dumont",
  "the GazettE",
  "Mika Singh",
  "Limp Bizkit",
  "Amrinder Gill",
  "Todd Terje",
  "Twenty One Pilots",
  "YUKI",
  "加藤ミリヤ",
  "Phil Collins",
  "Korn",
  "The Smashing Pumpkins",
  "Charli XCX",
  "Dixie Chicks",
  "Taylor Henderson",
  "EXO-K",
  "サカナクション",
  "Will Sparks",
  "Yiruma",
  "Leiva",
  "Nas",
  "Angel Olsen",
  "윤하",
  "Glee Cast",
  "Shania Twain",
  "Ola",
  "Left Boy",
  "Janelle Monáe",
  "Jennifer Rostock",
  "Andy Mineo",
  "fun.",
  "Chet Faker",
  "Nightwish",
  "MercyMe",
  "Pat Metheny",
  "Gramatik",
  "Willie Nelson",
  "Ева Польна",
  "KREVA",
  "Boy & Bear",
  "Chris Malinchak",
  "Donna Summer",
  "Washed Out",
  "Booka Shade",
  "Above & Beyond",
  "Simple Plan",
  "Bushido",
  "Sebastian Ingrosso",
  "Grimes",
  "ゆず",
  "Glenn Morrison",
  "The Preatures",
  "UVERworld",
  "Die Toten Hosen",
  "Kishore Kumar",
  "2Cellos",
  "싸이",
  "Mac Miller",
  "Sigur Rós",
  "Fedde Le Grand",
  "Nene Malo",
  "Cnblue",
  "Passion Pit",
  "Silversun Pickups",
  "Storm Queen",
  "Garth Brooks",
  "Schandmaul",
  "Bee Gees",
  "Eminem feat Rihanna",
  "Gary Barlow",
  "Asha Bhosle",
  "가인",
  "Ana Tijoux",
  "Periphery",
  "五月天",
  "浜崎あゆみ",
  "Cheek",
  "GOT7",
  "Carole King",
  "Iced Earth",
  "SKE48",
  "Faul & Wad Ad",
  "Fababy",
  "Negramaro",
  "家入レオ",
  "Tyrese",
  "Banda Los Recoditos",
  "Sander van Doorn",
  "Ирина Аллегрова",
  "THE SECOND from EXILE",
  "Dir en grey",
  "Miguel",
  "Shaan",
  "Mount Kimbie",
  "Michel Teló",
  "Thaeme & Thiago",
  "360",
  "T.O.P",
  "孫燕姿",
  "Ани Лорак",
  "Simon & Garfunkel",
  "Estopa",
  "Justin Moore",
  "The Who",
  "Veronica Maggio",
  "Mister You",
  "Serena Ryder",
  "Los bunkers",
  "Timbaland",
  "Karmin",
  "JoJo",
  "Sido",
  "Espinoza Paz",
  "Dal★shabet",
  "Chlöe Howl",
  "Casseurs Flowters",
  "Danny Brown",
  "Péricles",
  "Sharon Jones and the Dap-Kings",
  "Irie Révoltés",
  "Ivo Mozart",
  "Sistar",
  "Arash",
  "The Cranberries",
  "ASAP Ferg",
  "Jenni Rivera",
  "Imany",
  "Dr. Dre",
  "걸스데이",
  "Cœur De Pirate",
  "Sia",
  "RADWIMPS",
  "Migos",
  "Casper",
  "Toby Keith",
  "Weezer",
  "Eduardo Costa",
  "Asgeir",
  "Marilyn Manson",
  "Chitãozinho & Xororó",
  "Anuradha Paudwal",
  "CPM 22",
  "ClariS",
  "Vicentico",
  "Azealia Banks",
  "Ne-Yo",
  "Abraham Mateo",
  "Bodybangers",
  "Aline Barros",
  "Michele Bravi",
  "flower",
  "Frei.Wild",
  "Melendi",
  "Pritam",
  "Fedez",
  "The Black Eyed Peas",
  "Red Foo",
  "Diplo",
  "sakanaction",
  "Deep Purple",
  "New Politics",
  "Gotye",
  "LUNA SEA",
  "Death Cab for Cutie",
  "Damien Jurado",
  "Scooter",
  "Of Mice & Men",
  "J Balvin",
  "Papon",
  "VIXX",
  "MISIA",
  "Architects",
  "Journey",
  "Mandisa",
  "L.O.C.",
  "Tycho",
  "Rizzle Kicks",
  "The Naked And Famous",
  "Lake Street Dive",
  "Paloma Faith",
  "Manna Dey",
  "Hello Sleepwalkers",
  "Cat Stevens",
  "KANA-BOON",
  "Transatlantic",
  "tobyMac",
  "Phillip Phillips",
  "Brad Paisley",
  "Broilers",
  "The Airborne Toxic Event",
  "Julion Alvarez y Su Norteno Banda",
  "Loreen",
  "Aiko",
  "Xavier Naidoo",
  "George Michael",
  "The Kooks",
  "Juan Magan",
  "La Fouine",
  "Skylar Grey",
  "Beatrice Egli",
  "E-Girls",
  "Rod Stewart",
  "Dulce María",
  "Antonis Remos",
  "Shaka Ponk",
  "애프터스쿨",
  "Farid Bang",
  "Rage Against the Machine",
  "Banks",
  "Talib Kweli",
  "Roberto Carlos",
  "Sade",
  "Marina and The Diamonds",
  "Duck Sauce",
  "Vicetone",
  "Ms Mr",
  "Jerrod Niemann",
  "Shaka Loveless",
  "Udit Narayan",
  "Combichrist",
  "Extremoduro",
  "Valerio Scanu",
  "Tina Turner",
  "Metric",
  "Richard Clayderman",
  "Boy George",
  "Fidel Rueda",
  "DJ Antoine",
  "Gucci Mane",
  "Newsboys",
  "Jason Mraz",
  "Röyksopp",
  "Lenka",
  "Alfaaz",
  "Hilltop Hoods",
  "What So Not",
  "Kis-My-Ft2",
  "Crystal Castles",
  "Portugal. The Man",
  "Nelly",
  "Falguni Pathak",
  "Carlos Baute",
  "Banda El Recodo",
  "Illy",
  "Jessica Mauboy",
  "BABYMETAL",
  "Gogol Bordello",
  "May'n",
  "Нюша",
  "Laidback Luke",
  "Daft Punk feat Pharrell Williams",
  "Oliver Heldens",
  "Adriano Celentano",
  "Banda Carnaval",
  "Emis Killa",
  "Elbow",
  "Julion Alvarez",
  "Foxes",
  "The Dead Weather",
  "Pierce the Veil",
  "Álex Ubago",
  "Babyshambles",
  "Gold Panda",
  "Sergio Dalma",
  "George Strait",
  "Neutral Milk Hotel",
  "Cartel De Santa",
  "Eskimo Callboy",
  "Antonio Orozco",
  "Dente",
  "Laleh",
  "Andrea Berg",
  "Renato Zero",
  "Ricardo Montaner",
  "Broods",
  "Himesh Reshammiya",
  "DJ Khaled",
  "Aditya Narayan",
  "Daniele Silvestri",
  "Medina",
  "Carpark North",
  "French Montana",
  "Elen Levon",
  "Lucinda Williams",
  "Brett Eldredge",
  "Jenni Vartiainen",
  "Hedley",
  "MAN WITH A MISSION",
  "Francesca Battistelli",
  "Roxette",
  "Valesca Popozuda",
  "Samantha Jade",
  "Sohn",
  "Keys N Krates",
  "Jennifer Hudson",
  "Taio Cruz",
  "Edward Sharpe & the Magnetic Zeros",
  "Priyanka Chopra",
  "NEEDTOBREATHE",
  "Flight Facilities",
  "Mind Vortex",
  "Ozark Henry",
  "Stam1na",
  "Russian Red",
  "Nelly Furtado",
  "LE YOUTH",
  "The Notwist",
  "Red Hot Chilli Pipers",
  "인피니트",
  "GLAY",
  "f(x)",
  "Sidewalk Prophets",
  "Matt Redman",
  "Luis Fonsi",
  "The Fratellis",
  "Nina Persson",
  "El Trono de Mexico",
  "Ingrid Michaelson",
  "2BiC",
  "Volbeat",
  "SPYAIR",
  "Y-TITTY",
  "Suzanne Vega",
  "Bosse",
  "Plumb",
  "Westlife",
  "Rosario",
  "汪峰",
  "スキマスイッチ",
  "Kelis",
  "Choir of Young Believers",
  "Jimi Hendrix",
  "Brooks & Dunn",
  "The Police",
  "The Shins",
  "Gentleman",
  "Ice Cube",
  "PINK",
  "Elvis Costello",
  "E-40",
  "Bondax",
  "Fear, and Loathing in Las Vegas",
  "Magic",
  "Sting",
  "Emmanuel Moire",
  "The Chainsmokers",
  "Daniel Barenboim",
  "Kavita Krishnamurthy",
  "F.T. Island",
  "Josh Gad",
  "Rammstein",
  "Mike Candys",
  "Fifth Harmony",
  "Goldfrapp",
  "Marcelo Jeneci",
  "Jake Miller",
  "Electric Light Orchestra",
  "Travis",
  "Nusrat Fateh Ali Khan",
  "Alkilados",
  "The Strypes",
  "Banda Rancho Viejo",
  "김동률",
  "David Dallas",
  "Zara Larsson",
  "Henrique & Juliano",
  "Miranda Lambert",
  "Ravi Shankar",
  "스피카",
  "The Wombats",
  "Flatbush Zombies",
  "Kollegah",
  "Mike Posner",
  "Hezekiah Walker",
  "Jabberwocky",
  "Anna Vissi",
  "Maya Jane Coles",
  "Zero Assoluto",
  "Rahat Fateh Ali Khan",
  "Skindred",
  "Joe Nichols",
  "Mohammed Rafi",
  "Agapornis",
  "Christopher",
  "SPICY CHOCOLATE",
  "Robin Schulz",
  "Paolo Nutini",
  "Texas",
  "Bilal Saeed",
  "KAYTRANADA",
  "Tracy Chapman",
  "Dream Theater",
  "Two Fingerz",
  "Aventura",
  "関ジャニ∞",
  "Gary Clark, Jr.",
  "Karunesh",
  "DJ Snake",
  "The Amity Affliction",
  "Il Divo",
  "Noel Schajris",
  "Alexandra Stan",
  "DREAMS COME TRUE",
  "Pete Seeger",
  "Zucchero",
  "Chief Keef",
  "JUNIEL",
  "Sampha",
  "Martina Stoessel",
  "BUMP OF CHICKEN",
  "Maluma",
  "The Afters",
  "San Cisco",
  "Mia Martina",
  "Dave Koz",
  "Caliban",
  "voXXclub",
  "Fiuk",
  "Sidney Samson",
  "Jazzanova",
  "Shankar-Ehsaan-Loy",
  "Matt Corby",
  "DJ Bl3nd",
  "Odesza",
  "Aesthetic Perfection",
  "Erasure",
  "Chris Lake",
  "Wham!",
  "Roberto Tapia",
  "Tamela Mann",
  "UNISON SQUARE GARDEN",
  "The Presets",
  "NMB48",
  "Jessica Sutta",
  "Suicide Commando",
  "John Denver",
  "Kygo",
  "Dizzee Rascal",
  "Agnes Obel",
  "St. Lucia",
  "三代目 J Soul Brothers",
  "Mötley Crüe",
  "Chuckie",
  "La Arrolladora Banda El Limón",
  "Brunori sas",
  "Caked Up",
  "HKT48",
  "Пицца",
  "Nabiha",
  "Kidz Bop Kids",
  "Big Daddy Weave",
  "Jim Jones",
  "Camryn",
  "Javed Ali",
];

const result = {};
artists.forEach((elem, idx) => {
  console.log(idx);
});

jsonData = JSON.stringify(result);
fs.writeFile("artists.txt", jsonData, function (err) {
  if (err) {
    console.log(err);
  }
});
