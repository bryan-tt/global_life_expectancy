function showTab(tabId) {
    // Hide all tabs
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }

    // Show the selected tab
    var selectedTab = document.getElementById(tabId);
    selectedTab.style.display = "block";
}