var element = document.querySelector(".demo-page-container");
panzoom(element, {
  onDoubleClick: function (e) {
    // `e` - is current double click event.

    return false; // tells the library to not preventDefault, and not stop propagation
  },
});
