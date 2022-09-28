export default function (): Window | undefined {
    try {
        return window;
    } catch (_) {
        return undefined;
    }
}