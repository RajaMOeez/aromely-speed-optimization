// ADD TO CART FORM FUNCTIONALITY 
let formsSelector = document.querySelectorAll('.opti_ajax_form');
formsSelector.forEach((form, index) => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        document.querySelector('.variants-mobile-wrapper.wrapper-active')?.classList.remove('wrapper-active');
        document.querySelector('.main-container-wrapper.bg-wrapper-active')?.classList.remove('bg-wrapper-active');
        theme.AjaxProduct.prototype.addItemFromForm(e, form);
    });
});


// ALL CARD SELLING PLAN FUNCTIONALITY OF THE THEME
class OptiSellingPlanCart extends HTMLElement {
    constructor() {
        super(),
            (this.sellingPlan = this),
            (this.itemObject = {
                sellingPlanId: this.getAttribute('data-selling-plan-id'),
                sellingItemId: this.getAttribute('data-item-id'),
                sellingPlanName: this.getAttribute('data-selling-name'),
            }),
            (this.checkboxSelector = this.sellingPlan.querySelector('.selling_toggle_checkbox')),
            (this.sellingNameChild = this.sellingPlan.querySelector('.cart_delivery_text')),
            this.checkboxSelector.addEventListener('change', this.checkboxChangeHandler.bind(this)),
            (this.cartItems = []),
            this.fetchCartProducts();
    }
    async fetchCartProducts() {
        await fetch('/cart.json', { method: 'GET', headers: { 'content-type': 'application/json' } })
            .then((e) => {
                if (e.ok) return e.json();
                throw new Error('No items in cart found.');
            })
            .then((e) => {
                this.cartItems = e.items;
            })
            .catch((e) => {
                console.log(e);
            });
    }
    sellingSavings(e, t) {
        let i = 0;
        t &&
            t.forEach((e, t) => {
                let n = document.querySelectorAll('.total_cart_savings')[t],
                    r = document.querySelectorAll('.cart_item_suggested')[t],
                    a = document.querySelectorAll('.cart_percentage_off')[t],
                    { itemOriginalPrice: l, itemQuantity: s } = n.dataset,
                    c = Number(l) * Number(s);
                i += c - e.price * e.quantity;
                let o = 100 - Math.round((e.price / Number(l)) * 100);
                r && (r.innerHTML = theme.Currency.formatMoney(e.price)), a && (a.innerHTML = `${o}% off`);
            });
        let n = document.querySelector('[data-discount-savings]'),
            r = document.querySelector('[data-subtotal]');
        n && r && ((n.innerHTML = theme.Currency.formatMoney(i)), (r.innerHTML = theme.Currency.formatMoney(e)));
    }
    checkboxChangeHandler() {
        let e = this.cartItems.find((e) => e.id == this.itemObject.sellingItemId);
        if (e)
            if (this.checkboxSelector.classList.contains('checkbox_active')) {
                const t = { id: `${e.id}`, selling_plan: '', quantity: e.quantity };
                fetch('/cart/change.js', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(t),
                })
                    .then((e) => {
                        if (e.ok) return e.json();
                        throw new Error('Failed to update the cart item.');
                    })
                    .then((e) => {
                        (this.sellingNameChild.innerHTML = ''), this.sellingSavings(e.total_price, e.items);
                      document.dispatchEvent(new CustomEvent("cart:build")); 
                    })
                    .catch((e) => {
                        console.error('Error updating cart item:', e);
                    }),
                    this.checkboxSelector.classList.remove('checkbox_active');
                       
            } else {
                const t = { id: `${e.id}`, selling_plan: this.itemObject.sellingPlanId, quantity: e.quantity };
                fetch('/cart/change.js', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(t),
                })
                    .then((e) => {
                        if (e.ok) return e.json();
                        throw new Error('Failed to update the cart item.');
                    })
                    .then((e) => {
                        (this.sellingNameChild.innerHTML = this.itemObject.sellingPlanName),
                            this.sellingSavings(e.total_price, e.items);
                      document.dispatchEvent(new CustomEvent("cart:build"));
                    })
                    .catch((e) => {
                        console.error('Error updating cart item:', e);
                    }),
                    
                    this.checkboxSelector.classList.add('checkbox_active');
            }
        else console.error('Item not found for updating.');
    }
}
customElements.define('opti-selling-plan', OptiSellingPlanCart);


// CART RECEOMMENDATION FUNCTIONALITY OF THE THEME
class ProductCartRecommendations extends HTMLElement {
    constructor() {
        super(),
            (this.cartSection = this),
            (this.recommendationsHolder = document?.querySelector('.recommendations_holder')),
            (this.secondProductsHolder = document?.querySelector('.recomm_products_holder')),
            (this.dotsHolder = document?.querySelector('.recomm_dots_holder')),
            (this.shopCurrency = this.cartSection.dataset.shopCurrency.replace(/[0-9.,]/g, '')),
            (this.childContainer = ''),
            (this.currentDotIndex = 0),
            (this.pageStartingX = 0),
            (this.pageEndingX = 0),
            (this.totalLength = 0),
            this.connectedCallback.bind(this);
    }
    connectedCallback() {
        const t = 'https://' + window.location.host + this.dataset.url;
        fetch(t)
            .then((t) => t.json())
            .then((t) => {
                const n = t.products.filter((t) => !t.title.toLowerCase().includes('20ml')),
                    e = n.filter((t) => t.tags.some((t) => t.toLowerCase().includes('diffuser'))),
                    i = n.filter((t) => t.tags.some((t) => t.toLowerCase().includes('oil'))),
                    s = [...e.slice(0, 2), ...i.slice(0, 2)];
                if (
                    ((this.recommendationsHolder.innerHTML = ''),
                        (this.secondProductsHolder.innerHTML = ''),
                        (this.dotsHolder.innerHTML = ''),
                        s)
                )
                    s.forEach((t, n) => {
                        let e = t.available ? t.id : '';
                        if (t.variants)
                            for (const n of t.variants)
                                if (n.available) {
                                    e = n.id;
                                    break;
                                }
                        if (t.available) {
                            const i = (t.price / 100).toFixed(2);
                            const s = t.compare_at_price ? (t.compare_at_price / 100).toFixed(2) : '';
                            const a = document.createElement('li');

                            a.classList.add('recommendation_child');
                            a.innerHTML = `
                        <product-recommendations-block>
                            <div class="grid__item recomm_product_card">
                                <div class="grid-product__content">
                                    <div class="grid__item-image-wrapper">
                                        <div class="grid-product__image-mask">
                                            <a href="${t.url}">
                                                <div class="grid__image-ratio grid__image-ratio--square image_container">
                                                    <img src="${t.featured_image}" alt="${t.title
                                }" width="100%" height="100%">
                                                </div>
                                            </a>
                                        </div>
                                        <div class="product_content_block content_wrapper">
                                            <a href="${t.url}" class="grid-product__link custom_card_link">
                                                <div class="grid-product__meta">
                                                    <div class="grid-product__title product_title h4 my-product-title">
                                                        ${t.title}
                                                    </div>
                                                    <div class="grid-product__price">
                                                        <p class="product_price">
                                                            <span class="original_price">
                                                                <del>${s ? this.shopCurrency : ''} ${s}</del>
                                                            </span>
                                                            <span class="sale_price">${this.shopCurrency
                                } ${i}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                            ${t.variants.length > 1
                                    ? `
                                                <div class="product_recomm_variants_popup">
                                                    <div class="popup_buttons">
                                                        ${t.variants
                                        .map(
                                            (variant, index) => `
                                                            <div class="cart-button-block">
                                                                <span class="cart_button_text ${index === 0 ? 'btn_active' : ''
                                                }" data-custom-variant-id="${variant.id}">
                                                                    ${variant.title}
                                                                </span>
                                                            </div>
                                                        `
                                        )
                                        .join('')}
                                                    </div>
                                                    ${t?.selling_plan_groups[0]?.selling_plans[0].id
                                        ? `
                                                        <div class="selling_plan_container">
                                                            <div class="selling_plain_block">
                                                                <div class="lable_block">
                                                                    <input type="checkbox" class="selling_toggle_checkbox active_selling checked" checked>
                                                                    <span class="icon_toggle_tick">&check;</span>
                                                                    <span class="icon_cross_toggle">&times;</span>
                                                                </div>
                                                                <div class="selling_content">
                                                                    <span><b>Subscribe & save 10% off </b></span>
                                                                    <span>Delivery every 30 days</span>
                                                                    <span>Change, Skip or Cancel anytime</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    `
                                        : ''
                                    }
                                                    <form action="/cart/add" method="POST" enctype="multipart/form-data" class="product-single__form recommend_form_added">
                                                        <input type="hidden" name="id" class="multi_variant_id" value="${e}">
                                                        ${t?.selling_plan_groups[0]?.selling_plans[0].id
                                        ? `
                                                            <input type="hidden" class="selling_plan_input" name="selling_plan" value="${t.selling_plan_groups[0].selling_plans[0].id}" data-selling-name="selling_plan" data-selling-plan="${t.selling_plan_groups[0].selling_plans[0].id}"> 
                                                        `
                                        : ''
                                    }
                                                        <button type="submit" name="add" data-add-to-cart class="btn btn--full add-to-cart custom_color_button">
                                                            <span data-add-to-cart-text data-default-text="Add to cart">
                                                                Add to Cart
                                                            </span>
                                                        </button>
                                                    </form>
                                                </div>
                                                <button class="btn btn--full custom_color_button mobile_mini_button popup_activate_btn"> 
                                                    <span class="desktop_text">Add to cart </span> 
                                                    <span class="mobile_icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                        </svg>
                                                    </span> 
                                                </button>
                                            `
                                    : `
                                                <form action="/cart/add" method="POST" enctype="multipart/form-data" class="product-single__form recommend_form_added">
                                                    <input type="hidden" name="id" value="${e}">
                                                    <button type="submit" name="add" data-add-to-cart class="btn btn--full add-to-cart custom_color_button mobile_mini_button">
                                                        <span data-add-to-cart-text class="dektop_text" data-default-text="Add to cart">Add to Cart</span>
                                                        <span class="mobile_icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                        </svg>
                                                        </span>
                                                    </button>
                                                </form>`
                                }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </product-recommendations-block>
                    `;

                            this.recommendationsHolder.appendChild(a);

                            const o = document.createElement('span');
                            o.classList.add('recomm_dot');
                            if (n === 0) {
                                o.classList.add('active_dot');
                                this.childContainer = a;
                            }
                            this.dotsHolder.appendChild(o);
                        }
                    }),
                        (this.recommendationsHolder.style.transform = 'translateX(0px)'),
                        (this.secondProductsHolder.innerHTML = this.recommendationsHolder.innerHTML),
                        this.dotsHolder.querySelectorAll('span.recomm_dot').forEach((t, n) => {
                            t.addEventListener('click', this.dotClickInit.bind(this, n));
                        }),
                        (this.totalLength = this.recommendationsHolder.children.length),
                        this.recommendationsHolder.addEventListener(
                            'touchstart',
                            this.recommendationsTouchStartInit.bind(this)
                        ),
                        this.recommendationsHolder.addEventListener('touchend', this.recommendationsTouchEndInit.bind(this)),
                        this.recommendationsHolder.addEventListener(
                            'touchmove',
                            this.recommendationsTouchMoveInit.bind(this)
                        );
                else {
                    const t =
                        "<li style='width: 100%'><p class='empty_recomm_title black_title'>Add more for best recommendations</p></li>";
                    (this.recommendationsHolder.innerHTML = t), (this.secondProductsHolder.innerHTML = t);
                }
            })
            .catch((t) => {
                console.error(t);
            });
    }
    dotClickInit(t) {
        (this.currentDotIndex = t),
            (this.recommendationsHolder.style.transform = `translateX(-${this.childContainer.clientWidth * this.currentDotIndex
                }px)`),
            this.dotUpdated(this.currentDotIndex);
    }
    dotUpdated(t) {
        this.dotsHolder &&
            (this.dotsHolder.querySelector('span.active_dot').classList.remove('active_dot'),
                this.dotsHolder.querySelectorAll('span')[t].classList.add('active_dot'));
    }
    recommendationsTouchStartInit(t) {
        this.pageStartingX = t.touches[0].clientX;
    }
    recommendationsTouchMoveInit(t) {
        this.pageEndingX = t.touches[0].clientX;
    }
    recommendationsTouchEndInit(t) {
        let n = Math.abs(this.pageStartingX - this.pageEndingX),
            e = t.target,
            i =
                e.closest('button.add-to-cart') ||
                e.classList.contains('popup_activate_btn') ||
                e.classList.contains('cart_button_text') ||
                e.classList.contains('selling_toggle_checkbox');
        n > 50 &&
            !i &&
            (this.pageStartingX > this.pageEndingX
                ? (this.currentDotIndex = Math.min(this.currentDotIndex + 1, this.totalLength - 1))
                : this.pageStartingX < this.pageEndingX &&
                (this.currentDotIndex = Math.max(this.currentDotIndex - 1, 0)));
    }
}
customElements.define('product-cart-recommendation', ProductCartRecommendations);


// RECOMMENDATIONS CARD FORM FUNCTIONALITY
class ProductRecommendationForm extends HTMLElement {
    constructor() {
        super(),
            (this.submitForm = this.querySelector('.recommend_form_added')),
            (this.variantPopup = this.querySelector('.product_recomm_variants_popup')),
            (this.variantSelectors = this.querySelectorAll('.cart_button_text')),
            (this.sellingPlanActivator = this.querySelector('.selling_toggle_checkbox')),
            (this.sellingPlanInput = this.querySelector('.selling_plan_input')),
            (this.variantInputSelector = this.querySelector('.multi_variant_id')),
            (this.popButtonActivate = this.querySelector('.popup_activate_btn')),
            this.submitForm.addEventListener('submit', this.submitInitHandler.bind(this)),
            this.popButtonActivate && this.popButtonActivate.addEventListener('click', this.popupInitiate.bind(this)),
            this.variantSelectors &&
            this.variantSelectors.forEach((t) => t.addEventListener('click', this.variantInitiate.bind(this, t))),
            this.sellingPlanActivator &&
            this.sellingPlanActivator.addEventListener('change', this.sellingPlanInit.bind(this));
    }
    submitInitHandler(t) {
        t.preventDefault(), theme.AjaxProduct.prototype.addItemFromForm(t, this.submitForm);
    }
    popupInitiate(e) {
        e.preventDefault();
        this.variantPopup.classList.contains('show')
            ? this.variantPopup.classList.remove('show')
            : this.variantPopup.classList.add('show');
    }
    variantInitiate(t) {
        this.variantSelectors.forEach((t) => {
            t.classList.contains('btn_active') && t.classList.remove('btn_active');
        }),
            t.classList.add('btn_active'),
            this.variantInputSelector && (this.variantInputSelector.value = t.dataset.customVariantId);
    }
    sellingPlanInit() {
        this.sellingPlanActivator.classList.contains('checked')
            ? ((this.sellingPlanInput.name = ''),
                (this.sellingPlanInput.value = ''),
                this.sellingPlanActivator.classList.remove('checked'))
            : ((this.sellingPlanInput.name = this.sellingPlanInput.dataset.sellingName),
                (this.sellingPlanInput.value = this.sellingPlanInput.dataset.sellingPlan),
                this.sellingPlanActivator.classList.add('checked'));
    }
}
customElements.define('product-recommendations-block', ProductRecommendationForm);


// PRODUCT RECOMMENDATION CARD FUNCTIONALITY
class ProductRecommCard extends HTMLElement {
    constructor() {
        super();
        this.el = this.querySelectorAll('.variant-contents');
        this.formSelector = this.querySelectorAll('form.opti_ajax_form');

        if (this.el) {
            this.el.forEach((content, index) => {
                content.addEventListener('click', (e) => this.cardContentHandler(e, index));
            });
        }

        if (this.formSelector) {
            this.formSelector.forEach((form, index) => {
                form.addEventListener('submit', (e) => this.submitHandler(e, index));
            });
        }
    }

    cardContentHandler(e, index) {
        if (e.target.tagName === 'SPAN' && e.target.classList.contains('cart_button_text')) {
            const activeButtons = this.el[index].querySelectorAll('span.cart_button_text.btn_active');
            activeButtons.forEach((item) => {
                item.classList.remove('btn_active');
            });
            e.target.classList.add('btn_active');
            this.formSelector[index].querySelector("input[name='id']").value = e.target.dataset.customVariantId;
        }

        if (e.target.tagName === 'INPUT' && e.target.classList.contains('selling_toggle_checkbox')) {
            let inputSellingSelect = this.formSelector[index].querySelector('input.selling_plan_input');
            if (e.target.classList.contains('active_selling')) {
                e.target.classList.remove('active_selling');
                inputSellingSelect.value = '';
                inputSellingSelect.name = '';
            } else {
                e.target.classList.add('active_selling');
                inputSellingSelect.value = inputSellingSelect.dataset.sellingPlan;
                inputSellingSelect.name = inputSellingSelect.dataset.sellingName;
            }
        }
    }

    submitHandler(e, index) {
        e.preventDefault();
        document.querySelector('.variants-mobile-wrapper.wrapper-active')?.classList.remove('wrapper-active');
        document.querySelector('.main-container-wrapper.bg-wrapper-active')?.classList.remove('bg-wrapper-active');
        theme.AjaxProduct.prototype.addItemFromForm(e, this.formSelector[index]);
    }
}
customElements.define('product-recomm-card', ProductRecommCard);


// SEARCH ITEM CARD LIGHT FUNCTIONLITY FOR ADD TO CART
class ProductItemLight extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.form = this.querySelector('form');
        if (!this.form) return;

        this.setupVariantListeners();
        this.setupSellingPlanToggle();
        this.setupFormSubmission();
    }
    setupVariantListeners() {
        const variantButtons = this.form.querySelectorAll('[data-custom-variant-id]');
        const idInput = this.form.querySelector('input[name="id"]');
        if (!idInput || variantButtons.length === 0) return;
        variantButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                variantButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const variantId = btn.getAttribute('data-custom-variant-id');
                idInput.value = variantId;
            });
        });
    }
    setupSellingPlanToggle() {
        const toggle = this.form.querySelector('.selling_toggle_checkbox');
        const sellingInput = this.form.querySelector('.search_selling_input');
        if (!toggle || !sellingInput) return;
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                sellingInput.name = sellingInput.dataset.sellingName;
                sellingInput.value = sellingInput.dataset.sellingPlan;
            } else {
                sellingInput.removeAttribute('name');
                sellingInput.removeAttribute('value');
            }
        });
    }
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (typeof theme?.AjaxProduct?.prototype?.addItemFromForm === 'function') {
                theme.AjaxProduct.prototype.addItemFromForm(e, this.form);
            } else {
                console.warn('theme.AjaxProduct.prototype.addItemFromForm is not defined.');
            }
        });
    }
}
customElements.define('product-item-light', ProductItemLight);


// TABS FUNCTIONALITY OF THE SEARCH PAGE FOR BESTSELLERS AND RECENTLY VIEWED
function openTab(evt, tabId) {
    const contents = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    contents.forEach(c => c.classList.remove('active'));
    buttons.forEach(b => b.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}


// STICKY ADD TO CART FUNCTIONALITY
window.addEventListener("DOMContentLoaded", function () {
    let stickyContainer = document.querySelector(".sticky_atc_container");
    let stickyElemTarget = document.querySelector("button.sticky_element_target");
    let headerContainer = document.querySelector("header.shopify-section-header-sticky");
    if (headerContainer && headerContainer.classList.contains("site-header--stuck")) {
        if(stickyContainer) stickyContainer.style.top = `${headerContainer.clientHeight}px`;
    }
    window.addEventListener("scroll", () => {
        if (stickyElemTarget && stickyElemTarget.getBoundingClientRect().top <= 0) {
            if (headerContainer.classList.contains("site-header--stuck")) {
                if(stickyContainer) stickyContainer.style.top = `${headerContainer.clientHeight}px`;
            } else {
                if(stickyContainer) stickyContainer.style.top = "0px";
            }
        } else {
            if(stickyContainer) stickyContainer.style.top = "-100%";
        }
    })
});


// GIFT SET LOGIC OF THE THEME
document.addEventListener('DOMContentLoaded', function () {
    function resetGiftsetLayout() {
        window.optiSelections = [];
        updateProgress(0);

        const progressContainer = document.querySelector('.progress_container');
        if (progressContainer) progressContainer.style.display = '';

        const innerWrapper = document.querySelector('.inner_wrapper_holder');
        if (innerWrapper) innerWrapper.style.display = '';

        const placeholder = document.querySelector('.completed_prod_placeholder');
        if (placeholder) placeholder.style.display = 'none';

        let panelSelectors = document.querySelectorAll(".opti_panel_selected.active_panel");
        if (panelSelectors) {
            panelSelectors.forEach(panel => {
                panel.classList.remove("active_panel")
            });
        }
    }

    let giftPackgeInit = document.querySelector(".opti_gift_init");
    let closeButtonPannel = document.querySelector(".close_btn_tim");
    let giftsetPanelSelector = document.querySelector(".opti_giftset_container");

    if (giftPackgeInit) {
        giftPackgeInit.addEventListener("click", function () {
            if (giftsetPanelSelector) {
                giftsetPanelSelector.classList.add("active_panel");
            }
        });
    }

    if (closeButtonPannel) {
        closeButtonPannel.addEventListener("click", function () {
            if (giftsetPanelSelector) {
                giftsetPanelSelector.classList.remove("active_panel");
                resetGiftsetLayout();
            }
        });
    }

    if (giftsetPanelSelector) {
        giftsetPanelSelector.addEventListener("click", function (e) {
            if (e.target.classList.contains("opti_giftset_container")) {
                e.target.classList.remove("active_panel");
                resetGiftsetLayout();
            }
        });
    }

    const tabButtons = document.querySelectorAll('.opti-tab-btn');
    const tabContents = document.querySelectorAll('.opti-tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.opacity = 0;
            });

            button.classList.add('active');
            const targetContent = document.getElementById(button.dataset.optiTab);
            if (targetContent) {
                targetContent.classList.add('active');
                setTimeout(() => {
                    targetContent.style.opacity = 1;
                }, 50);
            }
        });
    });
});
class OptiGiftsetBundle extends HTMLElement {
    connectedCallback() {
        const card = this.querySelector('.opti-product-card');
        const variantCard = this.querySelector('.opti-variant-card');
        const errorMessage = this.querySelector(".card_error_msg");
        const panelOpen = this.querySelector(".opti_panel_selected");

        if (!card || !variantCard || !errorMessage || !panelOpen) return;

        window.optiSelections = window.optiSelections || [];

        card.addEventListener('click', optiDebounce((e) => {
            const variantId = variantCard.dataset.id;
            const alreadySelected = window.optiSelections.find(v => v.id === variantId);

            if (alreadySelected) {
                window.optiSelections = window.optiSelections.filter(v => v.id !== variantId);
                panelOpen.classList.remove("active_panel");
                updateProgress(window.optiSelections.length);
                errorMessage.innerHTML = "Removed from selection";
                errorMessage.classList.add("active_message");
                setTimeout(() => {
                    errorMessage.classList.remove("active_message");
                }, 1500);
            } else {
                const variantInfo = {
                    id: variantId,
                    title: variantCard.dataset.title,
                    image: variantCard.dataset.image,
                    price: variantCard.dataset.price,
                    reviews: variantCard.dataset.reviews,
                    final_price: variantCard.dataset.finalPrice,
                    compare_price: variantCard.dataset.comparePrice,
                };

                if (variantCard.dataset.sellingPlan) {
                    variantInfo.selling_plan = variantCard.dataset.sellingPlan;
                }
                if (typeof window.optiEditIndex === 'number') {
                    window.optiSelections.splice(window.optiEditIndex, 0, variantInfo);
                    window.optiEditIndex = undefined;
                } else {
                    window.optiSelections.push(variantInfo);
                }

                if (window.optiSelections.length > 3) {
                    window.optiSelections = window.optiSelections.slice(0, 3);
                }

                updateProgress(window.optiSelections.length);

                if (window.optiSelections.length === 3) {
                    renderCompletedSelections();
                }

                panelOpen.classList.add("active_panel");
            }
        }, 300));
    }
}
customElements.define('opti-giftset-bundle', OptiGiftsetBundle);


function optiDebounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
function updateProgress(count) {
    const bar = document.querySelector('.inner_progress_bar');
    const steps = document.querySelectorAll('.circle_elem');
    if (!bar || !steps) return;

    const percentage = (count / 3) * 100;
    bar.style.width = `${percentage}%`;

    steps.forEach((circle, idx) => {
        if (idx < count) {
            circle.classList.add('active');
        } else {
            circle.classList.remove('active');
        }
    });
}
function renderCompletedSelections() {
    const progressContainer = document.querySelector('.progress_container');
    const wrapperHolder = document.querySelector('.inner_wrapper_holder');
    const placeholder = document.querySelector('.completed_prod_placeholder');
    if (!placeholder) return;

    const container = placeholder.querySelector('.inner_container_stim');
    if (!container) return;

    if (progressContainer) progressContainer.style.display = 'none';
    if (wrapperHolder) wrapperHolder.style.display = 'none';
    container.innerHTML = '';

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'completed_cards_container';

    window.optiSelections.forEach((variant, index) => {
        const card = document.createElement('div');
        card.className = 'completed_card';
        card.innerHTML = `
        <div class="card_inner">
          <img src="${variant.image}" alt="${variant.title}">
          <div class="card_details">
            <p>${variant.title}</p>
            <div class="price">${variant.price}</div>
            <div class="reviews">${variant.reviews || ''}</div>
          </div>
          <button class="edit_btn" data-index="${index}" title="Edit" data-variant-index="${variant.id}">✎</button>
        </div>
      `;
        cardsContainer.appendChild(card);
    });

    const cartBtn = document.createElement('button');
    cartBtn.textContent = 'Add to Cart';
    cartBtn.className = 'add_to_cart_btn btn';

    cartBtn.addEventListener('click', () => {
        cartBtn.disabled = true;
        cartBtn.classList.add('loading-dots');

        let defaultVariantId = null;
        const urlParams = new URLSearchParams(window.location.search);
        const variantFromUrl = urlParams.get('variant');

        if (variantFromUrl) {
            defaultVariantId = variantFromUrl;
        } else {
            const productInput = document.querySelector('input[name="product_torom"]');
            if (productInput) {
                defaultVariantId = productInput.value;
            }
        }

        const giftSetId = `gift-set-${Math.floor(1000 + Math.random() * 9000)}`;
        let items = window.optiSelections.map(v => {
            const item = {
                id: v.id,
                quantity: 1,
                properties: {
                    gift_set: giftSetId
                }
            };
            if (v.selling_plan) {
                item.selling_plan = v.selling_plan;
            }
            return item;
        });

        if (defaultVariantId) {
            items.push({
                id: defaultVariantId,
                quantity: 1,
                properties: {
                    gift_set: giftSetId
                }
            });
        }

        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items })
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to add items');
                return response.json();
            })
            .then(data => {
                setTimeout(() => {
                    document.dispatchEvent(new CustomEvent('cart:build'));
                    document.dispatchEvent(new CustomEvent('cart:open'));
                }, 100);

                window.optiSelections = [];
                updateProgress(0);

                const progress = document.querySelector('.progress_container');
                if (progress) progress.style.display = '';

                const wrapper = document.querySelector('.inner_wrapper_holder');
                if (wrapper) wrapper.style.display = '';

                if (placeholder) placeholder.style.display = 'none';

                const giftsetPanel = document.querySelector('.opti_giftset_container');
                if (giftsetPanel) {
                    giftsetPanel.classList.remove('active_panel');
                }

                let panelSelectors = document.querySelectorAll(".opti_panel_selected.active_panel");
                if (panelSelectors) {
                    panelSelectors.forEach(panel => {
                        panel.classList.remove("active_panel")
                    });
                }
            })
            .catch(error => {
                console.error('Error adding items to cart:', error.message);
            })
            .finally(() => {
                cartBtn.disabled = false;
                cartBtn.classList.remove('loading-dots');
            });
    });

    const priceContainer = document.createElement('div');
    priceContainer.className = 'completed_price_container';
    let finalPrice = window.optiSelections.reduce((a, s) => a + parseFloat(s.final_price || 0), 0);
    let comparePrice = window.optiSelections.reduce((a, s) => a + parseFloat(s.compare_price || 0), 0);
    let discountPrice = 0;
    let discountPercent = 0;

    const giftsetEl = document.querySelector('[data-giftset-block]');
    if (giftsetEl) {
      const giftsetCompare = parseFloat(giftsetEl.dataset.comparePrice || 0);
      const giftsetFinal = parseFloat(giftsetEl.dataset.giftsetFinal || 0);
    
      comparePrice = comparePrice + giftsetCompare;
      finalPrice = finalPrice + giftsetFinal;
    
      discountPrice = comparePrice - finalPrice;
      discountPercent = comparePrice > 0
        ? Math.round((discountPrice / comparePrice) * 100)
        : 0;
    
      // console.log(`Compare Price: ${totalComparePrice}`);
      // console.log(`Final Price: ${totalFinalPrice}`);
      // console.log(`Discount: ${discountPercent}%`);
    }

    priceContainer.innerHTML = `
        <div class="discount_price_container">
            <p>Total Savings:</p>
            <p>
              ${theme.Currency.formatMoney(discountPrice, theme.settings.moneyFormat)}
              <span>${discountPercent}% off</span>
            </p>
        </div>
        <div class="final_price_container">
            <p>Total:</p>
            <p>
                <span class="compare_price"><del>${theme.Currency.formatMoney(comparePrice, theme.settings.moneyFormat)}</del></span>
                <span class="final_price">${theme.Currency.formatMoney(finalPrice, theme.settings.moneyFormat)}</span>
            </p>
        </div>
        `


    container.appendChild(cardsContainer);
    container.appendChild(priceContainer);
    container.appendChild(cartBtn);
    placeholder.style.display = 'block';

    cardsContainer.querySelectorAll('.edit_btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            window.optiSelections.splice(index, 1);
            window.optiEditIndex = index;

            if (progressContainer) progressContainer.style.display = '';
            if (wrapperHolder) wrapperHolder.style.display = '';
            placeholder.style.display = 'none';

            updateProgress(window.optiSelections.length);

            let panelSelector = document.querySelector(`.opti-variant-card[data-id='${e.currentTarget.dataset.variantIndex}']`);
            if (panelSelector) {
                let parentItem = panelSelector.closest(".opti-product-card")?.querySelector(".opti_panel_selected");
                if (parentItem) {
                    parentItem.classList.remove("active_panel");
                }
            }
        });
    });
}




// CODE FOR STARTER KIT FUNCTIONALITY
let starterKitForm = document.querySelectorAll('.single_multipart_check');
if (starterKitForm) {
    starterKitForm.forEach((form) => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            document.querySelector('.variants-mobile-wrapper.wrapper-active')?.classList.remove('wrapper-active');
            document.querySelector('.main-container-wrapper.bg-wrapper-active')?.classList.remove('bg-wrapper-active');
            const inputSelector = document.querySelector('.ajax_form_multi');
            const productId = inputSelector?.getAttribute('data-track-init-id');

            if (productId) {
                try {
                    const response = await fetch('/cart/add.js', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: productId,
                            quantity: 1,
                            properties: {
                                kit: `starter-kit-${inputSelector.value.slice(-4)}`
                            }
                        })
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    await response.json();
                    theme.AjaxProduct.prototype.addItemFromForm(e, form);
                } catch (error) {
                    console.error('Error adding product to cart:', error);
                }
            }
        });
    });
}



// STARTER KIT JAVASCRIPT FUNCTIONALITY WITH CUSTOM VARIANTS
let customVariants = document.querySelectorAll(".variant_cit_item");
if(customVariants) {
    customVariants.forEach(element => {
      element.addEventListener("click", function() {
          document.querySelectorAll(".variant_cit_item").forEach(item => item.classList.remove("item_active"));
          element.classList.add("item_active");
          let inputSelector = document.querySelector(".ajax_form_multi");
          if(element.classList.contains('item_disabled')) {
            inputSelector.removeAttribute("data-track-init-id");
            return;
          }
          if(inputSelector && element.dataset.variantId) {
              inputSelector.setAttribute("data-track-init-id", element.dataset.variantId);
          }
      })
    });
}



