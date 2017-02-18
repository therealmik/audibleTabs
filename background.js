/**
 * @fileoverview An extension that mutes all audible tabs.
 */

'use strict';


/**
 * Recently activated tabIds.
 *
 * @type {!Array<!string>}
 */
var recentlyActivated = [];


/**
 * Gets all audible tabs.
 *
 * @return {!Promise<!Array<Tab>>}
 */
function getAudibleTabs() {
  return new Promise(resolve => {
    chrome.tabs.query({audible: true}, resolve);
  });
}


/**
 * Activates a tab.
 *
 * @param {!Tab} tab The tab that you want muted.
 * @return {!Promise<Tab>}
 */
function activateTab(tab) {
  return new Promise(resolve => {
    chrome.tabs.update(tab.id, {active: true}, resolve);
  });
}


/**
 * Handles the click event for the browserAction badge.
 *
 * @param {!Tab} activeTab The tab that was active when the badge was clicked.
 */
function onBrowserActionClicked(activeTab) {
  getAudibleTabs()
    .then(tabs => tabs.filter(t => t.id != activeTab.id))
    .then(tabs => {
      if (tabs.length == 0) {
        return;
      }

      // Sort by increasing tabId
      tabs = tabs.sort((a, b) => a.id - b.id);

      /** @type {!Tab} */
      let nextTab = tabs.find(t => t.id > activeTab.id) || tabs[0];

      activateTab(nextTab);
    });
}

chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
