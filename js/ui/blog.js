import { h, mount } from './dom.js';

const FUN_FACT = 'https://workofphuong.github.io/fun-fact-roster/';

const p = (...kids) => h('p', null, ...kids);
const step = (n, title) => h('h2', { class: 'step' }, h('span', { class: 'num', 'aria-hidden': 'true' }, n), title);
const ul = (...items) => h('ul', null, items.map((i) => h('li', null, ...[].concat(i))));

function figure(src, alt, caption) {
  return h('figure', { class: 'blog-fig' },
    h('a', { href: src, target: '_blank', rel: 'noopener' }, h('img', { src, alt, loading: 'lazy' })),
    caption ? h('figcaption', null, caption) : null);
}

// Two screenshots side by side: first version (left) and final (right).
function pair(a, b, caption) {
  const col = (x, label) => h('figure', { class: 'blog-fig' },
    h('a', { href: x.src, target: '_blank', rel: 'noopener' }, h('img', { src: x.src, alt: x.alt, loading: 'lazy' })),
    h('figcaption', null, label));
  return h('div', { class: 'blog-pair' },
    h('div', { class: 'blog-pair-grid' }, col(a, 'First version'), col(b, 'Final version')),
    caption ? h('p', { class: 'muted blog-cap' }, caption) : null);
}

export function renderBlog() {
  const root = h('article', { class: 'screen blog' },
    h('header', { class: 'blog-hero' },
      h('a', { class: 'back', href: '#/', 'aria-label': 'Back' }, '← Back'),
      h('p', { class: 'kicker' }, 'The story behind the app'),
      h('h1', null, 'How I built Wordloop'),
      h('p', { class: 'sub' }, 'To help people remember vocabulary better.')),

    p('In another life, I tutor Japanese as a side hustle. I’ve been learning the language since middle school and lived in Yokohama for a year. It has slowly become a part of me that I don’t want to forget, and helping others learn it is one way I stay connected.'),
    p('The thing is, Japanese characters (Hiragana, Katakana and Kanji) are really hard for beginners. You have to remember the character, the reading and the meaning, and you can’t just look at a character and guess how to pronounce it. My students struggle with this a lot, and I don’t have enough time to review all the vocabulary with them. Making words stick takes exposure maxxing in every sense: seeing it, writing it, and hearing it over and over until it lands. And when teaching online, I can’t even tell if students are writing by themselves or using a dictionary or AI.'),
    p('So I wondered if there was a tool that could bring vocabulary back to students again and again, in different forms of exercises. That’s how Wordloop came to be.'),

    step(1, 'Core questions'),
    h('div', { class: 'blog-card' }, ul(
      [h('strong', null, 'What is it? '), 'A web app people can access from a link.'],
      [h('strong', null, 'Who is it for? '), 'Language learners.'],
      [h('strong', null, 'What is it for? '), 'Helping people remember new words faster and for longer through enough exposure. The science behind it is spaced repetition and active recall.'],
      [h('strong', null, 'Constraints '), '(the part I started liking a lot): limiting the number of possible options.'])),
    p('The final step before mapping out and building is a deep conversation with AI. I do this every time, before I build anything. I want to think things through thoroughly before AI starts throwing tons of information at me and I lose sight of my original intention.'),

    step(2, 'Mapping the user journey'),
    p('The most interesting thing I found about building a web app is how structured and logical it needs to be. I love structuring things by nature. I’ve been mind-mapping and systemizing my learning since primary school. These are the sketches I made before building: a quick first map on a note card, then a cleaner flow in my notebook.'),
    figure('img/mindmap-1.jpg', 'Handwritten mind map on a note card. Main screen branches into progress, your vocab list, add new list, practice and install.', 'First sketch: everything the main screen needs to hold.'),
    figure('img/mindmap-2.jpg', 'Handwritten flow in a notebook. Main screen branches into today’s card, vocab list, create or add list, practice and install or save.', 'Second sketch: the same idea, reordered into a flow.'),
    p('The app sounded easy at first, since I just wanted a tool to help my students practice vocabulary. But once I put myself in the user’s shoes, plenty of questions popped up. What makes them stay in the app? How do they avoid getting confused and know where to go when they first open it? What matters to them? What motivates them?'),

    step(3, 'Building'),
    h('h3', null, 'The home screen: which words to practice'),
    p('After going over all the inputs again and again, I started building with Claude. I got lucky with my first web app, ',
      h('a', { href: FUN_FACT, target: '_blank', rel: 'noopener' }, 'Fun Fact Roster'),
      ', because the output was almost perfect. This time was different. The output wasn\u2019t what I expected in either design or content: way too much text, a boring layout and colors, and wording that didn\u2019t fit my intention. If I were a first-time user, I wouldn\u2019t know what I was doing there or where to focus on such a crowded screen.'),
    pair({ src: 'img/v1-home.png', alt: 'First version of the home screen, called Revisit, in blue and white with several cards and a lot of text.' },
      { src: 'img/final-home.jpg', alt: 'Final home screen of Wordloop: peach card with one Start looping button, then a short list of word lists.' },
      'The home screen, before and after. One next step instead of a pile of cards.'),
    p('That\u2019s when the basic questions from step 1 became really helpful: who is this for, and what is it for?'),
    p('It\u2019s for language learners, to remember words through constant exposure.'),
    p('So users need to (1) know which words to practice, and (2) add new words so they have something to practice with. I focused on those two purposes and removed many other things.'),

    h('h3', null, 'The second page: adding words'),
    p('The screen for adding new words had the same clutter from the opposite angle. I had so many constraints that the app itself needed tons of explanation. I was torn about what to keep, especially around input format, and I don\u2019t have the capacity for fancy features like reading PDFs or Word files. So I went with \u201Cthe simpler, the better\u201D: a plain text box where users separate a word and its meaning with a comma or a colon.'),
    pair({ src: 'img/v1-add.png', alt: 'First version of the Add words screen: Paste and CSV tabs, an empty box and a Replace option.' },
      { src: 'img/final-newlist.jpg', alt: 'Final New list screen: list name, a words box with a format example, then schedule choices Steady loop and Exam loop.' },
      'Adding words, before and after. Naming the list, pasting words and picking a schedule now happen on one screen.'),
    p('This is also where the one other thing I kept lives: the schedule, because that\u2019s where the spaced repetition happens. Each list has two options:'),
    ul(
      [h('strong', null, 'Steady loop'), ' brings words back on day 1, 3, 7, 14 and 30, for long-term retention.'],
      [h('strong', null, 'Exam loop'), ' is tighter, with revisits on day 1, 2, 4, 7 and 14, for anyone with a test coming up.']),
    p('That way the app does the \u201Csomeone keeps saying it over and over\u201D job I never had time for as a tutor.'),

    step(4, 'Design and user experience'),
    p('As a marketing major, this is my favorite part! I got to choose the app name and slogan and think about how to make the app attractive enough that people remember it, enjoy their time in it, and come back.'),
    p('An LLM was a big help here. I wanted something about vocabulary and remembering through repetition, and together we came up with Wordloop: looping words as many times as it takes until you remember them. Each round of revisiting words is also called a “loop,” and you “loop” your words when you start practicing. The slogan sums it up: ',
      h('strong', null, 'Learn it. Loop it. Keep it.')),
    p('I also chose the color palette carefully. I removed borders from some buttons and got rid of unnecessary buttons to leave more white space between elements.'),
    p(h('strong', null, 'And done!'), ' There’s a sample list on the home screen if you want to try it out.'),
    h('p', null, h('a', { class: 'btn', href: '#/' }, 'Check out the app')),
    h('p', { class: 'ps' }, h('strong', null, 'P.S. '), 'Building this app, and the idea of seeing something continuously until you remember it, reminded me a lot of marketing. You keep showing up and reminding people until they remember you, your brand and your product.'));
  mount(root);
}
