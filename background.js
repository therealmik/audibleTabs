/**
 * @fileoverview An extension that cycles through audible tabs.
 */

'use strict';


/**
 * Gets all audible tabs.
 *
 * @return {!Promise<!Array<!Tab>>}
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
 * @return {!Promise<!Tab>}
 */
function activateTab(tab) {
  return new Promise(resolve => {
    chrome.tabs.update(tab.id, {active: true}, resolve);
  });
}


/**
 * Compares the IDs of two tabs (as per Array.sort).
 *
 * @param {!Tab} a A Tab.
 * @param {!Tab} b Another Tab.
 * @return {number}
 */
function compareTabIds(a, b) {
  return a.id - b.id;
}


/**
 * Sorts tabs by their numerical ID.
 *
 * @param {!Array<!Tab>} tabs Some tabs to sort.
 * @return {!Array<!Tab>}
 */
function sortTabsById(tabs) {
  return tabs.sort(compareTabIds);
}


/**
 * Handles the click event for the browserAction badge.
 *
 * @param {!Tab} activeTab The tab that was active when the badge was clicked.
 */
function onBrowserActionClicked(activeTab) {
  // In order to get cycle behavior, we:
  // - Remove the current tab from the list of audible tabs
  // - Sort the list of audible tabs by tab ID
  // - Activate either:
  //   - The tab with the lowest ID greater than the current tab ID.
  //   - The tab with the lowest ID.
  getAudibleTabs()
    .then(tabs => tabs.filter(t => t.id != activeTab.id))
    .then(sortTabsById)
    .then(tabs => {
      if (tabs.length == 0) {
        return; // No audible tabs (except maybe the current one)
      }

      /** @type {!Tab} */
      let nextTab = tabs.find(t => t.id > activeTab.id) || tabs[0];

      activateTab(nextTab);
    });
}


chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
