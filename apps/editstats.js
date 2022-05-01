import { MonksTokenBar, log, error, i18n, setting, makeid } from "../monks-tokenbar.js";

export class EditStats extends FormApplication {
    constructor(object, options) {
        super(object, options);
        this.stats = object?.getFlag('monks-tokenbar', 'stats') || MonksTokenBar.stats;
        this.stats = this.stats.map(s => {
            s.id = s.id || makeid();
            return s;
        });
        //let's just grab the first player character we can find
        let player = game.actors.find(a => a.type == 'character');
        if (player) {
            let attributes = getDocumentClass("Token")?.getTrackedAttributes(player.data.data ?? {});
            if (attributes)
                this.attributes = attributes.value.concat(attributes.bar).map(a => a.join('.'));
        }
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "tokenbar-editstats",
            title: 'Edit Stats',
            template: "./modules/monks-tokenbar/templates/editstats.html",
            width: 400,
            closeOnSubmit: true,
            popOut: true,
        });
    }

    getData(options) {
        return {
            stats: this.stats
        };
    }

    _updateObject() {
        if (Object.keys(this.object).length != 0) {
            this.object.setFlag('monks-tokenbar', 'stats', this.stats);
        }else
            game.settings.set('monks-tokenbar', 'stats', this.stats);
        MonksTokenBar.tokenbar.refresh();
        this.submitting = true;
    }

    addStat(event) {
        this.stats.push({ id: makeid(), stat: "", icon: "fa-address-book" });
        this.render(true);
    }

    removeStat() {
        let statid = event.currentTarget.closest('.form-group').dataset.id;
        this.stats.findSplice(s => s.id === statid);
        $('.form-group[data-id="' + statid + '"]', this.element).remove();
    }

    resetStats() {
        if (Object.keys(this.object).length != 0) {
            this.stats = MonksTokenBar.stats;
            this.object.unsetFlag('monks-tokenbar', 'stats');
            this.close();
        }
        else
            this.stats = MonksTokenBar.system.defaultStats;
        this.render(true);
        let that = this;
        window.setTimeout(function () { that.setPosition(); }, 100);
    }

    changeIcon(event) {
        this.statid = event.currentTarget.closest('.form-group').dataset.id;
        $('.font-picker', this.element).css({top: $(event.currentTarget).position().top}).show();
    }

    selectIcon(event) {
        let stat = this.stats.find(s => s.id == this.statid);
        stat.icon = event.currentTarget.dataset.value;
        $('.form-group[data-id="' + this.statid + '"] .icon i', this.element).attr('class', 'fas ' + stat.icon);
        $('.font-picker', this.element).hide();
    }

    changeText(event) {
        let statid = event.currentTarget.closest('.form-group').dataset.id;
        let stat = this.stats.find(s => s.id == statid);
        stat.stat = $(event.currentTarget).val();
        if (!this.submitting)
            this.render(true);
    }

    activateListeners(html) {
        super.activateListeners(html);

        $('button[name="submit"]', html).click(this._onSubmit.bind(this));
        $('button[name="reset"]', html).click(this.resetStats.bind(this));

        $('div.icon', html).click(this.changeIcon.bind(this));
        $('.stat-text', html).blur(this.changeText.bind(this));
        $('div.remove', html).click(this.removeStat.bind(this));
        $('div.add', html).click(this.addStat.bind(this));

        $('.font-picker .close-picker', html).on('click', function (event) { $('.font-picker', html).hide(); event.preventDefault(); });

        if (this.attributes) {
            let that = this;

            var substringMatcher = function (strs) {
                return function findMatches(q, cb) {
                    var matches, substrRegex;

                    // an array that will be populated with substring matches
                    matches = [];

                    // regex used to determine if a string contains the substring `q`
                    substrRegex = new RegExp(q, 'i');

                    // iterate through the pool of strings and for any string that
                    // contains the substring `q`, add it to the `matches` array
                    $.each(strs, function (i, str) {
                        if (substrRegex.test(str)) {
                            matches.push(str);
                        }
                    });

                    cb(matches);
                };
            };

            $('.stat-text', html).typeahead(
                {
                    minLength: 1,
                    hint: true,
                    highlight: true
                },
                {
                    source: substringMatcher(that.attributes)
                }
            );
        }
    };
}

Hooks.on("renderEditStats", (app, html, data) => {
    let fonts = ["fa-address-book", "fa-address-card", "fa-adjust", "fa-air-freshener", "fa-align-center", "fa-align-justify", "fa-align-left", "fa-align-right", "fa-allergies", "fa-ambulance", "fa-american-sign-language-interpreting", "fa-anchor", "fa-angle-double-down", "fa-angle-double-left", "fa-angle-double-right", "fa-angle-double-up", "fa-angle-down", "fa-angle-left", "fa-angle-right", "fa-angle-up", "fa-angry", "fa-ankh", "fa-archive", "fa-archway", "fa-arrow-alt-circle-down", "fa-arrow-alt-circle-left", "fa-arrow-alt-circle-right", "fa-arrow-alt-circle-up", "fa-arrow-circle-down", "fa-arrow-circle-left", "fa-arrow-circle-right", "fa-arrow-circle-up", "fa-arrow-down", "fa-arrow-left", "fa-arrow-right", "fa-arrow-up", "fa-arrows-alt", "fa-arrows-alt-h", "fa-arrows-alt-v", "fa-assistive-listening-systems", "fa-asterisk", "fa-at", "fa-atlas", "fa-atom", "fa-audio-description", "fa-award", "fa-baby", "fa-baby-carriage", "fa-backspace", "fa-backward", "fa-bacon", "fa-bacteria", "fa-bacterium", "fa-bahai", "fa-balance-scale", "fa-balance-scale-left", "fa-balance-scale-right", "fa-ban", "fa-band-aid", "fa-barcode", "fa-bars", "fa-baseball-ball", "fa-basketball-ball", "fa-bath", "fa-battery-empty", "fa-battery-full", "fa-battery-half", "fa-battery-quarter", "fa-battery-three-quarters", "fa-bed", "fa-beer", "fa-bell", "fa-bell-slash", "fa-bezier-curve", "fa-bible", "fa-bicycle", "fa-biking", "fa-binoculars", "fa-biohazard", "fa-birthday-cake", "fa-blender", "fa-blender-phone", "fa-blind", "fa-blog", "fa-bold", "fa-bolt", "fa-bomb", "fa-bone", "fa-bong", "fa-book", "fa-book-dead", "fa-book-medical", "fa-book-open", "fa-book-reader", "fa-bookmark", "fa-border-all", "fa-border-none", "fa-border-style", "fa-bowling-ball", "fa-box", "fa-box-open", "fa-box-tissue", "fa-boxes", "fa-braille", "fa-brain", "fa-bread-slice", "fa-briefcase", "fa-briefcase-medical", "fa-broadcast-tower", "fa-broom", "fa-brush", "fa-bug", "fa-building", "fa-bullhorn", "fa-bullseye", "fa-burn", "fa-bus", "fa-bus-alt", "fa-business-time", "fa-calculator", "fa-calendar", "fa-calendar-alt", "fa-calendar-check", "fa-calendar-day", "fa-calendar-minus", "fa-calendar-plus", "fa-calendar-times", "fa-calendar-week", "fa-camera", "fa-camera-retro", "fa-campground", "fa-candy-cane", "fa-cannabis", "fa-capsules", "fa-car", "fa-car-alt", "fa-car-battery", "fa-car-crash", "fa-car-side", "fa-caravan", "fa-caret-down", "fa-caret-left", "fa-caret-right", "fa-caret-square-down", "fa-caret-square-left", "fa-caret-square-right", "fa-caret-square-up", "fa-caret-up", "fa-carrot", "fa-cart-arrow-down", "fa-cart-plus", "fa-cash-register", "fa-cat", "fa-certificate", "fa-chair", "fa-chalkboard", "fa-chalkboard-teacher", "fa-charging-station", "fa-chart-area", "fa-chart-bar", "fa-chart-line", "fa-chart-pie", "fa-check", "fa-check-circle", "fa-check-double", "fa-check-square", "fa-cheese", "fa-chess", "fa-chess-bishop", "fa-chess-board", "fa-chess-king", "fa-chess-knight", "fa-chess-pawn", "fa-chess-queen", "fa-chess-rook", "fa-chevron-circle-down", "fa-chevron-circle-left", "fa-chevron-circle-right", "fa-chevron-circle-up", "fa-chevron-down", "fa-chevron-left", "fa-chevron-right", "fa-chevron-up", "fa-child", "fa-church", "fa-circle", "fa-circle-notch", "fa-city", "fa-clinic-medical", "fa-clipboard", "fa-clipboard-check", "fa-clipboard-list", "fa-clock", "fa-clone", "fa-closed-captioning", "fa-cloud", "fa-cloud-download-alt", "fa-cloud-meatball", "fa-cloud-moon", "fa-cloud-moon-rain", "fa-cloud-rain", "fa-cloud-showers-heavy", "fa-cloud-sun", "fa-cloud-sun-rain", "fa-cloud-upload-alt", "fa-cocktail", "fa-code", "fa-code-branch", "fa-coffee", "fa-cog", "fa-cogs", "fa-coins", "fa-columns", "fa-comment", "fa-comment-alt", "fa-comment-dollar", "fa-comment-dots", "fa-comment-medical", "fa-comment-slash", "fa-comments", "fa-comments-dollar", "fa-compact-disc", "fa-compass", "fa-compress", "fa-compress-alt", "fa-compress-arrows-alt", "fa-concierge-bell", "fa-cookie", "fa-cookie-bite", "fa-copy", "fa-copyright", "fa-couch", "fa-credit-card", "fa-crop", "fa-crop-alt", "fa-cross", "fa-crosshairs", "fa-crow", "fa-crown", "fa-crutch", "fa-cube", "fa-cubes", "fa-cut", "fa-database", "fa-deaf", "fa-democrat", "fa-desktop", "fa-dharmachakra", "fa-diagnoses", "fa-dice", "fa-dice-d20", "fa-dice-d6", "fa-dice-five", "fa-dice-four", "fa-dice-one", "fa-dice-six", "fa-dice-three", "fa-dice-two", "fa-digital-tachograph", "fa-directions", "fa-disease", "fa-divide", "fa-dizzy", "fa-dna", "fa-dog", "fa-dollar-sign", "fa-dolly", "fa-dolly-flatbed", "fa-donate", "fa-door-closed", "fa-door-open", "fa-dot-circle", "fa-dove", "fa-download", "fa-drafting-compass", "fa-dragon", "fa-draw-polygon", "fa-drum", "fa-drum-steelpan", "fa-drumstick-bite", "fa-dumbbell", "fa-dumpster", "fa-dumpster-fire", "fa-dungeon", "fa-edit", "fa-egg", "fa-eject", "fa-ellipsis-h", "fa-ellipsis-v", "fa-envelope", "fa-envelope-open", "fa-envelope-open-text", "fa-envelope-square", "fa-equals", "fa-eraser", "fa-ethernet", "fa-euro-sign", "fa-exchange-alt", "fa-exclamation", "fa-exclamation-circle", "fa-exclamation-triangle", "fa-expand", "fa-expand-alt", "fa-expand-arrows-alt", "fa-external-link-alt", "fa-external-link-square-alt", "fa-eye", "fa-eye-dropper", "fa-eye-slash", "fa-fan", "fa-fast-backward", "fa-fast-forward", "fa-faucet", "fa-fax", "fa-feather", "fa-feather-alt", "fa-female", "fa-fighter-jet", "fa-file", "fa-file-alt", "fa-file-archive", "fa-file-audio", "fa-file-code", "fa-file-contract", "fa-file-csv", "fa-file-download", "fa-file-excel", "fa-file-export", "fa-file-image", "fa-file-import", "fa-file-invoice", "fa-file-invoice-dollar", "fa-file-medical", "fa-file-medical-alt", "fa-file-pdf", "fa-file-powerpoint", "fa-file-prescription", "fa-file-signature", "fa-file-upload", "fa-file-video", "fa-file-word", "fa-fill", "fa-fill-drip", "fa-film", "fa-filter", "fa-fingerprint", "fa-fire", "fa-fire-alt", "fa-fire-extinguisher", "fa-firefox-browser", "fa-first-aid", "fa-fish", "fa-fist-raised", "fa-flag", "fa-flag-checkered", "fa-flag-usa", "fa-flask", "fa-flushed", "fa-folder", "fa-folder-minus", "fa-folder-open", "fa-folder-plus", "fa-font", "fa-football-ball", "fa-forward", "fa-frog", "fa-frown", "fa-frown-open", "fa-funnel-dollar", "fa-futbol", "fa-gamepad", "fa-gas-pump", "fa-gavel", "fa-gem", "fa-genderless", "fa-ghost", "fa-gift", "fa-gifts", "fa-glass-cheers", "fa-glass-martini", "fa-glass-martini-alt", "fa-glass-whiskey", "fa-glasses", "fa-globe", "fa-globe-africa", "fa-globe-americas", "fa-globe-asia", "fa-globe-europe", "fa-golf-ball", "fa-gopuram", "fa-graduation-cap", "fa-greater-than", "fa-greater-than-equal", "fa-grimace", "fa-grin", "fa-grin-alt", "fa-grin-beam", "fa-grin-beam-sweat", "fa-grin-hearts", "fa-grin-squint", "fa-grin-squint-tears", "fa-grin-stars", "fa-grin-tears", "fa-grin-tongue", "fa-grin-tongue-squint", "fa-grin-tongue-wink", "fa-grin-wink", "fa-grip-horizontal", "fa-grip-lines", "fa-grip-lines-vertical", "fa-grip-vertical", "fa-guitar", "fa-h-square", "fa-hamburger", "fa-hammer", "fa-hamsa", "fa-hand-holding", "fa-hand-holding-heart", "fa-hand-holding-medical", "fa-hand-holding-usd", "fa-hand-holding-water", "fa-hand-lizard", "fa-hand-middle-finger", "fa-hand-paper", "fa-hand-peace", "fa-hand-point-down", "fa-hand-point-left", "fa-hand-point-right", "fa-hand-point-up", "fa-hand-pointer", "fa-hand-rock", "fa-hand-scissors", "fa-hand-sparkles", "fa-hand-spock", "fa-hands", "fa-hands-helping", "fa-hands-wash", "fa-handshake", "fa-handshake-alt-slash", "fa-handshake-slash", "fa-hanukiah", "fa-hard-hat", "fa-hashtag", "fa-hat-cowboy", "fa-hat-cowboy-side", "fa-hat-wizard", "fa-hdd", "fa-head-side-cough", "fa-head-side-cough-slash", "fa-head-side-mask", "fa-head-side-virus", "fa-heading", "fa-headphones", "fa-headphones-alt", "fa-headset", "fa-heart", "fa-heart-broken", "fa-heartbeat", "fa-helicopter", "fa-highlighter", "fa-hiking", "fa-hippo", "fa-history", "fa-hockey-puck", "fa-holly-berry", "fa-home", "fa-horse", "fa-horse-head", "fa-hospital", "fa-hospital-alt", "fa-hospital-symbol", "fa-hospital-user", "fa-hot-tub", "fa-hotdog", "fa-hotel", "fa-hourglass", "fa-hourglass-end", "fa-hourglass-half", "fa-hourglass-start", "fa-house-damage", "fa-house-user", "fa-hryvnia", "fa-i-cursor", "fa-ice-cream", "fa-icicles", "fa-icons", "fa-id-badge", "fa-id-card", "fa-id-card-alt", "fa-igloo", "fa-image", "fa-images", "fa-inbox", "fa-indent", "fa-industry", "fa-infinity", "fa-info", "fa-info-circle", "fa-italic", "fa-jedi", "fa-joint", "fa-journal-whills", "fa-kaaba", "fa-key", "fa-keyboard", "fa-khanda", "fa-kiss", "fa-kiss-beam", "fa-kiss-wink-heart", "fa-kiwi-bird", "fa-landmark", "fa-language", "fa-laptop", "fa-laptop-code", "fa-laptop-house", "fa-laptop-medical", "fa-laugh", "fa-laugh-beam", "fa-laugh-squint", "fa-laugh-wink", "fa-layer-group", "fa-leaf", "fa-lemon", "fa-less-than", "fa-less-than-equal", "fa-level-down-alt", "fa-level-up-alt", "fa-life-ring", "fa-lightbulb", "fa-link", "fa-lira-sign", "fa-list", "fa-list-alt", "fa-list-ol", "fa-list-ul", "fa-location-arrow", "fa-lock", "fa-lock-open", "fa-long-arrow-alt-down", "fa-long-arrow-alt-left", "fa-long-arrow-alt-right", "fa-long-arrow-alt-up", "fa-low-vision", "fa-luggage-cart", "fa-lungs", "fa-lungs-virus", "fa-magic", "fa-magnet", "fa-mail-bulk", "fa-male", "fa-map", "fa-map-marked", "fa-map-marked-alt", "fa-map-marker", "fa-map-marker-alt", "fa-map-pin", "fa-map-signs", "fa-marker", "fa-mars", "fa-mars-double", "fa-mars-stroke", "fa-mars-stroke-h", "fa-mars-stroke-v", "fa-mask", "fa-medal", "fa-medkit", "fa-meh", "fa-meh-blank", "fa-meh-rolling-eyes", "fa-memory", "fa-menorah", "fa-mercury", "fa-meteor", "fa-microchip", "fa-microphone", "fa-microphone-alt", "fa-microphone-alt-slash", "fa-microphone-slash", "fa-microscope", "fa-minus", "fa-minus-circle", "fa-minus-square", "fa-mitten", "fa-mobile", "fa-mobile-alt", "fa-money-bill", "fa-money-bill-alt", "fa-money-bill-wave", "fa-money-bill-wave-alt", "fa-money-check", "fa-money-check-alt", "fa-monument", "fa-moon", "fa-mortar-pestle", "fa-mosque", "fa-motorcycle", "fa-mountain", "fa-mouse", "fa-mouse-pointer", "fa-mug-hot", "fa-music", "fa-network-wired", "fa-neuter", "fa-newspaper", "fa-not-equal", "fa-notes-medical", "fa-object-group", "fa-object-ungroup", "fa-oil-can", "fa-om", "fa-otter", "fa-outdent", "fa-pager", "fa-paint-brush", "fa-paint-roller", "fa-palette", "fa-pallet", "fa-paper-plane", "fa-paperclip", "fa-parachute-box", "fa-paragraph", "fa-parking", "fa-passport", "fa-pastafarianism", "fa-paste", "fa-pause", "fa-pause-circle", "fa-paw", "fa-peace", "fa-pen", "fa-pen-alt", "fa-pen-fancy", "fa-pen-nib", "fa-pen-square", "fa-pencil-alt", "fa-pencil-ruler", "fa-people-arrows", "fa-people-carry", "fa-pepper-hot", "fa-percent", "fa-percentage", "fa-person-booth", "fa-phone", "fa-phone-alt", "fa-phone-slash", "fa-phone-square", "fa-phone-square-alt", "fa-phone-volume", "fa-photo-video", "fa-piggy-bank", "fa-pills", "fa-pizza-slice", "fa-place-of-worship", "fa-plane", "fa-plane-arrival", "fa-plane-departure", "fa-plane-slash", "fa-play", "fa-play-circle", "fa-plug", "fa-plus", "fa-plus-circle", "fa-plus-square", "fa-podcast", "fa-poll", "fa-poll-h", "fa-poo", "fa-poo-storm", "fa-poop", "fa-portrait", "fa-pound-sign", "fa-power-off", "fa-pray", "fa-praying-hands", "fa-prescription", "fa-prescription-bottle", "fa-prescription-bottle-alt", "fa-print", "fa-procedures", "fa-project-diagram", "fa-pump-medical", "fa-pump-soap", "fa-puzzle-piece", "fa-qrcode", "fa-question", "fa-question-circle", "fa-quidditch", "fa-quote-left", "fa-quote-right", "fa-quran", "fa-radiation", "fa-radiation-alt", "fa-rainbow", "fa-random", "fa-receipt", "fa-record-vinyl", "fa-recycle", "fa-redo", "fa-redo-alt", "fa-registered", "fa-remove-format", "fa-reply", "fa-reply-all", "fa-republican", "fa-restroom", "fa-retweet", "fa-ribbon", "fa-ring", "fa-road", "fa-robot", "fa-rocket", "fa-route", "fa-rss", "fa-rss-square", "fa-ruble-sign", "fa-ruler", "fa-ruler-combined", "fa-ruler-horizontal", "fa-ruler-vertical", "fa-running", "fa-rupee-sign", "fa-sad-cry", "fa-sad-tear", "fa-satellite", "fa-satellite-dish", "fa-save", "fa-school", "fa-screwdriver", "fa-scroll", "fa-sd-card", "fa-search", "fa-search-dollar", "fa-search-location", "fa-search-minus", "fa-search-plus", "fa-seedling", "fa-server", "fa-shapes", "fa-share", "fa-share-alt", "fa-share-alt-square", "fa-share-square", "fa-shekel-sign", "fa-shield-alt", "fa-shield-virus", "fa-ship", "fa-shipping-fast", "fa-shoe-prints", "fa-shopping-bag", "fa-shopping-basket", "fa-shopping-cart", "fa-shower", "fa-shuttle-van", "fa-sign", "fa-sign-in-alt", "fa-sign-language", "fa-sign-out-alt", "fa-signal", "fa-signature", "fa-sim-card", "fa-sink", "fa-sitemap", "fa-skating", "fa-skiing", "fa-skiing-nordic", "fa-skull", "fa-skull-crossbones", "fa-slash", "fa-sleigh", "fa-sliders-h", "fa-smile", "fa-smile-beam", "fa-smile-wink", "fa-smog", "fa-smoking", "fa-smoking-ban", "fa-sms", "fa-snowboarding", "fa-snowflake", "fa-snowman", "fa-snowplow", "fa-soap", "fa-socks", "fa-solar-panel", "fa-sort", "fa-sort-alpha-down", "fa-sort-alpha-down-alt", "fa-sort-alpha-up", "fa-sort-alpha-up-alt", "fa-sort-amount-down", "fa-sort-amount-down-alt", "fa-sort-amount-up", "fa-sort-amount-up-alt", "fa-sort-down", "fa-sort-numeric-down", "fa-sort-numeric-down-alt", "fa-sort-numeric-up", "fa-sort-numeric-up-alt", "fa-sort-up", "fa-spa", "fa-space-shuttle", "fa-spell-check", "fa-spider", "fa-spinner", "fa-splotch", "fa-spray-can", "fa-square", "fa-square-full", "fa-square-root-alt", "fa-stamp", "fa-star", "fa-star-and-crescent", "fa-star-half", "fa-star-half-alt", "fa-star-of-david", "fa-star-of-life", "fa-step-backward", "fa-step-forward", "fa-stethoscope", "fa-sticky-note", "fa-stop", "fa-stop-circle", "fa-stopwatch", "fa-stopwatch-20", "fa-store", "fa-store-alt", "fa-store-alt-slash", "fa-store-slash", "fa-stream", "fa-street-view", "fa-strikethrough", "fa-stroopwafel", "fa-subscript", "fa-subway", "fa-suitcase", "fa-suitcase-rolling", "fa-sun", "fa-superscript", "fa-surprise", "fa-swatchbook", "fa-swimmer", "fa-swimming-pool", "fa-synagogue", "fa-sync", "fa-sync-alt", "fa-syringe", "fa-table", "fa-table-tennis", "fa-tablet", "fa-tablet-alt", "fa-tablets", "fa-tachometer-alt", "fa-tag", "fa-tags", "fa-tape", "fa-tasks", "fa-taxi", "fa-teeth", "fa-teeth-open", "fa-temperature-high", "fa-temperature-low", "fa-tenge", "fa-terminal", "fa-text-height", "fa-text-width", "fa-th", "fa-th-large", "fa-th-list", "fa-theater-masks", "fa-thermometer", "fa-thermometer-empty", "fa-thermometer-full", "fa-thermometer-half", "fa-thermometer-quarter", "fa-thermometer-three-quarters", "fa-thumbs-down", "fa-thumbs-up", "fa-thumbtack", "fa-ticket-alt", "fa-times", "fa-times-circle", "fa-tint", "fa-tint-slash", "fa-tired", "fa-toggle-off", "fa-toggle-on", "fa-toilet", "fa-toilet-paper", "fa-toilet-paper-slash", "fa-toolbox", "fa-tools", "fa-tooth", "fa-torah", "fa-torii-gate", "fa-tractor", "fa-trademark", "fa-traffic-light", "fa-trailer", "fa-train", "fa-tram", "fa-transgender", "fa-transgender-alt", "fa-trash", "fa-trash-alt", "fa-trash-restore", "fa-trash-restore-alt", "fa-tree", "fa-trophy", "fa-truck", "fa-truck-loading", "fa-truck-monster", "fa-truck-moving", "fa-truck-pickup", "fa-tshirt", "fa-tty", "fa-tv", "fa-umbrella", "fa-umbrella-beach", "fa-underline", "fa-undo", "fa-undo-alt", "fa-universal-access", "fa-university", "fa-unlink", "fa-unlock", "fa-unlock-alt", "fa-upload", "fa-user", "fa-user-alt", "fa-user-alt-slash", "fa-user-astronaut", "fa-user-check", "fa-user-circle", "fa-user-clock", "fa-user-cog", "fa-user-edit", "fa-user-friends", "fa-user-graduate", "fa-user-injured", "fa-user-lock", "fa-user-md", "fa-user-minus", "fa-user-ninja", "fa-user-nurse", "fa-user-plus", "fa-user-secret", "fa-user-shield", "fa-user-slash", "fa-user-tag", "fa-user-tie", "fa-user-times", "fa-users", "fa-users-cog", "fa-users-slash", "fa-utensil-spoon", "fa-utensils", "fa-vector-square", "fa-venus", "fa-venus-double", "fa-venus-mars", "fa-vial", "fa-vials", "fa-video", "fa-video-slash", "fa-vihara", "fa-virus", "fa-virus-slash", "fa-viruses", "fa-voicemail", "fa-volleyball-ball", "fa-volume-down", "fa-volume-mute", "fa-volume-off", "fa-volume-up", "fa-vote-yea", "fa-vr-cardboard", "fa-walking", "fa-wallet", "fa-warehouse", "fa-water", "fa-wave-square", "fa-weight", "fa-weight-hanging", "fa-wheelchair", "fa-wifi", "fa-wind", "fa-window-close", "fa-window-maximize", "fa-window-minimize", "fa-window-restore", "fa-wine-bottle", "fa-wine-glass", "fa-wine-glass-alt", "fa-won-sign", "fa-wrench", "fa-x-ray", "fa-yen-sign", "fa-yin-yang"];

    $('.font-picker section', html).empty();
    for (let font of fonts) {
        $('.font-picker section', html).append($('<div>').attr('data-value', font).html('<i class="fas ' + font + '"></i>').click(app.selectIcon.bind(app)));
    }
});