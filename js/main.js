import { renderHome } from './ui/home.js';
import { renderAdd } from './ui/add.js';
import { renderRound } from './ui/round.js';
import { renderNewList, renderReview, renderEdit } from './ui/newlist.js';
import { renderList } from './ui/list.js';
import { renderExamples } from './ui/examples.js';
import { renderPractice } from './ui/practice.js';
import { renderSettings } from './ui/settings.js';
import { initPwa } from './pwa.js';
import { getState, storageError } from './store.js';

// Page views for the owner's GoatCounter. Sends only the screen name, never list ids or words.
function countView(path) {
  const send = () => {
    try {
      window.goatcounter?.count?.({ path: '/wordloop/' + (path || 'home'), title: 'Wordloop ' + (path || 'home') });
    } catch { /* offline or blocked: ignore */ }
  };
  // count.js loads async, so the first screen may render before it is ready.
  if (window.goatcounter?.count) send();
  else window.addEventListener('load', send, { once: true });
}

function route() {
  const [, path = '', arg] = (location.hash || '#/').split('/');
  countView(path);
  switch (path) {
    case 'add': return renderAdd();
    case 'round': return renderRound();
    case 'examples': return renderExamples(arg);
    case 'edit': return renderEdit(arg);
    case 'review': return renderReview(arg);
    case 'new': return renderNewList();
    case 'list': return renderList(arg);
    case 'practice': return renderPractice(arg);
    case 'settings': return renderSettings();
    default: return renderHome();
  }
}

getState();
initPwa();
window.addEventListener('hashchange', route);
route();
if (storageError) console.warn('Storage problem:', storageError);
