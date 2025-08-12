// ADDED BY @OPTIEXERTS
// FILE TO HANDLE THE JAVASCRIPT OF THE ADDED FEATURES

let containerHTML = "";
let containerBlock = document.querySelector("#lazyload-container");

function buttonsClickHandler() {
    let tabsButtons = document.querySelectorAll(".tab-btn")
    let tabsContent = document.querySelectorAll(".text-content");

    function checkAndHideAddToCartButtons() {
        const activeTab = document.querySelector(".tab-btn.btn-active");
        if (!activeTab) return;

        const tabLabel = activeTab.textContent.trim();
        const isGiftSetsCollection = tabLabel === "Gift Sets" || tabLabel === "Diffuser Gift Sets";

        const activeTabId = activeTab.getAttribute("data-tabid");
        const activeContent = document.querySelector(`.text-content[data-tabid="${activeTabId}"]`) ||
            document.querySelector(`.text-content.tab-active`);

        if (activeContent) {
            const desktopAddToCartButtons = activeContent.querySelectorAll(".add-to-cart-popover.desktop-block");
            const mobileAddToCartButtons = activeContent.querySelectorAll(".add-to-cart-popover.mobile-block");

            if (isGiftSetsCollection) {
                // desktopAddToCartButtons.forEach(button => {
                //     button.style.display = "none";
                // });
                // mobileAddToCartButtons.forEach(button => {
                //     button.style.display = "none";
                // });
            } else {
                desktopAddToCartButtons.forEach(button => {
                    button.style.display = "";
                });
                mobileAddToCartButtons.forEach(button => {
                    button.style.display = "";
                });
            }
        }
    }

    checkAndHideAddToCartButtons();

    if (tabsButtons && tabsContent) {
        tabsButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                document.querySelector(".tab-btn.btn-active").classList.remove("btn-active");
                document.querySelector(".text-content.tab-active").classList.remove("tab-active");
                tabsButtons[index].classList.add("btn-active");
                tabsContent[button.dataset.tabid].classList.add("tab-active");
                const element = document.querySelector(".collection-tabs-section");
                const offset = 80;
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: elementPosition,
                    behavior: "smooth"
                });

                let shopHeaderContainer = document.querySelector(".shopify-section-header-sticky");
                setTimeout(() => {
                    /* CHANGE COMMENT ADDED 07-08-2024 */
                    if (!shopHeaderContainer.classList.contains("site-header--stuck")) {
                        document.querySelector(".tabs-buttons").classList.remove("buttons-sticky");
                    } else {
                        document.querySelector(".tabs-buttons").classList.add("buttons-sticky");
                        document.querySelector(".tabs-buttons").style.top = `${shopHeaderContainer.offsetHeight}px`;
                    }

                    checkAndHideAddToCartButtons();
                }, 100);
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    buttonsClickHandler();
});

// let buttonsBlock = document.querySelector(".tabs-buttons");
// let getRect = buttonsBlock ? buttonsBlock.getBoundingClientRect().top + window.scrollY : '';
// var lastScrollTop = 0;
// let addtocartButtonContainer = document.querySelector(".product-page-container");
// let checkContainer = document.querySelector("#lazyload-container");
// let stickycartContainer = document.querySelector(".sticky-button-container");
// let footerContainer = document.querySelector("footer");
// let shopHeaderContainer = document.querySelector(".shopify-section-header-sticky");
let stickyBackToTopButton = document.querySelector(".sticky-home-button");
// window.addEventListener("scroll", function () {
//     /* CHANGE COMMENT ADDED 07-08-2024 */
//     if (buttonsBlock) {
//         var st = window.scrollY || document.documentElement.scrollTop;
//         if (st > lastScrollTop) {
//             if (window.scrollY > getRect) {
//                 buttonsBlock.classList.add("buttons-sticky");
//                 if (shopHeaderContainer.classList.contains("site-header--stuck")) {
//                     buttonsBlock.style.top = `${shopHeaderContainer.offsetHeight}px`;
//                 } else {
//                     buttonsBlock.style.top = "-1px";
//                 }
//             } else {
//                 buttonsBlock.classList.remove("buttons-sticky");
//             }
//             // console.log("going down")
//         } else if (st < lastScrollTop) {
//             if (window.scrollY > getRect) {
//                 buttonsBlock.classList.add("buttons-sticky");
//                 if (shopHeaderContainer.classList.contains("site-header--stuck")) {
//                     buttonsBlock.style.top = `${shopHeaderContainer.offsetHeight}px`;
//                 }
//             } else {
//                 buttonsBlock.classList.remove("buttons-sticky");
//             }
//             // console.log("going up");
//         }
//         lastScrollTop = st <= 0 ? 0 : st;
//         if (checkContainer.getBoundingClientRect().bottom < 100) {
//             buttonsBlock.style.display = "none";
//         } else {
//             buttonsBlock.style.display = "flex";
//         }
//     }
//     if (addtocartButtonContainer) {
//         const footerRect = footerContainer.getBoundingClientRect();
//         const windowHeight = window.innerHeight || document.documentElement.clientHeight;

//         let cartButton = addtocartButtonContainer.querySelector("[id^='ProductSubmitButton-template']");
//         if (cartButton) {
//             if (cartButton.getBoundingClientRect().bottom < 0) {
//                 if (footerRect.top <= windowHeight && footerRect.bottom >= 0) {
//                     stickycartContainer.classList.remove("activate-sticky");
//                 } else {
//                     stickycartContainer.classList.add("activate-sticky");
//                 }
//             } else {
//                 stickycartContainer.classList.remove("activate-sticky");
//             }
//         }
//     }
//     if (stickyBackToTopButton) {
//         if (window.scrollY > 100) {
//             stickyBackToTopButton.classList.add("activetopbutton");
//         } else {
//             stickyBackToTopButton.classList.remove("activetopbutton");
//         }
//     }
// });


const prev = document.getElementById('prev-btn')
const next = document.getElementById('next-btn')
const list = document.getElementById('item-list')

if (prev) {
    prev.addEventListener('click', () => {
        const itemWidth = list.children[0].clientWidth;
        const padding = 10
        list.scrollLeft -= itemWidth + padding
    })
}

if (next) {
    next.addEventListener('click', () => {
        const itemWidth = list.children[0].clientWidth;
        const padding = 10
        list.scrollLeft += itemWidth + padding
    })
}


function popoverInitiator(button) {
    let currentButton = button;
    let closestDiv = currentButton.previousElementSibling;
    document.querySelectorAll(".add-to-cart-popover").forEach((card) => {
        card.classList.remove("popover-sticky");
    })
    document.querySelectorAll(".cart-popover-wrapper").forEach((card) => {
        card.classList.remove("wrapper-visible");
    })
    currentButton.closest(".add-to-cart-popover").classList.add("popover-sticky");
    if (closestDiv.classList.contains("cart-popover-wrapper")) {
        closestDiv.classList.add("wrapper-visible");
    } else {
        closestDiv.classList.remove("wrapper-visible");
    }
}

function closeButtonWrapper(btn) {
    btn.closest(".cart-popover-wrapper").classList.remove("wrapper-visible");
    btn.closest(".add-to-cart-popover").classList.remove("popover-sticky");
}

let readMoreButton = document.querySelectorAll(".read-more-button");
let cropedDescription = document.querySelectorAll(".cropped-description");
if (readMoreButton && cropedDescription) {
    cropedDescription.forEach((description, index) => {
        if (description.offsetHeight < description.scrollHeight || description.offsetWidth < description.scrollWidth) {
            readMoreButton[index].classList.add("button-active");
        } else {
            readMoreButton[index].classList.remove("button-active")
        }
    })

    readMoreButton.forEach((btn, index) => {
        btn.addEventListener("click", function () {
            if (cropedDescription[index].classList.contains("webkit-unset")) {
                cropedDescription[index].classList.remove("webkit-unset")
                btn.innerHTML = "Read More"
            } else {
                cropedDescription[index].classList.add("webkit-unset")
                btn.innerHTML = "Show Less"
            }
        })

    })
}


function mobilePopoverInitiator(button) {
    let currentButton = button;
    let closestDiv = currentButton.nextElementSibling;
    let nextWrapper = closestDiv.nextElementSibling;
    document.querySelectorAll(".variants-mobile-wrapper").forEach((card) => {
        card.classList.remove("wrapper-active");
    })
    document.querySelectorAll(".main-container-wrapper").forEach((card) => {
        card.classList.remove("bg-wrapper-active");
    })
    closestDiv.classList.add("wrapper-active");
    nextWrapper.classList.add("bg-wrapper-active");
}
function closePopupButtonWrapper(btn) {
    btn.closest(".variants-mobile-wrapper").classList.remove("wrapper-active");
    document.querySelector(".main-container-wrapper.bg-wrapper-active").classList.remove("bg-wrapper-active")
}

function wrapperRemover(wrapper) {
    wrapper.classList.remove("bg-wrapper-active");
    document.querySelector(".variants-mobile-wrapper.wrapper-active").classList.remove("wrapper-active");
}

if (stickyBackToTopButton) {
    stickyBackToTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 5,
            behavior: 'smooth'
        });
    });
}


let customReviewBadges = document.querySelector(".judgeme-custom-text");
window.addEventListener("load", function () {
    if (customReviewBadges) {
        let badgeText = customReviewBadges.querySelector(".jdgm-prev-badge__text");
        let prevText = badgeText.innerHTML;
        badgeText.innerHTML = 'Based on ' + prevText;
    }
});


// collapsable tabs coding block
let collapsableTabs = document.querySelector(".opti_custom_content_block.policies_collapsable");
let collapsableButtons = document.querySelectorAll(".panel_wrapper_container .collapsable_icon");
let collapsablePanels = document.querySelectorAll(".panel_wrapper_container");
if (collapsableTabs) {
    let allAnchors = collapsableTabs.querySelectorAll("a");
    allAnchors.forEach(anchor => {
        anchor.addEventListener("click", () => {
            if (anchor.hash === "#shipment_policy_block" || anchor.hash === "#return_policy_block") {
                collapsableTabs.classList.remove("collapsible-content__inner");
                document.querySelector(`${anchor.hash}`).classList.add("activate_wrapper");
            }
        });
    });
}

if (collapsableButtons) {
    collapsableButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            collapsableTabs.classList.add("collapsible-content__inner");
            btn.closest(".panel_wrapper_container").classList.remove("activate_wrapper");
        })
    })
}

if (collapsablePanels) {
    collapsablePanels.forEach(panel => {
        panel.addEventListener("click", function (e) {
            if (e.target.classList.contains("panel_wrapper_container")) {
                collapsableTabs.classList.add("collapsible-content__inner");
                panel.classList.remove("activate_wrapper")
            }
        })
    })
}

function singleSellingPlanTracker(toggle) {
    let closestContainer = toggle.closest(".selling_plan_container");
    // getting the next product-form element for single variant product
    let closestContent = closestContainer.nextElementSibling;
    let inputSelector = closestContent.querySelector(".selling_plan_input");
    if (toggle.checked) {
        inputSelector.value = inputSelector.dataset.sellingPlan;
        inputSelector.name = "selling_plan";
    } else {
        inputSelector.value = "";
        inputSelector.name = "";
    }
}

// product selling plan toggle
function productPageSellingTracker(toggle) {
    let mainProductSellingIndex = document.querySelector(".main_product_selling_plan");
    let appGenPrice = document.querySelector(".app-generated-price");
    let priceItemSelector = document.querySelector(".normal-price-container");
    let priceBadge = document.querySelector(".container_sale_badge");
    if (toggle.checked) {
        mainProductSellingIndex.value = mainProductSellingIndex.dataset.sellingPlan;
        mainProductSellingIndex.name = "selling_plan";
        appGenPrice.style.display = "block";
        priceItemSelector.style.display = "none";
        priceBadge.style.display = "inline-block";
    } else {
        mainProductSellingIndex.value = "";
        mainProductSellingIndex.name = "";
        appGenPrice.style.display = "none";
        priceItemSelector.style.display = "block";
        priceBadge.style.display = "none"
    }
}

document.addEventListener("DOMContentLoaded", function () {
  requestAnimationFrame(() => {
    const completeSetContainer = document.querySelector(".complete-collection-container");
    if (!completeSetContainer) return;

    const completeSetBlock = completeSetContainer.querySelector(".complete_set_block");
    const dotsContainer = completeSetContainer.querySelector(".carousel_dots_mini");
    const childContainers = completeSetBlock.querySelectorAll(".card-wrapper.set_card_wrapper");

    if (childContainers.length === 0) return;

    let totalCards = childContainers.length;
    let currentIndex = 0;
    let cardsPerView = window.innerWidth >= 768 ? 2 : 1;
    let totalSlides = Math.ceil(totalCards / cardsPerView);
    let startX = 0, endX = 0;

    completeSetBlock.style.display = 'flex';
    completeSetBlock.style.transition = 'transform 0.3s ease';
    completeSetBlock.style.willChange = 'transform';

    function updateCardWidths() {
      cardsPerView = window.innerWidth >= 768 ? 2 : 1;
      totalSlides = Math.ceil(totalCards / cardsPerView);

      let containerWidth = completeSetBlock.offsetWidth || completeSetContainer.offsetWidth;
      let newCardWidth = containerWidth / cardsPerView;

      childContainers.forEach(card => {
        card.style.minWidth = `${newCardWidth}px`;
        card.style.flexShrink = "0";
      });

      renderDots();
      updateSliderPosition();
    }

    function renderDots() {
      if (!dotsContainer) return;

      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const span = document.createElement('span');
        if (i === currentIndex) span.classList.add("activeDot");
        dotsContainer.appendChild(span);
      }

      dotsContainer.querySelectorAll("span").forEach((dot, index) => {
        dot.addEventListener("click", () => {
          currentIndex = index;
          updateSliderPosition();
        });
      });
    }

    function updateSliderPosition() {
      let slideWidth = childContainers[0].offsetWidth * currentIndex;
      completeSetBlock.style.transform = `translateX(-${slideWidth}px)`;
      updateDots(currentIndex);
    }

    function updateDots(index) {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll("span").forEach(dot => dot.classList.remove("activeDot"));
      if (dotsContainer.querySelectorAll("span")[index])
        dotsContainer.querySelectorAll("span")[index].classList.add("activeDot");
    }

    const prevBtn = completeSetContainer.querySelector(".set_prev_button");
    const nextBtn = completeSetContainer.querySelector(".set_next_button");

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSliderPosition();
        }
      });

      nextBtn.addEventListener("click", () => {
        if (currentIndex < totalSlides - 1) {
          currentIndex++;
          updateSliderPosition();
        }
      });
    }

    completeSetBlock.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    completeSetBlock.addEventListener("touchmove", (e) => {
      endX = e.touches[0].clientX;
    });

    completeSetBlock.addEventListener("touchend", () => {
      if (startX > endX + 30 && currentIndex < totalSlides - 1) {
        currentIndex++;
      } else if (startX < endX - 30 && currentIndex > 0) {
        currentIndex--;
      }
      updateSliderPosition();
    });

    window.addEventListener("resize", () => {
      updateCardWidths();
    });

    updateCardWidths();
    completeSetContainer.classList.add("js-loaded");
  });
});






let reviewContainers = document.querySelectorAll(".opti_review_container");
if (reviewContainers) {
    reviewContainers.forEach(reviewContainer => {
        reviewContainer.addEventListener("click", function (e) {
            let reviewBlock = document.querySelector(".opti_wrapper_visible");
            if (reviewBlock) {
                let custReviewButton = reviewBlock.querySelector(".opti_review_tab");
                let reviewsContent = reviewBlock.querySelector(".collapsible-content");
                let reviewsContentBlock = reviewBlock.querySelector(".opti_custom_content_block");

                custReviewButton.classList.add("is-open");
                custReviewButton.classList.add("active");
                custReviewButton.setAttribute("aria-expanded", true);
                reviewsContent.classList.add("is-open");
                reviewsContent.style.height = `${reviewsContentBlock.clientHeight + 20}px`;

                reviewBlock.scrollIntoView({ behavior: 'smooth' });

            }
        });
    })
}


// CONVERTING LOGIC TO A SINGLE FORM FOR PRODUCT PAGE
let productPopovers = document.querySelectorAll(".cart-popover-wrapper");
productPopovers.forEach((popover, index) => {
    popover.addEventListener("click", function(e) {

        // ACTIVATE THE SELECTED VARIANT
        if(e.target.tagName === 'SPAN' && e.target.classList.contains("cart_button_text")) {
            popover.querySelector(".cart_button_text.btn_active").classList.remove("btn_active");
            e.target.classList.add("btn_active");
            let selectedFormInput = popover.querySelector(".current_variant_form");
            selectedFormInput.value = e.target.dataset.customVariantId;
        }

        // ENABELING THE SELLING PLAN
        if(e.target.tagName === 'INPUT' && e.target.classList.contains("selling_toggle_checkbox")) {
            let selectedFormInput = popover.querySelector(".selling_plan_input");
            if(selectedFormInput) {
                if(e.target.checked) {
                    selectedFormInput.name = selectedFormInput.dataset.sellingName;
                    selectedFormInput.value = selectedFormInput.dataset.sellingPlan;
                } else {
                    selectedFormInput.name = "";
                    selectedFormInput.value = "";
                }
            }
        }

    })
})

let mobilePopoverSelectors = document.querySelectorAll(".variants-mobile-wrapper");
mobilePopoverSelectors.forEach((popover, index) => {
    popover.addEventListener("click", function(e) {

        // ACTIVATE THE SELECTED VARIANT
        if(e.target.tagName === 'SPAN' && e.target.classList.contains("cart_button_text")) {
            popover.querySelector(".cart_button_text.btn_active").classList.remove("btn_active");
            e.target.classList.add("btn_active");
            let selectedFormInput = popover.querySelector(".current_variant_form");
            selectedFormInput.value = e.target.dataset.customVariantId;
        }

        // ENABELING THE SELLING PLAN
        if(e.target.tagName === 'INPUT' && e.target.classList.contains("selling_toggle_checkbox")) {
            let selectedFormInput = popover.querySelector(".selling_plan_input");
            if(selectedFormInput) {
                if(e.target.checked) {
                    selectedFormInput.name = selectedFormInput.dataset.sellingName;
                    selectedFormInput.value = selectedFormInput.dataset.sellingPlan;
                } else {
                    selectedFormInput.name = "";
                    selectedFormInput.value = "";
                }
            }
        }

    })
})

document.querySelector('.my-custom-sticky-button-only')?.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector('.outer_package_container');
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});


document.addEventListener("DOMContentLoaded", function () {
const urlParams = new URLSearchParams(window.location.search);
const tabHandle = urlParams.get('tab');

if (tabHandle) {
    const allTabButtons = document.querySelectorAll('.tab-btn');
    const allTabContents = document.querySelectorAll('.prducts_container_block');

    allTabButtons.forEach(btn => btn.classList.remove('btn-active'));
    allTabContents.forEach(content => content.classList.remove('tab-active'));

    const activeBtn = document.querySelector(`.tab-btn[data-tabhandle="${tabHandle}"]`);
    const activeContent = document.querySelector(`.prducts_container_block[data-tabhandle="${tabHandle}"]`);

    if (activeBtn && activeContent) {
    activeBtn.classList.add('btn-active');
    activeContent.classList.add('tab-active');

    // Optional: scroll to tabs section
    const tabSection = document.querySelector('.tabs-section');
    if (tabSection) {
        tabSection.scrollIntoView({ behavior: 'smooth' });
    }
    }
}
});
