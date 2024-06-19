import type { App } from 'vue';
import { authDirective } from './authDirective';

export function directive(app: App) {
    authDirective(app);
}