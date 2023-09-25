/* on scroll by given top offset
 * add bottom box shadow on the element */
import {
    animateLiftUpClass,
    kappaGradientClass,
    outerShadowClass,
    smokeBgClass,
} from "./GlobalStylesUtils";

export function addGradientOuterShadowOnScroll(
    elementId: string,
    topOffset = 0,
) {
    const elementClasses = [outerShadowClass, kappaGradientClass, smokeBgClass];
    const element = document.getElementById(elementId);
    const scrollOffset =
        window.pageYOffset || document.documentElement.offsetTop;
    const isHeroInView = true;
    if (element) {
        if (scrollOffset > topOffset || isHeroInView) {
            elementClasses.map(itemClass => element.classList.add(itemClass));
        } else {
            elementClasses.map(itemClass =>
                element.classList.remove(itemClass),
            );
        }
    }
}

export function scrollPageIntoView(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }
}

export const isElementInView = elementId => {
    const element = document.getElementById(elementId);
    if (!!element) {
        const scroll = window.scrollY || window.pageYOffset;
        const boundsTop = element.getBoundingClientRect().top + scroll;

        const viewport = {
            top: scroll,
            bottom: scroll + window.innerHeight,
        };

        const bounds = {
            top: boundsTop,
            bottom: boundsTop + element.clientHeight,
        };

        return (
            (bounds.bottom >= viewport.top &&
                bounds.bottom <= viewport.bottom) ||
            (bounds.top <= viewport.bottom && bounds.top >= viewport.top)
        );
    }
    return false;
};

export function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* scroll animation listeners */
export function animateLiftUpAndZoomIn(elementId, inView) {
    const elementClasses = [animateLiftUpClass];
    const element = document.getElementById(elementId);

    if (element) {
        inView
            ? elementClasses.map(itemClass => element.classList.add(itemClass))
            : elementClasses.map(itemClass =>
                  element.classList.remove(itemClass),
              );
    }
}
