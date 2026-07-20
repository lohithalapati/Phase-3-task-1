export class Sanitizer {
    static sanitizeString(input: string): string {
        const map: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
        };
        const reg = /[&<>"'/]/ig;
        return input.replace(reg, (match) => map[match]);
    }
}
