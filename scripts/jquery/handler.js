// From now on I want to write all my code in a more concise yet understandable
// way. For that reason, I will be including documentation above every function.
// Why, you may ask? Because I want people to learn. I want to inspire future
// developers but also help current developers expand their knowledge even more.
// I know, I know, you think I'm cray cray, but it's for the greater benefit.
//
// Also, thanks for taking the time to look at the source code for the new version
// of my site. You're the best. Stitch loves you. <3


// Initializes the content on load.

window.onload = function() {
    show_tags(
        make_buttons(
            window.location.hash.replace("#", "")
        )
    );
};

// This method makes it much easier to trim all strings in an array.

Array.prototype.trim = function() {
    return this.map(s => s.trim());
}

// Allows for easy access to simple array elements. Although slow, won't be
// much of an issue since we're working with less than 200 items, as far as
// I know. Man, I lose track of everything recently.

Array.prototype.unique = function() {
    const that = this;
    return this.filter(function(item, pos) {
        return that.indexOf(item) === pos;
    });
}

// This function, along with its callback, allows for simple
// iteration of the query selector. In other words, it makes navigating
// much more simple.

function query(selector, callback) {
    const items = document.querySelectorAll(selector);
    const ret = [];
    for (let i = 0; i < items.length; i++) {
        const cbr = callback(items[i], i, items);
        if (typeof cbr !== "undefined"  &&  cbr !== null) {
            ret.push(cbr);
        }
    }
    return ret;
}

// This function can be used interchangeably to allow the years
// situated along the timeline to be shown or hidden, if desired.

function display_years(display="block") {
    query("li.event", function(item) {
        item.style.display = display;
    });
}

// Similar to above, this function allows for all years
// and categories to be shown or hidden.

function display_all(display="block") {
    display_years(display);
    query("section", function(item) {
        item.style.display = display;
    });
}

// This function enables tags to be shown or hidden,
// if desired.

function show_tags(tag) {
    if (!tag) return;
    display_years("none");
    query("section", function(item) {
        let tags = item.dataset.tags;
        tags = tags ? tags.split(',').trim() : [];
        if (tags.indexOf(tag) === -1) {
            item.style.display = "none";
        } else {
            item.style.display = "block";
            item.parentElement.style.display = "block";
        }
    });
}

// Calls for dynamic button creation.

function make_buttons(hash) {
    let found = false;
    const list = query("section", function (item) {
        const tags = item.dataset.tags;
        return tags ? tags.split(',').trim() : [];
    }).flat().unique().sort();

    for (let i = 0; i < list.length; i++) {
        const button = document.createElement("BUTTON");
        button.appendChild(document.createTextNode(list[i]));
        document.querySelector('#buttons').appendChild(button);

        if (list[i] === hash) {
            button.classList.add("selected");
            found = hash;
        }

        button.addEventListener("click", function() {
            if (this.classList.contains("selected")) {
                this.classList.remove("selected");
                display_all();
            } else {
                const selected = document.querySelector('button.selected');
                if (selected) selected.classList.remove("selected");
                this.classList.add("selected");
                show_tags(this.textContent);
            }
        });
    }
    return found;
}