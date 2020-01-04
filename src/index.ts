import '@/scss/index.scss';
import {HamburgerMenu} from '@/ts/module/HamburgerMenu.ts';
import {Module} from '@/ts/module/Module.ts';

const modules: Module[] = [];
modules.push(new HamburgerMenu());

modules.forEach(e => e.initialize());
