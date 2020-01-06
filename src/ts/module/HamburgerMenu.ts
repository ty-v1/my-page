import {Module} from '@/ts/module/Module.ts';

/**
 * ハンバーガーメニューの制御を行う
 * */
export class HamburgerMenu implements Module {
    private static readonly ID = 'st-hamburger-menu';
    private static readonly MENU_ID = 'st-header__menu';
    private static readonly ACTIVE = 'active';
    private static readonly MENU_OPEN = 'st-header-menu_open';

    private readonly hamburger: HTMLElement;
    private readonly menu: HTMLElement;
    private isActive = false;

    public constructor() {
        this.hamburger = document.getElementById(HamburgerMenu.ID) as HTMLElement;
        this.menu = document.getElementById(HamburgerMenu.MENU_ID) as HTMLElement;
    }

    public initialize(): void {
        this.hamburger.addEventListener('click', () => this.onClick());
    }

    public onClick(): void {
        if (!this.isActive) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }

    private openMenu() {
        this.isActive = true;
        this.hamburger.classList.add(HamburgerMenu.ACTIVE);
        this.menu.classList.add(HamburgerMenu.MENU_OPEN);
    }

    private closeMenu() {
        this.isActive = false;
        this.hamburger.classList.remove(HamburgerMenu.ACTIVE);
        this.menu.classList.remove(HamburgerMenu.MENU_OPEN);
    }
}
