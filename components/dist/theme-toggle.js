const themeToggle = document.createElement('template');
themeToggle.innerHTML = `
    <style>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    :host{
        cursor: pointer;
        --height: 2.5rem;
        --width: 2.5rem;
    }
    .theme-toggle {
        display: flex;
        position: relative;
        width: 1.2rem;
        height: 1.2rem;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }
    .theme-toggle::after{
        content: '';
        position: absolute;
        height: var(--height);
        width: var(--width);
        top: 50%;
        left: 50%;
        opacity: 0;
        border-radius: 50%;
        pointer-events: none;
        transition: transform 0.3s, opacity 0.3s;
        transform: translate(-50%, -50%) scale(1.2);
        background-color: rgba(var(--text-color,inherit), 0.12);
    }
    :host(:focus-within) .theme-toggle{
        outline: none;
    }
    :host(:focus-within) .theme-toggle::after{
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    .icon {
        position: absolute;
        height: 100%;
        width: 100%;
        fill: rgba(var(--text-color,inherit), 1);
        transition: transform 0.3s, opacity 0.1s;
    }
    
    .theme-switcher__checkbox {
        display: none;
    }
    :host([checked]) .moon-icon {
        transform: translateY(50%);
        opacity: 0;
    }
    :host(:not([checked])) .sun-icon {
        transform: translateY(50%);
        opacity: 0;
    }
    </style>
    <label class="theme-toggle" title="Change theme" tabindex="0">
        <slot name="light-mode-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon moon-icon" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><rect fill="none" height="24" width="24"/><path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"/></svg>
        </slot>
        <slot name="dark-mode-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon sun-icon" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><rect fill="none" height="24" width="24"/><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>
        </slot>
    </label>
`;

class ThemeToggle extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        }).append(themeToggle.content.cloneNode(true));

        this.isChecked = false;
        this.hasTheme = 'light';

        this.toggleState = this.toggleState.bind(this);
        this.fireEvent = this.fireEvent.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
    }
    static get observedAttributes() {
        return ['checked'];
    }

    daylight() {
        this.hasTheme = 'light';
        document.body.dataset.theme = 'light';
        this.setAttribute('aria-checked', 'false');
    }

    nightlight() {
        this.hasTheme = 'dark';
        document.body.dataset.theme = 'dark';
        this.setAttribute('aria-checked', 'true');
    }

    toggleState() {
        if (!document.startViewTransition) {
            this.toggleAttribute('checked');
            this.fireEvent();
            return;
        }
        document.startViewTransition(() => {
            this.toggleAttribute('checked');
            this.fireEvent();
        });
    }
    handleKeyDown(e) {
        if (e.key === ' ') {
            this.toggleState();
        }
    }
    handleThemeChange(e) {
        if (e.detail.theme !== this.hasTheme) {
            if (e.detail.theme === 'dark') {
                this.setAttribute('checked', '');
            }
            else {
                this.removeAttribute('checked');
            }
        }
    }

    fireEvent() {
        this.dispatchEvent(
            new CustomEvent('themechange', {
                bubbles: true,
                composed: true,
                detail: {
                    theme: this.hasTheme
                }
            })
        );
    }

    connectedCallback() {
        this.setAttribute('role', 'switch');
        this.setAttribute('aria-label', 'theme toggle');
        if (localStorage.getItem(`${window.location.hostname}-theme`) === "dark") {
            this.nightlight();
            this.setAttribute('checked', '');
        } else if (localStorage.getItem(`${window.location.hostname}-theme`) === "light") {
            this.daylight();
            this.removeAttribute('checked');
        }
        else {
            if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
                this.nightlight();
                this.setAttribute('checked', '');
            } else {
                this.daylight();
                this.removeAttribute('checked');
            }
        }
        this.addEventListener("click", this.toggleState);
        this.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener('themechange', this.handleThemeChange);
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.toggleState);
        this.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener('themechange', this.handleThemeChange);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'checked') {
            if (this.hasAttribute('checked')) {
                this.nightlight();
                localStorage.setItem(`${window.location.hostname}-theme`, "dark");
            } else {
                this.daylight();
                localStorage.setItem(`${window.location.hostname}-theme`, "light");
            }
        }
    }
}

window.customElements.define('theme-toggle', ThemeToggle);