
// simple can use DOM
export const canUseDOM = () => {
    return document && document.documentElement;
}

export const disableScroll = (selector) => {
    if (canUseDOM()) {
        const el = document.querySelector(selector)
        if (el) {
            el.style.overflow = 'hidden'
        }
    }
}

export const enableScroll = (selector) => {
    if (canUseDOM()) {
        const el = document.querySelector(selector)
        if (el) {
            el.style.overflow = 'auto'
        }
    }
}