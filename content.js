/*
  ─────────────────────────────────────────────────────────────────────────────
   ALL TEXT ON THE WEBSITE  ·  SAV TEKST STRANICE

   Change any text between the quotes '…'. Keep the quotes, commas and
   brackets exactly as they are — one missing quote stops the page from loading.
   An apostrophe inside a text must be written as \'

   Hearts written as ❤️ / ❤ / 🤍 are drawn as matching rose-gold hearts.
   Photos live in the photos/ folder (mama.jpg, photo-1.jpg … photo-9.jpg).
  ─────────────────────────────────────────────────────────────────────────────
*/
window.SITE_CONTENT = {
  intro: {
    line1: 'Za jednu posebnu osobu…',
    line2: 'Jedan mali poklon, ispunjen velikom ljubavlju.',
    button: 'Klikni me!',
    messageLead: 'Jer danas nije običan dan.',
    message:
      'Danas slavimo osobu koja je toliko toga učinila za nas, a možda nikada neće ni znati koliko nam znači.',
    next: 'Pogledaj šta smo ti pripremili',
  },

  hero: {
    // One entry per line of the big heading
    title: ['Sretan 41.', 'rođendan,', 'mama!'],
    text: 'Četrdeset i jedna godina života, ljubavi, snage, osmijeha i bezbroj trenutaka koji su učinili naše živote ljepšim.',
    subtitle: 'Naša najveća sreća je što te imamo.',
    photo: 'mama.jpg',
    photoAlt: 'Mama',
    // Which part of the photo stays visible inside the arch (x% y%)
    photoFocus: '50% 20%',
    scrollCue: 'Dolje te čeka pismo',
  },

  letter: {
    heading: 'Riječi iz srca',
    greeting: 'Draga mama,',
    paragraphs: [
      'Ponekad je teško pronaći prave riječi kojima bismo opisali koliko nam neko znači. A kada je riječ o tebi, čini se da nijedna riječ nije dovoljno velika.',
      'Hvala ti za svaku brigu koju si nosila u sebi, za svaki savjet, svaki zagrljaj, svaku žrtvu i svaki trenutak u kojem si nas stavljala ispred sebe.',
      'Možda ti to ne govorimo dovoljno često, ali primjećujemo sve. Primjećujemo tvoju snagu, tvoju dobrotu, tvoju ljubav i sve ono što radiš čak i kada niko ne vidi.',
      'Ti si naš oslonac, naša sigurnost i jedan od najljepših Allahovih darova u našim životima.',
      'Želimo ti da se uvijek smiješ, da ti srce bude spokojno i da ti život donese barem dio one sreće koju ti svakodnevno donosiš nama.',
      'I zapamti, bez obzira na godine koje prolaze, za nas ćeš uvijek biti naša mama – osoba kojoj ćemo se uvijek vraćati.',
      'Volimo te više nego što riječi mogu opisati.',
      'Sretan rođendan, mama. ❤️',
    ],
    signature: 'Zauvijek tvoji. ❤️',
  },

  gallery: {
    heading: 'Naše najljepše uspomene',
    subtitle:
      'Trenuci možda prolaze, fotografije ostaju, ali ljubav koju nosimo u sebi nikada ne blijedi.',
    interlude: 'Svaka fotografija čuva jednu priču, a u svakoj priči si ti.',
    hintDesktop: 'Klikni na fotografiju da je otvoriš u punoj veličini.',
    hintMobile: 'Prevuci prstom za sljedeću fotografiju.',
    // Shown in place of a photo that is not there yet (e.g. photo-9.jpg)
    emptyTitle: 'I za sve uspomene koje tek dolaze…',
    emptyText: 'Najljepše tek dolazi.',
    // focus = which part of a cropped photo stays visible (x% y%)
    // fit   = 'cover' always crops to the frame, 'contain' always shows the whole photo
    photos: [
      { src: 'photo-1.jpg', caption: 'Mali trenuci, najveće uspomene.', focus: '50% 40%' },
      { src: 'photo-2.jpg', caption: 'Jedan od bezbroj razloga za osmijeh.', focus: '50% 55%' },
      { src: 'photo-3.jpg', caption: 'Zajedno je uvijek najljepše.', focus: '50% 45%' },
      { src: 'photo-4.jpg', caption: 'Uz tebe je svaki dan ljepši.', focus: '50% 40%' },
      { src: 'photo-5.jpg', caption: 'Ljubav koja ne poznaje godine.', focus: '50% 20%' },
      { src: 'photo-6.jpg', caption: 'Tamo gdje je mama, tu je i dom.', focus: '50% 50%' },
      { src: 'photo-7.jpg', caption: 'Osmijesi koje čuvamo zauvijek.', focus: '50% 39%', fit: 'cover' },
      { src: 'photo-8.jpg', caption: 'Hvala ti za svaki ovakav trenutak.', focus: '50% 50%' },
      { src: 'photo-9.jpg', caption: 'Najljepše tek dolazi.', focus: '50% 50%' },
    ],
  },

  surprises: {
    heading: 'Tri mala iznenađenja',
    subtitle: 'Svaka kartica krije po jednu poruku. Klikni i otkrij je.',
    openHint: 'Klikni da otkriješ',
    closeHint: 'Klikni ponovo da je okreneš',
    cards: [
      {
        title: 'Zašto te volimo?',
        icon: 'heart',
        message:
          'Zbog tvoje bezuslovne ljubavi, zbog toga što uvijek pronađeš način da nas nasmiješ, zbog tvoje snage i zbog toga što si jednostavno – ti.',
      },
      {
        title: 'Jedna želja za tebe',
        icon: 'star',
        message:
          'Da nikada ne izgubiš svoj osmijeh, da ti svaki novi dan donese razlog za sreću i da uvijek osjetiš koliko si voljena.',
      },
      {
        title: 'Ne zaboravi…',
        icon: 'flower',
        message:
          'Bez obzira na to koliko odrastemo, koliko daleko odemo i koliko se život promijeni – uvijek ćemo biti tu za tebe, baš kao što si ti uvijek bila tu za nas.',
      },
    ],
  },

  dova: {
    heading: 'Naša najljepša dova za tebe',
    paragraphs: [
      'Molimo Allaha da te uvijek čuva, podari ti zdravlje, dug život ispunjen dobrom, mir u srcu i sreću na svakom koraku.',
      'Da ti svaki novi dan bude ispunjen bereketom, da te Allah sačuva od svakog zla, udalji od tebe svaku brigu i podari ti mnogo razloga za osmijeh.',
      'Da te Allah uvijek čuva s nama, da još dugo zajedno stvaramo uspomene, dijelimo osmijehe i zahvaljujemo Mu što te imamo.',
    ],
    amin: 'Amin, ja Rabb. 🤍',
  },

  finale: {
    lead: 'I za kraj, samo da znaš…',
    intro:
      'Ne trebamo poseban dan da bismo znali koliko nam značiš. Ali danas želimo da te podsjetimo na nešto što možda ne govorimo dovoljno često:',
    trio: ['Ti si voljena.', 'Ti si važna.', 'Ti si nezamjenjiva.'],
    after: [
      'I dok god imamo tebe, uvijek ćemo imati jedan poseban razlog da budemo zahvalni.',
      'Sretan rođendan, mama. Neka ti Allah podari još mnogo lijepih godina, a nama priliku da budemo uz tebe u svakoj od njih.',
    ],
    end: 'Volimo te, mama.',
    heartLabel: 'Pošalji srce',
    heartHint: 'Dodirni srce',
    replay: 'Otvori poklon ponovo',
    footer: 'S beskrajnom ljubavlju, tvoja djeca',
  },

  ui: {
    soundOn: 'Uključi zvuk',
    soundOff: 'Isključi zvuk',
    close: 'Zatvori',
    prev: 'Prethodna fotografija',
    next: 'Sljedeća fotografija',
    lightbox: 'Fotografija u punoj veličini',
    gift: 'Rođendanski poklon',
    photoAlt: function (n) {
      return 'Porodična uspomena ' + n
    },
    goToPhoto: function (n) {
      return 'Prikaži fotografiju ' + n
    },
  },
}
