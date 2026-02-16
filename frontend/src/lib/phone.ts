export function normalizePhone(phone: string): string {
    let digits = phone.replace(/[^0-9]/g, '');

    // Russian phone number logic
    if (digits.length === 11) {
        if (digits.startsWith('8')) {
            return '7' + digits.slice(1);
        }
        if (digits.startsWith('7')) {
            return digits;
        }
    }

    if (digits.length === 10) {
        return '7' + digits;
    }

    return digits;
}
